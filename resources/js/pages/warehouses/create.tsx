import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'

import warehousesRoutes from '@/routes/warehouses'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المخازن', href: warehousesRoutes.index().url },
    { title: 'إنشاء', href: warehousesRoutes.store().url },
]

export default function WarehouseCreate() {
    const { add } = useToast()
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مخزن جديد" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={warehousesRoutes.store().url} method="post" className="mx-auto w-full max-w-xl space-y-4" onSuccess={() => add({ title: 'تم الحفظ', description: 'تم إنشاء المخزن بنجاح' })} onError={() => add({ title: 'خطأ', description: 'تعذر إنشاء المخزن', variant: 'destructive' })}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required />
                                <div className="text-sm text-destructive">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="code">الكود</Label>
                                <Input id="code" name="code" />
                                <div className="text-sm text-destructive">{errors.code}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">العنوان</Label>
                                <Input id="address" name="address" />
                                <div className="text-sm text-destructive">{errors.address}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">ملاحظات</Label>
                                <Input id="notes" name="notes" />
                                <div className="text-sm text-destructive">{errors.notes}</div>
                            </div>
                            <div className="items-center gap-2" hidden>
                                <input id="is_active" name="is_active" type="checkbox" className="h-4 w-4" />
                                <Label htmlFor="is_active">نشط</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={warehousesRoutes.index().url} className="inline-flex">
                                    <Button type="button" variant="outline">إلغاء</Button>
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


