import type { ReactNode } from 'react';
import { SNAPSHOT_COLORS } from './colors';

/**
 * Mini-visualisations « instantané » pour les bandes de KPI.
 * Contrairement à une sparkline, elles n'inventent pas de tendance temporelle :
 * elles représentent honnêtement la composition ou la proportion d'un état courant.
 */

/** Carte KPI : grand chiffre + une mini-visualisation d'instantané. */
export function StatCard({
  title,
  value,
  description,
  children,
}: {
  title: string;
  value: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between p-6 bg-card border border-border rounded-lg min-h-[200px]">
      <div>
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
        <p className="mt-4 text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</p>
        {description && <p className="mt-1 text-[13px] text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

export interface Segment {
  label: string;
  count: number;
  color: string;
}

/** Barre segmentée : composition d'un total en plusieurs catégories. */
export function CompositionBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, seg) => s + seg.count, 0) || 1;
  const visible = segments.filter((s) => s.count > 0);
  return (
    <div className="space-y-3">
      <div className="flex w-full h-2.5 overflow-hidden rounded-full bg-muted">
        {visible.map((seg) => (
          <div
            key={seg.label}
            className="h-full transition-all"
            style={{ width: `${(seg.count / total) * 100}%`, backgroundColor: seg.color }}
            title={`${seg.label}: ${seg.count}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-[12px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-muted-foreground">{seg.label}</span>
            <span className="font-semibold text-foreground tabular-nums">{seg.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mini classement horizontal (top N par valeur). */
export function CategoryBars({
  title,
  rows,
  formatValue,
  color = SNAPSHOT_COLORS.brand,
}: {
  title?: string;
  rows: { label: string; value: number }[];
  formatValue: (v: number) => string;
  color?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2">
      {title && <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">{title}</p>}
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 text-[12px]">
          <span className="w-24 truncate text-muted-foreground shrink-0">{r.label}</span>
          <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, backgroundColor: color }} />
          </div>
          <span className="font-semibold text-foreground tabular-nums shrink-0">{formatValue(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

/** Jauge de proportion : part d'un sous-ensemble dans un total. */
export function ShareBar({ fraction, color, label }: { fraction: number; color: string; label: string }) {
  const pct = Math.max(0, Math.min(100, Math.round(fraction * 100)));
  return (
    <div className="space-y-2">
      <div className="h-2.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className="text-[12px] text-muted-foreground">{label}</p>
    </div>
  );
}
