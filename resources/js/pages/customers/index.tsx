import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type BreadcrumbItem } from '@/types'
import { useDebouncedCallback } from 'use-debounce'
import { useState } from 'react'
import { Plus, Pencil, Trash2, CreditCard, Receipt, FileText } from 'lucide-react'
import { formatEGP } from '@/lib/currency'

type CustomerRow = {
    id: number;
    name: string;
    phone?: string | null;
    is_active: boolean;
    current_balance: number;
    unpaid_invoices: Array<{
        id: number;
        number: string;
        total: number;
        paid: number;
        remaining: number;
        date: string;
    }>;
}
type PaginationLink = string | null

interface PageProps {
    customers: {
        data: CustomerRow[]
        links: { url: PaginationLink; label: string; active: boolean }[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    filters?: { search?: string; balance_filter?: string }
}

import customersRoutes from '@/routes/customers'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'العملاء', href: customersRoutes.index().url },
]

export default function CustomersIndex({ customers, filters = {} }: PageProps) {
    const { add } = useToast()
    const [search, setSearch] = useState(filters.search ?? '')
    const [balanceFilter, setBalanceFilter] = useState(filters.balance_filter ?? 'all')


    // دالة للحصول على الرصيد المدين
    const getCustomerBalance = (customer: CustomerRow): number => {
        return customer.current_balance || 0;
    }

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(customersRoutes.index().url, {
            search: value,
            balance_filter: balanceFilter
        }, { preserveState: true, replace: true })
    }, 300)

    const handleBalanceFilterChange = (value: string) => {
        setBalanceFilter(value)
        router.get(customersRoutes.index().url, {
            search,
            balance_filter: value
        }, { preserveState: true, replace: true })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="العملاء" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2 flex-1">
                        <div className="w-full max-w-sm">
                            <Input
                                placeholder="ابحث باسم العميل"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value)
                                    debouncedSearch(e.target.value)
                                }}
                            />
                        </div>
                        <Select value={balanceFilter} onValueChange={handleBalanceFilterChange}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="فلترة الرصيد" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">جميع العملاء</SelectItem>
                                <SelectItem value="with_balance">لديهم رصيد مدين</SelectItem>
                                <SelectItem value="without_balance">بدون رصيد مدين</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Link href={customersRoutes.create().url} className="inline-flex">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> عميل جديد
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="min-w-[500px] w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">الاسم</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الهاتف</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">الرصيد المدين</th>
                                <th className="px-4 py-2 text-right text-sm font-medium">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-background">
                            {customers.data.map((c) => {
                                const balance = getCustomerBalance(c)
                                return (
                                <tr key={c.id}>
                                    <td className="px-4 py-2 text-sm">{c.name}</td>
                                    <td className="px-4 py-2 text-sm">{c.phone ?? '-'}</td>
                                    <td className="px-4 py-2 text-sm">
                                        <span className={`font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {formatEGP(balance)}
                                        </span>
                                        {balance === 0 && (
                                            <div className="text-xs text-gray-500">
                                                لا يوجد رصيد مدين
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {balance > 0 && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            // عرض الفواتير غير المدفوعة
                                                            const unpaidInvoices = c.unpaid_invoices || []
                                                            let message = `الرصيد المدين: ${formatEGP(balance)}\n\n`

                                                            if (unpaidInvoices.length > 0) {
                                                                message += 'الفواتير غير المدفوعة:\n'
                                                                unpaidInvoices.forEach(invoice => {
                                                                    message += `- فاتورة #${invoice.number}: ${formatEGP(invoice.remaining)} (تاريخ: ${invoice.date})\n`
                                                                })
                                                            }

                                                            alert(message)
                                                        }}
                                                        title="عرض تفاصيل الرصيد المدين"
                                                    >
                                                        <Receipt className="h-4 w-4" />
                                                    </Button>
                                                    <Link href={`/customers/${c.id}/payment`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="تحصيل مبلغ من العميل"
                                                        >
                                                            <CreditCard className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </>
                                            )}
                                            {/* زر عرض فواتير العميل */}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    // الانتقال إلى صفحة فواتير المبيعات مع فلترة حسب العميل
                                                    router.get('/sales-invoices', {
                                                        customer_id: c.id,
                                                        customer_name: c.name
                                                    })
                                                }}
                                                title="عرض فواتير العميل"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                            <Link href={customersRoutes.edit(c.id).url} className="inline-flex">
                                                <Button variant="outline" size="sm">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    if (!confirm('حذف هذا العميل؟')) return
                                                    router.delete(customersRoutes.destroy(c.id).url, {
                                                        onSuccess: () => add({ title: 'تم الحذف', description: 'تم حذف العميل بنجاح' }),
                                                        onError: () => add({ title: 'خطأ', description: 'تعذر حذف العميل', variant: 'destructive' }),
                                                    })
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    )
}


