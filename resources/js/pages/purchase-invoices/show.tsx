import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem } from '@/types'
import { formatEGP, formatNumber } from '@/lib/currency'

interface PageProps {
    invoice: {
        id: number
        number: string
        supplier: string | null
        warehouse: string | null
        date: string
        status: string
        subtotal: number
        discount_total: number
        tax_total: number
        total: number
        paid?: number
        remaining?: number
        notes: string | null
        items: { id: number; product: string | null; sku: string | null; qty: number; unit_cost: number; discount_value: number; tax_value: number; line_total: number }[]
    }
}

import purchaseInvoicesRoutes from '@/routes/purchase-invoices'
import { form as payForm } from '@/routes/purchase-invoices/pay'

export default function PurchaseInvoiceShow({ invoice }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فواتير الشراء', href: purchaseInvoicesRoutes.index().url },
        { title: `#${invoice.number}`, href: '#' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`فاتورة شراء #${invoice.number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold">فاتورة شراء #{invoice.number}</div>
                    <div className="flex items-center gap-2">
                        <Link href={purchaseInvoicesRoutes.print(invoice.id).url} className="inline-flex" target="_blank" rel="noopener noreferrer"><Button variant="outline">طباعة</Button></Link>
                        <Link href={payForm(invoice.id).url} className="inline-flex"><Button>سداد</Button></Link>
                        <Link href={purchaseInvoicesRoutes.index().url} className="inline-flex"><Button variant="outline">رجوع</Button></Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">المورد</div>
                        <div className="font-medium">{invoice.supplier ?? '-'}</div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">المستودع</div>
                        <div className="font-medium">{invoice.warehouse ?? '-'}</div>
                    </div>
                    <div className="rounded-lg border p-4">
                        <div className="text-sm text-muted-foreground">التاريخ</div>
                        <div className="font-medium">{invoice.date}</div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">المنتج</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">SKU</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الكمية</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">سعر الوحدة</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الخصم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الضريبة</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {invoice.items.map((it) => (
                                <tr key={it.id}>
                                    <td className="px-4 py-2 text-sm">{it.product ?? '-'}</td>
                                    <td className="px-4 py-2 text-sm">{it.sku ?? '-'}</td>
                                    <td className="px-4 py-2 text-sm">{formatNumber(it.qty)}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(it.unit_cost)}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(it.discount_value)}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(it.tax_value)}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(it.line_total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="ml-auto w-full max-w-sm space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between text-sm"><span>الإجمالي قبل</span><span>{formatEGP(invoice.subtotal)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span>الخصم</span><span>{formatEGP(invoice.discount_total)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span>الضريبة</span><span>{formatEGP(invoice.tax_total)}</span></div>
                    <div className="flex items-center justify-between text-base font-semibold"><span>الإجمالي</span><span>{formatEGP(invoice.total)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span>المدفوع</span><span>{formatEGP(invoice.paid ?? 0)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span>المتبقي</span><span>{formatEGP(invoice.remaining ?? 0)}</span></div>
                </div>
            </div>
        </AppLayout>
    )
}


