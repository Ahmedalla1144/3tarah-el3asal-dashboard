import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import unitsRoutes from '@/routes/units'
import { useEffect } from 'react'
import { attachLiveValidation } from '@/components/forms/validate'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الوحدات الأساسية', href: unitsRoutes.index().url },
    { title: 'إضافة', href: unitsRoutes.create().url },
]

export default function UnitCreate() {
    useEffect(() => {
        // Use a timeout to ensure the form is rendered
        const timer = setTimeout(() => {
            const form = document.querySelector('form[action*="units"]') as HTMLFormElement
            if (form) {
                attachLiveValidation(form, [
                    { name: 'name', label: 'اسم الوحدة', required: true, minLength: 2, maxLength: 100 },
                ])
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="إضافة وحدة" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-xl">
                    <Form action={unitsRoutes.store().url} method="post" className="space-y-4 rounded-lg border p-4">
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">اسم الوحدة</Label>
                                    <Input id="name" name="name" required maxLength={100} />
                                    <div className="text-sm text-destructive" data-error-for="name">{errors.name}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href={unitsRoutes.index().url} className="inline-flex"><Button type="button" variant="outline">إلغاء</Button></Link>
                                    <Button type="submit" disabled={processing}>حفظ</Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </div>
        </AppLayout>
    )
}


