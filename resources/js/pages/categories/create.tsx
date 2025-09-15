import categoriesRoutes from '@/routes/categories'
import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الفئات', href: categoriesRoutes.index().url },
    { title: 'إنشاء', href: categoriesRoutes.create().url },
]

export default function CategoryCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إنشاء فئة" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form
                    action={categoriesRoutes.store().url}
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

                            <div className="flex items-center gap-2">
                                <Link href={categoriesRoutes.index().url} className="inline-flex">
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


