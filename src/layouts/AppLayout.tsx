import { HomeHeader } from '@/components/layout/HomeHeader';
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
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul>
          <li><a href="/" className="hover:underline">Accueil</a></li>
          <li><a href="/users" className="hover:underline">Utilisateurs</a></li>
        </ul>
      </aside>
      <div className="flex-1 p-6">
        <HomeHeader />
        {/* C'est ICI que tu dois rendre children */}
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
