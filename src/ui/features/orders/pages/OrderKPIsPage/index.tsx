import { useState, useEffect } from 'react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order } from '@/domain/models/Order';
import PageLayout from '@/ui/components/layouts/PageLayout';
import { OrderStats } from '@/ui/features/orders/components/OrderStats';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OrderKPIsPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch {
      setError(t('orders.load_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const headerActions = (
    <button
      onClick={loadOrders}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      {t('common.refresh')}
    </button>
  );

  if (loading && orders.length === 0) {
    return (
      <PageLayout title={t('orders.kpis_title', 'Statistiques commandes')} subtitle={t('orders.kpis_subtitle', 'Vue d\'ensemble des performances')}>
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
          <div className="max-w-md p-6 text-center bg-card border border-rose-500/30 rounded-lg">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-rose-500" />
            <h2 className="mb-1 text-base font-semibold">{t('orders.error_title')}</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 px-4 py-2 mx-auto mt-4 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90"
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
      <OrderStats orders={orders} />
    </PageLayout>
  );
}
