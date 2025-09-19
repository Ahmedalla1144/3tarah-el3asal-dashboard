import productsRoutes from '@/routes/products'
import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { formatQty } from '@/lib/currency'

interface PageProps {
    product: {
        id: number
        name: string
        sku: string | null
        category_id: number | null
        barcode?: string | null
        base_unit_id?: number | null
        sale_price?: number | null
        cost_price?: number | null
        min_stock?: number | null
        is_batch_tracked?: boolean
        is_active?: boolean
    }
    categories: { id: number; name: string }[]
    units: { id: number; name: string }[]
    product_units?: { unit_id: number; unit_name: string | null; ratio_to_base: number }[]
}

export default function ProductEdit({ product, categories, units, product_units = [] }: PageProps) {
    const [isActive, setIsActive] = useState(!!product.is_active)
    const [baseUnitId, setBaseUnitId] = useState<string>(product.base_unit_id ? String(product.base_unit_id) : '')
    const [salePrice, setSalePrice] = useState<string>(product.sale_price != null ? String(product.sale_price) : '')
    const [costPrice, setCostPrice] = useState<string>(product.cost_price != null ? String(product.cost_price) : '')
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المنتجات', href: productsRoutes.index().url },
        { title: `تعديل #${product.id}`, href: productsRoutes.edit(product.id).url },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل منتج #${product.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form
                    action={productsRoutes.update(product.id).url}
                    method="post"
                    className="mx-auto w-full max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="PUT" />

                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" defaultValue={product.name} required />
                                <div className="text-sm text-destructive">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">الفئة</Label>
                                <Select name="category_id" required defaultValue={product.category_id ? String(product.category_id) : undefined}>
                                    <SelectTrigger id="category_id">
                                        <SelectValue placeholder="اختر فئة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="text-sm text-destructive">{errors.category_id}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sku">الكود SKU</Label>
                                <Input id="sku" name="sku" defaultValue={product.sku ?? ''} />
                                <div className="text-sm text-destructive">{errors.sku}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="base_unit_id">الوحدة الأساسية</Label>
                                <input type="hidden" name="base_unit_id" value={baseUnitId} />
                                <Select value={baseUnitId} onValueChange={(val) => {
                                    // Find ratio of the newly selected unit relative to current base
                                    const ratio = product_units.find(u => String(u.unit_id) === val)?.ratio_to_base ?? 1
                                    // Multiply prices by ratio to convert to new base
                                    const sp = parseFloat(String(product.sale_price) || '0')
                                    const cp = parseFloat(String(product.cost_price) || '0')
                                    const newSp = Number.isFinite(sp) ? (sp * ratio) : sp
                                    const newCp = Number.isFinite(cp) ? (cp * ratio) : cp
                                    console.log(newSp, newCp)
                                    setSalePrice(newSp ? String(Number(newSp.toFixed(6))) : '')
                                    setCostPrice(newCp ? String(Number(newCp.toFixed(6))) : '')
                                    setBaseUnitId(val)
                                }}>
                                    <SelectTrigger id="base_unit_id">
                                        <SelectValue placeholder="اختر وحدة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((u) => (
                                            <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="text-sm text-destructive">{errors.base_unit_id}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="sale_price">سعر البيع</Label>
                                <Input id="sale_price" name="sale_price" type="number" step="0.000001" min="0" value={Number(salePrice)} onChange={(e)=> setSalePrice(e.target.value)} />
                                <div className="text-sm text-destructive">{errors.sale_price}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cost_price">سعر التكلفة</Label>
                                <Input id="cost_price" name="cost_price" type="number" step="0.000001" min="0" value={Number(costPrice)} onChange={(e)=> setCostPrice(e.target.value)} />
                                <div className="text-sm text-destructive">{errors.cost_price}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="min_stock">الحد الأدنى للمخزون</Label>
                                <Input id="min_stock" name="min_stock" type="number" step="0.000001" min="0" defaultValue={formatQty(product.min_stock) ?? ''} />
                                <div className="text-sm text-destructive">{errors.min_stock}</div>
                            </div>
                            <div className="items-center gap-2 hidden">
                                <input type="hidden" name="is_active" value={isActive ? '1' : '0'} />
                                <Checkbox id="is_active" checked={isActive} onCheckedChange={(val) => setIsActive(!!val)} />
                                <Label htmlFor="is_active">نشط</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={productsRoutes.index().url} className="inline-flex">
                                    <Button type="button" variant="outline">إلغاء</Button>
                                </Link>
                                <Link href={`/products/${product.id}/units`} className="inline-flex">
                                    <Button type="button" variant="secondary">إدارة الوحدات</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>حفظ</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}


