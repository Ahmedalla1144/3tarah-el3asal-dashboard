import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'

type Role = { id: number; name: string }

interface PageProps { roles: Role[] }

import usersRoutes from '@/routes/users'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المستخدمون', href: usersRoutes.index().url },
    { title: 'إنشاء', href: usersRoutes.store().url },
]

export default function UserCreate({ roles }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="مستخدم جديد" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={usersRoutes.store().url} method="post" className="mx-auto w-full max-w-xl space-y-4">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" required />
                                <div className="text-sm text-destructive">{errors.name}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">البريد</Label>
                                <Input id="email" name="email" type="email" required />
                                <div className="text-sm text-destructive">{errors.email}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">كلمة المرور</Label>
                                <Input id="password" name="password" type="password" required />
                                <div className="text-sm text-destructive">{errors.password}</div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
                                <Input id="password_confirmation" name="password_confirmation" type="password" required />
                            </div>
                            <div className="grid gap-2">
                                <Label>الأدوار</Label>
                                <div className="flex flex-wrap gap-3">
                                    {roles.map((r) => (
                                        <label key={r.id} className="flex items-center gap-2 text-sm">
                                            <input type="checkbox" name="roles[]" value={r.id} className="h-4 w-4" /> {r.name}
                                        </label>
                                    ))}
                                </div>
                                <div className="text-sm text-destructive">{errors.roles}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={usersRoutes.index().url} className="inline-flex">
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


