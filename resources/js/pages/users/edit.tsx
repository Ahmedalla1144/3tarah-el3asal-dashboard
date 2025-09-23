import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { useEffect } from 'react'
import { attachLiveValidation } from '@/components/forms/validate'

type Role = { id: number; name: string }
type PageProps = {
    user: { id: number; name: string; email: string; role_ids: number[] }
    roles: Role[]
    [key: string]: any
}

import usersRoutes from '@/routes/users'

export default function UserEdit() {
    const { props } = usePage<PageProps>()
    const { user, roles } = props

    useEffect(() => {
        // Use a timeout to ensure the form is rendered
        const timer = setTimeout(() => {
            const form = document.querySelector('form[action*="users"]') as HTMLFormElement
            if (form) {
                attachLiveValidation(form, [
                    { name: 'name', label: 'الاسم', required: true, minLength: 2, maxLength: 100 },
                    { name: 'email', label: 'البريد الإلكتروني', required: true, maxLength: 100 },
                    { name: 'password', label: 'كلمة المرور الجديدة', minLength: 6, maxLength: 50 },
                ])
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المستخدمون', href: usersRoutes.index().url },
        { title: `تعديل: ${user.name}`, href: '#' },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل مستخدم ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={usersRoutes.update(user.id).url} method="post" className="mx-auto w-full max-w-xl space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="put" />
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required defaultValue={user.name} />
                                <div className="text-sm text-destructive" data-error-for="name">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد</Label>
                                <Input id="email" name="email" type="email" required defaultValue={user.email} />
                                <div className="text-sm text-destructive" data-error-for="email">{errors.email}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">كلمة المرور الجديدة (اختياري)</Label>
                                <Input id="password" name="password" type="password" />
                                <div className="text-sm text-destructive" data-error-for="password">{errors.password}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
                                <Input id="password_confirmation" name="password_confirmation" type="password" />
                                <div className="text-sm text-destructive" data-error-for="password_confirmation"></div>
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
                                <Link href={usersRoutes.index().url} className="inline-flex">
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


