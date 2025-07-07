import { HomeHeader } from '@/components/layout/HomeHeader';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

type HomeLayoutProps = {
  children?: ReactNode;
};

export function HomeLayout({ children }: HomeLayoutProps) {
  usePageTitle("StockS");

  return (
    <div className="flex flex-col bg-primary-soft">
      <HomeHeader />
      {children ?? <Outlet />}
    </div>
  );
}
