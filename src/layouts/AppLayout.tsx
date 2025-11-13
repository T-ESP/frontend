import { useState } from 'react';
import { Sidebar } from '@/ui/components/layouts/Sidebar/Sidebar';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { HomeHeader } from '@/ui/components/layouts/HomeHeader/HomeHeader';

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  usePageTitle("StockS - Dashboard");

  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true
  );

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1">
        <HomeHeader onMenuClick={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        {/* C'est ICI que tu dois rendre children */}
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
