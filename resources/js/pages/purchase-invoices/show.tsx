import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem } from '@/types'
import { formatEGP, formatNumber } from '@/lib/currency'
import { useEffect, useState } from 'react'
import { configureQZ, listPrinters, printUrlToPrinter } from '@/lib/qz'
import purchaseInvoicesRoutes from '@/routes/purchase-invoices'

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

import { form as payForm } from '@/routes/purchase-invoices/pay'

const CERT = `-----BEGIN CERTIFICATE-----
MIIDKzCCAhOgAwIBAgIURQdGKgELUzk+S6jHmuV7o1oc9hAwDQYJKoZIhvcNAQEL
BQAwJTEjMCEGA1UEAwwaM3RhcmEuZWwzYXNhbC5tcmJvdHVzYS5jb20wHhcNMjUw
OTI1MTUyMjA1WhcNMzUwOTIzMTUyMjA1WjAlMSMwIQYDVQQDDBozdGFyYS5lbDNh
c2FsLm1yYm90dXNhLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB
AM1UUd7fxTmZn4w0JvjQ+N8dssYwtcpSkfUKQ77m4nw/lpDbJbE+7Kpq53GAh5qn
ykngJl9ojBcHO4XKCKuCOAW+kxphr7mxA0rYJU96p42pys1PC8S2MjVyCI3aehcf
aBCqRZtd39SAG+43lCwl0CXLcWw4HL727i1Cp9u1FfRidm10f62u33EJSgmR4lyL
FijuW8v6QXhFAgmAEmBKQENf7aix+NzJ4h5fL8tA040NzVaVZHRT7uIpfDzv0ToY
I3JbzSxdTmixe1sIz0h6pqUAcibUUUArmrrr10m4Kcbg0YBEeYp8YybgJo0Iq3U8
FcZfOgXyu0VbcVqJvqCn7VkCAwEAAaNTMFEwHQYDVR0OBBYEFEiUvw4foYihYNkL
aIbIrtQjX7GRMB8GA1UdIwQYMBaAFEiUvw4foYihYNkLaIbIrtQjX7GRMA8GA1Ud
EwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAFvsyUF5S1wPEcs3RBQT3cId
zrv2yQcestfuJ25aRKxt3F6k2/DSTzMNNqz5OkJ+9Sp1LlVqJLxneczt25IfeKZj
94cagbYPnBHplLf8+glN/reesM50pxJ5HsRmei0vjjtIEYJo7qhnJzSDopSu/pZJ
PFX4L4K0W+0EEFMbDdcJtRNFeqSAnB1c+qGp2eXbYUJ3sfPOdyKBvjZ/+BAFv7QY
xXv180+qjXOkOws1UAbScgi5t9/OpVt+55Km+fHvoER2cHK34pU+tqCF5kddip1h
Eq9iHF2ox/AjpR4n7T3o5l6iIZxC4I5p7rhQl5OGOmgHJSlTlKh9qrbEJILAkZU=
-----END CERTIFICATE-----`;

export default function PurchaseInvoiceShow({ invoice }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فواتير الشراء', href: purchaseInvoicesRoutes.index().url },
        { title: `#${invoice.number}`, href: '#' },
    ]

    const [printers, setPrinters] = useState<string[]>([])
    const [selectedPrinter, setSelectedPrinter] = useState<string>('')

    useEffect(() => {
        configureQZ('/qz/sign', CERT)
        listPrinters().then(setPrinters).catch(() => { })
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`فاتورة شراء #${invoice.number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold">فاتورة شراء #{invoice.number}</div>
                    <div className="flex items-center gap-2">
                        <Link href={purchaseInvoicesRoutes.print(invoice.id).url} className="inline-flex" target="_blank" rel="noopener noreferrer"><Button variant="outline">طباعة</Button></Link>
                        <select className="rounded border px-2 py-1" value={selectedPrinter} onChange={(e) => setSelectedPrinter(e.target.value)}>
                            <option value="">اختر طابعة (QZ)</option>
                            {printers.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <Button disabled={!selectedPrinter} onClick={() => printUrlToPrinter(selectedPrinter, purchaseInvoicesRoutes.print(invoice.id).url)}>طباعة QZ</Button>
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
                                <th className="px-4 py-2 text-left text-sm font-medium hidden">الخصم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium hidden">الضريبة</th>
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
                                    <td className="px-4 py-2 text-sm hidden">{formatEGP(it.discount_value)}</td>
                                    <td className="px-4 py-2 text-sm hidden">{formatEGP(it.tax_value)}</td>
                                    <td className="px-4 py-2 text-sm">{formatEGP(it.line_total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="ml-auto w-full max-w-sm space-y-2 rounded-lg border p-4">
                    <div className="flex- items-center justify-between text-sm hidden"><span>الإجمالي قبل</span><span>{formatEGP(invoice.subtotal)}</span></div>
                    <div className="flex- items-center justify-between text-sm hidden"><span>الخصم</span><span>{formatEGP(invoice.discount_total)}</span></div>
                    <div className="flex- items-center justify-between text-sm hidden"><span>الضريبة</span><span>{formatEGP(invoice.tax_total)}</span></div>
                    <div className="flex items-center justify-between text-base font-semibold"><span>الإجمالي</span><span>{formatEGP(invoice.total)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span>المدفوع</span><span>{formatEGP(invoice.paid ?? 0)}</span></div>
                    <div className="flex items-center justify-between text-sm"><span>المتبقي</span><span>{formatEGP(invoice.remaining ?? 0)}</span></div>
                </div>
            </div>
        </AppLayout>
    )
}


