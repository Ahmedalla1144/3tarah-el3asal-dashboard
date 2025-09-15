import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link, usePage } from '@inertiajs/react'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'

type PageProps = { warehouse: { id: number; name: string; code?: string | null; address?: string | null; is_active: boolean } }

import warehousesRoutes from '@/routes/warehouses'

export default function WarehouseEdit() {
    const { props } = usePage<PageProps>()
    const { warehouse } = props
    const { add } = useToast()
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المخازن', href: warehousesRoutes.index().url },
        { title: `تعديل: ${warehouse.name}`, href: '#' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل مخزن ${warehouse.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={warehousesRoutes.update(warehouse.id).url} method="post" className="mx-auto w-full max-w-xl space-y-4" onSuccess={() => add({ title: 'تم الحفظ', description: 'تم تحديث المخزن بنجاح' })} onError={() => add({ title: 'خطأ', description: 'تعذر تحديث المخزن', variant: 'destructive' })}>
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="put" />
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required defaultValue={warehouse.name} />
                                <div className="text-sm text-destructive">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="code">الكود</Label>
                                <Input id="code" name="code" defaultValue={warehouse.code ?? ''} />
                                <div className="text-sm text-destructive">{errors.code}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">العنوان</Label>
                                <Input id="address" name="address" defaultValue={warehouse.address ?? ''} />
                                <div className="text-sm text-destructive">{errors.address}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input id="is_active" name="is_active" type="checkbox" className="h-4 w-4" defaultChecked={warehouse.is_active} />
                                <Label htmlFor="is_active">نشط</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={warehousesRoutes.index().url} className="inline-flex">
                                    <Button type="button" variant="outline">رجوع</Button>
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


