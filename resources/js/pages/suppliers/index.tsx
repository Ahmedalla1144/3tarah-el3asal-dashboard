import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type SupplierRow = { id: number; name: string; phone?: string | null; is_active: boolean };
type PaginationLink = string | null;

interface PageProps {
    suppliers: {
        data: SupplierRow[];
        links: { url: PaginationLink; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {search: string}
}

import EmptyState from '@/components/empty-state';
import suppliersRoutes from '@/routes/suppliers';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'الموردون', href: suppliersRoutes.index().url }];

export default function SuppliersIndex({ suppliers, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(suppliersRoutes.index().url, { search: value }, { preserveState: true, replace: true });
    }, 300);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="الموردون" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="ابحث باسم المورد"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                        />
                    </div>

                    <Link href={suppliersRoutes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> مورد جديد
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full min-w-[500px] divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الهاتف</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {suppliers.data.length === 0 ? (
                                <EmptyState colSpan={3} />
                            ) : (
                                suppliers.data.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-4 py-2 text-sm">{s.name}</td>
                                        <td className="px-4 py-2 text-sm">{s.phone ?? '-'}</td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={suppliersRoutes.edit(s.id).url} className="inline-flex">
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (!confirm('حذف هذا المورد؟')) return;
                                                        router.delete(suppliersRoutes.destroy(s.id).url);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
