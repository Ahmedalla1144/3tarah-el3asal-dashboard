import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast } from '@/components/ui/toast';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { add } = useToast()
    const { props } = usePage<{ flash?: { status?: string | null; error?: string | null } }>()

    useEffect(() => {
        const flash = props.flash
        if (flash?.error) {
            add({ title: 'خطأ', description: flash.error, variant: 'destructive' })
            flash.error = '';
        } else if (flash?.status) {
            add({ title: 'تم', description: flash.status })
            flash.status = '';
        }
    }, [props.flash?.error, props.flash?.status])

    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
