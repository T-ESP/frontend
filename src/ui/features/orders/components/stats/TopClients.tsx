import { useMemo } from 'react';
import type { Order } from '@/domain/models/Order';
import type { User } from '@/domain/models/User';
import { StatsCard, StatsEmpty } from './StatsCard';
import { amountOf, formatCurrency } from './statsHelpers';

interface TopClientsProps {
  orders: Order[];
  users: User[];
}

/** Classement des meilleurs clients par chiffre d'affaires sur la période. */
export function TopClients({ orders, users }: TopClientsProps) {
  const rows = useMemo(() => {
    const byUser = new Map<number, { revenue: number; count: number }>();
    orders.forEach((o) => {
      const cur = byUser.get(o.user_id) ?? { revenue: 0, count: 0 };
      cur.revenue += amountOf(o);
      cur.count += 1;
      byUser.set(o.user_id, cur);
    });
    const userMap = new Map(users.map((u) => [u.id, u]));
    return [...byUser.entries()]
      .map(([userId, agg]) => {
        const u = userMap.get(userId);
        const name = u ? `${u.firstname ?? ''} ${u.lastname ?? ''}`.trim() || u.email : `Client #${userId}`;
        return { userId, name, ...agg };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
  }, [orders, users]);

  const maxRevenue = Math.max(1, ...rows.map((r) => r.revenue));

  const initials = (name: string) =>
    name
      .split(' ')
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

  return (
    <StatsCard title="Meilleurs clients" subtitle="Par chiffre d'affaires sur la période">
      {rows.length === 0 ? (
        <StatsEmpty message="Aucune commande sur la période" />
      ) : (
        <div className="space-y-3">
          {rows.map((r, i) => (
            <div key={r.userId} className="flex items-center gap-3">
              <span className="w-5 text-xs font-semibold text-center text-muted-foreground tabular-nums">
                {i + 1}
              </span>
              <span className="flex items-center justify-center w-8 h-8 text-xs font-semibold rounded-full shrink-0 bg-accent text-primary">
                {initials(r.name)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate text-foreground">{r.name}</span>
                  <span className="ml-2 text-sm font-semibold tabular-nums text-foreground shrink-0">
                    {formatCurrency(r.revenue)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(r.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{r.count} cmd</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </StatsCard>
  );
}
