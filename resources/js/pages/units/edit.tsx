import AppLayout from '@/layouts/app-layout'
import { Form, Head, Link, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type BreadcrumbItem } from '@/types'
import unitsRoutes from '@/routes/units'
import { useLiveValidation } from '@/hooks/useLiveValidation'

interface PageProps {
    unit: { id: number; name: string }
    [key: string]: unknown
}

export default function UnitEdit() {
    const { props } = usePage<PageProps>()
    const unit = props.unit

    useLiveValidation('form[action*="units"]', [
        { name: 'name', label: 'اسم الوحدة', minLength: 2 }
    ]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'الوحدات الأساسية', href: unitsRoutes.index().url },
        { title: `تعديل: ${unit.name}`, href: unitsRoutes.edit(unit.id).url },
    ]

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`تعديل وحدة - ${unit.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mx-auto w-full max-w-xl">
                    <Form action={unitsRoutes.update(unit.id).url} method="post" className="space-y-4 rounded-lg border p-4">
                        {({ processing, errors }) => (
                            <>
                                <input type="hidden" name="_method" value="put" />
                                <div className="grid gap-2">
                                    <Label htmlFor="name">اسم الوحدة</Label>
                                    <Input id="name" name="name" defaultValue={unit.name} required maxLength={100} />
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


