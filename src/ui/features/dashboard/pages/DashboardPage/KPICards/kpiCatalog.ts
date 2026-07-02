import {
  FiDollarSign,
  FiShoppingCart,
  FiPackage,
  FiUsers,
  FiTrendingUp,
  FiTruck,
  FiCheckCircle,
  FiAlertTriangle,
  FiBox,
  FiArchive,
  FiPhone,
} from "react-icons/fi";
import type { KPI } from "@/ui/features/dashboard/types";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";
import type { Supplier } from "@/domain/models/Supplier";

/**
 * Shared data + helpers passed to every KPI's compute function.
 * The dashboard loads this once and the catalog derives each metric from it,
 * so adding a new selectable KPI only means adding one entry below.
 */
export interface KpiContext {
  orders: Order[];
  products: Product[];
  users: User[];
  suppliers: Supplier[];
  totalRevenue: number;
  evolution: number;
  orderCount: number;
  dateRange: number;
  t: (key: string, fallback?: string) => string;
  fmtCurrency: (v: number) => string;
  fmtPercent: (v: number) => string;
  dateRangeLabel: string;
  /** Pre-fetched revenue series for the selected range. */
  revenueSparkline: { value: number }[];
}

export type KpiCategory = "sales" | "orders" | "inventory" | "suppliers" | "team";

export const KPI_CATEGORY_ORDER: KpiCategory[] = [
  "sales",
  "orders",
  "inventory",
  "suppliers",
  "team",
];

export interface KpiDefinition {
  key: string;
  category: KpiCategory;
  /** Short label shown in the edit modal. */
  label: (t: KpiContext["t"]) => string;
  /** Builds the full KPI card data from the shared context. */
  compute: (ctx: KpiContext) => KPI;
}

/** KPIs displayed by default (preserves the historical dashboard layout). */
export const DEFAULT_KPI_KEYS = ["revenue", "orders", "stock", "users"];

const BUCKETS = 8;

/** Last-N-buckets daily series from a date field, reduced per bucket. */
function dailySeries<T>(
  items: T[],
  dateOf: (item: T) => string | undefined | null,
  reduce: (slice: T[]) => number,
  buckets = BUCKETS,
): { value: number }[] {
  const start = new Date();
  start.setDate(start.getDate() - (buckets - 1));
  start.setHours(0, 0, 0, 0);
  const groups: T[][] = Array.from({ length: buckets }, () => []);
  items.forEach((it) => {
    const raw = dateOf(it);
    if (!raw) return;
    const d = new Date(raw);
    if (isNaN(d.getTime())) return;
    const idx = Math.floor((d.getTime() - start.getTime()) / 86_400_000);
    if (idx >= 0 && idx < buckets) groups[idx].push(it);
  });
  return groups.map((slice) => ({ value: reduce(slice) }));
}

/** Top-N values sorted descending — for metrics without a time axis. */
function topN<T>(items: T[], metric: (item: T) => number, n = 8): { value: number }[] {
  return [...items]
    .map(metric)
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => b - a)
    .slice(0, n)
    .map((value) => ({ value }));
}

/**
 * Distribution des produits par tranche de stock (0, 1-5, 6-10, 11-20, 21-50, 50+).
 * La première barre = produits en rupture : une vraie répartition, pas une courbe factice.
 */
function stockBands(products: Product[]): { value: number }[] {
  const bands = [0, 0, 0, 0, 0, 0]; // 0 · 1-5 · 6-10 · 11-20 · 21-50 · 50+
  for (const p of products) {
    const q = p.stock_quantity || 0;
    if (q <= 0) bands[0] += 1;
    else if (q <= 5) bands[1] += 1;
    else if (q <= 10) bands[2] += 1;
    else if (q <= 20) bands[3] += 1;
    else if (q <= 50) bands[4] += 1;
    else bands[5] += 1;
  }
  return bands.map((value) => ({ value }));
}

const isDelivered = (o: Order) => o.status?.toLowerCase() === "delivered";
const productValue = (p: Product) => (p.buying_price || 0) * (p.stock_quantity || 0);

/**
 * Full catalog of selectable KPIs, aggregated from every page that exposes
 * top-line metrics (Sales, Orders, Inventory, Suppliers, Team).
 */
export const KPI_CATALOG: KpiDefinition[] = [
  // ---- Sales / revenue ----
  {
    key: "revenue",
    category: "sales",
    label: (t) => t("dashboard.kpi.total_revenue"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.total_revenue"),
      value: ctx.fmtCurrency(ctx.totalRevenue),
      change: ctx.fmtPercent(ctx.evolution),
      trend: ctx.evolution >= 0 ? "up" : "down",
      icon: FiDollarSign,
      color: "emerald",
      description: ctx.dateRangeLabel,
      sparkline: ctx.revenueSparkline,
      chartType: "line",
    }),
  },
  {
    key: "revenue_growth",
    category: "sales",
    label: (t) => t("dashboard.kpi.revenue_growth", "Croissance du CA"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.revenue_growth", "Croissance du CA"),
      value: ctx.fmtPercent(ctx.evolution),
      change: "",
      trend: ctx.evolution >= 0 ? "up" : "down",
      icon: FiTrendingUp,
      color: "emerald",
      description: ctx.dateRangeLabel,
      sparkline: ctx.revenueSparkline,
      chartType: "line",
    }),
  },
  {
    key: "avg_order_value",
    category: "sales",
    label: (t) => t("dashboard.kpi.avg_order_value", "Panier moyen"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.avg_order_value", "Panier moyen"),
      value: ctx.fmtCurrency(ctx.orderCount > 0 ? ctx.totalRevenue / ctx.orderCount : 0),
      change: "",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: ctx.dateRangeLabel,
      sparkline: ctx.revenueSparkline,
      chartType: "line",
    }),
  },
  // ---- Orders ----
  {
    key: "orders",
    category: "orders",
    label: (t) => t("dashboard.kpi.total_orders"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.total_orders"),
      value: ctx.orderCount.toString(),
      change: "",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: ctx.t("common.all_time"),
      sparkline: dailySeries(ctx.orders, (o) => o.order_date || o.created_at, (s) => s.length),
      chartType: "bar",
    }),
  },
  {
    key: "delivered_orders",
    category: "orders",
    label: (t) => t("dashboard.kpi.delivered_orders", "Commandes livrées"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.delivered_orders", "Commandes livrées"),
      value: ctx.orders.filter(isDelivered).length.toString(),
      change: "",
      trend: "up",
      icon: FiCheckCircle,
      color: "emerald",
      description: ctx.t("common.all_time"),
      sparkline: dailySeries(
        ctx.orders,
        (o) => o.order_date || o.created_at,
        (s) => s.filter(isDelivered).length,
      ),
      chartType: "bar",
    }),
  },
  // ---- Inventory ----
  {
    key: "stock",
    category: "inventory",
    label: (t) => t("dashboard.kpi.low_stock_alert"),
    compute: (ctx) => {
      const lowStock = ctx.products.filter((p) => p.stock_quantity < 10).length;
      return {
        title: ctx.t("dashboard.kpi.low_stock_alert"),
        value: lowStock.toString(),
        change: lowStock > 5 ? ctx.t("dashboard.kpi.high") : ctx.t("dashboard.kpi.normal"),
        trend: lowStock > 5 ? "down" : "up",
        icon: FiPackage,
        color: lowStock > 5 ? "amber" : "purple",
        description: ctx.t("dashboard.kpi.products_low_units"),
        sparkline: topN(
          [...ctx.products].sort((a, b) => a.stock_quantity - b.stock_quantity),
          (p) => p.stock_quantity,
        ),
        chartType: "line",
      };
    },
  },
  {
    key: "total_products",
    category: "inventory",
    label: (t) => t("dashboard.kpi.total_products", "Total produits"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.total_products", "Total produits"),
      value: ctx.products.length.toString(),
      change: "",
      trend: "up",
      icon: FiBox,
      color: "blue",
      description: ctx.t("dashboard.kpi.in_catalog", "au catalogue"),
      sparkline: topN(ctx.products, (p) => p.stock_quantity),
      chartType: "bar",
    }),
  },
  {
    key: "inventory_value",
    category: "inventory",
    label: (t) => t("dashboard.kpi.inventory_value", "Valeur du stock"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.inventory_value", "Valeur du stock"),
      value: ctx.fmtCurrency(ctx.products.reduce((s, p) => s + productValue(p), 0)),
      change: "",
      trend: "up",
      icon: FiArchive,
      color: "emerald",
      description: ctx.t("dashboard.kpi.total_value", "valeur totale"),
      sparkline: topN(ctx.products, productValue),
      chartType: "line",
    }),
  },
  {
    key: "out_of_stock",
    category: "inventory",
    label: (t) => t("dashboard.kpi.out_of_stock", "Ruptures"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.out_of_stock", "Ruptures"),
      value: ctx.products.filter((p) => p.stock_quantity <= 0).length.toString(),
      change: "",
      trend: "up",
      icon: FiAlertTriangle,
      color: "rose",
      description: ctx.t("dashboard.kpi.stock_coverage", "répartition par niveau de stock"),
      // Histogramme de couverture : 1re barre = ruptures, puis produits proches de la rupture.
      sparkline: stockBands(ctx.products),
      chartType: "bar",
    }),
  },
  // ---- Suppliers ----
  {
    key: "suppliers_total",
    category: "suppliers",
    label: (t) => t("dashboard.kpi.suppliers_total", "Fournisseurs"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.suppliers_total", "Fournisseurs"),
      value: ctx.suppliers.length.toString(),
      change: "",
      trend: "up",
      icon: FiTruck,
      color: "blue",
      description: ctx.t("dashboard.kpi.registered", "référencés"),
      sparkline: [],
      chartType: "bar",
    }),
  },
  {
    key: "suppliers_with_phone",
    category: "suppliers",
    label: (t) => t("dashboard.kpi.suppliers_with_phone", "Fournisseurs joignables"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.suppliers_with_phone", "Fournisseurs joignables"),
      value: ctx.suppliers.filter((s) => s.phone_sup?.trim()).length.toString(),
      change: "",
      trend: "up",
      icon: FiPhone,
      color: "purple",
      description: ctx.t("dashboard.kpi.with_phone", "avec téléphone"),
      sparkline: [],
      chartType: "bar",
    }),
  },
  // ---- Team / users ----
  {
    key: "users",
    category: "team",
    label: (t) => t("dashboard.kpi.total_users"),
    compute: (ctx) => ({
      title: ctx.t("dashboard.kpi.total_users"),
      value: ctx.users.length.toString(),
      change: "",
      trend: "up",
      icon: FiUsers,
      color: "purple",
      description: ctx.t("common.all_time"),
      sparkline: dailySeries(ctx.users, (u) => u.created_at, (s) => s.length),
      chartType: "bar",
    }),
  },
];

export const KPI_CATALOG_MAP: Record<string, KpiDefinition> = Object.fromEntries(
  KPI_CATALOG.map((def) => [def.key, def]),
);
