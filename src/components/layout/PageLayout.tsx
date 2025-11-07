// src/components/layouts/PageLayout.tsx
import { ReactNode } from "react";

export default function PageLayout({
  title,
  subtitle,
  actions,
  children
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="px-8 py-10 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {children}
      </div>
    </div>
  );
}
