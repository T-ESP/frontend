import { useMemo } from 'react';
import type { Order } from '@/domain/models/Order';
import { useTranslation } from 'react-i18next';
import { KpiStatCard } from '@/ui/components/common/KpiStatCard/KpiStatCard';

interface OrderStatsProps {
  orders: Order[];
}

const BUCKETS = 7;

const buildDailySeries = (
  orders: Order[],
  reducer: (slice: Order[]) => number,
): { value: number }[] => {
  const now = new Date();
  const start = new Date();
  start.setDate(now.getDate() - (BUCKETS - 1));
  start.setHours(0, 0, 0, 0);

  const buckets: number[] = Array(BUCKETS).fill(0);

  orders.forEach((o) => {
    const d = new Date(o.order_date);
    const diffDays = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < BUCKETS) {
      const slice = orders.filter((x) => {
        const xd = new Date(x.order_date);
        return Math.floor((xd.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) === diffDays;
      });
      buckets[diffDays] = reducer(slice);
    }
  });

  return buckets.map((v) => ({ value: v }));
};

export function OrderStats({ orders }: OrderStatsProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const total = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const pending = orders.filter((o) => o.status.toLowerCase() === 'pending').length;
    const delivered = orders.filter((o) => o.status.toLowerCase() === 'delivered').length;
    const avgValue = total > 0 ? totalRevenue / total : 0;

    const now = Date.now();
    const since30 = now - 30 * 24 * 60 * 60 * 1000;
    const since60 = now - 60 * 24 * 60 * 60 * 1000;
    const last30 = orders.filter((o) => new Date(o.order_date).getTime() >= since30);
    const prev30 = orders.filter((o) => {
      const t = new Date(o.order_date).getTime();
      return t >= since60 && t < since30;
    });

    const evolution = (curr: number, prev: number) => {
      if (prev === 0) return curr === 0 ? 0 : 100;
      return ((curr - prev) / prev) * 100;
    };

    const revenue30 = last30.reduce((s, o) => s + (o.amount || 0), 0);
    const revenuePrev30 = prev30.reduce((s, o) => s + (o.amount || 0), 0);
    const revenueChange = evolution(revenue30, revenuePrev30);

    const orderCountChange = evolution(last30.length, prev30.length);
    const deliveredCurr = last30.filter((o) => o.status.toLowerCase() === 'delivered').length;
    const deliveredPrev = prev30.filter((o) => o.status.toLowerCase() === 'delivered').length;
    const deliveredChange = evolution(deliveredCurr, deliveredPrev);

    const avgValueCurr = last30.length > 0 ? revenue30 / last30.length : 0;
    const avgValuePrev = prev30.length > 0 ? revenuePrev30 / prev30.length : 0;
    const avgValueChange = evolution(avgValueCurr, avgValuePrev);

    return {
      total,
      totalRevenue,
      pending,
      delivered,
      avgValue,
      revenueChange,
      orderCountChange,
      deliveredChange,
      avgValueChange,
    };
  }, [orders]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v);

  const formatPct = (v: number) => {
    const sign = v >= 0 ? '+' : '';
    return `${sign}${v.toFixed(1)}%`;
  };

  const revenueSeries = useMemo(
    () => buildDailySeries(orders, (slice) => slice.reduce((s, o) => s + (o.amount || 0), 0)),
    [orders],
  );

  const orderCountSeries = useMemo(
    () => buildDailySeries(orders, (slice) => slice.length),
    [orders],
  );

  const deliveredSeries = useMemo(
    () =>
      buildDailySeries(
        orders,
        (slice) => slice.filter((o) => o.status.toLowerCase() === 'delivered').length,
      ),
    [orders],
  );

  const avgValueSeries = useMemo(
    () =>
      buildDailySeries(orders, (slice) => {
        if (slice.length === 0) return 0;
        return slice.reduce((s, o) => s + (o.amount || 0), 0) / slice.length;
      }),
    [orders],
  );

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        title={t('orders.kpi.total_revenue', 'Chiffre d\'affaires')}
        value={formatCurrency(stats.totalRevenue)}
        change={formatPct(stats.revenueChange)}
        trend={stats.revenueChange >= 0 ? 'up' : 'down'}
        description={t('common.date_range.last_30_days', '30 derniers jours')}
        chartData={revenueSeries}
        chartType="line"
      />
      <KpiStatCard
        title={t('orders.kpi.total_orders', 'Total commandes')}
        value={stats.total.toString()}
        change={formatPct(stats.orderCountChange)}
        trend={stats.orderCountChange >= 0 ? 'up' : 'down'}
        description={t('common.date_range.last_30_days', '30 derniers jours')}
        chartData={orderCountSeries}
        chartType="bar"
      />
      <KpiStatCard
        title={t('orders.kpi.delivered', 'Livrées')}
        value={stats.delivered.toString()}
        change={formatPct(stats.deliveredChange)}
        trend={stats.deliveredChange >= 0 ? 'up' : 'down'}
        description={t('common.date_range.last_30_days', '30 derniers jours')}
        chartData={deliveredSeries}
        chartType="bar"
      />
      <KpiStatCard
        title={t('orders.kpi.avg_order_value', 'Panier moyen')}
        value={formatCurrency(stats.avgValue)}
        change={formatPct(stats.avgValueChange)}
        trend={stats.avgValueChange >= 0 ? 'up' : 'down'}
        description={t('common.date_range.last_30_days', '30 derniers jours')}
        chartData={avgValueSeries}
        chartType="line"
      />
    </div>
  );
}
