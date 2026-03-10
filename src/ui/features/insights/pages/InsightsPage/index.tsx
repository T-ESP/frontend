import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageLayout from "@/ui/components/layouts/PageLayout";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from "recharts";
import {
  FiAlertTriangle,
  FiActivity
} from "react-icons/fi"; // Switched to Feather icons (fi) consistent with your imports
import { productService } from "@/infrastructure/api/services/productService";
import type { Product } from "@/domain/models/Product";
import { KpiCard } from "@/ui/components/common/KpiCard";

// Colors for charts
// Colors for charts (variants of primary purple)
const COLORS = {
  // ABC Analysis
  A: "#362a49", // Primary Dark
  B: "#644d85", // Primary
  C: "#a480d1", // Primary Light

  // Stock Health
  stockout: "#1d162a", // Deepest
  low: "#4d3c67",      // Deep
  healthy: "#8b65bc",  // Medium 
  overstock: "#d7bff2" // Soft
};

export default function InsightsPage() {
  const { t } = useTranslation();
  // State for Real-Time Calculated Insights
  const [stockHealth, setStockHealth] = useState<any[]>([]);
  const [abcStats, setAbcStats] = useState<any[]>([]);
  const [riskProducts, setRiskProducts] = useState<Product[]>([]);
  const [globalStats, setGlobalStats] = useState({
    totalValue: 0,
    stockoutCount: 0,
    overstockCount: 0,
    turnoverRate: 4.2 // Mocked for now, implies calculation from sales/stock
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      // Fetch all products to perform client-side aggregation
      // In a real huge app, the backend should provide /analytics/summary endpoints
      const products = await productService.getAll();

      processStockHealth(products);
      processABCAnalysis(products);
      identifyRisks(products);

    } catch (error) {
      console.error("Échec du chargement des analyses", error);
    }
  };

  // 1. Analyze Stock Levels (Based on your Backend /stocks logic)
  const processStockHealth = (products: Product[]) => {
    let stockout = 0;
    let low = 0;
    let healthy = 0;
    let overstock = 0;
    let totalVal = 0;

    products.forEach(p => {
      totalVal += p.buying_price * p.stock_quantity;

      if (p.stock_quantity === 0) stockout++;
      else if (p.stock_quantity < 10) low++; // Threshold example
      else if (p.stock_quantity > 100) overstock++; // Threshold example
      else healthy++;
    });

    setStockHealth([
      { name: t('insights.status.stockout'), value: stockout, color: COLORS.stockout },
      { name: t('insights.status.low'), value: low, color: COLORS.low },
      { name: t('insights.status.healthy'), value: healthy, color: COLORS.healthy },
      { name: t('insights.status.overstock'), value: overstock, color: COLORS.overstock },
    ]);

    setGlobalStats(prev => ({
      ...prev,
      totalValue: totalVal,
      stockoutCount: stockout,
      overstockCount: overstock
    }));
  };

  // 2. Simulate ABC Analysis (Usually based on Revenue, here simplified by Price)
  const processABCAnalysis = (products: Product[]) => {
    // Sort by value (Price * Stock)
    const sorted = [...products].sort((a, b) => (b.buying_price * b.stock_quantity) - (a.buying_price * a.stock_quantity));
    const totalItems = sorted.length;

    // A = Top 20%, B = Next 30%, C = Bottom 50%
    const countA = Math.floor(totalItems * 0.2);
    const countB = Math.floor(totalItems * 0.3);
    const countC = totalItems - countA - countB;

    setAbcStats([
      { name: t('insights.abc.class_a'), value: countA, color: COLORS.A },
      { name: t('insights.abc.class_b'), value: countB, color: COLORS.B },
      { name: t('insights.abc.class_c'), value: countC, color: COLORS.C },
    ]);
  };

  // 3. Identify Top Risks (For the Risk Table)
  const identifyRisks = (products: Product[]) => {
    // Products that are low stock AND expensive (High impact risk)
    const risks = products
      .filter(p => p.stock_quantity < 15)
      .sort((a, b) => b.buying_price - a.buying_price)
      .slice(0, 5);
    setRiskProducts(risks);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <PageLayout
      title={t('insights.title')}
      subtitle={t('insights.subtitle')}
      icon={<FiActivity className="text-purple-600 w-7 h-7" />}
    >
      {/* 1. Global Inventory KPIs */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={t('insights.kpi.inventory_value')}
          value={formatCurrency(globalStats.totalValue)}
          color="primary"
        />
        <KpiCard
          label={t('insights.kpi.turnover_rate')}
          value={`${globalStats.turnoverRate}x`}
          color="primary"
        />
        <KpiCard
          label={t('insights.kpi.stockout_risk')}
          value={globalStats.stockoutCount.toString()}
          color="primary"
        />
        <KpiCard
          label={t('insights.kpi.overstock_alerts')}
          value={globalStats.overstockCount.toString()}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">

        {/* 2. Stock Health Distribution (Pie Chart) */}
        <div className="flex flex-col p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t('insights.charts.health_title')}</h3>
            <p className="text-sm text-gray-500">{t('insights.charts.health_subtitle')}</p>
          </div>
          <div className="flex-1 min-h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockHealth}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stockHealth.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. ABC Analysis (Bar Chart) */}
        <div className="flex flex-col p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t('insights.charts.abc_title')}</h3>
            <p className="text-sm text-gray-500">{t('insights.charts.abc_subtitle')}</p>
          </div>
          <div className="flex-1 min-h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={abcStats} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {abcStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-center text-gray-500">
            {t('insights.charts.abc_description')}
          </div>
        </div>

        {/* 4. Actionable Risks (Table) */}
        <div className="flex flex-col bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t('insights.risks.title')}</h3>
              <p className="text-sm text-gray-500">{t('insights.risks.subtitle')}</p>
            </div>
            <FiActivity className="text-rose-500" />
          </div>
          <div className="flex-1 p-2 overflow-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-50">
                {riskProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 text-rose-600">
                        <FiAlertTriangle size={14} />
                        <span className="text-sm font-bold">{t('insights.risks.remaining', { count: p.stock_quantity })}</span>
                      </div>
                      <p className="text-xs text-gray-400">{t('insights.risks.order_now')}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button className="w-full text-sm font-medium text-center text-primary hover:text-primary-plus">
              {t('insights.risks.view_plan')}
            </button>
          </div>
        </div>

      </div>

      {/* 5. Supplier Reliability Section */}

    </PageLayout >
  );
}

// Cleaned up inline KpiCard since we now use the shared common component