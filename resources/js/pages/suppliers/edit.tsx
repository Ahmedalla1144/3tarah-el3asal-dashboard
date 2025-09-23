import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { useEffect } from 'react'
import { attachLiveValidation } from '@/components/forms/validate'

type PageProps = {
    supplier: { id: number; name: string; phone?: string | null; address?: string | null; email?: string | null; tax_id?: string | null; opening_balance?: number | null; notes?: string | null; is_active: boolean }
    [key: string]: any
}

import suppliersRoutes from '@/routes/suppliers'

export default function SupplierEdit() {
    const { props } = usePage<PageProps>()
    const { supplier } = props

    useEffect(() => {
        // Use a timeout to ensure the form is rendered
        const timer = setTimeout(() => {
            const form = document.querySelector('form[action*="suppliers"]') as HTMLFormElement
            if (form) {
                attachLiveValidation(form, [
                    { name: 'name', label: 'الاسم', required: true, minLength: 2, maxLength: 150 },
                    { name: 'phone', label: 'الهاتف', maxLength: 30 },
                    { name: 'email', label: 'البريد الإلكتروني', maxLength: 100 },
                ])
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الموردون', href: suppliersRoutes.index().url },
        { title: `تعديل: ${supplier.name}`, href: '#' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل مورد ${supplier.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={suppliersRoutes.update(supplier.id).url} method="post" className="mx-auto w-full max-w-xl space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="put" />
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required defaultValue={supplier.name} />
                                <div className="text-sm text-destructive" data-error-for="name">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">الهاتف</Label>
                                <Input id="phone" name="phone" defaultValue={supplier.phone ?? ''} />
                                <div className="text-sm text-destructive" data-error-for="phone">{errors.phone}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">العنوان</Label>
                                <Input id="address" name="address" defaultValue={supplier.address ?? ''} />
                                <div className="text-sm text-desuctive">{errors.address}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input id="email" name="email" type="email" defaultValue={supplier.email ?? ''} />
                                <div className="text-sm text-destructive" data-error-for="email">{errors.email}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tax_id">الرقم الضريبي</Label>
                                <Input id="tax_id" name="tax_id" defaultValue={supplier.tax_id ?? ''} />
                                <div className="text-sm text-destructive">{errors.tax_id}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="opening_balance">الرصيد الافتتاحي</Label>
                                <Input id="opening_balance" name="opening_balance" type="number" step="0.01" min="0" defaultValue={supplier.opening_balance ?? ''} />
                                <div className="text-sm text-destructive">{errors.opening_balance}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">ملاحظات</Label>
                                <Input id="notes" name="notes" defaultValue={supplier.notes ?? ''} />
                                <div className="text-sm text-destructive">{errors.notes}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input id="is_active" name="is_active" type="checkbox" className="h-4 w-4" defaultChecked={supplier.is_active} />
                                <Label htmlFor="is_active">نشط</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={suppliersRoutes.index().url} className="inline-flex">
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


