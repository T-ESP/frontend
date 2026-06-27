import { useMemo } from 'react';
import type { Order } from '@/domain/models/Order';
import { KpiStatCard } from '@/ui/components/common/KpiStatCard/KpiStatCard';
import {
  type DateRange,
  adaptiveGrain,
  bucketize,
  buildBuckets,
  discountOf,
  evolution,
  filterOrders,
  formatCurrency,
  formatPct,
  normalizeStatus,
  previousRange,
  sumAmount,
} from './statsHelpers';

interface OrderKpiBandProps {
  allOrders: Order[];
  range: DateRange;
}

const countDelivered = (orders: Order[]) =>
  orders.filter((o) => normalizeStatus(o.status) === 'delivered').length;
const countCancelled = (orders: Order[]) =>
  orders.filter((o) => normalizeStatus(o.status) === 'cancelled').length;
const uniqueClients = (orders: Order[]) => new Set(orders.map((o) => o.user_id)).size;
const sumDiscount = (orders: Order[]) => orders.reduce((s, o) => s + discountOf(o), 0);

/** Bande de 8 indicateurs clés, recalculés sur la période sélectionnée. */
export function OrderKpiBand({ allOrders, range }: OrderKpiBandProps) {
  const m = useMemo(() => {
    const curr = filterOrders(allOrders, range);
    const prev = filterOrders(allOrders, previousRange(range));

    const grain = adaptiveGrain(range);
    const buckets = buildBuckets(range, grain);
    const slices = bucketize(curr, buckets);

    const series = (reducer: (s: Order[]) => number) => slices.map((s) => ({ value: reducer(s) }));

    const revenue = sumAmount(curr);
    const revenuePrev = sumAmount(prev);
    const total = curr.length;
    const totalPrev = prev.length;
    const avg = total > 0 ? revenue / total : 0;
    const avgPrev = totalPrev > 0 ? revenuePrev / totalPrev : 0;
    const delivered = countDelivered(curr);
    const deliveredPrev = countDelivered(prev);
    const cancelled = countCancelled(curr);
    const cancelledPrev = countCancelled(prev);
    const discount = sumDiscount(curr);
    const discountPrev = sumDiscount(prev);
    const clients = uniqueClients(curr);
    const clientsPrev = uniqueClients(prev);

    const deliveryRate = total > 0 ? (delivered / total) * 100 : 0;
    const deliveryRatePrev = totalPrev > 0 ? (deliveredPrev / totalPrev) * 100 : 0;
    const cancelRate = total > 0 ? (cancelled / total) * 100 : 0;
    const cancelRatePrev = totalPrev > 0 ? (cancelledPrev / totalPrev) * 100 : 0;
    const discountRate = revenue + discount > 0 ? (discount / (revenue + discount)) * 100 : 0;
    const discountRatePrev =
      revenuePrev + discountPrev > 0 ? (discountPrev / (revenuePrev + discountPrev)) * 100 : 0;

    return {
      revenue,
      total,
      avg,
      delivered,
      deliveryRate,
      cancelled,
      cancelRate,
      discount,
      discountRate,
      clients,
      changes: {
        revenue: evolution(revenue, revenuePrev),
        total: evolution(total, totalPrev),
        avg: evolution(avg, avgPrev),
        delivery: deliveryRate - deliveryRatePrev,
        cancel: cancelRate - cancelRatePrev,
        discount: evolution(discount, discountPrev),
        discountRate: discountRate - discountRatePrev,
        clients: evolution(clients, clientsPrev),
      },
      series: {
        revenue: series(sumAmount),
        count: series((s) => s.length),
        avg: series((s) => (s.length > 0 ? sumAmount(s) / s.length : 0)),
        delivered: series(countDelivered),
        cancelled: series(countCancelled),
        discount: series(sumDiscount),
        clients: series(uniqueClients),
      },
    };
  }, [allOrders, range]);

  const desc = 'vs période précédente';

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        title="Chiffre d'affaires"
        value={formatCurrency(m.revenue)}
        change={formatPct(m.changes.revenue)}
        trend={m.changes.revenue >= 0 ? 'up' : 'down'}
        description={desc}
        chartData={m.series.revenue}
        chartType="line"
        infoTooltip="Somme des montants nets des commandes sur la période."
      />
      <KpiStatCard
        title="Total commandes"
        value={m.total.toString()}
        change={formatPct(m.changes.total)}
        trend={m.changes.total >= 0 ? 'up' : 'down'}
        description={desc}
        chartData={m.series.count}
        chartType="bar"
      />
      <KpiStatCard
        title="Panier moyen"
        value={formatCurrency(m.avg)}
        change={formatPct(m.changes.avg)}
        trend={m.changes.avg >= 0 ? 'up' : 'down'}
        description={desc}
        chartData={m.series.avg}
        chartType="line"
        infoTooltip="Chiffre d'affaires divisé par le nombre de commandes."
      />
      <KpiStatCard
        title="Clients uniques"
        value={m.clients.toString()}
        change={formatPct(m.changes.clients)}
        trend={m.changes.clients >= 0 ? 'up' : 'down'}
        description={desc}
        chartData={m.series.clients}
        chartType="bar"
        infoTooltip="Nombre de clients distincts ayant commandé sur la période."
      />
      <KpiStatCard
        title="Taux de livraison"
        value={`${m.deliveryRate.toFixed(1)}%`}
        change={`${formatPct(m.changes.delivery)} pts`}
        trend={m.changes.delivery >= 0 ? 'up' : 'down'}
        description={desc}
        chartData={m.series.delivered}
        chartType="bar"
        infoTooltip="Part des commandes au statut « livrée »."
      />
      <KpiStatCard
        title="Taux d'annulation"
        value={`${m.cancelRate.toFixed(1)}%`}
        change={`${formatPct(m.changes.cancel)} pts`}
        // Une hausse des annulations est négative.
        trend={m.changes.cancel > 0 ? 'down' : 'up'}
        description={desc}
        chartData={m.series.cancelled}
        chartType="bar"
        infoTooltip="Part des commandes au statut « annulée »."
      />
      <KpiStatCard
        title="Remises accordées"
        value={formatCurrency(m.discount)}
        change={formatPct(m.changes.discount)}
        // Plus de remises = coût, donc tendance inversée.
        trend={m.changes.discount > 0 ? 'down' : 'up'}
        description={desc}
        chartData={m.series.discount}
        chartType="line"
        infoTooltip="Montant total des remises appliquées sur la période."
      />
      <KpiStatCard
        title="Taux de remise moyen"
        value={`${m.discountRate.toFixed(1)}%`}
        change={`${formatPct(m.changes.discountRate)} pts`}
        trend={m.changes.discountRate > 0 ? 'down' : 'up'}
        description={desc}
        chartData={m.series.discount}
        chartType="line"
        infoTooltip="Remises rapportées au chiffre d'affaires brut (net + remises)."
      />
    </div>
  );
}
