import productsRoutes from '@/routes/products'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type BreadcrumbItem } from '@/types'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { formatEGP, formatNumber } from '@/lib/currency'

type ProductRow = {
    id: number
    name: string
    sku: string | null
    stock: number
    min_stock: number | null
    sale_price: number | null
    cost_price: number | null
    is_active: boolean
    base_unit?: { id: number | null; name: string | null }
}

type PaginationLink = string | null

interface PageProps {
    products: {
        data: ProductRow[]
        links: { url: PaginationLink; label: string; active: boolean }[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    filters: { search?: string }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المنتجات', href: productsRoutes.index().url },
]

export default function ProductsIndex({ products, filters }: PageProps) {
    // const { auth } = usePage<SharedData>().props

    const [search, setSearch] = useState(filters.search ?? '')
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(productsRoutes.index().url, { search: value }, { preserveState: true, replace: true, only: ['products', 'filters'] })
    }, 300)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المنتجات" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="ابحث بالرقم أو الاسم"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                        />
                    </div>

                    <Link href={productsRoutes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> منتج جديد
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-[900px] w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الرقم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الكود SKU</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">المخزون</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الحد الأدنى</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">سعر البيع</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">سعر التكلفة</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">نشط؟</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {products.data.map((p) => (
                                <tr key={p.id} className={p.min_stock != null && p.stock <= p.min_stock ? 'bg-red-50 dark:bg-red-900/20' : ''}>
                                    <td className="px-4 py-2 text-sm">{p.id}</td>
                                    <td className="px-4 py-2 text-sm">{p.name}</td>
                                    <td className="px-4 py-2 text-sm">{p.sku ?? '-'}</td>
                                    <td className="px-4 py-2 text-sm">
                                        {formatNumber(p.stock ?? 0)}
                                        <span className="ml-1 text-xs text-muted-foreground">{p.base_unit?.name ?? ''}</span>
                                    </td>
                                    <td className="px-4 py-2 text-sm">{p.min_stock != null ? formatNumber(p.min_stock) : '-'}</td>
                                    <td className="px-4 py-2 text-sm">{p.sale_price != null ? formatEGP(p.sale_price) : '-'}</td>
                                    <td className="px-4 py-2 text-sm">{p.cost_price != null ? formatEGP(p.cost_price) : '-'}</td>
                                    <td className="px-4 py-2 text-sm">{p.is_active ? 'نعم' : 'لا'}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={productsRoutes.edit(p.id).url} className="inline-flex">
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (!confirm('حذف هذا المنتج؟')) return
                                                    router.delete(productsRoutes.destroy(p.id).url)
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

                {products.links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {products.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url ?? '#'}
                                className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                                preserveScroll
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}


