import categoriesRoutes from '@/routes/categories'
import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import { useEffect } from 'react'
import { attachLiveValidation } from '@/components/forms/validate'

interface PageProps {
    category: { id: number; name: string }
}

export default function CategoryEdit({ category }: PageProps) {
    useEffect(() => {
        // Use a timeout to ensure the form is rendered
        const timer = setTimeout(() => {
            const form = document.querySelector('form[action*="categories"]') as HTMLFormElement
            if (form) {
                attachLiveValidation(form, [
                    { name: 'name', label: 'الاسم', required: true, minLength: 2, maxLength: 100 },
                ])
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [])
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الفئات', href: categoriesRoutes.index().url },
        { title: `تعديل #${category.id}`, href: categoriesRoutes.edit(category.id).url },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل فئة #${category.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Form action={categoriesRoutes.update(category.id).url} method="post" className="mx-auto w-full max-w-xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="_method" value="PUT" />

                            <div className="grid gap-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" name="name" defaultValue={category.name} required />
                                <div className="text-sm text-destructive" data-error-for="name">{errors.name}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={categoriesRoutes.index().url} className="inline-flex">
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


