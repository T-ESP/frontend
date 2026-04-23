import { useState, useEffect } from "react";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { KPICards } from "./KPICards";
import { ChartContainer } from "./ChartContainer";
import { TopProducts } from "./TopProducts";
import { FlopProducts } from "./TopProducts/FlopProducts";
import { RecentOrders } from "./RecentOrders/RecentOrders";
import { PageActions } from "./PageActions/PageActions";
import { orderService } from "@/infrastructure/api/services/orderService";
import { productService } from "@/infrastructure/api/services/productService";
import { userService } from "@/infrastructure/api/services/userService";
import { salesService } from "@/infrastructure/api/services/salesService";
import { globalKpisService } from "@/infrastructure/api/services/globalKpisService";
import type { TopFlopProduct } from "@/infrastructure/api/services/globalKpisService";
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
  const [flopBySales, setFlopBySales] = useState<TopFlopProduct[]>([]);
  const [flopByProfit, setFlopByProfit] = useState<TopFlopProduct[]>([]);
  const [flopLoading, setFlopLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = new Date();
      if (dateRange === 0) {
        startDate.setFullYear(2000, 0, 1);
      } else {
        startDate.setDate(startDate.getDate() - dateRange);
      }

      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      const period = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };

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
      setTotalRevenue(revenueData.total_revenue);
      setEvolution(evolutionData.evolution_percentage);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }

    try {
      setFlopLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      if (dateRange === 0) {
        startDate.setFullYear(2000, 0, 1);
      } else {
        startDate.setDate(startDate.getDate() - dateRange);
      }
      const formatDate = (d: Date) => d.toISOString().split("T")[0];
      const topFlop = await globalKpisService.getTopFlop({
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      });
      setFlopBySales(topFlop.flop_10_by_sales);
      setFlopByProfit(topFlop.flop_10_by_profit);
    } catch (error) {
      console.error("Error loading flop data:", error);
    } finally {
      setFlopLoading(false);
    }
  };

  return (
    <PageLayout
      title={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
      actions={
        <PageActions
          onDateRangeChange={setDateRange}
          currentRange={dateRange}
        />
      }
    >
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white border border-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="bg-white border border-gray-200 h-80 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="bg-white border border-gray-200 h-64 rounded-xl animate-pulse lg:col-span-7" />
            <div className="bg-white border border-gray-200 h-64 rounded-xl animate-pulse lg:col-span-5" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <KPICards
            orders={orders}
            products={products}
            users={users}
            totalRevenue={totalRevenue}
            evolution={evolution}
            dateRange={dateRange}
          />

          <ChartContainer orders={orders} dateRange={dateRange} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <RecentOrders orders={orders} />
            </div>
            <div className="lg:col-span-5">
              <TopProducts products={products} />
            </div>
          </div>

          <FlopProducts
            flopBySales={flopBySales}
            flopByProfit={flopByProfit}
            loading={flopLoading}
          />
        </div>
      )}
    </PageLayout>
  );
}
