import { HomeHeader } from '@/components/layout/HomeHeader';
import { Sidebar } from '@/components/layout/Sidebar';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  usePageTitle("StockS - Dashboard");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <HomeHeader />
        {/* C'est ICI que tu dois rendre children */}
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
