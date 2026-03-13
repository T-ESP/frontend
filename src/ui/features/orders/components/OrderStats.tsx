import { KpiCard } from "@/ui/components/common/KpiCard";
import type { Order } from "@/domain/models/Order";
import { useTranslation } from "react-i18next";

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const { t } = useTranslation();

  // Calculate stats from orders
  const pendingCount = orders.filter(o => o.status.toLowerCase() === 'pending').length;
  const confirmedCount = orders.filter(o => o.status.toLowerCase() === 'confirmed').length;
  const shippedCount = orders.filter(o => o.status.toLowerCase() === 'shipped').length;
  const deliveredCount = orders.filter(o => o.status.toLowerCase() === 'delivered').length;
  const cancelledCount = orders.filter(o => o.status.toLowerCase() === 'cancelled').length;

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
      <KpiCard
        label={t('orders.status.pending')}
        value={pendingCount}
        color="primary"
      />
      <KpiCard
        label={t('orders.status.confirmed')}
        value={confirmedCount}
        color="primary"
      />
      <KpiCard
        label={t('orders.status.shipped')}
        value={shippedCount}
        color="primary"
      />
      <KpiCard
        label={t('orders.status.delivered')}
        value={deliveredCount}
        color="primary"
      />
      <KpiCard
        label={t('orders.status.cancelled')}
        value={cancelledCount}
        color="primary"
      />
    </div>
  );
}
