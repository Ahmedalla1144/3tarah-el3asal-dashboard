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
MIIDoTCCAomgAwIBAgIUJ5zuLz7MskF5tC/khHGkaUx6Ge4wDQYJKoZIhvcNAQEL
BQAwYDELMAkGA1UEBhMCRUcxDjAMBgNVBAgMBUNhaXJvMQ4wDAYDVQQHDAVDYWly
bzEQMA4GA1UECgwHQ29tcGFueTELMAkGA1UECwwCSVQxEjAQBgNVBAMMCWxvY2Fs
aG9zdDAeFw0yNTA5MjcwOTU5MDlaFw0yNjA5MjcwOTU5MDlaMGAxCzAJBgNVBAYT
AkVHMQ4wDAYDVQQIDAVDYWlybzEOMAwGA1UEBwwFQ2Fpcm8xEDAOBgNVBAoMB0Nv
bXBhbnkxCzAJBgNVBAsMAklUMRIwEAYDVQQDDAlsb2NhbGhvc3QwggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQClCcITr3qpIymTLZ6STEIauO0CJCyQzSYP
S2GbKMVlhERoa8P93MJinmft4zsxmzzqQbrG7ujoGWlUhX0JZ+wV5h6gA+4/Gcts
lDJTlq5BRjSHWM6AH/JhD8r6Y679UfRHGM8dqP7yUfyavUQyNAAzZ+k+o9dRF7a2
sxfwO9u3JWv2mS5f6g0kLESl3AaBs9N5YBJpgJ4VdjmfyGscpORj0LrPuRxb8szH
CyRJARPDOPVOgBEqEsqp2TCMH6AxTzExHVkqHuYvs3bvvjY2SkkGAHwZ/raEDZh4
DeijJhmOXb4i4srpxw6eFjPjRY/Zg5DCLJvAJHiX2a1tVHZFfh3PAgMBAAGjUzBR
MB0GA1UdDgQWBBQufnv6r3laPAJmJqb7BEGFyyQm3DAfBgNVHSMEGDAWgBQufnv6
r3laPAJmJqb7BEGFyyQm3DAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA
A4IBAQAz8jaqn/GPu4O2iycJgB/L1y8bnM/WqHEXNFIOxxr4MIOHTLfPTiAZDe7k
ypqPaM+V3XyASVMJgh09yu1pPTlwA2YBJ6zu7fx1L2IkSYJgMUaMcJ4kDXCqImuK
pBO8wUgXwSXTLQWyaWE8VD4euyh1cOrGO52R0loPs+whAkaHy79FkPcBpaHbOVQX
vt5bDxhr1U5bQekCNIEpkv7RNGGi5+o2g92kpcsS9H5gynI7Sx1a2qb4G2bh8pAg
sBM96Kh2NtJTTeP6dB1pKBGcgXxNP1QxbtBEqr4hdf8Z0BQ1kP+NZWg+yjJET1sB
8IwfkKbAGG8pI9on00QlJjNbFxS0
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


