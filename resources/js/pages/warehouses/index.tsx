import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { useToast } from '@/components/ui/toast'
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
    }
}

const routes = {
    index: () => ({ url: '/warehouses' }),
    create: () => ({ url: '/warehouses/create' }),
    edit: (id: number) => ({ url: `/warehouses/${id}/edit` }),
    destroy: (id: number) => ({ url: `/warehouses/${id}` }),
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المخازن', href: routes.index().url },
]

export default function WarehousesIndex({ warehouses }: PageProps) {
    const { add } = useToast()
    const [search, setSearch] = useState('')
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(routes.index().url, { search: value }, { preserveState: true, replace: true })
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

                    <Link href={routes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> مخزن جديد
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الكود</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">العنوان</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">نشط؟</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {warehouses.data.map((w) => (
                                <tr key={w.id}>
                                    <td className="px-4 py-2 text-sm">{w.name}</td>
                                    <td className="px-4 py-2 text-sm">{w.code ?? '-'}</td>
                                    <td className="px-4 py-2 text-sm">{w.address ?? '-'}</td>
                                    <td className="px-4 py-2 text-sm">{w.is_active ? 'نعم' : 'لا'}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={routes.edit(w.id).url} className="inline-flex">
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (!confirm('حذف هذا المخزن؟')) return
                                                    router.delete(routes.destroy(w.id).url, {
                                                        onSuccess: () => add({ title: 'تم الحذف', description: 'تم حذف المخزن بنجاح' }),
                                                        onError: () => add({ title: 'خطأ', description: 'تعذر حذف المخزن', variant: 'destructive' }),
                                                    })
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}


