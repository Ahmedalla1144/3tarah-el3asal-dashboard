import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { useToast } from '@/components/ui/toast'

type Role = { id: number; name: string }
type PageProps = { user: { id: number; name: string; email: string; role_ids: number[] }, roles: Role[] }

const routes = {
    index: () => ({ url: '/users' }),
    update: (id: number) => ({ url: `/users/${id}` }),
}

export default function UserEdit() {
    const { props } = usePage<PageProps>()
    const { user, roles } = props
    const { add } = useToast()
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المستخدمون', href: routes.index().url },
        { title: `تعديل: ${user.name}`, href: '#' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل مستخدم ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={routes.update(user.id).url} method="post" className="mx-auto w-full max-w-xl space-y-4" onSuccess={() => add({ title: 'تم الحفظ', description: 'تم تحديث المستخدم بنجاح' })} onError={() => add({ title: 'خطأ', description: 'تعذر تحديث المستخدم', variant: 'destructive' })}>
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="put" />
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required defaultValue={user.name} />
                                <div className="text-sm text-destructive">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد</Label>
                                <Input id="email" name="email" type="email" required defaultValue={user.email} />
                                <div className="text-sm text-destructive">{errors.email}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">كلمة المرور الجديدة (اختياري)</Label>
                                <Input id="password" name="password" type="password" />
                                <div className="text-sm text-destructive">{errors.password}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
                                <Input id="password_confirmation" name="password_confirmation" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label>الأدوار</Label>
                                <div className="flex flex-wrap gap-3">
                                    {roles.map((r) => (
                                        <label key={r.id} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" name="roles[]" value={r.id} className="h-4 w-4" defaultChecked={user.role_ids.includes(r.id)} /> {r.name}
                                        </label>
                                    ))}
                                </div>
                                <div className="text-sm text-destructive">{errors.roles}</div>
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


