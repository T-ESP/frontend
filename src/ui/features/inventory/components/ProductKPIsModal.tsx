import { useState, useEffect } from 'react';
import {
  X, TrendingUp, TrendingDown, AlertTriangle,
  BarChart3, DollarSign, Package, RefreshCw,
  Activity, Truck, Zap, Target, PieChart,
  ChevronRight
} from 'lucide-react';
import { productKpisService } from '@/infrastructure/api/services/productKpisService';
import type {
  PricingMarginKPI,
  StockAvailabilityKPI,
  SalesRotationKPI,
  ProfitabilityKPI,
  RestockKPI,
  PredictionsAlertsKPI,
  ScoringClassificationKPI,
  ComparativeKPI,
  PriceEvolutionKPI,
} from '@/infrastructure/api/services/productKpisService';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useTranslation } from "react-i18next";

interface ProductKPIsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

type TabType =
  | 'overview' | 'pricing' | 'stock' | 'sales' | 'profitability'
  | 'restock' | 'predictions' | 'classification' | 'comparative';

export function ProductKPIsModal({ isOpen, onClose, productId, productName }: ProductKPIsModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<{
    pricingMargin?: PricingMarginKPI;
    stockAvailability?: StockAvailabilityKPI;
    salesRotation?: SalesRotationKPI;
    profitability?: ProfitabilityKPI;
    restock?: RestockKPI;
    predictionsAlerts?: PredictionsAlertsKPI;
    scoringClassification?: ScoringClassificationKPI;
    comparative?: ComparativeKPI;
    priceEvolution?: PriceEvolutionKPI;
  }>({});

  useEffect(() => {
    if (isOpen && productId) loadKPIs();
  }, [isOpen, productId]);

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const allKpis = await productKpisService.getAllKPIs(productId);
      setKpis(allKpis);
    } catch (err) {
      setError(t('inventory.kpi_modal.failed_load'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // --- UI COMPONENTS ---

  const tabs = [
    { id: 'overview', label: t('inventory.kpi_modal.tabs.overview'), icon: Activity, desc: t('inventory.kpi_modal.tab_desc.overview') },
    { id: 'pricing', label: t('inventory.kpi_modal.tabs.pricing'), icon: DollarSign, desc: t('inventory.kpi_modal.tab_desc.pricing') },
    { id: 'stock', label: t('inventory.kpi_modal.tabs.stock'), icon: Package, desc: t('inventory.kpi_modal.tab_desc.stock') },
    { id: 'sales', label: t('inventory.kpi_modal.tabs.sales'), icon: BarChart3, desc: t('inventory.kpi_modal.tab_desc.sales') },
    { id: 'profitability', label: t('inventory.kpi_modal.tabs.profitability'), icon: PieChart, desc: t('inventory.kpi_modal.tab_desc.profitability') },
    { id: 'restock', label: t('inventory.kpi_modal.tabs.restock'), icon: Truck, desc: t('inventory.kpi_modal.tab_desc.restock') },
    { id: 'predictions', label: t('inventory.kpi_modal.tabs.predictions'), icon: Zap, desc: t('inventory.kpi_modal.tab_desc.predictions') },
    { id: 'classification', label: t('inventory.kpi_modal.tabs.classification'), icon: Target, desc: t('inventory.kpi_modal.tab_desc.classification') },
    { id: 'comparative', label: t('inventory.kpi_modal.tabs.comparative'), icon: RefreshCw, desc: t('inventory.kpi_modal.tab_desc.comparative') },
  ];

  const formatCurrency = (val?: number | null) => val != null ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val) : 'N/A';
  const formatPercent = (val?: number | null) => val != null ? `${val.toFixed(1)}%` : 'N/A';
  const formatNum = (val?: number | null) => val != null ? val.toLocaleString() : 'N/A';

  const StatusBadge = ({ status }: { status: string }) => {
    const getStyles = () => {
      // Map abstract statuses to visual styles
      if (['critical', 'stockout', 'below', 'C', 'Z'].includes(status)) return 'bg-rose-50 text-rose-700 ring-rose-200';
      if (['warning', 'low', 'low_stock', 'average', 'B', 'Y'].includes(status)) return 'bg-amber-50 text-amber-700 ring-amber-200';
      if (['optimal', 'good', 'fast', 'above', 'star', 'A', 'X'].includes(status)) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      if (['excess', 'high'].includes(status)) return 'bg-blue-50 text-blue-700 ring-blue-200';
      return 'bg-slate-50 text-slate-700 ring-slate-200';
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getStyles()} uppercase tracking-wide`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  const TrendIndicator = ({ value }: { value: 'increasing' | 'stable' | 'decreasing' }) => {
    if (value === 'increasing') return <div className="flex items-center text-emerald-600 text-xs font-medium"><TrendingUp className="w-3 h-3 mr-1" /> +Inc</div>;
    if (value === 'decreasing') return <div className="flex items-center text-rose-600 text-xs font-medium"><TrendingDown className="w-3 h-3 mr-1" /> -Dec</div>;
    return <div className="flex items-center text-slate-500 text-xs font-medium"><div className="w-3 h-0.5 bg-slate-400 mr-1" /> Stable</div>;
  };

  const StatCard = ({ title, value, subtext, icon: Icon, trend, alert }: any) => (
    <div className="group relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
          {(subtext || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {trend && <TrendIndicator value={trend} />}
              {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
            </div>
          )}
        </div>
        <div className={`p-2 rounded-xl ${alert ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600'} transition-colors`}>
          {Icon ? <Icon size={20} /> : <Activity size={20} />}
        </div>
      </div>
      {/* Decorative gradient background opacity */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent rounded-full opacity-50 blur-2xl group-hover:from-blue-100 transition-all" />
    </div>
  );

  const SectionHeader = ({ title, desc }: { title: string, desc: string }) => (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{desc}</p>
    </div>
  );

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="text-xs text-slate-500 mb-1">{new Date(label).toLocaleDateString()}</p>
          <p className="text-sm font-bold text-slate-900">
            {formatter ? formatter(payload[0].value) : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-7xl h-[85vh] flex overflow-hidden border border-slate-200">

        {/* SIDEBAR NAVIGATION */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-3 shadow-blue-200 shadow-lg">
              <Package size={20} />
            </div>
            <h2 className="font-bold text-slate-900 truncate" title={productName}>{productName}</h2>
            <p className="text-xs text-slate-500">ID: #{productId}</p>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${isActive
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/50 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                  <div>
                    <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-slate-700'}`}>{tab.label}</p>
                    <p className={`text-[10px] ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>{tab.desc}</p>
                  </div>
                  {isActive && <ChevronRight size={14} className="ml-auto text-blue-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
          {/* Header Actions */}
          <div className="h-16 flex items-center justify-between px-8 border-b border-slate-200 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{t('inventory.kpi_modal.analytics')}</span>
              <ChevronRight size={14} />
              <span className="font-medium text-slate-900 capitalize">{activeTab}</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" />
                <p>Gathering insights...</p>
              </div>
            ) : error ? (
              <div className="h-full flex flex-col items-center justify-center text-rose-500">
                <AlertTriangle size={48} className="mb-4 opacity-50" />
                <p>{error}</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-8">

                {/* --- OVERVIEW TAB --- */}
                {activeTab === 'overview' && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <SectionHeader title={t('inventory.kpi_modal.sections.overview')} desc={t('inventory.kpi_modal.sections.overview_desc')} />

                    {/* Hero Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.global_score')}
                        value={`${formatNum(kpis.scoringClassification?.global_score)}/100`}
                        icon={Target}
                        alert={kpis.scoringClassification?.global_score! < 50}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.margin_rate')}
                        value={formatPercent(kpis.pricingMargin?.margin_rate)}
                        icon={DollarSign}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.current_stock')}
                        value={kpis.stockAvailability?.current_stock}
                        subtext={kpis.stockAvailability?.product_status.replace('_', ' ')}
                        icon={Package}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.turnover_rate')}
                        value={formatNum(kpis.salesRotation?.stock_turnover_rate)}
                        trend={kpis.salesRotation?.sales_trend}
                        icon={RefreshCw}
                      />
                    </div>

                    {/* Main Alert Section */}
                    {kpis.predictionsAlerts && (
                      <div className={`flex items-start gap-4 p-6 rounded-2xl border ${kpis.predictionsAlerts.alert_status === 'stockout' ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-200'
                        }`}>
                        <div className={`p-3 rounded-xl ${kpis.predictionsAlerts.alert_status === 'stockout' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                          <Zap size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">AI Recommendation</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-slate-600">Current Status:</span>
                            <StatusBadge status={kpis.predictionsAlerts.alert_status} />
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-8">
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider">Reorder Qty</p>
                              <p className="text-xl font-bold text-slate-900">{kpis.predictionsAlerts.optimal_reorder_quantity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider">Reorder Point</p>
                              <p className="text-xl font-bold text-slate-900">{kpis.predictionsAlerts.optimal_reorder_point}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 uppercase tracking-wider">Days Coverage</p>
                              <p className="text-xl font-bold text-slate-900">{formatNum(kpis.predictionsAlerts.days_of_coverage)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- PRICING TAB --- */}
                {activeTab === 'pricing' && kpis.pricingMargin && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title={t('inventory.kpi_modal.sections.pricing')} desc={t('inventory.kpi_modal.sections.pricing_desc')} />

                    <div className="grid grid-cols-3 gap-5">
                      <StatCard title={t('inventory.kpi_modal.metrics.selling_price')} value={formatCurrency(kpis.pricingMargin.current_selling_price)} icon={DollarSign} />
                      <StatCard title={t('inventory.kpi_modal.metrics.buying_price')} value={formatCurrency(kpis.pricingMargin.current_buying_price)} icon={DollarSign} />
                      <StatCard title={t('inventory.kpi_modal.metrics.margin')} value={formatPercent(kpis.pricingMargin.margin_rate)} icon={PieChart} />
                    </div>

                    {kpis.priceEvolution && (
                      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="font-bold text-slate-900">Price Evolution</h3>
                          {(kpis.priceEvolution.selling_price_history.length > 0 || kpis.priceEvolution.buying_price_history.length > 0) && (
                            <div className="flex gap-4 text-sm">
                              {kpis.priceEvolution.selling_price_history.length > 0 && (
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Selling</div>
                              )}
                              {kpis.priceEvolution.buying_price_history.length > 0 && (
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500" /> Buying</div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="h-[300px]">
                          {(kpis.priceEvolution.selling_price_history.length === 0 && kpis.priceEvolution.buying_price_history.length === 0) ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                              <Package size={48} className="mb-4 opacity-50" />
                              <p className="text-lg font-medium">No Price History Available</p>
                              <p className="text-sm mt-2">Price changes will appear here once recorded</p>
                            </div>
                          ) : (
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={
                                kpis.priceEvolution.selling_price_history.length > 0
                                  ? kpis.priceEvolution.selling_price_history
                                  : kpis.priceEvolution.buying_price_history
                              }>
                                <defs>
                                  <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                  </linearGradient>
                                  <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => new Date(v).toLocaleDateString()} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                                {kpis.priceEvolution.selling_price_history.length > 0 && (
                                  <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSell)" />
                                )}
                                {kpis.priceEvolution.buying_price_history.length > 0 && kpis.priceEvolution.selling_price_history.length === 0 && (
                                  <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBuy)" />
                                )}
                              </AreaChart>
                            </ResponsiveContainer>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* --- STOCK TAB --- */}
                {activeTab === 'stock' && kpis.stockAvailability && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title={t('inventory.kpi_modal.sections.stock')} desc={t('inventory.kpi_modal.sections.stock_desc')} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Status Card */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Package className="text-slate-400" size={20} /> Current Status
                        </h3>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl mb-4">
                          <span className="text-slate-500 font-medium">Availability</span>
                          <StatusBadge status={kpis.stockAvailability.product_status} />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-slate-500">In Hand</span>
                            <span className="font-bold text-slate-900 text-lg">{kpis.stockAvailability.current_stock}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Safety Level</span>
                            <span className="font-bold text-amber-600">{kpis.stockAvailability.safety_stock_recommended}</span>
                          </div>
                        </div>
                      </div>

                      {/* Stockout Visual */}
                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <AlertTriangle className="text-slate-400" size={20} /> Stockout Analysis
                        </h3>
                        <div className="text-center py-4">
                          <div className="text-4xl font-bold text-slate-900 mb-1">{formatPercent(kpis.stockAvailability.stockout_rate)}</div>
                          <p className="text-sm text-slate-500">Historical Stockout Rate</p>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(kpis.stockAvailability.stockout_rate ?? 0, 100)}%` }} />
                        </div>
                        <div className="mt-6 flex justify-between text-sm">
                          <div>
                            <p className="text-slate-400">Occurrences</p>
                            <p className="font-medium text-slate-900">{kpis.stockAvailability.stockout_count} times</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400">Avg Duration</p>
                            <p className="font-medium text-slate-900">{kpis.stockAvailability.avg_stockout_duration_days?.toFixed(1)} days</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- CLASSIFICATION TAB --- */}
                {activeTab === 'classification' && kpis.scoringClassification && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title={t('inventory.kpi_modal.sections.classification')} desc={t('inventory.kpi_modal.sections.classification_desc')} />

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-8 rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                          <p className="text-indigo-100 font-medium mb-1">ABC Class</p>
                          <h2 className="text-6xl font-bold">{kpis.scoringClassification.abc_classification}</h2>
                          <div className="mt-8 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                            <Activity size={16} />
                            <span className="font-medium">{kpis.scoringClassification.performance_category} Performance</span>
                          </div>
                        </div>
                        <Target className="absolute -bottom-8 -right-8 w-48 h-48 text-white/10" />
                      </div>

                      <div className="bg-white p-8 rounded-3xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6">Score Breakdown</h3>
                        <div className="space-y-6">
                          {['Popularity', 'Profitability', 'Reliability'].map((metric) => {
                            const key = `${metric.toLowerCase()}_score` as keyof ScoringClassificationKPI;
                            const val = kpis.scoringClassification![key] as number;
                            return (
                              <div key={metric}>
                                <div className="flex justify-between text-sm mb-2">
                                  <span className="text-slate-600">{metric}</span>
                                  <span className="font-bold text-slate-900">{val}/100</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5">
                                  <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${val}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- SALES TAB --- */}
                {activeTab === 'sales' && kpis.salesRotation && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title={t('inventory.kpi_modal.sections.sales')} desc={t('inventory.kpi_modal.sections.sales_desc')} />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.turnover_rate')}
                        value={formatNum(kpis.salesRotation.stock_turnover_rate)}
                        trend={kpis.salesRotation.sales_trend as 'increasing' | 'stable' | 'decreasing'}
                        icon={RefreshCw}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.sales_velocity')}
                        value={formatNum(kpis.salesRotation.sales_velocity_per_day)}
                        subtext={t('inventory.kpi_modal.labels.per_day')}
                        icon={BarChart3}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.total_sold')}
                        value={kpis.salesRotation.quantity_sold}
                        subtext={`${kpis.salesRotation.order_count} ${t('inventory.kpi_modal.labels.orders')}`}
                        icon={Activity}
                      />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="font-bold text-slate-900">Rotation Analysis</h3>
                          <p className="text-sm text-slate-500">Stock movement velocity</p>
                        </div>
                        <StatusBadge status={kpis.salesRotation.sales_trend} />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-500">Avg Storage Duration</span>
                            <span className="font-bold text-slate-900">{formatNum(kpis.salesRotation.avg_storage_duration_days)} days</span>
                          </div>
                          <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-500">Avg per Order</span>
                            <span className="font-bold text-slate-900">{formatNum(kpis.salesRotation.avg_quantity_per_order)}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-500">Revenue</span>
                            <span className="font-bold text-slate-900">{formatCurrency(kpis.salesRotation.revenue)}</span>
                          </div>
                          <div className="flex justify-between p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-500">Sales Trend</span>
                            <TrendIndicator value={kpis.salesRotation.sales_trend as 'increasing' | 'stable' | 'decreasing'} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- PROFITABILITY TAB --- */}
                {activeTab === 'profitability' && kpis.profitability && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title={t('inventory.kpi_modal.sections.profitability')} desc={t('inventory.kpi_modal.sections.profitability_desc')} />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.roi')}
                        value={formatPercent(kpis.profitability.roi)}
                        icon={TrendingUp}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.total_profit')}
                        value={formatCurrency(kpis.profitability.total_profit)}
                        icon={DollarSign}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.avg_profit_sale')}
                        value={formatCurrency(kpis.profitability.avg_profit_per_sale)}
                        icon={PieChart}
                      />
                      <StatCard
                        title={t('inventory.kpi_modal.metrics.revenue_percent')}
                        value={formatPercent(kpis.profitability.contribution_to_total_revenue_percent)}
                        icon={Target}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6">Profit Metrics</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <span className="text-slate-600">Total Profit</span>
                            <span className="font-bold text-emerald-700 text-xl">{formatCurrency(kpis.profitability.total_profit)}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                            <span className="text-slate-600">ROI</span>
                            <span className="font-bold text-slate-900 text-xl">{formatPercent(kpis.profitability.roi)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6">Contribution Analysis</h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-600">Revenue Share</span>
                              <span className="font-bold text-slate-900">{formatPercent(kpis.profitability.contribution_to_total_revenue_percent)}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                              <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(kpis.profitability.contribution_to_total_revenue_percent ?? 0, 100)}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-slate-600">Profit Share</span>
                              <span className="font-bold text-slate-900">{formatPercent(kpis.profitability.contribution_to_total_profit_percent)}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3">
                              <div className="bg-emerald-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(kpis.profitability.contribution_to_total_profit_percent ?? 0, 100)}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- RESTOCK TAB --- */}
                {activeTab === 'restock' && kpis.restock && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title="Restock Analysis" desc="Supply chain and reorder recommendations" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <StatCard
                        title="Restock Count"
                        value={kpis.restock.restock_count}
                        icon={Truck}
                      />
                      <StatCard
                        title="Avg Quantity"
                        value={formatNum(kpis.restock.avg_quantity_per_restock)}
                        icon={AlertTriangle}
                      />
                      <StatCard
                        title="Avg Delay"
                        value={`${formatNum(kpis.restock.avg_delivery_delay_days)} days`}
                        icon={Package}
                      />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                      <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Truck size={20} className="text-slate-400" /> {t('inventory.kpi_modal.metrics.supply_chain')}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Restocks</p>
                          <p className="text-2xl font-bold text-slate-900">{kpis.restock.restock_count}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t('inventory.kpi_modal.metrics.avg_quantity')}</p>
                          <p className="text-2xl font-bold text-slate-900">{formatNum(kpis.restock.avg_quantity_per_restock)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t('inventory.kpi_modal.metrics.total_cost')}</p>
                          <p className="text-2xl font-bold text-slate-900">{formatCurrency(kpis.restock.total_restock_cost)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t('inventory.kpi_modal.metrics.reception_rate')}</p>
                          <p className="text-2xl font-bold text-slate-900">{formatPercent(kpis.restock.reception_rate)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                          <Target size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 mb-2">{t('inventory.kpi_modal.metrics.optimal_strategy')}</h3>
                          <p className="text-slate-600 mb-4">Based on historical data and supply chain analysis</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/60 p-4 rounded-xl">
                              <p className="text-sm text-slate-600">{t('inventory.kpi_modal.metrics.frequency')}</p>
                              <p className="text-xl font-bold text-slate-900">Every {formatNum(kpis.restock.restock_frequency_days)} {t('inventory.kpi_modal.labels.days')}</p>
                            </div>
                            <div className="bg-white/60 p-4 rounded-xl">
                              <p className="text-sm text-slate-600">{t('inventory.kpi_modal.metrics.avg_cost')}</p>
                              <p className="text-xl font-bold text-slate-900">{formatCurrency(kpis.restock.avg_restock_cost)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- PREDICTIONS TAB --- */}
                {activeTab === 'predictions' && kpis.predictionsAlerts && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title="AI Predictions" desc="Forecasts and intelligent recommendations" />

                    <div className="bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 text-white p-8 rounded-3xl relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Zap size={24} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{t('inventory.kpi_modal.metrics.alert_status')}</h3>
                            <p className="text-violet-100">Current prediction model</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                            <p className="text-violet-100 text-sm mb-2">Status</p>
                            <StatusBadge status={kpis.predictionsAlerts.alert_status} />
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                            <p className="text-violet-100 text-sm mb-2">{t('inventory.kpi_modal.metrics.days_coverage')}</p>
                            <p className="text-3xl font-bold">{formatNum(kpis.predictionsAlerts.days_of_coverage)}</p>
                          </div>
                          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/20">
                            <p className="text-violet-100 text-sm mb-2">{t('inventory.kpi_modal.metrics.stockout_date')}</p>
                            <p className="text-lg font-bold">{kpis.predictionsAlerts.estimated_stockout_date ? new Date(kpis.predictionsAlerts.estimated_stockout_date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                      <Activity className="absolute -bottom-8 -right-8 w-56 h-56 text-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6">{t('inventory.kpi_modal.metrics.reorder_recs')}</h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div>
                              <p className="text-sm text-slate-600">{t('inventory.kpi_modal.metrics.optimal_qty')}</p>
                              <p className="text-xs text-slate-400">Based on forecast</p>
                            </div>
                            <span className="text-2xl font-bold text-blue-600">{kpis.predictionsAlerts.optimal_reorder_quantity}</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <div>
                              <p className="text-sm text-slate-600">{t('inventory.kpi_modal.metrics.reorder_point')}</p>
                              <p className="text-xs text-slate-400">Trigger threshold</p>
                            </div>
                            <span className="text-2xl font-bold text-amber-600">{kpis.predictionsAlerts.optimal_reorder_point}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6">{t('inventory.kpi_modal.metrics.coverage_analysis')}</h3>
                        <div className="text-center py-8">
                          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-4">
                            <div className="text-center">
                              <p className="text-4xl font-bold text-slate-900">{formatNum(kpis.predictionsAlerts.days_of_coverage)}</p>
                              <p className="text-xs text-slate-500 mt-1">{t('inventory.kpi_modal.labels.days')}</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600">Current stock coverage</p>
                          <div className="mt-4 inline-flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            AI Model Active
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- COMPARATIVE TAB --- */}
                {activeTab === 'comparative' && kpis.comparative && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SectionHeader title="Market Position" desc="Competitive analysis and benchmarking" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <StatCard
                        title="vs Category Avg"
                        value={formatPercent(kpis.comparative.performance_vs_category_percent)}
                        trend={(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? 'increasing' : 'decreasing'}
                        icon={Activity}
                      />
                      <StatCard
                        title="Category Rank"
                        value={`#${kpis.comparative.rank_in_category}`}
                        subtext="Market position"
                        icon={Target}
                      />
                      <StatCard
                        title="Market Share"
                        value={formatPercent(kpis.comparative.share_in_category_percent)}
                        icon={PieChart}
                      />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-slate-200">
                      <h3 className="font-bold text-slate-900 mb-6">{t('inventory.kpi_modal.metrics.competitive_position')}</h3>
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-slate-600 mb-4">Performance vs Category</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 bg-slate-100 rounded-full h-3">
                              <div className="bg-blue-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(Math.abs(kpis.comparative.performance_vs_category_percent ?? 0), 100)}%` }} />
                            </div>
                            <span className="text-lg font-bold text-slate-900 w-24 text-right">{formatPercent(kpis.comparative.performance_vs_category_percent)}</span>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-slate-600 mb-4">{t('inventory.kpi_modal.metrics.vs_supplier')}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 bg-slate-100 rounded-full h-3">
                              <div className="bg-emerald-600 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(Math.abs(kpis.comparative.performance_vs_supplier_percent ?? 0), 100)}%` }} />
                            </div>
                            <span className="text-lg font-bold text-slate-900 w-24 text-right">{formatPercent(kpis.comparative.performance_vs_supplier_percent)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <TrendingUp size={20} />
                          </div>
                          <h4 className="font-bold text-slate-900">{t('inventory.kpi_modal.metrics.performance')} vs Average</h4>
                        </div>
                        <p className="text-4xl font-bold text-emerald-600 mb-2">
                          {(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? '+' : ''}{formatPercent(kpis.comparative.performance_vs_category_percent)}
                        </p>
                        <p className="text-sm text-slate-600">
                          {(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? 'Above' : 'Below'} category average
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Target size={20} />
                          </div>
                          <h4 className="font-bold text-slate-900">Market Share</h4>
                        </div>
                        <p className="text-4xl font-bold text-blue-600 mb-2">{formatPercent(kpis.comparative.share_in_category_percent)}</p>
                        <p className="text-sm text-slate-600">
                          Rank #{kpis.comparative.rank_in_category} in category
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}