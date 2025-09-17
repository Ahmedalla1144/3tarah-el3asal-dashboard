import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useIsAdmin, useIsCashier } from '@/lib/auth';
import { dashboard } from '@/routes';
import products from '@/routes/products';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

type Role = 'admin' | 'cashier';
type NavItemWithRoles = NavItem & { visibleFor?: Role[] };

const DASHBOARD_HREF = dashboard().url;


const allNavItems: NavItemWithRoles[] = [
    { title: 'لوحة التحكم', href: DASHBOARD_HREF, icon: LayoutGrid, visibleFor: ['admin', 'cashier'] },
    { title: 'الفئات', href: '/categories', icon: Folder, visibleFor: ['admin'] },
    { title: 'الوحدات', href: '/units', icon: Folder, visibleFor: ['admin'] },
    { title: 'المنتجات', href: products.index(), icon: Folder, visibleFor: ['admin'] },
    { title: 'المخازن', href: '/warehouses', icon: Folder, visibleFor: ['admin'] },
    { title: 'فواتير الشراء', href: '/purchase-invoices', icon: Folder, visibleFor: ['admin', 'cashier'] },
    { title: 'فواتير المبيعات', href: '/sales-invoices', icon: Folder, visibleFor: ['admin', 'cashier'] },
    { title: 'الموردون', href: '/suppliers', icon: Folder, visibleFor: ['admin'] },
    { title: 'العملاء', href: '/customers', icon: Folder, visibleFor: ['admin'] },
    { title: 'المستخدمون', href: '/users', icon: Folder, visibleFor: ['admin'] },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const isAdmin = useIsAdmin();
    const isCashier = useIsCashier();

    const role: Role = isAdmin ? 'admin' : isCashier ? 'cashier' : 'admin';
    const mainNavItems = allNavItems.filter((it) => it.visibleFor?.includes(role));

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
