import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { type BreadcrumbItem } from '@/types'
import { formatEGP, formatNumber } from '@/lib/currency'
import { useEffect, useState } from 'react'
import { Printer } from 'lucide-react'
import purchaseInvoicesRoutes from '@/routes/purchase-invoices'
import { form as payForm } from '@/routes/purchase-invoices/pay'
import { configureQZ, ensureQZConnected, getDefaultPrinter, listPrinters } from '@/lib/qz'
import { useToast } from '@/components/ui/toast'

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

export default function PurchaseInvoiceShow({ invoice }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فواتير الشراء', href: purchaseInvoicesRoutes.index().url },
        { title: `#${invoice.number}`, href: '' },
    ]

    const [printers, setPrinters] = useState<string[]>([])
    const [defaultPrinter, setDefaultPrinter] = useState<string>('')
    const [selectedPrinter, setSelectedPrinter] = useState<string>('')
    const { add } = useToast()

    useEffect(() => {
        configureQZ();
        ensureQZConnected();

        setTimeout(() => {
            getDefaultPrinter().then(printer => setDefaultPrinter(printer)).catch((error) => {
                console.log("Error getting default printer", error)
            });
            listPrinters().then(setPrinters).catch((error) => { console.log("Error Printing", error) });
        }, 800);
    }, [])

    const handlePrint = () => {
        window.open(`/purchase-invoices/${invoice.id}/print`, '_blank')
    }

    const handleRemotePrint = async () => {
        try {
            await fetch("/print-jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    invoice_id: invoice.id,
                    printer_name: defaultPrinter,
                    type: 'purchase'
                }),
            });

            // ✅ هنا هنعرض التوست
            add({ title: 'تم الإرسال', description: `تم إرسال الفاتورة رقم ${invoice.number} للطابعة 🎉` });
        } catch {
            add({ title: 'خطأ', description: 'فشل إرسال أمر الطباعة', variant: 'destructive' });
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`فاتورة شراء ${invoice.number}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">فاتورة شراء #{invoice.number}</h1>
                            <p className="text-muted-foreground">تاريخ: {invoice.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button onClick={handlePrint} variant="outline">
                                <Printer className="mr-2 h-4 w-4" />
                                طباعة
                            </Button>

                            <Button disabled={!selectedPrinter && !defaultPrinter} onClick={handleRemotePrint}>طباعة عن بُعد</Button>

                            <select className="rounded border px-2 py-1 dark:bg-black" value={defaultPrinter || selectedPrinter} onChange={(e) => setSelectedPrinter(e.target.value)}>
                                <option value="">اختر طابعة</option>
                                {printers.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>

                            <Link href={payForm(invoice.id).url} className="inline-flex"><Button>سداد</Button></Link>
                            <Link href={purchaseInvoicesRoutes.index().url} className="inline-flex"><Button variant="outline">رجوع</Button></Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-semibold mb-3">تفاصيل المورد</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">المورد:</span>
                                    <span className="font-medium">{invoice.supplier ?? '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">الملاحظات:</span>
                                    <span className="font-medium">{invoice.notes ?? '-'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg border p-4">
                            <h3 className="text-lg font-semibold mb-3">تفاصيل الفاتورة</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">المستودع:</span>
                                    <span className="font-medium">{invoice.warehouse ?? '-'}</span>
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
                                        <th className="px-4 py-3 text-right text-sm font-medium">SKU</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">الكمية</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">سعر الوحدة</th>
                                        <th className="px-4 py-3 text-right text-sm font-medium">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border bg-background">
                                    {invoice.items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3 text-sm">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm">{item.product ?? '-'}</td>
                                            <td className="px-4 py-3 text-sm">{item.sku ?? '-'}</td>
                                            <td className="px-4 py-3 text-sm">{formatNumber(item.qty)}</td>
                                            <td className="px-4 py-3 text-sm">{formatEGP(item.unit_cost)}</td>
                                            <td className="px-4 py-3 text-sm font-medium">{formatEGP(item.line_total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="ml-auto w-full max-w-sm space-y-2 rounded-lg border p-4">
                        <div className="flex items-center justify-between text-base font-semibold">
                            <span>إجمالي الفاتورة</span>
                            <span>{formatEGP(invoice.total)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>المدفوع</span>
                            <span>{formatEGP(invoice.paid ?? 0)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-medium">
                            <span>المتبقي</span>
                            <span>{formatEGP(invoice.remaining ?? 0)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}


