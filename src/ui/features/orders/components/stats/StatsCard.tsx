import type { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** Carte conteneur homogène pour les widgets de la page Statistiques. */
export function StatsCard({ title, subtitle, action, className = '', children }: StatsCardProps) {
  return (
    <div className={`flex flex-col bg-card border border-border rounded-lg ${className}`}>
      <div className="flex items-start justify-between gap-3 p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}

/** État vide standardisé pour les widgets. */
export function StatsEmpty({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10 text-center text-muted-foreground">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
