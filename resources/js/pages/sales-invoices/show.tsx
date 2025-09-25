import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem } from '@/types'
import { formatEGP, formatNumber } from '@/lib/currency'
import { Printer, CreditCard } from 'lucide-react'
import salesInvoicesRoutes from '@/routes/sales-invoices'
import { form as payForm } from '@/routes/sales-invoices/pay'
import { useEffect, useState } from 'react'
import { configureQZ, listPrinters, printUrlToPrinter } from '@/lib/qz'

interface InvoiceItem {
    id: number
    product: {
        id: number
        name: string
    }
    unit: {
        id: number
        name: string
    }
    qty: number
    unit_price: number
    discount_value: number
    tax_value: number
    total: number
}

interface PageProps {
    invoice: {
        id: number
        number: string
        date: string
        status: string
        total: number
        paid_amount: number
        remaining_amount: number
        notes: string | null
        customer: {
            id: number
            name: string
            current_balance: number
        } | null
        warehouse: {
            id: number
            name: string
        } | null
        items: InvoiceItem[]
    }
}

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

export default function SalesInvoiceShow({ invoice }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فواتير المبيعات', href: salesInvoicesRoutes.index().url },
        { title: invoice.number, href: '' },
    ]

    const [printers, setPrinters] = useState<string[]>([])
    const [selectedPrinter, setSelectedPrinter] = useState<string>('')

    useEffect(() => {
        configureQZ('/qz/sign', CERT)
        listPrinters().then(setPrinters).catch(() => { })
    }, [])

    const handlePrint = () => {
        window.open(`/sales-invoices/${invoice.id}/print`, '_blank')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`فاتورة مبيعات ${invoice.number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">فاتورة مبيعات #{invoice.number}</h1>
                            <p className="text-muted-foreground">تاريخ: {invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handlePrint} variant="outline">
                                <Printer className="mr-2 h-4 w-4" />
                                طباعة
                            </Button>
                            <select className="rounded border px-2 py-1" value={selectedPrinter} onChange={(e) => setSelectedPrinter(e.target.value)}>
                                <option value="">اختر طابعة (QZ)</option>
                                {printers.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                            <Button disabled={!selectedPrinter} onClick={() => printUrlToPrinter(selectedPrinter, salesInvoicesRoutes.print(invoice.id).url)}>طباعة QZ</Button>
                            {invoice.remaining_amount > 0 && (
                                <Link href={payForm(invoice.id).url}>
                                    <Button>
                                        <CreditCard className="mr-2 h-4 w-4" />
                                        سداد
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-semibold mb-3">تفاصيل العميل</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">الاسم:</span>
                                    <span className="font-medium">{invoice.customer?.name || 'غير محدد'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">الرصيد المدين:</span>
                                    <span className={`font-medium ${invoice.customer?.current_balance && invoice.customer.current_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatEGP(invoice.customer?.current_balance || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-semibold mb-3">تفاصيل الفاتورة</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">المستودع:</span>
                                    <span className="font-medium">{invoice.warehouse?.name || 'غير محدد'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">الحالة:</span>
                                    <span className={`font-medium ${invoice.status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                                        {invoice.status === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="rounded-lg border">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">بنود الفاتورة</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-3 text-right text-sm font-medium">#</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">المنتج</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">الوحدة</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">الكمية</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">سعر الوحدة</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">الخصم</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">الضريبة</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {invoice.items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{item.product.name}</td>
                                            <td className="px-4 py-3 text-sm">{item.unit.name}</td>
                                            <td className="px-4 py-3 text-sm">{formatNumber(item.qty)}</td>
                                            <td className="px-4 py-3 text-sm">{formatEGP(item.unit_price)}</td>
                                            <td className="px-4 py-3 text-sm">{formatEGP(item.discount_value)}</td>
                                            <td className="px-4 py-3 text-sm">{formatEGP(item.tax_value)}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{formatEGP(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Invoice Summary */}
                    <div className="ml-auto w-full max-w-sm space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between text-base font-semibold">
                            <span>إجمالي البضاعة</span>
                            <span>{formatEGP(invoice.total)}</span>
                        </div>
                        {invoice.customer && invoice.customer.current_balance > 0 && (
                            <div className="flex items-center justify-between text-sm text-red-600">
                                <span>الرصيد المدين</span>
                                <span>{formatEGP(invoice.customer.current_balance)}</span>
                            </div>
                        )}
                        {invoice.customer && invoice.customer.current_balance > 0 && (
                            <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                                <span>الإجمالي الفعلي</span>
                                <span className="text-red-600">
                                    {formatEGP(invoice.total + invoice.customer.current_balance)}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>المدفوع</span>
                            <span>{formatEGP(invoice.paid_amount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-medium">
                            <span>المتبقي</span>
                            <span>{formatEGP(invoice.remaining_amount)}</span>
                        </div>
                    </div>

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-semibold mb-2">ملاحظات</h3>
                            <p className="text-muted-foreground">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Link href={salesInvoicesRoutes.index().url} className="inline-flex">
                            <Button type="button" variant="outline">العودة للقائمة</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

