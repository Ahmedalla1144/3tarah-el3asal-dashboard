import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import productsRoutes from '@/routes/products'

interface ProductUnit {
    id: number
    unit_id: number
    unit_name: string | null
    ratio_to_base: number
    is_default_sale: boolean
    is_default_buy: boolean
}

interface PageProps {
    product: {
        id: number
        name: string
        base_unit: { id: number; name: string | null }
        units: ProductUnit[]
    }
    availableUnits: { id: number; name: string }[]
}

export default function ProductUnits({ product, availableUnits }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المنتجات', href: productsRoutes.index().url },
        { title: product.name, href: productsRoutes.edit(product.id).url },
        { title: 'إدارة الوحدات', href: '' },
    ]

    const [newUnit, setNewUnit] = useState({
        unit_id: '',
        ratio_to_base: '',
        is_default_sale: false,
        is_default_buy: false,
    })

    const availableUnitsForSelect = availableUnits.filter(
        unit => !product.units.some(pu => pu.unit_id === unit.id)
    )

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`إدارة وحدات ${product.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-4xl space-y-6">
                    {/* Product Info */}
                    <div className="rounded-lg border p-4">
                        <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                        <p className="text-sm text-muted-foreground">
                            الوحدة الأساسية: {product.base_unit.name}
                        </p>
                    </div>

                    {/* Add New Unit Form */}
                    <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">إضافة وحدة جديدة</h3>
                        <Form
                            action={`/products/${product.id}/units`}
                            method="post"
                            className="grid grid-cols-1 gap-4 md:grid-cols-4"
                            onSubmitComplete={() => {
                                setNewUnit({
                                    unit_id: '',
                                    ratio_to_base: '',
                                    is_default_sale: false,
                                    is_default_buy: false,
                                })
                            }}
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="unit_id">الوحدة</Label>
                                {/* Hidden field to actually submit the selected unit id */}
                                <input type="hidden" name="unit_id" value={newUnit.unit_id} />
                                <Select
                                    required
                                    value={newUnit.unit_id}
                                    onValueChange={(val) => setNewUnit(prev => ({ ...prev, unit_id: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="اختر الوحدة" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUnitsForSelect.map((unit) => (
                                            <SelectItem key={unit.id} value={String(unit.id)}>
                                                {unit.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="ratio_to_base">النسبة للوحدة الأساسية</Label>
                                <Input
                                    name="ratio_to_base"
                                    type="number"
                                    step="0.000001"
                                    min="0.000001"
                                    required
                                    value={newUnit.ratio_to_base}
                                    onChange={(e) => setNewUnit(prev => ({ ...prev, ratio_to_base: e.target.value }))}
                                    placeholder="مثال: 1000 للكيلو"
                                />
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {/* Send 0/1 for boolean */}
                                    <input type="hidden" name="is_default_sale" value="0" />
                                    <Checkbox
                                        id="is_default_sale"
                                        name="is_default_sale"
                                        value="1"
                                        checked={newUnit.is_default_sale}
                                        onCheckedChange={(val) => setNewUnit(prev => ({ ...prev, is_default_sale: !!val }))}
                                    />
                                    <Label htmlFor="is_default_sale">افتراضي للمبيعات</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="hidden" name="is_default_buy" value="0" />
                                    <Checkbox
                                        id="is_default_buy"
                                        name="is_default_buy"
                                        value="1"
                                        checked={newUnit.is_default_buy}
                                        onCheckedChange={(val) => setNewUnit(prev => ({ ...prev, is_default_buy: !!val }))}
                                    />
                                    <Label htmlFor="is_default_buy">افتراضي للمشتريات</Label>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <Button type="submit">إضافة</Button>
                            </div>
                        </Form>
                    </div>

                    {/* Existing Units */}
                    <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium mb-4">الوحدات الموجودة</h3>
                        <div className="space-y-4">
                            {product.units.map((unit) => (
                                <div key={unit.id} className="grid grid-cols-1 gap-4 md:grid-cols-5 items-end border rounded-lg p-4">
                                    <div>
                                        <Label>الوحدة</Label>
                                        <div className="text-sm font-medium">{unit.unit_name}</div>
                                    </div>
                                    <div>
                                        <Label>النسبة للوحدة الأساسية</Label>
                                        <Form
                                            action={`/products/${product.id}/units/${unit.id}`}
                                            method="post"
                                            className="flex gap-2"
                                        >
                                            <input type="hidden" name="_method" value="patch" />
                                            <Input
                                                name="ratio_to_base"
                                                type="number"
                                                step="0.000001"
                                                min="0.000001"
                                                defaultValue={unit.ratio_to_base}
                                                className="text-sm"
                                            />
                                            <Button type="submit" size="sm">تحديث</Button>
                                        </Form>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Form
                                                action={`/products/${product.id}/units/${unit.id}`}
                                                method="post"
                                            >
                                                <input type="hidden" name="_method" value="patch" />
                                                <input type="hidden" name="ratio_to_base" value={unit.ratio_to_base} />
                                                <input type="hidden" name="is_default_sale" value={unit.is_default_sale ? '0' : '1'} />
                                                <Button
                                                    type="submit"
                                                    variant={unit.is_default_sale ? "default" : "outline"}
                                                    size="sm"
                                                >
                                                    {unit.is_default_sale ? 'افتراضي للمبيعات' : 'تعيين للمبيعات'}
                                                </Button>
                                            </Form>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Form
                                                action={`/products/${product.id}/units/${unit.id}`}
                                                method="post"
                                            >
                                                <input type="hidden" name="_method" value="patch" />
                                                <input type="hidden" name="ratio_to_base" value={unit.ratio_to_base} />
                                                <input type="hidden" name="is_default_buy" value={unit.is_default_buy ? '0' : '1'} />
                                                <Button
                                                    type="submit"
                                                    variant={unit.is_default_buy ? "default" : "outline"}
                                                    size="sm"
                                                >
                                                    {unit.is_default_buy ? 'افتراضي للمشتريات' : 'تعيين للمشتريات'}
                                                </Button>
                                            </Form>
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        {unit.unit_id !== product.base_unit.id && (
                                            <Form
                                                action={`/products/${product.id}/units/${unit.id}`}
                                                method="post"
                                            >
                                                <input type="hidden" name="_method" value="delete" />
                                                <Button type="submit" variant="destructive" size="sm">
                                                    حذف
                                                </Button>
                                            </Form>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={productsRoutes.edit(product.id).url} className="inline-flex">
                            <Button type="button" variant="outline">العودة للمنتج</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

