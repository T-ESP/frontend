import { useState, useEffect } from "react";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { KPICards } from "./KPICards";
import { ChartContainer } from "./ChartContainer";
import { TopProducts } from "./TopProducts";
import { AlertsWidget } from "./AlertsWidget/AlertsWidget";
import { PageActions } from "./PageActions/PageActions";
import { orderService } from "@/infrastructure/api/services/orderService";
import { productService } from "@/infrastructure/api/services/productService";
import { userService } from "@/infrastructure/api/services/userService";
import { salesService } from "@/infrastructure/api/services/salesService";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";
import { useTranslation } from "react-i18next";
import { FiSettings, FiCheck } from "react-icons/fi";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [evolution, setEvolution] = useState(0);
  const [totalOrderCount, setTotalOrderCount] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];

      const period = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };

      // Fetch all data in parallel, including order stats for accurate count
      const [ordersData, productsData, usersData, revenueData, evolutionData, statsData] =
        await Promise.allSettled([
          orderService.getAll(),
          productService.getAll(),
          userService.getAll(),
          salesService.getTotalRevenue(period),
          salesService.getEvolution(period),
          orderService.getStats(),
        ]);

      if (ordersData.status === "fulfilled") setOrders(ordersData.value);
      if (productsData.status === "fulfilled") setProducts(productsData.value);
      if (usersData.status === "fulfilled") setUsers(usersData.value);
      if (revenueData.status === "fulfilled")
        setTotalRevenue(revenueData.value.total_revenue);
      if (evolutionData.status === "fulfilled")
        setEvolution(evolutionData.value.evolution_percentage);
      // Use stats total_orders for accurate count (avoids pagination discrepancy)
      if (statsData.status === "fulfilled")
        setTotalOrderCount(statsData.value.total_orders);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export logic placeholder
  };

  return (
    <PageLayout
      title={t("dashboard.title")}
      subtitle={t("dashboard.subtitle")}
      actions={
        <div className="flex items-center gap-2">
          {/* Edit Mode toggle */}
          <button
            onClick={() => setEditMode((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl border transition-all ${
              editMode
                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {editMode ? (
              <>
                <FiCheck className="w-4 h-4" />
                Terminer
              </>
            ) : (
              <>
                <FiSettings className="w-4 h-4" />
                Éditer
              </>
            )}
          </button>
          <PageActions
            onDateRangeChange={setDateRange}
            currentRange={dateRange}
            onExport={handleExport}
          />
        </div>
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
          {/* KPI Cards with edit modal */}
          <KPICards
            orders={orders}
            products={products}
            users={users}
            totalRevenue={totalRevenue}
            evolution={evolution}
            totalOrderCount={totalOrderCount}
            dateRange={dateRange}
            editMode={editMode}
            onCloseEdit={() => setEditMode(false)}
          />

          <ChartContainer orders={orders} users={users} dateRange={dateRange} />

          <AlertsWidget />

          <TopProducts products={products} />
        </>
      )}
    </PageLayout>
  );
}