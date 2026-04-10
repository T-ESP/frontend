import { useState, useEffect } from 'react';
import { Sidebar } from '@/ui/components/layouts/Sidebar';
import { usePageTitle } from '@/ui/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { HomeHeader } from '@/ui/components/layouts/HomeHeader';
import { FloatingChat } from '@/ui/components/FloatingChat/FloatingChat';

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  usePageTitle("StockS - Dashboard");

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !isSidebarOpen) setIsSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const marginLeft = isMobile ? 0 : isSidebarOpen ? 256 : 80;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f4f9]">
      {/* Backdrop mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />

      <div
        className="flex-1 flex flex-col overflow-hidden transition-[margin-left] duration-300"
        style={{ marginLeft }}
      >
        <HomeHeader onMenuToggle={toggleSidebar} />
        <div className="flex-1 overflow-y-auto bg-[#f5f4f9]">
          {children ?? <Outlet />}
        </div>
      </div>

      <FloatingChat />
    </div>
  );
}
