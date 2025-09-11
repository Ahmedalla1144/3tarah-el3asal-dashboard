import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link, usePage } from '@inertiajs/react'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'

type PageProps = { customer: { id: number; name: string; phone?: string | null; address?: string | null; email?: string | null; tax_id?: string | null; opening_balance?: number | null; credit_limit?: number | null; notes?: string | null; is_active: boolean } }

const routes = {
    index: () => ({ url: '/customers' }),
    update: (id: number) => ({ url: `/customers/${id}` }),
}

export default function CustomerEdit() {
    const { props } = usePage<PageProps>()
    const { customer } = props
    const { add } = useToast()
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'العملاء', href: routes.index().url },
        { title: `تعديل: ${customer.name}`, href: '#' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل عميل ${customer.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={routes.update(customer.id).url} method="post" className="mx-auto w-full max-w-xl space-y-4" onSuccess={() => add({ title: 'تم الحفظ', description: 'تم تحديث العميل بنجاح' })} onError={() => add({ title: 'خطأ', description: 'تعذر تحديث العميل', variant: 'destructive' })}>
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="put" />
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required defaultValue={customer.name} />
                                <div className="text-sm text-destructive">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">الهاتف</Label>
                                <Input id="phone" name="phone" defaultValue={customer.phone ?? ''} />
                                <div className="text-sm text-destructive">{errors.phone}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">العنوان</Label>
                                <Input id="address" name="address" defaultValue={customer.address ?? ''} />
                                <div className="text-sm text-destructive">{errors.address}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input id="email" name="email" type="email" defaultValue={customer.email ?? ''} />
                                <div className="text-sm text-destructive">{errors.email}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tax_id">الرقم الضريبي</Label>
                                <Input id="tax_id" name="tax_id" defaultValue={customer.tax_id ?? ''} />
                                <div className="text-sm text-destructive">{errors.tax_id}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="opening_balance">الرصيد الافتتاحي</Label>
                                <Input id="opening_balance" name="opening_balance" type="number" step="0.01" min="0" defaultValue={customer.opening_balance ?? ''} />
                                <div className="text-sm text-destructive">{errors.opening_balance}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="credit_limit">حد الائتمان</Label>
                                <Input id="credit_limit" name="credit_limit" type="number" step="0.01" min="0" defaultValue={customer.credit_limit ?? ''} />
                                <div className="text-sm text-destructive">{errors.credit_limit}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="notes">ملاحظات</Label>
                                <Input id="notes" name="notes" defaultValue={customer.notes ?? ''} />
                                <div className="text-sm text-destructive">{errors.notes}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input id="is_active" name="is_active" type="checkbox" className="h-4 w-4" defaultChecked={customer.is_active} />
                                <Label htmlFor="is_active">نشط</Label>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={routes.index().url} className="inline-flex">
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


