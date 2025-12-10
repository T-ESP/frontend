// src/components/layouts/PageLayout.tsx
import type { ReactNode } from "react";

export default function PageLayout({
  title,
  subtitle,
  actions,
  children,
  icon
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            {icon && icon}
            {title}
          </h1>
          {subtitle && <p className="text-slate-500 mt-2 text-base">{subtitle}</p>}
        </div>
        {actions && <div>{actions}</div>}
      </div>

      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}
