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
    <div className="min-h-screen p-4 md:p-8 bg-transparent">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="flex items-center gap-3 text-xl md:text-3xl font-bold text-foreground">
            {title}
          </h1>
          {subtitle && <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      <div className="space-y-4 md:space-y-6">
        {children}
      </div>
    </div>
  );
}
