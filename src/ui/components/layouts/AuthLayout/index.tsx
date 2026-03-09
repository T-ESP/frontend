import { usePageTitle } from '@/ui/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/ui/features/auth/hooks/useAuth';

type AuthLayoutProps = {
  children?: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  usePageTitle("StockS - Connexion");
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f4f3f8]">
      {children ?? <Outlet />}
    </div>
  );
}
