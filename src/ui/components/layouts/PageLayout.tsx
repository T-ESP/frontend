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
  icon?: ReactNode;
}) {
  return (
    <div className="min-h-screen p-8 bg-slate-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
            {/* {icon && icon} */}
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-base text-slate-500">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
