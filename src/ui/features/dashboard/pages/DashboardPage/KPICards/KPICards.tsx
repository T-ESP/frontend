import { useState, useEffect, useMemo } from "react";
import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers } from "react-icons/fi";
import { Settings, Check, X } from "lucide-react";
import { KPICard } from "./KPICard";
import type { KPI } from "@/ui/features/dashboard/types";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";
import { useTranslation } from "react-i18next";
import { Checkbox } from "@/components/ui/checkbox";
import { salesService } from "@/infrastructure/api/services/salesService";

function grainForRange(days: number): "day" | "week" | "month" {
  if (days <= 30) return "day";
  if (days <= 90) return "week";
  return "month";
}

function buildOrdersSparkline(orders: Order[]): { value: number }[] {
  if (orders.length === 0) return [];
  const buckets = new Map<string, number>();
  orders.forEach((order) => {
    const date = new Date(order.order_date || order.created_at);
    if (isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  const sorted = Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-8).map(([, v]) => ({ value: v }));
}

function buildUsersSparkline(users: User[]): { value: number }[] {
  if (users.length === 0) return [];
  const usersWithDate = users.filter((u) => u.created_at);
  if (usersWithDate.length < 2) {
    // Pas assez de données temporelles : distribuer uniformément sur 6 buckets fictifs
    const perBucket = Math.floor(users.length / 6);
    const remainder = users.length % 6;
    return Array.from({ length: 6 }, (_, i) => ({
      value: perBucket + (i === 5 ? remainder : 0),
    }));
  }
  const buckets = new Map<string, number>();
  usersWithDate.forEach((user) => {
    const d = new Date(user.created_at!);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  });
  const sorted = Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b));
  return sorted.slice(-8).map(([, v]) => ({ value: v }));
}

function buildStockSparkline(products: Product[]): { value: number }[] {
  return [...products]
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 8)
    .map((p) => ({ value: p.stock_quantity }));
}

interface KPICardsProps {
  orders: Order[];
  products: Product[];
  users: User[];
  totalRevenue: number;
  evolution: number;
  totalOrderCount?: number;
  dateRange?: number;
  editMode?: boolean;
  onCloseEdit?: () => void;
}

const KPI_STORAGE_KEY = "dashboard_kpi_visible";
const ALL_KPI_KEYS = ["revenue", "orders", "stock", "users"] as const;
type KPIKey = typeof ALL_KPI_KEYS[number];

function readPreferences(): KPIKey[] {
  try {
    const saved = localStorage.getItem(KPI_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as KPIKey[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return [...ALL_KPI_KEYS];
}

function writePreferences(keys: KPIKey[]) {
  try {
    localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // ignore
  }
}

export function KPICards({
  orders,
  products,
  users,
  totalRevenue,
  evolution,
  totalOrderCount,
  dateRange = 30,
  editMode = false,
  onCloseEdit,
}: KPICardsProps) {
  const { t } = useTranslation();

  const [visibleKPIs, setVisibleKPIs] = useState<KPIKey[]>(() => readPreferences());
  const [pendingVisible, setPendingVisible] = useState<KPIKey[]>(visibleKPIs);
  const [revenueSparkline, setRevenueSparkline] = useState<{ value: number }[]>([]);

  useEffect(() => {
    const fetchSparkline = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);
        const fmt = (d: Date) => d.toISOString().split("T")[0];
        const res = await salesService.getEvolutionByGrain({
          start_date: fmt(startDate),
          end_date: fmt(endDate),
          grain: grainForRange(dateRange),
        });
        setRevenueSparkline(res.data.map((p) => ({ value: Math.round(p.revenue) })));
      } catch {
        setRevenueSparkline([]);
      }
    };
    fetchSparkline();
  }, [dateRange]);

  // Sync pending each time the modal opens
  useEffect(() => {
    if (editMode) setPendingVisible(visibleKPIs);
  }, [editMode, visibleKPIs]);

  // Close on Escape
  useEffect(() => {
    if (!editMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseEdit?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editMode, onCloseEdit]);

  const applyChanges = () => {
    const next = pendingVisible.length > 0 ? pendingVisible : [...ALL_KPI_KEYS];
    setVisibleKPIs(next);
    writePreferences(next);
    onCloseEdit?.();
  };

  const cancelChanges = () => {
    setPendingVisible(visibleKPIs);
    onCloseEdit?.();
  };

  const toggleKPI = (key: KPIKey) => {
    setPendingVisible((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${(value || 0).toFixed(1)}%`;
  };

  const lowStockProducts = products.filter((p) => p.stock_quantity < 10).length;

  const ordersSparkline = useMemo(() => buildOrdersSparkline(orders), [orders]);
  const usersSparkline = useMemo(() => buildUsersSparkline(users), [users]);
  const stockSparkline = useMemo(() => buildStockSparkline(products), [products]);

  const getDateRangeLabel = () => {
    if (dateRange === 7) return t("common.date_range.last_7_days");
    if (dateRange === 90) return t("common.date_range.last_90_days");
    if (dateRange === 365) return t("common.date_range.last_year");
    return t("common.date_range.last_30_days");
  };

  const orderCount = totalOrderCount ?? orders.length;

  const allKPIData: Record<KPIKey, KPI> = {
    revenue: {
      title: t("dashboard.kpi.total_revenue"),
      value: formatCurrency(totalRevenue),
      change: formatPercentage(evolution),
      trend: evolution >= 0 ? "up" : "down",
      icon: FiDollarSign,
      color: "emerald",
      description: getDateRangeLabel(),
      isPrimary: false,
      sparkline: revenueSparkline,
      chartType: "line",
    },
    orders: {
      title: t("dashboard.kpi.total_orders"),
      value: orderCount.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: t("common.all_time"),
      sparkline: ordersSparkline,
      chartType: "bar",
    },
    stock: {
      title: t("dashboard.kpi.low_stock_alert"),
      value: lowStockProducts.toString(),
      change:
        lowStockProducts > 5 ? t("dashboard.kpi.high") : t("dashboard.kpi.normal"),
      trend: lowStockProducts > 5 ? "down" : "up",
      icon: FiPackage,
      color: lowStockProducts > 5 ? "amber" : "purple",
      description: t("dashboard.kpi.products_low_units"),
      sparkline: stockSparkline,
      chartType: "line",
    },
    users: {
      title: t("dashboard.kpi.total_users"),
      value: users.length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiUsers,
      color: "purple",
      description: t("common.all_time"),
      sparkline: usersSparkline,
      chartType: "bar",
    },
  };

  const kpiLabels: Record<KPIKey, string> = {
    revenue: t("dashboard.kpi.total_revenue"),
    orders: t("dashboard.kpi.total_orders"),
    stock: t("dashboard.kpi.low_stock_alert"),
    users: t("dashboard.kpi.total_users"),
  };

  const hasChanges =
    pendingVisible.length !== visibleKPIs.length ||
    pendingVisible.some((k) => !visibleKPIs.includes(k));

  return (
    <div className="mb-8">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {ALL_KPI_KEYS.filter((key) => visibleKPIs.includes(key)).map((key) => (
          <KPICard key={key} kpi={allKPIData[key]} />
        ))}
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={cancelChanges}
        >
          <div
            className="w-full max-w-md bg-white border shadow-xl rounded-xl border-border animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    {t("dashboard.kpi_edit.title", "Personnaliser les KPIs")}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {t("dashboard.kpi_edit.subtitle", "Choisis les indicateurs à afficher")}
                  </p>
                </div>
              </div>
              <button
                onClick={cancelChanges}
                className="p-1.5 transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-2">
              {ALL_KPI_KEYS.map((key) => {
                const isSelected = pendingVisible.includes(key);
                return (
                  <label
                    key={key}
                    className={`flex items-center justify-between px-4 py-3 transition-colors border rounded-lg cursor-pointer ${
                      isSelected
                        ? "bg-accent border-primary/20"
                        : "bg-white border-border hover:bg-muted"
                    }`}
                  >
                    <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {kpiLabels[key]}
                    </span>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleKPI(key)}
                    />
                  </label>
                );
              })}
              {pendingVisible.length === 0 && (
                <p className="px-1 text-xs text-muted-foreground">
                  {t("dashboard.kpi_edit.empty_hint", "Au moins un KPI doit rester affiché.")}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
              <button
                onClick={cancelChanges}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium transition-colors bg-white border rounded-lg border-border text-foreground hover:bg-muted"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={applyChanges}
                disabled={pendingVisible.length === 0 || !hasChanges}
                className="inline-flex items-center justify-center h-10 gap-2 px-4 text-sm font-medium transition-colors rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {t("common.apply", "Appliquer")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
