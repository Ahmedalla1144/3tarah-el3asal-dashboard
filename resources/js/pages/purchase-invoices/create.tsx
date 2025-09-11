import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useMemo, useState } from 'react'

interface ProductUnitRow { unit_id: number; unit: string | null; ratio_to_base: number; is_default_buy?: boolean }
interface ProductRow { id: number; name: string; base_unit_id: number | null; cost_price: number | null; stock: number; units?: ProductUnitRow[] }
interface PageProps {
    suppliers: { id: number; name: string }[]
    warehouses: { id: number; name: string }[]
    products: ProductRow[]
    units: { id: number; name: string }[]
    next_number: string
}

const routes = {
    index: () => ({ url: '/purchase-invoices' }),
    store: () => ({ url: '/purchase-invoices' }),
}

export default function PurchaseInvoiceCreate({ suppliers, warehouses, products, units, next_number }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'فواتير الشراء', href: routes.index().url },
        { title: 'إنشاء', href: routes.store().url },
    ]

    const [items, setItems] = useState([{ product_id: '', unit_id: '', qty: '', unit_cost: '', discount_value: '', tax_value: '' }])
    const [paidAmount, setPaidAmount] = useState<string>('')

    const total = useMemo(() => {
        return items.reduce((sum, r) => {
            const qty = parseFloat(String(r.qty || 0)) || 0
            const cost = parseFloat(String(r.unit_cost || 0)) || 0
            const disc = parseFloat(String(r.discount_value || 0)) || 0
            const tax = parseFloat(String(r.tax_value || 0)) || 0
            return sum + (qty * cost - disc + tax)
        }, 0)
    }, [items])

    function onSelectProduct(idx: number, productId: string) {
        const p = products.find(pr => String(pr.id) === productId)
        const defaultUnitId = p?.units?.find(u => u.is_default_buy)?.unit_id ?? p?.base_unit_id
        const ratio = p && defaultUnitId ? (p.units?.find(u => u.unit_id === defaultUnitId)?.ratio_to_base ?? 1) : 1
        const derivedCost = p?.cost_price != null ? (Number(p.cost_price) * ratio) : undefined
        setItems(prev => prev.map((row, i) => i === idx ? {
            ...row,
            product_id: productId,
            unit_id: defaultUnitId ? String(defaultUnitId) : row.unit_id,
            unit_cost: derivedCost != null ? String(Number(derivedCost.toFixed(6))) : row.unit_cost,
        } : row))
    }

    function onSelectUnit(idx: number, unitId: string) {
        const row = items[idx]
        const p = products.find(pr => String(pr.id) === row.product_id)
        const ratio = p?.units?.find(u => String(u.unit_id) === unitId)?.ratio_to_base ?? 1
        const derivedCost = p?.cost_price != null ? (Number(p.cost_price) * ratio) : undefined
        setItems(prev => prev.map((r, i) => i === idx ? {
            ...r,
            unit_id: unitId,
            unit_cost: derivedCost != null ? String(Number(derivedCost.toFixed(6))) : r.unit_cost,
        } : r))
    }

    function getRowUnits(idx: number): ProductUnitRow[] {
        const p = products.find(pr => String(pr.id) === items[idx].product_id)
        return p?.units ?? []
    }

    function getSelectedUnitName(idx: number): string | null {
        const row = items[idx]
        const p = products.find(pr => String(pr.id) === row.product_id)
        const u = p?.units?.find(u => String(u.unit_id) === row.unit_id)
        return u?.unit ?? null
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إنشاء فاتورة شراء" />

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
                                    <Label htmlFor="supplier_id">المورد</Label>
                                    <Select name="supplier_id" required defaultValue={suppliers[0] ? String(suppliers[0].id) : undefined}>
                                        <SelectTrigger id="supplier_id">
                                            <SelectValue placeholder="اختر المورد" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map((s) => (
                                                <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <div className="text-sm text-destructive">{errors.supplier_id}</div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="warehouse_id">المستودع</Label>
                                    <Select name="warehouse_id" required defaultValue={warehouses[0] ? String(warehouses[0].id) : undefined}>
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
                                                        <SelectItem key={p.id} value={String(p.id)}>
                                                            {p.name} (المخزون: {p.stock})
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
                                            <Input name={`items[${idx}][qty]`} value={items[idx].qty} onChange={(e)=> setItems(prev=> prev.map((r,i)=> i===idx?{...r, qty: e.target.value}: r))} type="number" step="0.001" min="0" required />
                                            <div className="text-xs text-muted-foreground">الوحدة: {getSelectedUnitName(idx) ?? '-'}</div>
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.qty`]}</div>
                                            {/* عرض المتاح في الشراء غير معتمد على المخزون، لذا لن نعرض المتاح هنا */}
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>سعر الوحدة</Label>
                                            <Input name={`items[${idx}][unit_cost]`} value={items[idx].unit_cost} onChange={(e)=> setItems(prev=> prev.map((r,i)=> i===idx?{...r, unit_cost: e.target.value}: r))} type="number" step="0.01" min="0" required />
                                            {getSelectedUnitName(idx) && (
                                                <div className="text-xs text-muted-foreground">للوحدة: {getSelectedUnitName(idx)}</div>
                                            )}
                                            <div className="text-sm text-destructive">{errors[`items.${idx}.unit_cost`]}</div>
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
                                    <Button type="button" variant="outline" onClick={() => setItems((prev) => [...prev, { product_id: '', unit_id: '', qty: '', unit_cost: '', discount_value: '', tax_value: '' }])}>إضافة بند</Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="paid_amount">المبلغ المدفوع (اختياري)</Label>
                                    <Input id="paid_amount" name="paid_amount" type="number" step="0.01" min="0" value={paidAmount} onChange={(e)=> setPaidAmount(e.target.value)} />
                                    <div className="text-sm text-muted-foreground">لو دخلت مبلغ، هيتم تسجيل دفعة للمورد وربطها بالفاتورة.</div>
                                </div>
                                <div className="ml-auto w-full max-w-sm space-y-2 rounded-lg border p-4">
                                    <div className="flex items-center justify-between text-base font-semibold"><span>إجمالي الفاتورة</span><span>{total.toFixed(2)}</span></div>
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


