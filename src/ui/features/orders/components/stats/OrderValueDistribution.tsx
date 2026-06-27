import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Order } from '@/domain/models/Order';
import { StatsCard, StatsEmpty } from './StatsCard';
import { type ChartTooltipProps, amountOf, formatCurrency } from './statsHelpers';

interface OrderValueDistributionProps {
  orders: Order[];
}

const BUCKETS: { label: string; min: number; max: number }[] = [
  { label: '0–25 €', min: 0, max: 25 },
  { label: '25–50 €', min: 25, max: 50 },
  { label: '50–100 €', min: 50, max: 100 },
  { label: '100–200 €', min: 100, max: 200 },
  { label: '200–500 €', min: 200, max: 500 },
  { label: '500 €+', min: 500, max: Infinity },
];

const BRAND = 'var(--color-primary)';

function Tip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2 bg-card border border-border rounded-lg shadow-lg">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground tabular-nums">{payload[0].value} commande(s)</p>
    </div>
  );
}

/** Histogramme : combien de commandes par tranche de montant. */
export function OrderValueDistribution({ orders }: OrderValueDistributionProps) {
  const data = useMemo(() => {
    const counts = BUCKETS.map(() => 0);
    orders.forEach((o) => {
      const v = amountOf(o);
      const idx = BUCKETS.findIndex((b) => v >= b.min && v < b.max);
      if (idx >= 0) counts[idx] += 1;
    });
    return BUCKETS.map((b, i) => ({ label: b.label, count: counts[i] }));
  }, [orders]);

  const median = useMemo(() => {
    if (orders.length === 0) return 0;
    const vals = orders.map(amountOf).sort((a, b) => a - b);
    const mid = Math.floor(vals.length / 2);
    return vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
  }, [orders]);

  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <StatsCard
      title="Distribution des paniers"
      subtitle={orders.length > 0 ? `Médiane : ${formatCurrency(median)}` : 'Répartition par tranche de montant'}
    >
      {orders.length === 0 ? (
        <StatsEmpty message="Aucune commande sur la période" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              allowDecimals={false}
              width={32}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <Tooltip content={<Tip />} cursor={{ fill: 'color-mix(in srgb, var(--primary) 8%, transparent)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={56} animationDuration={600}>
              {data.map((d, i) => (
                <Cell key={i} fill={BRAND} fillOpacity={d.count === maxCount ? 1 : 0.45} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </StatsCard>
  );
}
