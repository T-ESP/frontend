import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Order } from '@/domain/models/Order';
import { StatsCard, StatsEmpty } from './StatsCard';
import {
  type ChartTooltipProps,
  type DateRange,
  adaptiveGrain,
  bucketize,
  buildBuckets,
  formatCompactEUR,
  formatCurrency,
  sumAmount,
} from './statsHelpers';

interface RevenueOrdersChartProps {
  orders: Order[];
  range: DateRange;
}

const BRAND = 'var(--color-primary)';
const BRAND_LIGHT = 'hsl(var(--brand-h) calc(var(--brand-s) + 8%) calc(var(--brand-l) + 18%))';

function ChartTip({ active, payload, label, t }: ChartTooltipProps & { t: TFunction }) {
  if (!active || !payload?.length) return null;
  const revenue = payload.find((p) => p.dataKey === 'revenue')?.value ?? 0;
  const orders = payload.find((p) => p.dataKey === 'orders')?.value ?? 0;
  return (
    <div className="px-3 py-2 bg-card border border-border rounded-lg shadow-lg">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground tabular-nums">{formatCurrency(revenue)}</p>
      <p className="text-xs text-muted-foreground tabular-nums">
        {t('orders.stats.evolution.orders_count', { count: orders })}
      </p>
    </div>
  );
}

/** Évolution temporelle du chiffre d'affaires (ligne) et du volume de commandes (barres). */
export function RevenueOrdersChart({ orders, range }: RevenueOrdersChartProps) {
  const { t } = useTranslation();
  const { data, grain } = useMemo(() => {
    const g = adaptiveGrain(range);
    const buckets = buildBuckets(range, g);
    const slices = bucketize(orders, buckets);
    return {
      grain: g,
      data: buckets.map((b, i) => ({
        label: b.label,
        revenue: sumAmount(slices[i]),
        orders: slices[i].length,
      })),
    };
  }, [orders, range]);

  return (
    <StatsCard
      title={t('orders.stats.evolution.title')}
      subtitle={t('orders.stats.evolution.subtitle', { grain: t(`orders.stats.grain.${grain}`) })}
      className="lg:col-span-2"
    >
      {orders.length === 0 ? (
        <StatsEmpty message={t('orders.stats.evolution.empty')} />
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={data} margin={{ top: 10, right: 12, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="ord-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BRAND_LIGHT} stopOpacity={0.7} />
                <stop offset="100%" stopColor={BRAND_LIGHT} stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={20}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              yAxisId="left"
              width={64}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickFormatter={(v) => formatCompactEUR(Number(v))}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              width={36}
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
            />
            <Tooltip content={<ChartTip t={t} />} cursor={{ fill: 'color-mix(in srgb, var(--primary) 8%, transparent)' }} />
            <Legend
              wrapperStyle={{ fontSize: 12 }}
              formatter={(v) => (v === 'revenue' ? t('orders.stats.evolution.revenue') : t('orders.stats.evolution.orders'))}
            />
            <Bar
              yAxisId="right"
              dataKey="orders"
              fill="url(#ord-bar)"
              radius={[3, 3, 0, 0]}
              maxBarSize={48}
              animationDuration={600}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              stroke={BRAND}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
              animationDuration={600}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </StatsCard>
  );
}
