import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

type AuthLayoutProps = {
  children?: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-semibold text-center mb-4">Bienvenue</h1>
        <Outlet />
      </div>
    </div>
  );
}