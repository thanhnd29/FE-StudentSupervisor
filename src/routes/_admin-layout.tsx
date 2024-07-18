import * as React from 'react';

import { Outlet, createFileRoute } from '@tanstack/react-router';

import DashboardLayout from '@/core/components/layout/DashboardLayout';
import AuthWrapper from '@/core/components/wrapper/AuthWrapper';
import { MenuDashboardProvider } from '@/core/contexts/MenuDashboardContext';

interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = () => {
    return (
        <AuthWrapper>
            <MenuDashboardProvider>
                <DashboardLayout>
                    <Outlet />
                </DashboardLayout>
            </MenuDashboardProvider>
        </AuthWrapper>
    );
};

export const Route = createFileRoute('/_admin-layout')({
    component: Layout,
});
