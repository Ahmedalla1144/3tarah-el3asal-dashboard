import productsRoutes from '@/routes/products'
import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المنتجات', href: productsRoutes.index().url },
    { title: 'إنشاء', href: productsRoutes.create().url },
]

interface PageProps {
    categories: { id: number; name: string }[]
    units: { id: number; name: string }[]
}

export default function ProductCreate({ categories, units }: PageProps) {
    const [isActive, setIsActive] = useState(true)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إنشاء منتج" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form
                    action={productsRoutes.store().url}
                    method="post"
                    className="mx-auto w-full max-w-xl space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required />
                                <div className="text-sm text-destructive">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">الفئة</Label>
                                <Select name="category_id" required>
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
                                <Input id="sku" name="sku" />
                                <div className="text-sm text-destructive">{errors.sku}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="base_unit_id">الوحدة الأساسية</Label>
                                <Select name="base_unit_id">
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
                                <Input id="sale_price" name="sale_price" type="number" step="0.01" min="0" />
                                <div className="text-sm text-destructive">{errors.sale_price}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cost_price">سعر التكلفة</Label>
                                <Input id="cost_price" name="cost_price" type="number" step="0.01" min="0" />
                                <div className="text-sm text-destructive">{errors.cost_price}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="min_stock">الحد الأدنى للمخزون</Label>
                                <Input id="min_stock" name="min_stock" type="number" step="0.01" min="0" />
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
                                <Button type="submit" disabled={processing}>إنشاء</Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    )
}


