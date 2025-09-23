import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { useEffect } from 'react'
import { attachLiveValidation } from '@/components/forms/validate'

type PageProps = {
    warehouse: { id: number; name: string; code?: string | null; address?: string | null; is_active: boolean }
    [key: string]: any
}

import warehousesRoutes from '@/routes/warehouses'

export default function WarehouseEdit() {
    const { props } = usePage<PageProps>()
    const { warehouse } = props

    useEffect(() => {
        // Use a timeout to ensure the form is rendered
        const timer = setTimeout(() => {
            const form = document.querySelector('form[action*="warehouses"]') as HTMLFormElement
            if (form) {
                attachLiveValidation(form, [
                    { name: 'name', label: 'الاسم', required: true, minLength: 2, maxLength: 150 },
                    { name: 'code', label: 'الكود', maxLength: 50 },
                    { name: 'address', label: 'العنوان', maxLength: 200 },
                ])
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المخازن', href: warehousesRoutes.index().url },
        { title: `تعديل: ${warehouse.name}`, href: '#' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل مخزن ${warehouse.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={warehousesRoutes.update(warehouse.id).url} method="post" className="mx-auto w-full max-w-xl space-y-4" >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="put" />
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required defaultValue={warehouse.name} />
                                <div className="text-sm text-destructive" data-error-for="name">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="code">الكود</Label>
                                <Input id="code" name="code" defaultValue={warehouse.code ?? ''} />
                                <div className="text-sm text-destructive" data-error-for="code">{errors.code}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">العنوان</Label>
                                <Input id="address" name="address" defaultValue={warehouse.address ?? ''} />
                                <div className="text-sm text-destructive" data-error-for="address">{errors.address}</div>
                            </div>
                            <div className="items-center gap-2 hidden">
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


