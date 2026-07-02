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
import {
  startOnboardingTour,
  hasSeenTour,
  consumeReplayFlag,
  TOUR_START_EVENT,
} from "@/ui/features/onboarding/onboardingTour";

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

  // Permet de (re)lancer le tour à la demande depuis le header.
  useEffect(() => {
    const handler = () => startOnboardingTour();
    window.addEventListener(TOUR_START_EVENT, handler);
    return () => window.removeEventListener(TOUR_START_EVENT, handler);
  }, []);

  // Lance le tour automatiquement à la première visite (ou si une relecture est demandée),
  // une fois que les données — donc les zones ciblées — sont affichées.
  useEffect(() => {
    if (loading) return;
    if (!hasSeenTour() || consumeReplayFlag()) {
      const id = setTimeout(() => startOnboardingTour(), 500);
      return () => clearTimeout(id);
    }
  }, [loading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const MS_DAY = 86_400_000;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      // Période précédente de même longueur, juste avant la période courante,
      // pour calculer la croissance du CA côté client (l'endpoint /sales/evolution
      // ne renvoie qu'une série temporelle, pas le pourcentage d'évolution).
      const prevEndDate = new Date(startDate.getTime() - MS_DAY);
      const prevStartDate = new Date(prevEndDate.getTime() - dateRange * MS_DAY);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];

      const period = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };
      const previousPeriod = {
        start_date: formatDate(prevStartDate),
        end_date: formatDate(prevEndDate),
      };

      // Fetch all data in parallel, including order stats for accurate count
      const [ordersData, productsData, usersData, revenueData, prevRevenueData, statsData] =
        await Promise.allSettled([
          orderService.getAll(),
          productService.getAll(),
          userService.getAll(),
          salesService.getTotalRevenue(period),
          salesService.getTotalRevenue(previousPeriod),
          orderService.getStats(),
        ]);

      if (ordersData.status === "fulfilled") setOrders(ordersData.value);
      if (productsData.status === "fulfilled") setProducts(productsData.value);
      if (usersData.status === "fulfilled") setUsers(usersData.value);

      const currentRevenue =
        revenueData.status === "fulfilled" ? revenueData.value.total_revenue : 0;
      if (revenueData.status === "fulfilled") setTotalRevenue(currentRevenue);

      // Croissance = (courant - précédent) / précédent × 100 (aligné sur le backend).
      if (revenueData.status === "fulfilled" && prevRevenueData.status === "fulfilled") {
        const previousRevenue = prevRevenueData.value.total_revenue;
        const growth =
          Math.abs(previousRevenue) < 1e-9
            ? currentRevenue > 1e-9
              ? 100
              : 0
            : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
        setEvolution(growth);
      }
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
            data-tour="customize"
            onClick={() => setEditMode((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
              editMode
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
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
              <div key={i} className="h-32 border bg-card border-border rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="border bg-card border-border h-96 rounded-lg animate-pulse" />
        </div>
      ) : (
        <>
          {/* KPI Cards with edit modal */}
          <div data-tour="kpis">
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
          </div>

          <ChartContainer orders={orders} users={users} dateRange={dateRange} />

          <div data-tour="alerts">
            <AlertsWidget />
          </div>

          <TopProducts products={products} />
        </>
      )}
    </PageLayout>
  );
}