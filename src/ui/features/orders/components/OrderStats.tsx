import { Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import { OrderStatCard } from "./OrderStatCard";
import type { Order } from "@/domain/models/Order";

interface OrderStatsProps {
  orders: Order[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  // Calculate stats from orders
  const pendingCount = orders.filter(o => o.status.toLowerCase() === 'pending').length;
  const confirmedCount = orders.filter(o => o.status.toLowerCase() === 'confirmed').length;
  const shippedCount = orders.filter(o => o.status.toLowerCase() === 'shipped').length;
  const deliveredCount = orders.filter(o => o.status.toLowerCase() === 'delivered').length;
  const cancelledCount = orders.filter(o => o.status.toLowerCase() === 'cancelled').length;

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-5">
      <OrderStatCard
        label="Pending"
        value={pendingCount}
        icon={Clock}
        color="amber"
      />
      <OrderStatCard
        label="Confirmed"
        value={confirmedCount}
        icon={CheckCircle}
        color="blue"
      />
      <OrderStatCard
        label="Shipped"
        value={shippedCount}
        icon={Truck}
        color="purple"
      />
      <OrderStatCard
        label="Delivered"
        value={deliveredCount}
        icon={Package}
        color="emerald"
      />
      <OrderStatCard
        label="Cancelled"
        value={cancelledCount}
        icon={XCircle}
        color="rose"
      />
    </div>
  );
}
