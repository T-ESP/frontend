import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers } from "react-icons/fi";
import { KPICard } from "./KPICard";
import type { KPI } from "@/ui/features/dashboard/types";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";
import { useTranslation } from "react-i18next";

interface KPICardsProps {
  orders: Order[];
  products: Product[];
  users: User[];
  totalRevenue: number;
  evolution: number;
  dateRange?: number;
}

export function KPICards({ orders, products, users, totalRevenue, evolution, dateRange = 30 }: KPICardsProps) {
  console.log("🚀 ~ KPICards ~ totalRevenue:", totalRevenue)
  const { t } = useTranslation();
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${(value || 0).toFixed(1)}%`;
  };

  // Calculate low stock products (stock < 10)
  const lowStockProducts = products.filter(p => p.stock_quantity < 10).length;

  const getDateRangeLabel = () => {
    if (dateRange === 7) return t('common.date_range.last_7_days');
    if (dateRange === 90) return t('common.date_range.last_90_days');
    if (dateRange === 365) return t('common.date_range.last_year');
    return t('common.date_range.last_30_days');
  };

  const kpiData: KPI[] = [
    {
      title: t('dashboard.kpi.total_revenue'),
      value: formatCurrency(totalRevenue),
      change: formatPercentage(evolution),
      trend: evolution >= 0 ? "up" : "down",
      icon: FiDollarSign,
      color: "emerald",
      description: getDateRangeLabel()
    },
    {
      title: t('dashboard.kpi.total_orders'),
      value: orders.length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: t('common.all_time')
    },
    {
      title: t('dashboard.kpi.low_stock_alert'),
      value: lowStockProducts.toString(),
      change: lowStockProducts > 5 ? t('dashboard.kpi.high') : t('dashboard.kpi.normal'),
      trend: lowStockProducts > 5 ? "down" : "up",
      icon: FiPackage,
      color: lowStockProducts > 5 ? "amber" : "purple",
      description: t('dashboard.kpi.products_low_units')
    },
    {
      title: t('dashboard.kpi.total_users'),
      value: users.length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiUsers,
      color: "purple",
      description: t('common.all_time')
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <KPICard key={index} kpi={kpi} />
      ))}
    </div>
  );
}
