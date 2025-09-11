import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { formatEGP } from '@/lib/currency'

type AccountOption = { id: number; name: string }
type MethodOption = { id: number; name: string }

type PageProps = {
    invoice: { id: number; number: string; total: number; paid: number; remaining: number }
    accounts: AccountOption[]
    methods: MethodOption[]
}

export default function PurchaseInvoicePay() {
    const { props } = usePage<PageProps>();
    const { invoice, accounts, methods } = props;
    const [amount, setAmount] = useState(invoice?.remaining || 0);
    const [accountId, setAccountId] = useState<number | ''>('');
    const [methodId, setMethodId] = useState<number | ''>('');
    const [referenceNo, setReferenceNo] = useState('');
    const [notes, setNotes] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/purchase-invoices/${invoice.id}/pay`, {
            amount,
            account_id: accountId || null,
            payment_method_id: methodId || null,
            reference_no: referenceNo || null,
            notes: notes || null,
        });
    };

    return (
        <div className="mx-auto max-w-2xl p-4">
            <h1 className="mb-4 text-xl font-semibold">سداد فاتورة شراء #{invoice.number}</h1>

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
                        value={amount}
                        placeholder="ادخل المبلغ المراد سداده"
                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                        className="w-full rounded border px-3 py-2"
                        required
                    />
                    <div className="mt-1 text-xs text-muted-foreground">يمكنك سداد جزء من الفاتورة أو المبلغ بالكامل.</div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-1 block text-sm">الحساب</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value ? parseInt(e.target.value) : '')}
                        >
                            <option value="">اختر الحساب</option>
                            {accounts?.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm">طريقة الدفع</label>
                        <select
                            className="w-full rounded border px-3 py-2"
                            value={methodId}
                            onChange={(e) => setMethodId(e.target.value ? parseInt(e.target.value) : '')}
                        >
                            <option value="">اختر الطريقة</option>
                            {methods?.map((m) => (
                                <option key={m.id} value={m.id}>
                                    {m.name}
                                </option>
                            ))}
                        </select>
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
    );
}
