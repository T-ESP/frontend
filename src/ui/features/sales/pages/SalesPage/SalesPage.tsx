import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";


import PageLayout from "@/ui/components/layouts/PageLayout";
import SalesChart from "@/ui/features/sales/pages/SalesPage/SalesChart";
import { salesService } from "@/infrastructure/api/services/salesService";
import { orderService } from "@/infrastructure/api/services/orderService";
import { productService } from "@/infrastructure/api/services/productService";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KpiStatCard } from "@/ui/components/common/KpiStatCard/KpiStatCard";

interface TopProduct {
  id: number;
  name: string;
  revenue: number;
  quantity: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

/**
 * Palette dérivée d'une seule variable Tailwind (--color-primary, alias `--primary`).
 * Pour changer toute la teinte de la page : modifier `--primary` dans
 * `src/ui/styles/index.css`. Toutes les nuances ci-dessous, ainsi que les
 * classes utilitaires `bg-primary`, `text-primary`, etc. suivront.
 */
const PIE_COLORS = [
  "var(--color-primary)",
  "color-mix(in oklch, var(--color-primary) 70%, white)",
  "color-mix(in oklch, var(--color-primary) 40%, white)",
  "color-mix(in oklch, var(--color-primary) 80%, black)",
  "color-mix(in oklch, var(--color-primary) 55%, black)",
];

export default function SalesPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "fr-FR";

  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState(0);
  const [averageBasket, setAverageBasket] = useState(0);
  const [averageBasketEvolution, setAverageBasketEvolution] = useState(0);
  const [chartData, setChartData] = useState<Array<{ date: string; revenue: number; orders: number }>>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [topFilter, setTopFilter] = useState("");

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      const period = { start_date: formatDate(startDate), end_date: formatDate(endDate), grain: "day" };

      const [revenueData, basketData, ordersData, dailyRevenueData, productsData] = await Promise.allSettled([
        salesService.getTotalRevenue(period),
        salesService.getAverageBasket(period),
        orderService.getAll(),
        salesService.getEvolutionByGrain(period),
        productService.getAll(),
      ]);

      if (revenueData.status === "fulfilled" && revenueData.value)
        setTotalRevenue(revenueData.value.total_revenue || 0);
      if (basketData.status === "fulfilled" && basketData.value) {
        setAverageBasket(basketData.value.average_basket || 0);
        setAverageBasketEvolution(basketData.value.evolution_percentage || 0);
      }

      if (
        ordersData.status === "fulfilled" &&
        ordersData.value &&
        productsData.status === "fulfilled" &&
        productsData.value
      ) {
        setOrders(ordersData.value);
        await processInsights(ordersData.value, productsData.value);
      }

      if (dailyRevenueData.status === "fulfilled" && dailyRevenueData.value) {
        const dailyData = dailyRevenueData.value.data || [];

        if (dailyData.length > 0) {
          const halfPoint = Math.floor(dailyData.length / 2);
          const firstHalf = dailyData.slice(0, halfPoint);
          const secondHalf = dailyData.slice(halfPoint);

          const firstHalfRevenue = firstHalf.reduce((sum, d) => sum + d.revenue, 0);
          const secondHalfRevenue = secondHalf.reduce((sum, d) => sum + d.revenue, 0);

          if (firstHalfRevenue > 0) {
            const growth = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;
            setRevenueGrowth(growth);
          }
        }

        const ordersByDate = new Map<string, number>();
        if (ordersData.status === "fulfilled" && ordersData.value) {
          ordersData.value.forEach((order) => {
            if (order.status !== "Cancelled") {
              const dateStr = new Date(order.order_date).toISOString().split("T")[0];
              ordersByDate.set(dateStr, (ordersByDate.get(dateStr) || 0) + 1);
            }
          });
        }

        const processedData = dailyData.map((item) => ({
          date: item.date,
          revenue: item.revenue,
          orders: ordersByDate.get(item.date) || 0,
        }));

        setChartData(processedData);
      }
    } catch (error) {
      console.error("Error loading sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processInsights = async (orders: Order[], products: Product[]) => {
    try {
      const productMap = new Map<number, TopProduct>();
      const categoryMap = new Map<string, number>();
      const productsById = new Map(products.map((p) => [p.id, p]));

      const validOrders = orders.filter((order) => order.status !== "Cancelled" && order.amount > 0);

      const orderPromises = validOrders.map((order) =>
        orderService.getOrderItems(order.id).catch(() => [])
      );

      const allLineItems = await Promise.all(orderPromises);

      allLineItems.forEach((lineItems, orderIndex) => {
        if (!lineItems || lineItems.length === 0) return;

        lineItems.forEach((item) => {
          const product = productsById.get(item.product_id);
          if (!product) return;

          let lineTotal = item.line_total;
          if (typeof lineTotal !== "number" || isNaN(lineTotal) || lineTotal === null || lineTotal === undefined) {
            const order = validOrders[orderIndex];
            lineTotal = order.amount / lineItems.length;
          }

          const existing = productMap.get(item.product_id);
          if (existing) {
            existing.revenue += lineTotal;
            existing.quantity += item.quantity || 1;
          } else {
            productMap.set(item.product_id, {
              id: item.product_id,
              name: product.name,
              revenue: lineTotal,
              quantity: item.quantity || 1,
            });
          }

          const category = product.category || t("sales.uncategorized", "Non catégorisé");
          categoryMap.set(category, (categoryMap.get(category) || 0) + lineTotal);
        });
      });

      const sortedProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 8);
      setTopProducts(sortedProducts);

      const sortedCategories = Array.from(categoryMap.entries())
        .filter(([, value]) => value > 0)
        .map(([name, value]) => ({ name, value: Number(value) || 0 }))
        .sort((a, b) => b.value - a.value);

      const TOP_N = 4;
      const finalCategories = sortedCategories.slice(0, TOP_N);
      const otherCategories = sortedCategories.slice(TOP_N);

      if (otherCategories.length > 0) {
        const otherValue = otherCategories.reduce((sum, cat) => sum + cat.value, 0);
        finalCategories.push({ name: t("common.others", "Autres"), value: otherValue });
      }

      setCategoryData(
        finalCategories.map((cat, index) => ({
          ...cat,
          color: PIE_COLORS[index % PIE_COLORS.length],
        }))
      );
    } catch (error) {
      console.error("Erreur lors du traitement des analyses:", error);
      setTopProducts([]);
      setCategoryData([]);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat(currentLang, { style: "currency", currency: "EUR" }).format(val);

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Series for KPI mini charts (last 7 buckets from chartData, trimmed)
  const trimmed = chartData.slice(-7);
  const revenueSeries = trimmed.map((d) => ({ value: d.revenue }));
  const ordersSeries = trimmed.map((d) => ({ value: d.orders }));
  const avgBasketSeries = trimmed.map((d) => ({
    value: d.orders > 0 ? d.revenue / d.orders : 0,
  }));

  const filteredTopProducts = topProducts.filter((p) =>
    p.name.toLowerCase().includes(topFilter.toLowerCase())
  );
  const maxRevenue = topProducts[0]?.revenue || 1;

  return (
    <PageLayout title={t("sales.title")} subtitle={t("sales.subtitle")}>
      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white border border-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="bg-white border border-gray-200 h-96 rounded-2xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <KpiStatCard
              title={t("sales.stats.total_revenue")}
              value={formatCurrency(totalRevenue)}
              change={formatPercentage(revenueGrowth)}
              trend={revenueGrowth >= 0 ? "up" : "down"}
              description={t("sales.stats.last_30_days")}
              chartData={revenueSeries}
              chartType="line"
            />
            <KpiStatCard
              title={t("sales.stats.total_orders")}
              value={orders.filter((o) => o.status !== "Cancelled").length.toString()}
              change="+0.0%"
              trend="up"
              description={t("sales.stats.last_30_days")}
              chartData={ordersSeries}
              chartType="bar"
            />
            <KpiStatCard
              title={t("sales.stats.avg_basket")}
              value={formatCurrency(averageBasket)}
              change={formatPercentage(averageBasketEvolution)}
              trend={averageBasketEvolution >= 0 ? "up" : "down"}
              description={t("sales.stats.last_30_days")}
              chartData={avgBasketSeries}
              chartType="line"
            />
            <KpiStatCard
              title={t("sales.stats.revenue_growth")}
              value={formatPercentage(revenueGrowth)}
              change={formatPercentage(revenueGrowth)}
              trend={revenueGrowth >= 0 ? "up" : "down"}
              description={t("sales.stats.trend")}
              chartData={revenueSeries}
              chartType="line"
            />
          </div>

          {/* Chart + Categories */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SalesChart data={chartData} />
            </div>

            <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{t("sales.by_category")}</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {t("sales.charts.daily_revenue_30d", "30 derniers jours")}
                </p>
              </div>

              <div className="flex flex-col items-center p-6">
                <div className="w-full h-56">
                  {categoryData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">
                      Aucune donnée
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value) => formatCurrency(Number(value) || 0)}
                          contentStyle={{
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            fontSize: 12,
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="w-full mt-4 space-y-2.5">
                  {categoryData.map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-gray-600">{cat.name}</span>
                      </div>
                      <span className="font-semibold tabular-nums text-gray-900">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top products table */}
          <div className="overflow-hidden rounded-xl border bg-card text-card-foreground">
            <div className="flex flex-col gap-4 border-b p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">{t("sales.top_products")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Performance des produits sur la période
                </p>
              </div>
              <Input
                placeholder="Filtrer un produit…"
                value={topFilter}
                onChange={(e) => setTopFilter(e.target.value)}
                className="sm:w-64"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 px-6">
                    <Checkbox aria-label="Select all" />
                  </TableHead>
                  <TableHead className="px-6">{t("sales.table.product")}</TableHead>
                  <TableHead className="px-6 text-right">{t("sales.table.units")}</TableHead>
                  <TableHead className="px-6 text-right">{t("sales.table.revenue")}</TableHead>
                  <TableHead className="px-6">{t("sales.table.performance")}</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTopProducts.map((product, idx) => (
                  <TableRow key={product.id}>
                    <TableCell
                      className="px-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox aria-label={`Select ${product.name}`} />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
                          #{idx + 1}
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right text-muted-foreground tabular-nums">
                      {product.quantity}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-semibold tabular-nums">
                      {formatCurrency(product.revenue)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="h-1.5 w-full max-w-[180px] rounded-full bg-muted">
                        <div
                          className="h-1.5 rounded-full bg-primary"
                          style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </TableCell>

                  </TableRow>
                ))}
                {filteredTopProducts.length === 0 && (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={6}
                      className="h-24 px-6 text-center text-muted-foreground"
                    >
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-muted-foreground">
              <div>
                {filteredTopProducts.length} produit
                {filteredTopProducts.length > 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </>
      )}
    </PageLayout>
  );
}
