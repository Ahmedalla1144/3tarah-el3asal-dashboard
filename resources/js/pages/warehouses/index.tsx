import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type BreadcrumbItem } from '@/types'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'

type WarehouseRow = { id: number; name: string; code?: string | null; address?: string | null; is_active: boolean }
type PaginationLink = string | null

interface PageProps {
    warehouses: {
        data: WarehouseRow[]
        links: { url: PaginationLink; label: string; active: boolean }[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    },
    filters: {search: string}
}

import warehousesRoutes from '@/routes/warehouses'
import EmptyState from '@/components/empty-state'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المخازن', href: warehousesRoutes.index().url },
]

export default function WarehousesIndex({ warehouses, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '')
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(warehousesRoutes.index().url, { search: value }, { preserveState: true, replace: true })
    }, 300)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المخازن" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="ابحث باسم المخزن"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                        />
                    </div>

                    <Link href={warehousesRoutes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> مخزن جديد
                        </Button>
                    </Link>
                </div>


                    <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="min-w-[500px] w-full divide-y divide-border">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium">الكود</th>
                                    <th className="px-4 py-2 text-left text-sm font-medium">العنوان</th>
                                    <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-background">


                            {warehouses.data.length === 0 ? (
                                <EmptyState colSpan={4} />
                ) : (
                                warehouses.data.map((w) => (
                                    <tr key={w.id}>
                                        <td className="px-4 py-2 text-sm">{w.name}</td>
                                        <td className="px-4 py-2 text-sm">{w.code ?? '-'}</td>
                                        <td className="px-4 py-2 text-sm">{w.address ?? '-'}</td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={warehousesRoutes.edit(w.id).url} className="inline-flex">
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (!confirm('حذف هذا المخزن؟')) return
                                                        router.delete(warehousesRoutes.destroy(w.id).url)
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
            </div>
        </AppLayout>
    )
}


