import { useState } from 'react';
import { Sidebar } from '@/ui/components/layouts/Sidebar';
import { usePageTitle } from '@/ui/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { HomeHeader } from '@/ui/components/layouts/HomeHeader';

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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div
        className="flex-1 flex flex-col overflow-hidden transition-[margin-left] duration-300"
        style={{ marginLeft: isSidebarOpen ? '256px' : '80px' }}
      >
        <HomeHeader />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {/* C'est ICI que tu dois rendre children */}
          {children ?? <Outlet />}
        </div>
      </div>
    </div>
  );
}
