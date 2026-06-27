import { useMemo } from 'react';
import type { Order } from '@/domain/models/Order';
import { StatsCard, StatsEmpty } from './StatsCard';
import {
  ORDER_STATUSES,
  STATUS_COLORS,
  STATUS_LABELS,
  formatCurrency,
  normalizeStatus,
  sumAmount,
} from './statsHelpers';

interface StatusBreakdownProps {
  orders: Order[];
}

/** Cycle de vie des commandes : volume et CA par statut, du début à la livraison. */
export function StatusBreakdown({ orders }: StatusBreakdownProps) {
  const rows = useMemo(() => {
    const total = orders.length || 1;
    return ORDER_STATUSES.map((status) => {
      const slice = orders.filter((o) => normalizeStatus(o.status) === status);
      return {
        status,
        count: slice.length,
        revenue: sumAmount(slice),
        pct: (slice.length / total) * 100,
      };
    });
  }, [orders]);

  const maxCount = Math.max(1, ...rows.map((r) => r.count));

  return (
    <StatsCard title="Répartition par statut" subtitle="Cycle de vie des commandes">
      {orders.length === 0 ? (
        <StatsEmpty message="Aucune commande sur la période" />
      ) : (
        <div className="space-y-4">
          {rows.map((r) => (
            <div key={r.status}>
              <div className="flex items-center justify-between mb-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[r.status] }}
                  />
                  <span className="font-medium text-foreground">{STATUS_LABELS[r.status]}</span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-muted-foreground">{formatCurrency(r.revenue)}</span>
                  <span className="font-semibold text-foreground w-10 text-right">{r.count}</span>
                  <span className="text-muted-foreground w-12 text-right">{r.pct.toFixed(1)}%</span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${(r.count / maxCount) * 100}%`,
                    backgroundColor: STATUS_COLORS[r.status],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </StatsCard>
  );
}
