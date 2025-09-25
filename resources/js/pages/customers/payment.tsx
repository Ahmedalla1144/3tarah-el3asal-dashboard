import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatEGP } from '@/lib/currency'

interface PageProps {
    customer: {
        id: number
        name: string
        current_balance: number
        unpaid_invoices: Array<{
            id: number
            number: string
            total: number
            paid: number
            remaining: number
            date: string
        }>
    }
    accounts: Array<{ id: number; name: string }>
    paymentMethods: Array<{ id: number; name: string }>
}

interface Allocation {
    invoice_id: number
    amount: string
}

export default function CustomerPayment({ customer }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'العملاء', href: '/customers' },
        { title: customer.name, href: `/customers/${customer.id}/edit` },
        { title: 'تحصيل مبلغ', href: '' },
    ]

    const [formData, setFormData] = useState({
        amount: '',
        account_id: '1', // قيمة ثابتة للحساب
        payment_method_id: '1', // قيمة ثابتة لطريقة الدفع
        received_at: new Date().toISOString().split('T')[0],
        reference_no: '', // سيتم إرسالها فارغة
        notes: '', // سيتم إرسالها فارغة
    })

    const [allocations, setAllocations] = useState<Allocation[]>([])
    const [totalAllocated, setTotalAllocated] = useState(0)

    // تهيئة التخصيمات عند تغيير المبلغ
    useEffect(() => {
        if (formData.amount && customer.unpaid_invoices.length > 0) {
            const amount = parseFloat(formData.amount)
            const newAllocations: Allocation[] = []
            let remainingAmount = amount

            // تخصيم المبلغ على الفواتير حسب التاريخ (الأقدم أولاً)
            for (const invoice of customer.unpaid_invoices) {
                if (remainingAmount <= 0) break

                const allocationAmount = Math.min(remainingAmount, invoice.remaining)
                if (allocationAmount > 0) {
                    newAllocations.push({
                        invoice_id: invoice.id,
                        amount: allocationAmount.toFixed(2)
                    })
                    remainingAmount -= allocationAmount
                }
            }

            setAllocations(newAllocations)
        } else {
            setAllocations([])
        }
    }, [formData.amount, customer.unpaid_invoices])

    // حساب المجموع المخصص
    useEffect(() => {
        const total = allocations.reduce((sum, alloc) => sum + parseFloat(alloc.amount || '0'), 0)
        setTotalAllocated(total)
    }, [allocations])

    const handleAllocationChange = (index: number, value: string) => {
        const newAllocations = [...allocations]
        newAllocations[index].amount = value
        setAllocations(newAllocations)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // التحقق من أن المجموع المخصص يساوي المبلغ المدفوع
        if (Math.abs(totalAllocated - parseFloat(formData.amount)) > 0.01) {
            alert('مجموع التخصيمات يجب أن يساوي المبلغ المدفوع')
            return
        }

        // إرسال البيانات
        const form = e.target as HTMLFormElement
        form.submit()
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تحصيل مبلغ من ${customer.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {/* معلومات العميل */}
                    <Card>
                        <CardHeader>
                            <CardTitle>معلومات العميل</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">اسم العميل</Label>
                                    <p className="text-lg">{customer.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">الرصيد المدين</Label>
                                    <p className="text-lg font-semibold text-red-600">
                                        {formatEGP(customer.current_balance)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* نموذج الدفع */}
                    <Card>
                        <CardHeader>
                            <CardTitle>بيانات الدفع</CardTitle>
                            <CardDescription>
                                أدخل تفاصيل المبلغ المراد تحصيله من العميل
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                method="post"
                                action={`/customers/${customer.id}/payment`}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* إرسال التخصيمات كحقول مخفية */}
                                {allocations.map((allocation, index) => (
                                    <div key={index}>
                                        <input type="hidden" name={`allocations[${index}][invoice_id]`} value={allocation.invoice_id} />
                                        <input type="hidden" name={`allocations[${index}][amount]`} value={allocation.amount} />
                                    </div>
                                ))}

                                {/* إرسال القيم الثابتة كحقول مخفية */}
                                <input type="hidden" name="account_id" value={formData.account_id} />
                                <input type="hidden" name="payment_method_id" value={formData.payment_method_id} />
                                <input type="hidden" name="reference_no" value={formData.reference_no} />
                                <input type="hidden" name="notes" value={formData.notes} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">المبلغ المدفوع *</Label>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            max={customer.current_balance}
                                            required
                                            value={formData.amount || customer.current_balance}
                                            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                                            placeholder="0.00"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            الحد الأقصى: {formatEGP(customer.current_balance)}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="received_at">تاريخ الاستلام *</Label>
                                        <Input
                                            id="received_at"
                                            name="received_at"
                                            type="date"
                                            required
                                            value={formData.received_at}
                                            onChange={(e) => setFormData(prev => ({ ...prev, received_at: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* تخصيم المبلغ على الفواتير */}
                                {formData.amount && allocations.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-medium">تخصيم المبلغ على الفواتير</h3>
                                            <div className="text-sm">
                                                <span className="text-muted-foreground">المجموع المخصص: </span>
                                                <span className={`font-semibold ${Math.abs(totalAllocated - parseFloat(formData.amount)) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                                                    {formatEGP(totalAllocated)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {allocations.map((allocation, index) => {
                                                const invoice = customer.unpaid_invoices.find(inv => inv.id === allocation.invoice_id)
                                                return (
                                                    <div key={allocation.invoice_id} className="flex items-center gap-4 p-3 border rounded-lg">
                                                        <div className="flex-1">
                                                            <p className="font-medium">فاتورة #{invoice?.number}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                المتبقي: {formatEGP(invoice?.remaining || 0)} |
                                                                التاريخ: {invoice?.date}
                                                            </p>
                                                        </div>
                                                        <div className="w-32">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                max={invoice?.remaining || 0}
                                                                value={allocation.amount}
                                                                onChange={(e) => handleAllocationChange(index, e.target.value)}
                                                                className="text-right"
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {Math.abs(totalAllocated - parseFloat(formData.amount)) > 0.01 && (
                                            <p className="text-sm text-red-600">
                                                مجموع التخصيمات يجب أن يساوي المبلغ المدفوع
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        type="submit"
                                        disabled={Math.abs(totalAllocated - parseFloat(formData.amount)) > 0.01}
                                    >
                                        تسجيل الدفع
                                    </Button>
                                    <Link href="/customers">
                                        <Button type="button" variant="outline">إلغاء</Button>
                                    </Link>
                                </div>

                                {/* رسائل التحقق */}
                                {Math.abs(totalAllocated - parseFloat(formData.amount)) > 0.01 && (
                                    <p className="text-sm text-red-600">مجموع التخصيمات يجب أن يساوي المبلغ المدفوع</p>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
