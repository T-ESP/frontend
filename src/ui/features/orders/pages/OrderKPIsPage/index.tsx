import { useState, useEffect, useMemo } from 'react';
import { orderService } from '@/infrastructure/api/services/orderService';
import { userService } from '@/infrastructure/api/services/userService';
import type { Order } from '@/domain/models/Order';
import type { User } from '@/domain/models/User';
import PageLayout from '@/ui/components/layouts/PageLayout';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import {
  type DateRange,
  type PeriodPresetId,
  filterOrders,
  presetRange,
} from '@/ui/features/orders/components/stats/statsHelpers';
import { PeriodFilterBar } from '@/ui/features/orders/components/stats/PeriodFilterBar';
import { OrderKpiBand } from '@/ui/features/orders/components/stats/OrderKpiBand';
import { RevenueOrdersChart } from '@/ui/features/orders/components/stats/RevenueOrdersChart';
import { StatusBreakdown } from '@/ui/features/orders/components/stats/StatusBreakdown';
import { OrderValueDistribution } from '@/ui/features/orders/components/stats/OrderValueDistribution';
import { ClientTypeBasket } from '@/ui/features/orders/components/stats/ClientTypeBasket';
import { OrdersHeatmap } from '@/ui/features/orders/components/stats/OrdersHeatmap';
import { TopProductsOrdered } from '@/ui/features/orders/components/stats/TopProductsOrdered';
import { TopClients } from '@/ui/features/orders/components/stats/TopClients';

export default function OrderKPIsPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [preset, setPreset] = useState<PeriodPresetId>('30d');
  const [range, setRange] = useState<DateRange>(() => presetRange('30d'));

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [orderData, userData] = await Promise.all([
        orderService.getAll(),
        userService.getAll().catch(() => [] as User[]),
      ]);
      setOrders(orderData);
      setUsers(userData);
    } catch {
      setError(t('orders.load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => filterOrders(orders, range), [orders, range]);

  const headerActions = (
    <button
      onClick={loadData}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border rounded-lg text-muted-foreground bg-card border-border hover:bg-muted"
    >
      <RefreshCw className="w-4 h-4" />
      {t('common.refresh')}
    </button>
  );

  if (loading && orders.length === 0) {
    return (
      <PageLayout
        title={t('orders.kpis_title', 'Statistiques commandes')}
        subtitle={t('orders.kpis_subtitle', "Vue d'ensemble des performances")}
      >
        <div className="flex items-center justify-center py-24">
          <div className="text-center text-muted-foreground">
            <Loader2 className="w-6 h-6 mx-auto mb-3 text-primary animate-spin" />
            <div className="text-sm font-medium">{t('orders.loading')}</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t('orders.kpis_title', 'Statistiques commandes')}>
        <div className="flex items-center justify-center py-16">
          <div className="max-w-md p-6 text-center border rounded-lg bg-card border-rose-500/30">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-rose-500" />
            <h2 className="mb-1 text-base font-semibold">{t('orders.error_title')}</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 mx-auto mt-4 text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90"
            >
              <RefreshCw size={14} />
              {t('orders.retry')}
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={t('orders.kpis_title', 'Statistiques commandes')}
      subtitle={t('orders.kpis_subtitle', "Vue d'ensemble des performances")}
      actions={headerActions}
    >
      <PeriodFilterBar
        preset={preset}
        range={range}
        onChange={(p, r) => {
          setPreset(p);
          setRange(r);
        }}
      />

      {/* Bande d'indicateurs clés */}
      <OrderKpiBand allOrders={orders} range={range} />

      {/* Évolution + cycle de vie */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RevenueOrdersChart orders={filtered} range={range} />
        <StatusBreakdown orders={filtered} />
      </div>

      {/* Distribution paniers + nouveaux vs fidèles */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OrderValueDistribution orders={filtered} />
        <ClientTypeBasket range={range} />
      </div>

      {/* Heatmap temporelle */}
      <OrdersHeatmap orders={filtered} />

      {/* Classements produits & clients */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TopProductsOrdered range={range} />
        <TopClients orders={filtered} users={users} />
      </div>
    </PageLayout>
  );
}
