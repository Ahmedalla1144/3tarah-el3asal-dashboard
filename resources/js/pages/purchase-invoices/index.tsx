import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type BreadcrumbItem } from '@/types'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import { Plus, Printer, Eye } from 'lucide-react'
import { formatEGP } from '@/lib/currency'

type InvoiceRow = {
    id: number
    number: string
    supplier: string | null
    date: string
    status: string
    total: number
    paid?: number
    remaining?: number
}

type PaginationLink = string | null

interface PageProps {
    invoices: {
        data: InvoiceRow[]
        links: { url: PaginationLink; label: string; active: boolean }[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    filters: { search?: string }
}

import purchaseInvoicesRoutes from '@/routes/purchase-invoices'
import { form as payForm } from '@/routes/purchase-invoices/pay'
import EmptyState from '@/components/empty-state'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'فواتير الشراء', href: purchaseInvoicesRoutes.index().url },
]

export default function PurchaseInvoicesIndex({ invoices, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '')
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(purchaseInvoicesRoutes.index().url, { search: value }, { preserveState: true, replace: true })
    }, 300)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="فواتير الشراء" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="ابحث برقم الفاتورة أو اسم المورد"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                        />
                    </div>

                    <Link href={purchaseInvoicesRoutes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> فاتورة جديدة
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-[900px] w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الرقم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">المورد</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">التاريخ</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الحالة</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الإجمالي</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">المدفوع</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">المتبقي</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {search && invoices.data.length === 0 ? (
                                <EmptyState colSpan={8} />
                            ) : (
                            invoices.data.map((inv) => (
                                <tr key={inv.id}>
                                    <td className="px-4 py-2 text-sm">{inv.number}</td>
                                    <td className="px-4 py-2 text-sm">{inv.supplier ?? '-'}</td>
                                    <td className="px-4 py-2 text-sm">{inv.date}</td>
                                    <td className="px-4 py-2 text-sm">{inv.status}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(inv.total)}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(inv.paid ?? 0)}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(inv.remaining ?? 0)}</td>
                                    <td className="px-4 py-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Link href={purchaseInvoicesRoutes.show(inv.id).url} className="text-blue-600 hover:underline">
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                            <button
                                                onClick={() => window.open(`/purchase-invoices/${inv.id}/print`, '_blank')}
                                                className="text-green-600 hover:underline"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                            <Link href={payForm(inv.id).url} className="text-orange-600 hover:underline">سداد</Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {invoices.last_page > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {invoices.links.map((link, idx) => (
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


