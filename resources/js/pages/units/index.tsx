import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type BreadcrumbItem } from '@/types'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import unitsRoutes from '@/routes/units'
import { Pencil, Trash2 } from 'lucide-react'
import EmptyState from '@/components/empty-state'

type UnitRow = { id: number; name: string }
type PaginationLink = string | null

interface PageProps {
    units: {
        data: UnitRow[]
        links: { url: PaginationLink; label: string; active: boolean }[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    },
    filters: { search: string }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الوحدات الأساسية', href: unitsRoutes.index().url },
]

export default function UnitsIndex({ units, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(unitsRoutes.index().url, { search: value }, { preserveState: true, replace: true })
    }, 300)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الوحدات الأساسية" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="w/full max-w-sm">
                        <Input placeholder="ابحث بالاسم" value={search} onChange={(e) => { setSearch(e.target.value); debouncedSearch(e.target.value) }} />
                    </div>
                    <Link href={unitsRoutes.create().url} className="inline-flex">
                        <Button>إضافة وحدة</Button>
                    </Link>
                </div>


                <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-[400px] w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {search && units.data.length === 0 ? (
                                <EmptyState colSpan={2} />
                            ) : (
                                units.data.map((u) => (
                                    <tr key={u.id}>
                                        <td className="px-4 py-2 text-sm">{u.name}</td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={unitsRoutes.edit(u.id).url} className="inline-flex"><Button variant="outline" size="sm"><Pencil className="h-4 w-4" /></Button></Link>
                                                <Button variant="destructive" size="sm" onClick={() => { if (!confirm('حذف الوحدة؟')) return; router.delete(unitsRoutes.destroy(u.id).url) }}><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {units.last_page > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {units.links.map((link, idx) => (
                            <Link key={idx} href={link.url ?? '#'} className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`} preserveScroll>
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}


