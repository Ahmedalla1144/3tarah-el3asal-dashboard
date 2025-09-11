const categoriesRoutes = {
    index: () => ({ url: '/categories' }),
    create: () => ({ url: '/categories/create' }),
    edit: (id: number) => ({ url: `/categories/${id}/edit` }),
    destroy: (id: number) => ({ url: `/categories/${id}` }),
}
import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type BreadcrumbItem } from '@/types'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'

type CategoryRow = { id: number; name: string }
type PaginationLink = string | null

interface PageProps {
    categories: {
        data: CategoryRow[]
        links: { url: PaginationLink; label: string; active: boolean }[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    filters: { search?: string }
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الفئات', href: categoriesRoutes.index().url },
]

export default function CategoriesIndex({ categories, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '')
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(categoriesRoutes.index().url, { search: value }, { preserveState: true, replace: true })
    }, 300)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الفئات" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="ابحث بالاسم"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                debouncedSearch(e.target.value)
                            }}
                        />
                    </div>

                    <Link href={categoriesRoutes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> فئة جديدة
                        </Button>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الرقم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {categories.data.map((c) => (
                                <tr key={c.id}>
                                    <td className="px-4 py-2 text-sm">{c.id}</td>
                                    <td className="px-4 py-2 text-sm">{c.name}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={categoriesRoutes.edit(c.id).url} className="inline-flex">
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (!confirm('حذف هذه الفئة؟')) return
                                                    router.delete(categoriesRoutes.destroy(c.id).url)
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {categories.links.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url ?? '#'}
                                className={`rounded-md px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                                preserveScroll
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    )
}


