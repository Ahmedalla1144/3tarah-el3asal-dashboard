import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import products from '@/routes/products';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'المنتجات',
        href: products.index(),
        icon: Folder,
    },
    {
        title: 'الفئات',
        href: '/categories',
        icon: Folder,
    },
    {
        title: 'فواتير الشراء',
        href: '/purchase-invoices',
        icon: Folder,
    },
    {
        title: 'فواتير المبيعات',
        href: '/sales-invoices',
        icon: Folder,
    },
    {
        title: 'المخازن',
        href: '/warehouses',
        icon: Folder,
    },
    {
        title: 'الموردون',
        href: '/suppliers',
        icon: Folder,
    },
    {
        title: 'العملاء',
        href: '/customers',
        icon: Folder,
    },
];

const footerNavItems: NavItem[] = [

];

export function AppSidebar() {
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
