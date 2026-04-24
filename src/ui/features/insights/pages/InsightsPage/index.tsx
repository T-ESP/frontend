import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "@/ui/components/layouts/PageLayout";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { FiAlertTriangle, FiActivity, FiInfo, FiSettings, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";
import { productService } from "@/infrastructure/api/services/productService";
import type { Product } from "@/domain/models/Product";

// ─── Colour palette ──────────────────────────────────────────────────────────
const COLORS = {
  A: "#362a49",
  B: "#644d85",
  C: "#a480d1",
  stockout: "#e11d48",
  low: "#f97316",
  healthy: "#22c55e",
  overstock: "#6366f1",
};

// ─── Tooltip component ────────────────────────────────────────────────────────
function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-gray-400 hover:text-purple-600 transition-colors focus:outline-none"
        aria-label="Information"
      >
        <FiInfo className="w-3.5 h-3.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

// ─── KPI keys & metadata ──────────────────────────────────────────────────────
const KPI_KEYS = ["inventory_value", "turnover_rate", "stockout_risk", "overstock_alerts"] as const;
type KPIKey = typeof KPI_KEYS[number];
const KPI_STORAGE_KEY = "insights_kpi_visible";

// ─── Main page ────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const { t } = useTranslation();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stockHealth, setStockHealth] = useState<any[]>([]);
  const [abcStats, setAbcStats] = useState<any[]>([]);
  const [riskProducts, setRiskProducts] = useState<Product[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalValue: 0,
    stockoutCount: 0,
    overstockCount: 0,
    turnoverRate: 4.2,
  });

  // KPI visibility
  const [visibleKPIs, setVisibleKPIs] = useState<KPIKey[]>(() => {
    try {
      const saved = localStorage.getItem(KPI_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as KPIKey[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return [...KPI_KEYS];
  });
  const [kpiEditMode, setKpiEditMode] = useState(false);
  const [pendingKPIs, setPendingKPIs] = useState<KPIKey[]>(visibleKPIs);

  // Tab selection (for the charts panel)
  const [activeTab, setActiveTab] = useState<"health" | "abc" | "risks">("health");

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
    let stockout = 0, low = 0, healthy = 0, overstock = 0, totalVal = 0;
    prods.forEach((p) => {
      totalVal += p.buying_price * p.stock_quantity;
      if (p.stock_quantity === 0) stockout++;
      else if (p.stock_quantity < 10) low++;
      else if (p.stock_quantity > 100) overstock++;
      else healthy++;
    });
    setStockHealth([
      { name: "Rupture de stock", value: stockout, color: COLORS.stockout },
      { name: "Stock faible", value: low, color: COLORS.low },
      { name: "En bonne santé", value: healthy, color: COLORS.healthy },
      { name: "Surstock", value: overstock, color: COLORS.overstock },
    ]);
    setGlobalStats((prev) => ({ ...prev, totalValue: totalVal, stockoutCount: stockout, overstockCount: overstock }));
  };

  const processABCAnalysis = (prods: Product[]) => {
    const sorted = [...prods].sort((a, b) => (b.buying_price * b.stock_quantity) - (a.buying_price * a.stock_quantity));
    const totalItems = sorted.length;
    if (totalItems === 0) {
      setAbcStats([]);
      return;
    }
    const countA = Math.max(1, Math.floor(totalItems * 0.2));
    const countB = Math.max(1, Math.floor(totalItems * 0.3));
    const countC = Math.max(0, totalItems - countA - countB);
    const totalValue = sorted.reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    const valueA = sorted.slice(0, countA).reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    const valueB = sorted.slice(countA, countA + countB).reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    const valueC = sorted.slice(countA + countB).reduce((s, p) => s + p.buying_price * p.stock_quantity, 0);
    setAbcStats([
      { name: "Classe A – Haute Valeur", count: countA, value: countA, valuePct: totalValue ? Math.round(valueA / totalValue * 100) : 0, color: COLORS.A },
      { name: "Classe B – Valeur Moyenne", count: countB, value: countB, valuePct: totalValue ? Math.round(valueB / totalValue * 100) : 0, color: COLORS.B },
      { name: "Classe C – Faible Valeur", count: countC, value: countC, valuePct: totalValue ? Math.round(valueC / totalValue * 100) : 0, color: COLORS.C },
    ]);
  };

  const identifyRisks = (prods: Product[]) => {
    const risks = prods
      .filter((p) => p.stock_quantity < 15)
      .sort((a, b) => b.buying_price - a.buying_price)
      .slice(0, 5);
    setRiskProducts(risks);
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);

  // KPI edit helpers
  const openKPIEdit = () => { setPendingKPIs(visibleKPIs); setKpiEditMode(true); };
  const applyKPIs = () => {
    const next = pendingKPIs.length > 0 ? pendingKPIs : [...KPI_KEYS];
    setVisibleKPIs(next);
    try { localStorage.setItem(KPI_STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
    setKpiEditMode(false);
  };
  const togglePendingKPI = (key: KPIKey) =>
    setPendingKPIs((p) => p.includes(key) ? p.filter((k) => k !== key) : [...p, key]);

  const kpiMeta: Record<KPIKey, { label: string; value: string; tooltip: string; color: string; textColor: string }> = {
    inventory_value: {
      label: "Valeur de l'Inventaire",
      value: formatCurrency(globalStats.totalValue),
      tooltip: "Valeur totale de tout le stock disponible, calculée comme la somme de (prix d'achat × quantité en stock) pour chaque produit.",
      color: "bg-purple-50 border-purple-200",
      textColor: "text-purple-700",
    },
    turnover_rate: {
      label: "Rotation des Stocks",
      value: `${globalStats.turnoverRate}x / an`,
      tooltip: "Nombre de fois que votre stock est renouvelé par an. Un taux élevé indique une bonne liquidité des produits.",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
    },
    stockout_risk: {
      label: "Ruptures de Stock",
      value: `${globalStats.stockoutCount} produit${globalStats.stockoutCount !== 1 ? "s" : ""}`,
      tooltip: "Nombre de produits dont le stock est à zéro. Ces produits ne peuvent plus être vendus et génèrent des pertes de revenus immédiates.",
      color: "bg-rose-50 border-rose-200",
      textColor: "text-rose-700",
    },
    overstock_alerts: {
      label: "Alertes Surstock",
      value: `${globalStats.overstockCount} produit${globalStats.overstockCount !== 1 ? "s" : ""}`,
      tooltip: "Nombre de produits avec plus de 100 unités en stock. Un surstock immobilise du capital et augmente les coûts de stockage.",
      color: "bg-amber-50 border-amber-200",
      textColor: "text-amber-700",
    },
  };

  const tabs = [
    { key: "health" as const, label: "Santé des Stocks" },
    { key: "abc" as const, label: "Analyse ABC" },
    { key: "risks" as const, label: "Alertes Critiques" },
  ];

  return (
    <PageLayout
      title={t("insights.title")}
      subtitle={t("insights.subtitle")}
      icon={<FiActivity className="text-purple-600 w-7 h-7" />}
    >
      {/* ── KPI Section ──────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* KPI Header with edit toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
            Indicateurs clés
          </h2>
          {kpiEditMode ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sélectionner les KPIs:</span>
              {KPI_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => togglePendingKPI(key)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                    pendingKPIs.includes(key)
                      ? "bg-purple-100 text-purple-700 border-purple-300"
                      : "bg-gray-50 text-gray-400 border-gray-200"
                  }`}
                >
                  {kpiMeta[key].label}
                </button>
              ))}
              <button
                onClick={applyKPIs}
                className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiCheck className="w-3 h-3" /> Appliquer
              </button>
              <button
                onClick={() => setKpiEditMode(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={openKPIEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiSettings className="w-3.5 h-3.5" />
              Personnaliser
            </button>
          )}
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white border border-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {KPI_KEYS.filter((k) => visibleKPIs.includes(k)).map((key) => {
              const m = kpiMeta[key];
              return (
                <div key={key} className={`p-5 border rounded-xl ${m.color}`}>
                  <div className="flex items-start justify-between">
                    <p className={`text-xs font-semibold uppercase tracking-wider ${m.textColor} flex items-center`}>
                      {m.label}
                      <InfoTooltip text={m.tooltip} />
                    </p>
                  </div>
                  <p className="mt-2 text-2xl font-black text-gray-900">{m.value}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Tabs + Charts ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden mb-8">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-purple-600 text-purple-700 bg-purple-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.key === "risks" && riskProducts.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-rose-500 text-white rounded-full">
                  {riskProducts.length}
                </span>
              )}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={loadInsights}
            disabled={loading}
            className="flex items-center gap-1.5 mr-4 my-3 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <FiRefreshCw className="w-6 h-6 animate-spin mr-2" /> Chargement des analyses...
            </div>
          )}

          {/* Stock Health */}
          {!loading && activeTab === "health" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center">
                  Répartition des niveaux de stock
                  <InfoTooltip text="Classifie chaque produit selon son niveau de stock : rupture (0 unité), faible (<10), sain (10-100), surstock (>100)." />
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {products.length} produits analysés
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockHealth.filter((d) => d.value > 0)}
                        cx="50%" cy="50%"
                        innerRadius={60} outerRadius={90}
                        paddingAngle={3} dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {stockHealth.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} produits`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Summary table */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Détail par catégorie</h4>
                {stockHealth.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="flex-1 text-sm font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value} produits</span>
                    <span className="text-xs text-gray-400">
                      ({products.length > 0 ? Math.round(item.value / products.length * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABC Analysis */}
          {!loading && activeTab === "abc" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center">
                  Classification ABC
                  <InfoTooltip text="Méthode Pareto : Classe A = 20% des produits générant ~80% de la valeur. Classe B = 30% intermédiaires. Classe C = 50% restants à faible valeur." />
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Basée sur la valeur (prix d'achat × stock)
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={abcStats} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" tickFormatter={(v) => `${v} prods`} />
                      <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 11 }} />
                      <Tooltip
                        formatter={(value, _name, props: any) => [
                          `${value} produits (${props.payload?.valuePct ?? 0}% de la valeur)`,
                          "Nombre de produits",
                        ]}
                      />
                      <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                        {abcStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Détail par classe</h4>
                {abcStats.map((item) => (
                  <div key={item.name} className="p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-sm font-bold text-gray-800">{item.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span><strong>{item.count}</strong> produits</span>
                      <span><strong>{item.valuePct}%</strong> de la valeur totale</span>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-400 mt-2">
                  💡 Concentrez vos efforts sur la Classe A pour maximiser l'impact sur votre trésorerie.
                </p>
              </div>
            </div>
          )}

          {/* Critical Risks */}
          {!loading && activeTab === "risks" && (
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center">
                Produits à risque critique
                <InfoTooltip text="Produits dont le stock est inférieur à 15 unités, triés par prix décroissant. Ce sont les produits dont la rupture aurait le plus grand impact financier." />
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Articles de haute valeur presque épuisés — commandez dès maintenant
              </p>

              {riskProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <FiCheck className="w-12 h-12 mb-3 text-green-400" />
                  <p className="text-sm font-medium text-green-600">Aucun risque critique détecté</p>
                  <p className="text-xs text-gray-400 mt-1">Tous les produits sont en stock suffisant.</p>
                </div>
              ) : (
                <div className="overflow-hidden border border-gray-100 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Produit</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Catégorie</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Prix d'achat</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Stock restant</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Valeur à risque</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {riskProducts.map((p) => {
                        const urgency = p.stock_quantity === 0 ? "Rupture" : p.stock_quantity < 5 ? "Critique" : "Faible";
                        const urgencyColor =
                          p.stock_quantity === 0
                            ? "bg-rose-100 text-rose-700"
                            : p.stock_quantity < 5
                            ? "bg-orange-100 text-orange-700"
                            : "bg-amber-100 text-amber-700";
                        return (
                          <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3">
                              <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                              <p className="text-xs text-gray-400">ID: {p.id}</p>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{p.category || "—"}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                              {formatCurrency(p.buying_price)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${urgencyColor}`}>
                                  {urgency}
                                </span>
                                <div className="flex items-center gap-1 text-rose-600">
                                  <FiAlertTriangle className="w-3.5 h-3.5" />
                                  <span className="text-sm font-bold">{p.stock_quantity}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                              {formatCurrency(p.buying_price * p.stock_quantity)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}