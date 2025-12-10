import { usePageTitle } from '@/ui/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/ui/features/auth/hooks/useAuth';

type HomeLayoutProps = {
  children?: ReactNode;
};

export function HomeLayout({ children }: HomeLayoutProps) {
  usePageTitle("StockS");
  const { isAuthenticated } = useAuth();

  // Si l'utilisateur est déjà connecté, on le redirige vers le dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col bg-primary-soft">
      {children ?? <Outlet />}
    </div>
  );
}
