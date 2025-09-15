import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BarChart2 } from 'lucide-react';
import { formatEGP, formatNumber } from '@/lib/currency'
import purchaseInvoices from '@/routes/purchase-invoices';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface PageProps { metrics?: { total_purchases: number; total_sales: number; best_products: { product: string; qty_sold: number }[]; low_stock: { id: number; name: string; stock: number; min_stock: number }[] } }

export default function Dashboard({ metrics }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="لوحة التحكم" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">إجمالي المشتريات</div>
                        <div className="text-2xl font-semibold">{formatEGP(metrics?.total_purchases ?? 0)}</div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">إجمالي المبيعات</div>
                        <div className="text-2xl font-semibold">{formatEGP(metrics?.total_sales ?? 0)}</div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-muted-foreground">أفضل المنتجات مبيعاً</div>
                        <ul className="mt-2 space-y-1 text-sm">
                            {metrics?.best_products?.map((bp, i) => (
                                <li key={i} className="flex items-center justify-between"><span>{bp.product}</span><span>{formatNumber(bp.qty_sold)}</span></li>
                            )) ?? <li>لا يوجد بيانات</li>}
                        </ul>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="grid gap-4 p-4 md:grid-cols-2">
                        <div className="rounded-xl border p-4">
                            <div className="mb-2 text-sm text-muted-foreground">منتجات تحتاج إعادة طلب</div>
                            <div className="overflow-hidden rounded-lg border">
                                <table className="min-w-full divide-y divide-border">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium">المنتج</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium">المخزون</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium">الحد الأدنى</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-background">
                                        {metrics?.low_stock?.map((p) => (
                                            <tr key={p.id} className="bg-red-50 dark:bg-red-900/20">
                                                <td className="px-4 py-2 text-sm">{p.name}</td>
                                                <td className="px-4 py-2 text-sm">{formatNumber(p.stock)}</td>
                                                <td className="px-4 py-2 text-sm">{formatNumber(p.min_stock)}</td>
                                            </tr>
                                        )) ?? null}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex items-center justify-center">
                            <Link href={purchaseInvoices.index().url} className="inline-flex">
                                <Button size="lg"><BarChart2 className="mr-2 h-4 w-4" /> إلى فاتورة الشراء</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
