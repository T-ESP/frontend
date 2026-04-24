import { useState, useEffect } from "react";
import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers, FiSettings, FiCheck, FiX } from "react-icons/fi";
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
  totalOrderCount?: number; // from /orders/stats for accurate count
  dateRange?: number;
  editMode?: boolean;
}

const KPI_STORAGE_KEY = "dashboard_kpi_visible";
const ALL_KPI_KEYS = ["revenue", "orders", "stock", "users"] as const;
type KPIKey = typeof ALL_KPI_KEYS[number];

export function KPICards({
  orders,
  products,
  users,
  totalRevenue,
  evolution,
  totalOrderCount,
  dateRange = 30,
  editMode = false,
}: KPICardsProps) {
  const { t } = useTranslation();

  // Which KPIs are visible – persisted in localStorage
  const [visibleKPIs, setVisibleKPIs] = useState<KPIKey[]>(() => {
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
  });

  // Pending changes while in edit mode
  const [pendingVisible, setPendingVisible] = useState<KPIKey[]>(visibleKPIs);

  // Sync pending when edit mode opens
  useEffect(() => {
    if (editMode) setPendingVisible(visibleKPIs);
  }, [editMode, visibleKPIs]);

  const applyChanges = () => {
    const next = pendingVisible.length > 0 ? pendingVisible : [...ALL_KPI_KEYS];
    setVisibleKPIs(next);
    try {
      localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const toggleKPI = (key: KPIKey) => {
    setPendingVisible((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${(value || 0).toFixed(1)}%`;
  };

  const lowStockProducts = products.filter((p) => p.stock_quantity < 10).length;

  const getDateRangeLabel = () => {
    if (dateRange === 7) return t("common.date_range.last_7_days");
    if (dateRange === 90) return t("common.date_range.last_90_days");
    if (dateRange === 365) return t("common.date_range.last_year");
    return t("common.date_range.last_30_days");
  };

  // Use backend stats count if available, fall back to array length
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
    },
    orders: {
      title: t("dashboard.kpi.total_orders"),
      value: orderCount.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: t("common.all_time"),
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
    },
    users: {
      title: t("dashboard.kpi.total_users"),
      value: users.length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiUsers,
      color: "purple",
      description: t("common.all_time"),
    },
  };

  const kpiLabels: Record<KPIKey, string> = {
    revenue: t("dashboard.kpi.total_revenue"),
    orders: t("dashboard.kpi.total_orders"),
    stock: t("dashboard.kpi.low_stock_alert"),
    users: t("dashboard.kpi.total_users"),
  };

  return (
    <div className="mb-8">
      {/* Edit mode selector */}
      {editMode && (
        <div className="mb-4 p-4 bg-white border border-purple-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiSettings className="text-purple-600 w-4 h-4" />
              <span className="text-sm font-semibold text-gray-700">
                Choisir les KPIs à afficher
              </span>
            </div>
            <button
              onClick={applyChanges}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiCheck className="w-3.5 h-3.5" />
              Appliquer
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALL_KPI_KEYS.map((key) => {
              const isSelected = pendingVisible.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleKPI(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${isSelected
                      ? "bg-purple-50 text-purple-700 border-purple-300"
                      : "bg-gray-50 text-gray-500 border-gray-200 opacity-60"
                    }`}
                >
                  {isSelected ? (
                    <FiCheck className="w-3 h-3" />
                  ) : (
                    <FiX className="w-3 h-3" />
                  )}
                  {kpiLabels[key]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {ALL_KPI_KEYS.filter((key) => visibleKPIs.includes(key)).map((key) => (
          <KPICard key={key} kpi={allKPIData[key]} />
        ))}
      </div>
    </div>
  );
}
