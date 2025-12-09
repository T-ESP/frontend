// src/components/layouts/PageLayout.tsx
import type { ReactNode } from "react";

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
    <div className="px-8 py-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-2 text-base">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
