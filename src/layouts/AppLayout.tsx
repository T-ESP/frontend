import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

type AppLayoutProps = {
  children?: ReactNode;
};

export function AppLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul>
          <li><a href="/" className="hover:underline">Accueil</a></li>
          <li><a href="/users" className="hover:underline">Utilisateurs</a></li>
        </ul>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-6">
        <header className="mb-4 border-b pb-2">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
        </header>
        <Outlet />
      </div>
    </div>
  );
}