import { useState, useEffect } from "react";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { KPICards } from "./KPICards";
import { ChartContainer } from "./ChartContainer";
import { TopProducts } from "./TopProducts";
import { PageActions } from "./PageActions/PageActions";
import { orderService } from "@/infrastructure/api/services/orderService";
import { productService } from "@/infrastructure/api/services/productService";
import { userService } from "@/infrastructure/api/services/userService";
import { salesService } from "@/infrastructure/api/services/salesService";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [evolution, setEvolution] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get date ranges based on selected range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      const formatDate = (date: Date) => date.toISOString().split('T')[0];

      const period = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };

      // Fetch all data in parallel
      const [ordersData, productsData, usersData, revenueData, evolutionData] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        userService.getAll(),
        salesService.getTotalRevenue(period),
        salesService.getEvolution(period),
      ]);

      setOrders(ordersData);
      setProducts(productsData);
      setUsers(usersData);
      console.log("🚀 ~ loadDashboardData ~ revenueData:", revenueData)
      setTotalRevenue(revenueData.total_revenue);
      setEvolution(evolutionData.evolution_percentage);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // const csvData = [
    //   [t('dashboard.export.title'), new Date().toISOString()],
    //   [],
    //   [t('dashboard.export.metric'), t('dashboard.export.value')],
    //   [t('dashboard.kpi.total_revenue'), `€${totalRevenue.toFixed(2)}`],
    //   [t('dashboard.kpi.revenue_evolution'), `${evolution.toFixed(1)}%`],
    //   [t('dashboard.kpi.total_orders'), orders.length.toString()],
    //   [t('dashboard.kpi.total_products'), products.length.toString()],
    //   [t('dashboard.kpi.total_users'), users.length.toString()],
    //   [t('dashboard.kpi.low_stock'), products.filter(p => p.stock_quantity < 10).length.toString()],
    // ];

    //   const csv = csvData.map(row => row.join(',')).join('\n');
    //   const blob = new Blob([csv], { type: 'text/csv' });
    //   const url = window.URL.createObjectURL(blob);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.download = `dashboard-${new Date().toISOString().split('T')[0]}.csv`;
    //   link.click();
  }

  return (
    <PageLayout
      title={t('dashboard.title')}
      subtitle={t('dashboard.subtitle')}
      actions={
        <PageActions
          onDateRangeChange={setDateRange}
          currentRange={dateRange}
          onExport={handleExport}
        />
      }
    >
      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white border border-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="bg-white border border-gray-100 h-96 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <KPICards
            orders={orders}
            products={products}
            users={users}
            totalRevenue={totalRevenue}
            evolution={evolution}
            dateRange={dateRange}
          />

          <ChartContainer orders={orders} dateRange={dateRange} />

          <TopProducts products={products} />
        </>
      )}
    </PageLayout>
  );
}