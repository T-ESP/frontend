import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { Sidebar } from '@/ui/components/layouts/Sidebar';
import { HomeHeader } from '@/ui/components/layouts/HomeHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { usePageTitle } from '@/ui/hooks/usePageTitle';

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  usePageTitle('StockS - Dashboard');

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset className="bg-[#f5f4f9]">
          <div
            id="main-scroll-container"
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <HomeHeader />
            {children ?? <Outlet />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
