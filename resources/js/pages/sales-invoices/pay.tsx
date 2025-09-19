import AppLayout from '@/layouts/app-layout'
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { formatEGP } from '@/lib/currency'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BreadcrumbItem } from '@/types';
import salesInvoicesRoutes from '@/routes/sales-invoices'


type AccountOption = { id: number; name: string }
type MethodOption = { id: number; name: string }

type PageProps = {
    invoice: { id: number; number: string; total: number; paid: number; remaining: number }
    accounts: AccountOption[]
    methods: MethodOption[]
}

export default function SalesInvoicePay() {
    const { props } = usePage<PageProps>();
    const { invoice, accounts, methods } = props;
    const [amount, setAmount] = useState(invoice?.remaining || 0);
    const [accountId, setAccountId] = useState<string>('1');
    const [methodId, setMethodId] = useState<string>('1');
    const [referenceNo, setReferenceNo] = useState('');
    const [notes, setNotes] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (amount > invoice.remaining) {
            alert('لا يمكن أن يكون المبلغ المدفوع أكبر من المتبقي للفاتورة');
            return;
        }
        if (!accountId || !methodId) return;
        router.post(`/sales-invoices/${invoice.id}/pay`, {
            amount,
            account_id: parseInt(accountId),
            payment_method_id: parseInt(methodId),
            reference_no: referenceNo || null,
            notes: notes || null,
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فواتير الشراء', href: salesInvoicesRoutes.index().url },
        { title: `#${invoice.number}`, href: salesInvoicesRoutes.show(invoice.id).url },
        { title: 'سداد', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`سداد فاتورة مبيعات #${invoice.number}`} />
            <div className="mx-auto max-w-2xl p-4">
            <h1 className="mb-4 text-xl font-semibold">سداد فاتورة مبيعات #{invoice.number}</h1>

            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="rounded-lg border p-3 text-sm">
                    <div className="text-muted-foreground">الإجمالي</div>
                    <div className="text-base font-medium">{formatEGP(invoice.total)}</div>
                </div>
                <div className="rounded-lg border p-3 text-sm">
                    <div className="text-muted-foreground">المدفوع</div>
                    <div className="text-base font-medium">{formatEGP(invoice.paid)}</div>
                </div>
                <div className="rounded-lg border p-3 text-sm">
                    <div className="text-muted-foreground">المتبقي</div>
                    <div className="text-base font-medium">{formatEGP(invoice.remaining)}</div>
                </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 rounded-lg border p-4">
                <div>
                    <label className="mb-1 block text-sm">المبلغ</label>
                    <input
                        type="number"
                        step="0.01"
                        min={0}
                        max={invoice.remaining}
                        value={amount}
                        placeholder="ادخل المبلغ المراد سداده"
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        className="w-full rounded border px-3 py-2"
                        required
                    />
                    <div className="mt-1 text-xs text-muted-foreground">يمكنك سداد جزء من الفاتورة أو المبلغ بالكامل.</div>
                </div>
                <div className="grid-cols-1 gap-4 md:grid-cols-2 hidden">
                    <div>
                        <label className="mb-1 block text-sm">الحساب</label>
                        <Select value={accountId} onValueChange={setAccountId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر الحساب" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts?.map((a) => (
                                    <SelectItem key={a.id} value={String(a.id)}>
                                        {a.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">طريقة الدفع</label>
                        <Select value={methodId} onValueChange={setMethodId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="اختر الطريقة" />
                            </SelectTrigger>
                            <SelectContent>
                                {methods?.map((m) => (
                                    <SelectItem key={m.id} value={String(m.id)}>
                                        {m.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm">رقم المرجع</label>
                        <input className="w-full rounded border px-3 py-2" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} placeholder="مثال: إيصال/تحويل #" />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">ملاحظات</label>
                        <input className="w-full rounded border px-3 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="معلومة إضافية اختيارية" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">
                        حفظ السداد
                    </button>
                    <button className="rounded border px-4 py-2" type="button" onClick={() => history.back()}>
                        إلغاء
                    </button>
                </div>
            </form>
        </div>
        </AppLayout>
    );
}
