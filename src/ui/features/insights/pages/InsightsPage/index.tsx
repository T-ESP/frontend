import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  FiAlertTriangle, FiCheck, FiRefreshCw, FiInfo,
} from "react-icons/fi";
import { productService } from "@/infrastructure/api/services/productService";
import type { Product } from "@/domain/models/Product";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ProductKpiLink } from "@/ui/components/common/ProductKpiLink";
import PageLayout from "@/ui/components/layouts/PageLayout";

const BRAND_PRIMARY = "hsl(var(--brand-h) var(--brand-s) var(--brand-l))";
const BRAND_DARK = "hsl(var(--brand-h) var(--brand-s) calc(var(--brand-l) - 18%))";
const BRAND_LIGHT = "hsl(var(--brand-h) calc(var(--brand-s) + 8%) calc(var(--brand-l) + 18%))";

type StockHealthKey = "stockout" | "low" | "healthy" | "overstock";
type AbcKey = "classA" | "classB" | "classC";

const STOCK_HEALTH_COLOR: Record<StockHealthKey, string> = {
  stockout: "var(--color-error)",
  low: "var(--color-warning)",
  healthy: "var(--color-success)",
  overstock: BRAND_PRIMARY,
};
const ABC_COLOR: Record<AbcKey, string> = {
  classA: BRAND_DARK,
  classB: BRAND_PRIMARY,
  classC: BRAND_LIGHT,
};
const ABC_LABEL_KEY: Record<AbcKey, string> = {
  classA: "class_a",
  classB: "class_b",
  classC: "class_c",
};

function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-muted-foreground/70 hover:text-muted-foreground transition-colors focus:outline-none"
        aria-label="Information"
      >
        <FiInfo className="w-3.5 h-3.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-lg pointer-events-none font-normal">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

export default function InsightsPage() {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockHealth, setStockHealth] = useState<{ key: StockHealthKey; value: number }[]>([]);
  const [abcStats, setAbcStats] = useState<{ key: AbcKey; count: number; valuePct: number }[]>([]);
  const [riskProducts, setRiskProducts] = useState<Product[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadInsights(); }, []);

  const stockHealthChartConfig = useMemo(
    () =>
      ({
        stockout: { label: t("insights.status.stockout"), color: STOCK_HEALTH_COLOR.stockout },
        low: { label: t("insights.status.low"), color: STOCK_HEALTH_COLOR.low },
        healthy: { label: t("insights.status.healthy"), color: STOCK_HEALTH_COLOR.healthy },
        overstock: { label: t("insights.status.overstock"), color: STOCK_HEALTH_COLOR.overstock },
      }) satisfies ChartConfig,
    [t],
  );

  const abcChartConfig = useMemo(
    () =>
      ({
        classA: { label: t("insights.abc.class_a"), color: ABC_COLOR.classA },
        classB: { label: t("insights.abc.class_b"), color: ABC_COLOR.classB },
        classC: { label: t("insights.abc.class_c"), color: ABC_COLOR.classC },
      }) satisfies ChartConfig,
    [t],
  );

  const stockHealthLabel = (key: StockHealthKey) => t(`insights.status.${key}`);
  const abcLabel = (key: AbcKey) => t(`insights.abc.${ABC_LABEL_KEY[key]}`);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const prods = await productService.getAll();
      setProducts(prods);
      processStockHealth(prods);
      processABCAnalysis(prods);
      identifyRisks(prods);
    } catch (error) {
      console.error("Échec du chargement des analyses", error);
    } finally {
      setLoading(false);
    }
  };

  const processStockHealth = (prods: Product[]) => {
    let stockout = 0, low = 0, healthy = 0, overstock = 0;
    prods.forEach((p) => {
      if (p.stock_quantity === 0) stockout++;
      else if (p.stock_quantity < 10) low++;
      else if (p.stock_quantity > 100) overstock++;
      else healthy++;
    });
    setStockHealth([
      { key: "stockout", value: stockout },
      { key: "low", value: low },
      { key: "healthy", value: healthy },
      { key: "overstock", value: overstock },
    ]);
  };

  const processABCAnalysis = (prods: Product[]) => {
    const sorted = [...prods].sort(
      (a, b) => b.buying_price * b.stock_quantity - a.buying_price * a.stock_quantity
    );
    const totalItems = sorted.length;
    if (totalItems === 0) { setAbcStats([]); return; }
    const countA = Math.max(1, Math.floor(totalItems * 0.2));
    const countB = Math.max(1, Math.floor(totalItems * 0.3));
    const countC = Math.max(0, totalItems - countA - countB);
    const totalValue = sorted.reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    const valueA = sorted.slice(0, countA).reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    const valueB = sorted.slice(countA, countA + countB).reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    const valueC = sorted.slice(countA + countB).reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    setAbcStats([
      { key: "classA", count: countA, valuePct: totalValue ? Math.round((valueA / totalValue) * 100) : 0 },
      { key: "classB", count: countB, valuePct: totalValue ? Math.round((valueB / totalValue) * 100) : 0 },
      { key: "classC", count: countC, valuePct: totalValue ? Math.round((valueC / totalValue) * 100) : 0 },
    ]);
  };

  const identifyRisks = (prods: Product[]) => {
    setRiskProducts(
      prods
        .filter((p) => p.stock_quantity < 15)
        .sort((a, b) => b.buying_price - a.buying_price)
        .slice(0, 5)
    );
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);

  const headerActions = (
    <button
      onClick={loadInsights}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
    >
      <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      {t("common.refresh")}
    </button>
  );

  return (
    <PageLayout
      title={t("insights.title")}
      subtitle={t("insights.subtitle")}
      actions={headerActions}
    >
        {loading && (
          <div className="flex items-center justify-center h-64 text-muted-foreground/70">
            <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">{t("insights.loading")}</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Santé des stocks + Analyse ABC côte à côte */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* Santé des stocks */}
              <Card className="overflow-hidden bg-card border border-border rounded-lg py-0 ring-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground mb-1 flex items-center">
                    {t("insights.health_card.title")}
                    <InfoTip text={t("insights.health_card.info")} />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t("insights.health_card.analyzed", { count: products.length })}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ChartContainer config={stockHealthChartConfig} className="h-72 w-full">
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              nameKey="key"
                              formatter={(value, _name, item) => {
                                const key = item.payload?.key as StockHealthKey;
                                return (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: `var(--color-${key})` }} />
                                    <span className="text-muted-foreground">{stockHealthLabel(key)}</span>
                                    <span className="ml-auto font-semibold text-foreground tabular-nums">
                                      {t("insights.health_card.products", { value })}
                                    </span>
                                  </div>
                                );
                              }}
                              hideLabel
                            />
                          }
                        />
                        <Pie
                          data={stockHealth.filter((d) => d.value > 0)}
                          cx="50%" cy="50%"
                          innerRadius={60} outerRadius={95}
                          paddingAngle={2} dataKey="value" nameKey="key"
                          strokeWidth={2} stroke="#fff"
                        >
                          {stockHealth.map((entry) => (
                            <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ChartContainer>

                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-4">{t("insights.health_card.detail")}</h4>
                      <div className="space-y-2">
                        {stockHealth.map((item) => (
                          <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `var(--color-${item.key}, ${STOCK_HEALTH_COLOR[item.key]})` }} />
                            <span className="flex-1 text-sm font-medium text-muted-foreground">{stockHealthLabel(item.key)}</span>
                            <span className="text-sm font-semibold text-foreground tabular-nums">{item.value}</span>
                            <span className="text-xs text-muted-foreground/70 tabular-nums w-12 text-right">
                              {products.length > 0 ? Math.round((item.value / products.length) * 100) : 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analyse ABC */}
              <Card className="overflow-hidden bg-card border border-border rounded-lg py-0 ring-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground mb-1 flex items-center">
                    {t("insights.abc_card.title")}
                    <InfoTip text={t("insights.abc_card.info")} />
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{t("insights.abc_card.basis")}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ChartContainer config={abcChartConfig} className="h-72 w-full">
                      <BarChart data={abcStats} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" tickFormatter={(v) => `${v}`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                        <YAxis
                          dataKey="key" type="category" width={120}
                          axisLine={false} tickLine={false}
                          tick={{ fontSize: 12, fill: "#475569" }}
                          tickFormatter={(v) => t(`insights.abc_short.${ABC_LABEL_KEY[v as AbcKey] ?? v}`)}
                        />
                        <ChartTooltip
                          cursor={{ fill: "#f8fafc" }}
                          content={
                            <ChartTooltipContent
                              nameKey="key"
                              formatter={(value, _name, item) => {
                                const key = item.payload?.key as AbcKey;
                                return (
                                  <div className="flex items-center gap-2">
                                    <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: `var(--color-${key})` }} />
                                    <span className="text-muted-foreground">{abcLabel(key)}</span>
                                    <span className="ml-auto font-semibold text-foreground tabular-nums">
                                      {t("insights.abc_card.tooltip", { value, pct: item.payload?.valuePct })}
                                    </span>
                                  </div>
                                );
                              }}
                              hideLabel
                            />
                          }
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                          {abcStats.map((entry) => (
                            <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>

                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-4">{t("insights.abc_card.detail")}</h4>
                      <div className="space-y-2">
                        {abcStats.map((item) => (
                          <div key={item.key} className="p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `var(--color-${item.key}, ${ABC_COLOR[item.key]})` }} />
                              <span className="text-sm font-semibold text-foreground">{abcLabel(item.key)}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground tabular-nums">
                              <span><strong className="text-foreground">{item.count}</strong> {t("insights.abc_card.products")}</span>
                              <span><strong className="text-foreground">{item.valuePct}%</strong> {t("insights.abc_card.of_value")}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4 px-1">
                        {t("insights.abc_card.note")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes critiques */}
            <Card className="overflow-hidden bg-card border border-border rounded-lg py-0 ring-0">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold text-foreground mb-1 flex items-center">
                  {t("insights.critical.title")}
                  <InfoTip text={t("insights.critical.info")} />
                  {riskProducts.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded-full">
                      {riskProducts.length}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("insights.critical.subtitle")}
                </p>

                {riskProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 py-16 text-muted-foreground">
                    <FiCheck className="mb-3 h-10 w-10 text-emerald-500" />
                    <p className="text-sm font-medium text-foreground">{t("insights.critical.empty_title")}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t("insights.critical.empty_desc")}</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-4">{t("insights.critical.col_product")}</TableHead>
                          <TableHead className="px-4">{t("insights.critical.col_category")}</TableHead>
                          <TableHead className="px-4 text-right">{t("insights.critical.col_buy_price")}</TableHead>
                          <TableHead className="px-4 text-right">{t("insights.critical.col_stock")}</TableHead>
                          <TableHead className="px-4 text-right">{t("insights.critical.col_value")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {riskProducts.map((p) => {
                          const urgency =
                            p.stock_quantity === 0
                              ? t("insights.urgency.stockout")
                              : p.stock_quantity < 5
                                ? t("insights.urgency.critical")
                                : t("insights.urgency.low");
                          const urgencyDot = p.stock_quantity === 0 ? "bg-rose-500" : p.stock_quantity < 5 ? "bg-orange-500" : "bg-amber-500";
                          return (
                            <TableRow key={p.id}>
                              <TableCell className="px-4 py-3">
                                <ProductKpiLink productId={p.id} name={p.name} className="text-sm" />
                                <p className="text-xs text-muted-foreground">ID: {p.id}</p>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-sm text-muted-foreground">{p.category || "—"}</TableCell>
                              <TableCell className="px-4 py-3 text-right text-sm font-medium tabular-nums text-foreground num">{formatCurrency(p.buying_price)}</TableCell>
                              <TableCell className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    <span className={`size-1.5 rounded-full ${urgencyDot}`} />
                                    {urgency}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 tabular-nums">
                                    <FiAlertTriangle className="h-3.5 w-3.5" />
                                    <span className="text-sm font-semibold">{p.stock_quantity}</span>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-right text-sm font-medium tabular-nums text-foreground num">{formatCurrency(p.buying_price * p.stock_quantity)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
    </PageLayout>
  );
}
