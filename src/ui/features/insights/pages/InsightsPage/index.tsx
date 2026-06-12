import { useState, useEffect } from "react";
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

const BRAND_PRIMARY = "hsl(var(--brand-h) var(--brand-s) var(--brand-l))";
const BRAND_DARK = "hsl(var(--brand-h) var(--brand-s) calc(var(--brand-l) - 18%))";
const BRAND_LIGHT = "hsl(var(--brand-h) calc(var(--brand-s) + 8%) calc(var(--brand-l) + 18%))";

const stockHealthChartConfig = {
  stockout: { label: "Rupture de stock", color: "var(--color-error)" },
  low: { label: "Stock faible", color: "var(--color-warning)" },
  healthy: { label: "En bonne santé", color: "var(--color-success)" },
  overstock: { label: "Surstock", color: BRAND_PRIMARY },
} satisfies ChartConfig;

const abcChartConfig = {
  classA: { label: "Classe A – Haute Valeur", color: BRAND_DARK },
  classB: { label: "Classe B – Valeur Moyenne", color: BRAND_PRIMARY },
  classC: { label: "Classe C – Faible Valeur", color: BRAND_LIGHT },
} satisfies ChartConfig;

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
        className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
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
  const [stockHealth, setStockHealth] = useState<
    { key: keyof typeof stockHealthChartConfig; name: string; value: number }[]
  >([]);
  const [abcStats, setAbcStats] = useState<
    { key: keyof typeof abcChartConfig; name: string; count: number; valuePct: number }[]
  >([]);
  const [riskProducts, setRiskProducts] = useState<Product[]>([]);

  useEffect(() => { loadInsights(); }, []);

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
      { key: "stockout", name: "Rupture de stock", value: stockout },
      { key: "low", name: "Stock faible", value: low },
      { key: "healthy", name: "En bonne santé", value: healthy },
      { key: "overstock", name: "Surstock", value: overstock },
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
      { key: "classA", name: "Classe A – Haute Valeur", count: countA, valuePct: totalValue ? Math.round((valueA / totalValue) * 100) : 0 },
      { key: "classB", name: "Classe B – Valeur Moyenne", count: countB, valuePct: totalValue ? Math.round((valueB / totalValue) * 100) : 0 },
      { key: "classC", name: "Classe C – Faible Valeur", count: countC, valuePct: totalValue ? Math.round((valueC / totalValue) * 100) : 0 },
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

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-[5rem] z-30 mx-4 md:mx-8 mb-6 md:mb-8 rounded-2xl border border-gray-200 bg-white/85 backdrop-blur-md shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 px-5 md:px-6 py-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {t("insights.title")}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {t("insights.subtitle")}
            </p>
          </div>
          <button
            onClick={loadInsights}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>
      </header>

      <div className="px-4 md:px-8 space-y-6">

        {loading && (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <FiRefreshCw className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Chargement des analyses...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Santé des stocks + Analyse ABC côte à côte */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

              {/* Santé des stocks */}
              <Card className="overflow-hidden bg-white border border-gray-200 rounded-2xl py-0 ring-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center">
                    Santé des stocks
                    <InfoTip text="Classifie chaque produit selon son niveau de stock : rupture (0 unité), faible (<10), sain (10-100), surstock (>100)." />
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{products.length} produits analysés</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ChartContainer config={stockHealthChartConfig} className="h-72 w-full">
                      <PieChart>
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              nameKey="key"
                              formatter={(value, _name, item) => (
                                <div className="flex items-center gap-2">
                                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: `var(--color-${item.payload?.key})` }} />
                                  <span className="text-gray-600">{item.payload?.name}</span>
                                  <span className="ml-auto font-semibold text-gray-900 tabular-nums">{value} produits</span>
                                </div>
                              )}
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
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Détail par catégorie</h4>
                      <div className="space-y-2">
                        {stockHealth.map((item) => (
                          <div key={item.key} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `var(--color-${item.key}, ${stockHealthChartConfig[item.key].color})` }} />
                            <span className="flex-1 text-sm font-medium text-gray-700">{item.name}</span>
                            <span className="text-sm font-semibold text-gray-900 tabular-nums">{item.value}</span>
                            <span className="text-xs text-gray-400 tabular-nums w-12 text-right">
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
              <Card className="overflow-hidden bg-white border border-gray-200 rounded-2xl py-0 ring-0">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center">
                    Analyse ABC
                    <InfoTip text="Méthode Pareto : Classe A = 20% des produits générant ~80% de la valeur. Classe B = 30% intermédiaires. Classe C = 50% restants à faible valeur." />
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">Basée sur la valeur (prix d'achat × stock)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <ChartContainer config={abcChartConfig} className="h-72 w-full">
                      <BarChart data={abcStats} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" tickFormatter={(v) => `${v}`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                        <YAxis
                          dataKey="key" type="category" width={120}
                          axisLine={false} tickLine={false}
                          tick={{ fontSize: 12, fill: "#475569" }}
                          tickFormatter={(v) => abcChartConfig[v as keyof typeof abcChartConfig]?.label?.toString().split("–")[0].trim() ?? v}
                        />
                        <ChartTooltip
                          cursor={{ fill: "#f8fafc" }}
                          content={
                            <ChartTooltipContent
                              nameKey="key"
                              formatter={(value, _name, item) => (
                                <div className="flex items-center gap-2">
                                  <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: `var(--color-${item.payload?.key})` }} />
                                  <span className="text-gray-600">{item.payload?.name}</span>
                                  <span className="ml-auto font-semibold text-gray-900 tabular-nums">{value} produits ({item.payload?.valuePct}%)</span>
                                </div>
                              )}
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
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Détail par classe</h4>
                      <div className="space-y-2">
                        {abcStats.map((item) => (
                          <div key={item.key} className="p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `var(--color-${item.key}, ${abcChartConfig[item.key].color})` }} />
                              <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 tabular-nums">
                              <span><strong className="text-gray-900">{item.count}</strong> produits</span>
                              <span><strong className="text-gray-900">{item.valuePct}%</strong> de la valeur</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-4 px-1">
                        Concentrez vos efforts sur la Classe A pour maximiser l'impact sur la trésorerie.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes critiques */}
            <Card className="overflow-hidden bg-white border border-gray-200 rounded-2xl py-0 ring-0">
              <CardContent className="p-6">
                <h3 className="text-base font-semibold text-gray-900 mb-1 flex items-center">
                  Alertes critiques
                  <InfoTip text="Produits dont le stock est inférieur à 15 unités, triés par prix décroissant. Ce sont les produits dont la rupture aurait le plus grand impact financier." />
                  {riskProducts.length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-semibold bg-rose-50 text-rose-600 border border-rose-200 rounded-full">
                      {riskProducts.length}
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Articles de haute valeur presque épuisés — commandez dès maintenant
                </p>

                {riskProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/30 py-16 text-muted-foreground">
                    <FiCheck className="mb-3 h-10 w-10 text-emerald-500" />
                    <p className="text-sm font-medium text-foreground">Aucun risque critique détecté</p>
                    <p className="mt-1 text-xs text-muted-foreground">Tous les produits sont en stock suffisant.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-xl border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="px-4">Produit</TableHead>
                          <TableHead className="px-4">Catégorie</TableHead>
                          <TableHead className="px-4 text-right">Prix d'achat</TableHead>
                          <TableHead className="px-4 text-right">Stock restant</TableHead>
                          <TableHead className="px-4 text-right">Valeur à risque</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {riskProducts.map((p) => {
                          const urgency = p.stock_quantity === 0 ? "Rupture" : p.stock_quantity < 5 ? "Critique" : "Faible";
                          const urgencyDot = p.stock_quantity === 0 ? "bg-rose-500" : p.stock_quantity < 5 ? "bg-orange-500" : "bg-amber-500";
                          return (
                            <TableRow key={p.id}>
                              <TableCell className="px-4 py-3">
                                <p className="text-sm font-medium">{p.name}</p>
                                <p className="text-xs text-muted-foreground">ID: {p.id}</p>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-sm text-muted-foreground">{p.category || "—"}</TableCell>
                              <TableCell className="px-4 py-3 text-right text-sm font-medium tabular-nums">{formatCurrency(p.buying_price)}</TableCell>
                              <TableCell className="px-4 py-3 text-right">
                                <div className="inline-flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                    <span className={`size-1.5 rounded-full ${urgencyDot}`} />
                                    {urgency}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-rose-600 tabular-nums">
                                    <FiAlertTriangle className="h-3.5 w-3.5" />
                                    <span className="text-sm font-semibold">{p.stock_quantity}</span>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-right text-sm font-medium tabular-nums">{formatCurrency(p.buying_price * p.stock_quantity)}</TableCell>
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
      </div>
    </div>
  );
}
