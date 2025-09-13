import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMemo, useState } from 'react'

interface ProductUnitRow { unit_id: number; unit: string | null; ratio_to_base: number; is_default_sale?: boolean; is_default_buy?: boolean }
interface ProductRow { id: number; name: string; base_unit_id: number | null; sale_price: number | null; stock: number; units?: ProductUnitRow[] }
interface PageProps {
    customers: { id: number; name: string; current_balance: number }[]
    warehouses: { id: number; name: string }[]
    products: ProductRow[]
    units: { id: number; name: string }[]
    next_number: string
}

const routes = {
    index: () => ({ url: '/sales-invoices' }),
    store: () => ({ url: '/sales-invoices' }),
}

export default function SalesInvoiceCreate({ customers, warehouses, products, units, next_number }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فواتير المبيعات', href: routes.index().url },
        { title: 'إنشاء', href: routes.store().url },
    ]

    const [items, setItems] = useState([{ product_id: '', unit_id: '', qty: '', unit_price: '', discount_value: '', tax_value: '', max_qty: 0 }])
    const [paidAmount, setPaidAmount] = useState<string>('')
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')

    const total = useMemo(() => {
        return items.reduce((sum, r) => {
            const qty = parseFloat(String(r.qty || 0)) || 0
            const price = parseFloat(String(r.unit_price || 0)) || 0
            const disc = parseFloat(String(r.discount_value || 0)) || 0
            const tax = parseFloat(String(r.tax_value || 0)) || 0
            return sum + (qty * price - disc + tax)
        }, 0)
    }, [items])

    const selectedCustomer = customers.find(c => String(c.id) === selectedCustomerId)
    const customerDebitBalance = selectedCustomer?.current_balance || 0
    const actualTotal = total + customerDebitBalance

    function onSelectProduct(idx: number, productId: string) {
        const p = products.find(pr => String(pr.id) === productId)
        if (!p) return

        // First try to find default sale unit, then default buy unit, then base unit, then first available unit
        let defaultUnitId = p.units?.find(u => u.is_default_sale)?.unit_id
        if (!defaultUnitId) {
            defaultUnitId = p.units?.find(u => u.is_default_buy)?.unit_id
        }
        if (!defaultUnitId) {
            defaultUnitId = p.base_unit_id
        }
        if (!defaultUnitId && p.units && p.units.length > 0) {
            defaultUnitId = p.units[0].unit_id
        }

        const ratio = defaultUnitId ? (p.units?.find(u => u.unit_id === defaultUnitId)?.ratio_to_base ?? 1) : 1
        const derivedPrice = p.sale_price != null ? (Number(p.sale_price) * ratio) : undefined
        
        setItems(prev => prev.map((row, i) => i === idx ? {
            ...row,
            product_id: productId,
            unit_id: defaultUnitId ? String(defaultUnitId) : '',
            unit_price: derivedPrice != null ? String(Number(derivedPrice.toFixed(6))) : '',
            max_qty: p.stock || 0,
        } : row))
    }

    function onSelectUnit(idx: number, unitId: string) {
        const row = items[idx]
        const p = products.find(pr => String(pr.id) === row.product_id)
        const ratio = p?.units?.find(u => String(u.unit_id) === unitId)?.ratio_to_base ?? 1
        const derivedPrice = p?.sale_price != null ? (Number(p.sale_price) * ratio) : undefined
        setItems(prev => prev.map((r, i) => i === idx ? {
            ...r,
            unit_id: unitId,
            unit_price: derivedPrice != null ? String(Number(derivedPrice.toFixed(6))) : r.unit_price,
        } : r))
    }

    function getRowUnits(idx: number): ProductUnitRow[] {
        const p = products.find(pr => String(pr.id) === items[idx].product_id)
        return p?.units ?? []
    }

    function getAvailableForSelectedUnit(idx: number): number | null {
        const row = items[idx]
        const p = products.find(pr => String(pr.id) === row.product_id)
        if (!p || !row.unit_id) return null
        const ratio = p.units?.find(u => String(u.unit_id) === row.unit_id)?.ratio_to_base ?? 1
        if (!p.stock) return 0
        const available = p.stock / ratio
        return Number.isFinite(available) ? Math.floor(available * 1000) / 1000 : 0
    }

    function getSelectedUnitName(idx: number): string | null {
        const row = items[idx]
        const p = products.find(pr => String(pr.id) === row.product_id)
        const u = p?.units?.find(u => String(u.unit_id) === row.unit_id)
        return u?.unit ?? null
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إنشاء فاتورة مبيعات" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={routes.store().url} method="post" className="mx-auto w-full max-w-4xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="number">رقم الفاتورة</Label>
                                    <Input id="number" name="number" required defaultValue={next_number} />
                                    <div className="text-sm text-destructive">{errors.number}</div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="date">التاريخ</Label>
                                    <Input id="date" name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} />
                                    <div className="text-sm text-destructive">{errors.date}</div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="customer_id">العميل</Label>
                                    <Select name="customer_id" required value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                                        <SelectTrigger id="customer_id">
                                            <SelectValue placeholder="اختر العميل" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name} {c.current_balance !== 0 && `(رصيد: ${c.current_balance.toFixed(2)})`}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="text-sm text-destructive">{errors.customer_id}</div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="warehouse_id">المستودع</Label>
                                    <Select name="warehouse_id" required>
                                        <SelectTrigger id="warehouse_id">
                                            <SelectValue placeholder="اختر المستودع" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {warehouses.map((w) => (
                                                <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="text-sm text-destructive">{errors.warehouse_id}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-base font-medium">بنود الفاتورة</div>
                                {items.map((row, idx) => (
                                    <div key={idx} className="grid grid-cols-1 gap-4 md:grid-cols-12">
                                        <div className="md:col-span-3">
                                            <Label>المنتج</Label>
                                            <Select name={`items[${idx}][product_id]`} required value={items[idx].product_id} onValueChange={(val) => onSelectProduct(idx, val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر المنتج" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map((p) => (
                                                        <SelectItem key={p.id} value={String(p.id)} disabled={p.stock <= 0}>
                                                            {p.name} (المخزون: {p.stock}) {p.stock <= 0 ? '- غير متوفر' : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.product_id`]}</div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>الوحدة</Label>
                                            <Select name={`items[${idx}][unit_id]`} required value={items[idx].unit_id} onValueChange={(val) => onSelectUnit(idx, val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="اختر الوحدة" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {getRowUnits(idx).map((u) => (
                                                        <SelectItem key={u.unit_id} value={String(u.unit_id)}>{u.unit}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.unit_id`]}</div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>الكمية</Label>
                                            <Input name={`items[${idx}][qty]`} value={items[idx].qty} onChange={(e)=> setItems(prev=> prev.map((r,i)=> i===idx?{...r, qty: e.target.value}: r))} type="number" step="0.001" min="0" max={items[idx].max_qty} required />
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.qty`]}</div>
                                            {getAvailableForSelectedUnit(idx) != null && (
                                                <div className="text-xs text-muted-foreground">المتاح: {getAvailableForSelectedUnit(idx)}</div>
                                            )}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>سعر الوحدة</Label>
                                            <Input name={`items[${idx}][unit_price]`} value={items[idx].unit_price} onChange={(e)=> setItems(prev=> prev.map((r,i)=> i===idx?{...r, unit_price: e.target.value}: r))} type="number" step="0.01" min="0" required />
                                            {getSelectedUnitName(idx) && (
                                                <div className="text-xs text-muted-foreground">للوحدة: {getSelectedUnitName(idx)}</div>
                                            )}
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.unit_price`]}</div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <Label>الخصم</Label>
                                            <Input name={`items[${idx}][discount_value]`} value={items[idx].discount_value} onChange={(e)=> setItems(prev=> prev.map((r,i)=> i===idx?{...r, discount_value: e.target.value}: r))} type="number" step="0.01" min="0" />
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.discount_value`]}</div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <Label>الضريبة</Label>
                                            <Input name={`items[${idx}][tax_value]`} value={items[idx].tax_value} onChange={(e)=> setItems(prev=> prev.map((r,i)=> i===idx?{...r, tax_value: e.target.value}: r))} type="number" step="0.01" min="0" />
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.tax_value`]}</div>
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <Button type="button" variant="outline" onClick={() => setItems((prev) => [...prev, { product_id: '', unit_id: '', qty: '', unit_price: '', discount_value: '', tax_value: '', max_qty: 0 }])}>إضافة بند</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="paid_amount">المبلغ المدفوع (اختياري)</Label>
                                    <Input id="paid_amount" name="paid_amount" type="number" step="0.01" min="0" value={paidAmount} onChange={(e)=> setPaidAmount(e.target.value)} />
                                    <div className="text-sm text-muted-foreground">لو دخلت مبلغ، هيتم تسجيل إيصال واستقطاعه من الفاتورة مباشرة.</div>
                                </div>
                                <div className="ml-auto w-full max-w-sm space-y-2 rounded-lg border p-4">
                                    <div className="flex items-center justify-between text-base font-semibold"><span>إجمالي الفاتورة</span><span>{total.toFixed(2)}</span></div>
                                    {selectedCustomer && customerDebitBalance !== 0 && (
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>الرصيد المدين</span>
                                            <span className={customerDebitBalance > 0 ? 'text-red-600' : 'text-green-600'}>
                                                {customerDebitBalance.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    {selectedCustomer && customerDebitBalance !== 0 && (
                                        <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                                            <span>الإجمالي الفعلي</span>
                                            <span className={actualTotal > 0 ? 'text-red-600' : 'text-green-600'}>
                                                {actualTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">ملاحظات</Label>
                                <Input id="notes" name="notes" />
                                <div className="text-sm text-destructive">{errors.notes}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={routes.index().url} className="inline-flex">
                                    <Button type="button" variant="outline">إلغاء</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>إنشاء</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}


