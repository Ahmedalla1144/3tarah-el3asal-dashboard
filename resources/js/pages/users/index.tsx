import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type UserRow = { id: number; name: string; email: string; roles: string[] };
type PaginationLink = string | null;

interface PageProps {
    users: {
        data: UserRow[];
        links: { url: PaginationLink; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    },
    filters: {search: string}
}

import usersRoutes from '@/routes/users';
import EmptyState from '@/components/empty-state';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'المستخدمون', href: usersRoutes.index().url }];

export default function UsersIndex({ users, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(usersRoutes.index().url, { search: value }, { preserveState: true, replace: true });
    }, 300);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="المستخدمون" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="w-full max-w-sm">
                        <Input
                            placeholder="ابحث بالاسم أو البريد"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debouncedSearch(e.target.value);
                            }}
                        />
                    </div>

                    <Link href={usersRoutes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> مستخدم جديد
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full min-w-[600px] divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">البريد</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الأدوار</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {search && users.data.length === 0 ? (
                                <EmptyState colSpan={4} />
                            ) : (
                                users.data.map((u) => (
                                    <tr key={u.id}>
                                        <td className="px-4 py-2 text-sm">{u.name}</td>
                                        <td className="px-4 py-2 text-sm">{u.email}</td>
                                        <td className="px-4 py-2 text-sm">{u.roles.join(', ') || '-'}</td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={usersRoutes.edit(u.id).url} className="inline-flex">
                                                    <Button variant="outline" size="sm">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        if (!confirm('حذف هذا المستخدم؟')) return;
                                                        router.delete(usersRoutes.destroy(u.id).url);
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

                {users.last_page > 1 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {users.links.map((link, idx) => (
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
    );
}
