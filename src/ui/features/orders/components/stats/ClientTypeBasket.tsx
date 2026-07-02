import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Loader2 } from 'lucide-react';
import { salesService } from '@/infrastructure/api/services/salesService';
import { StatsCard, StatsEmpty } from './StatsCard';
import { type DateRange, formatCompactEUR, formatCurrency, toApiDate } from './statsHelpers';

interface ClientTypeBasketProps {
  range: DateRange;
}

const COLORS = ['hsl(var(--brand-h) calc(var(--brand-s) + 8%) calc(var(--brand-l) + 18%))', 'var(--color-primary)'];

/** Panier moyen comparé entre nouveaux clients et clients fidèles (endpoint /sales). */
export function ClientTypeBasket({ range }: ClientTypeBasketProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<{ key: 'new' | 'loyal'; value: number }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    salesService
      .getAverageBasketByClientType({ start_date: toApiDate(range.start), end_date: toApiDate(range.end) })
      .then((res) => {
        if (cancelled) return;
        setData([
          { key: 'new', value: res.new_clients ?? 0 },
          { key: 'loyal', value: res.loyal_clients ?? 0 },
        ]);
      })
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [range]);

  const hasData = data && data.some((d) => d.value > 0);

  return (
    <StatsCard title={t('orders.stats.client_type.title')} subtitle={t('orders.stats.client_type.subtitle')}>
      {loading ? (
        <div className="flex items-center justify-center h-[260px] text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : failed || !hasData ? (
        <StatsEmpty message={failed ? t('orders.stats.client_type.unavailable') : t('orders.stats.client_type.empty')} />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data!} margin={{ top: 24, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="key"
              tickFormatter={(v) => t(`orders.stats.client_type.${v}`)}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 13, fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              width={64}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              tickFormatter={(v) => formatCompactEUR(Number(v))}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={90} animationDuration={600}>
              {data!.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => formatCurrency(Number(v) || 0)}
                fill="var(--foreground)"
                fontSize={12}
                fontWeight={600}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </StatsCard>
  );
}
