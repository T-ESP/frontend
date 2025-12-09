import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers } from "react-icons/fi";
import { KPICard } from "./KPICard";
import type { KPI } from "@/ui/features/dashboard/types";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";

interface KPICardsProps {
  orders: Order[];
  products: Product[];
  users: User[];
  totalRevenue: number;
  evolution: number;
}

export function KPICards({ orders, products, users, totalRevenue, evolution }: KPICardsProps) {
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

  const kpiData: KPI[] = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: formatPercentage(evolution),
      trend: evolution >= 0 ? "up" : "down",
      icon: FiDollarSign,
      color: "emerald",
      description: "Last 30 days"
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: "All time"
    },
    {
      title: "Low Stock Alert",
      value: lowStockProducts.toString(),
      change: lowStockProducts > 5 ? "High" : "Normal",
      trend: lowStockProducts > 5 ? "down" : "up",
      icon: FiPackage,
      color: lowStockProducts > 5 ? "amber" : "purple",
      description: "Products < 10 units"
    },
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiUsers,
      color: "purple",
      description: "All time"
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
