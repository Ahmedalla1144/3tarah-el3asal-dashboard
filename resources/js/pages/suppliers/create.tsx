import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'

import suppliersRoutes from '@/routes/suppliers'
import { useLiveValidation } from '@/hooks/useLiveValidation'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الموردون', href: suppliersRoutes.index().url },
    { title: 'إنشاء', href: suppliersRoutes.store().url },
]

export default function SupplierCreate() {
    useLiveValidation('form[action*="suppliers"]', [
        { name: 'name', label: 'الاسم' },
        { name: 'phone', label: 'الهاتف', required: false, type: 'phone'},
        { name: 'email', label: 'البريد الإلكتروني', required: false},
    ]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مورد جديد" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={suppliersRoutes.store().url} method="post" className="mx-auto w-full max-w-xl space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required />
                                <div className="text-sm text-destructive" data-error-for="name">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">الهاتف</Label>
                                <Input id="phone" name="phone" />
                                <div className="text-sm text-destructive" data-error-for="phone">{errors.phone}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">العنوان</Label>
                                <Input id="address" name="address" />
                                <div className="text-sm text-destructive">{errors.address}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input id="email" name="email" type="email" />
                                <div className="text-sm text-destructive" data-error-for="email">{errors.email}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tax_id">الرقم الضريبي</Label>
                                <Input id="tax_id" name="tax_id" />
                                <div className="text-sm text-destructive">{errors.tax_id}</div>
                            </div>
                            <div className="grid- gap-2 hidden">
                                <Label htmlFor="opening_balance">الرصيد الافتتاحي</Label>
                                <Input id="opening_balance" value={0} name="opening_balance" type="number" step="0.01" min="0" />
                                <div className="text-sm text-destructive">{errors.opening_balance}</div>
                            </div>
                            <div className="grid- gap-2 hidden">
                                <Label htmlFor="notes">ملاحظات</Label>
                                <Input id="notes" name="notes" />
                                <div className="text-sm text-destructive">{errors.notes}</div>
                            </div>
                            <div className="flex- items-center gap-2 hidden">
                                <input id="is_active" name="is_active" type="checkbox" className="h-4 w-4" />
                                <Label htmlFor="is_active">نشط</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={suppliersRoutes.index().url} className="inline-flex">
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


