import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useRoles } from '@/lib/auth';
import { dashboard } from '@/routes';
import products from '@/routes/products';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Archive, FileText, LayoutGrid, Package, Printer, ShoppingBag, ShoppingCart, Tag, Truck, UserCog, Users } from 'lucide-react';
import AppLogo from './app-logo';

type Role = 'admin' | 'cashier' | 'printer';
type NavItemWithRoles = NavItem & { visibleFor?: Role[] };

const DASHBOARD_HREF = dashboard().url;


const allNavItems: NavItemWithRoles[] = [
    { title: 'لوحة التحكم', href: DASHBOARD_HREF, icon: LayoutGrid, visibleFor: ['admin', 'cashier'] },
    { title: 'الفئات', href: '/categories', icon: Tag, visibleFor: ['admin'] },
    { title: 'الوحدات', href: '/units', icon: Package, visibleFor: ['admin'] },
    { title: 'المخازن', href: '/warehouses', icon: Archive, visibleFor: ['admin'] },
    { title: 'المنتجات', href: products.index(), icon: ShoppingBag, visibleFor: ['admin'] },
    { title: 'فواتير الشراء', href: '/purchase-invoices', icon: ShoppingCart, visibleFor: ['admin', 'cashier'] },
    { title: 'فواتير المبيعات', href: '/sales-invoices', icon: FileText, visibleFor: ['admin', 'cashier'] },
    { title: 'الموردون', href: '/suppliers', icon: Truck, visibleFor: ['admin'] },
    { title: 'العملاء', href: '/customers', icon: Users, visibleFor: ['admin'] },
    { title: 'المستخدمون', href: '/users', icon: UserCog, visibleFor: ['admin'] },
    { title: 'الطباعة', href: '/print-worker', icon: Printer, visibleFor: ['printer'] },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const roles = useRoles();

    const mainNavItems = allNavItems.filter((it) => it.visibleFor?.some((r) => roles.includes(r)));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
