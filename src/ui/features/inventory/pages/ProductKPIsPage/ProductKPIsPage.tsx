import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, AlertTriangle,
  BarChart3, DollarSign, Package, RefreshCw,
  Activity, Truck, Zap, Target, PieChart,
  ArrowLeft,
} from 'lucide-react';
import { productKpisService } from '@/infrastructure/api/services/productKpisService';
import { productService } from '@/infrastructure/api/services/productService';
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
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import PageLayout from '@/ui/components/layouts/PageLayout';
import { InfoTip } from '@/ui/components/common/InfoTip/InfoTip';

export default function ProductKPIsPage() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'fr-FR';
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id ?? '0');

  const [productName, setProductName] = useState('');
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
    if (productId) loadData();
  }, [productId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [product, allKpis] = await Promise.all([
        productService.getById(productId),
        productKpisService.getAllKPIs(productId),
      ]);
      if (product) setProductName(product.name);
      setKpis(allKpis);
    } catch {
      setError(t('inventory.kpi_modal.failed_load'));
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const formatCurrency = (val?: number | null) =>
    val != null ? new Intl.NumberFormat(currentLang, { style: 'currency', currency: 'EUR' }).format(val) : 'N/A';
  const formatPercent = (val?: number | null) => val != null ? `${val.toFixed(1)}%` : 'N/A';
  const formatNum = (val?: number | null) => val != null ? val.toLocaleString(currentLang) : 'N/A';
  const formatInt = (val?: number | null) => val != null ? Math.round(val).toLocaleString(currentLang) : 'N/A';

  const StatusBadge = ({ status }: { status: string }) => {
    const getStyles = () => {
      if (['critical', 'stockout', 'below', 'C', 'Z'].includes(status)) return 'bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-200';
      if (['warning', 'low', 'low_stock', 'average', 'B', 'Y'].includes(status)) return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-200';
      if (['optimal', 'good', 'fast', 'above', 'star', 'A', 'X'].includes(status)) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-200';
      if (['excess', 'high'].includes(status)) return 'bg-accent text-primary ring-primary/20';
      return 'bg-muted/40 text-foreground ring-border';
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${getStyles()} uppercase tracking-wide`}>
        {t(`inventory.kpi_modal.status_values.${status}`, status.replace(/_/g, ' '))}
      </span>
    );
  };

  const TrendIndicator = ({ value }: { value: 'increasing' | 'stable' | 'decreasing' }) => {
    if (value === 'increasing') return <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400"><TrendingUp className="w-3 h-3 mr-1" />{t('inventory.kpi_modal.trends.inc')}</span>;
    if (value === 'decreasing') return <span className="inline-flex items-center text-xs font-medium text-rose-600 dark:text-rose-400"><TrendingDown className="w-3 h-3 mr-1" />{t('inventory.kpi_modal.trends.dec')}</span>;
    return <span className="inline-flex items-center text-xs font-medium text-muted-foreground"><span className="w-3 h-0.5 bg-muted-foreground mr-1" />{t('inventory.kpi_modal.trends.stable')}</span>;
  };

  const StatCard = ({ title, value, subtext, icon: Icon, trend, alert }: any) => (
    <div className={`flex flex-col justify-between p-5 bg-card border rounded-xl ${alert ? 'border-rose-500/30' : 'border-border'}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {Icon && (
          <Icon
            size={16}
            className={alert ? 'text-rose-500' : 'text-muted-foreground'}
            aria-hidden
          />
        )}
      </div>
      <p className={`mt-4 text-2xl font-semibold tracking-tight tabular-nums ${alert ? 'text-rose-600 dark:text-rose-400' : 'text-foreground'}`}>
        {value}
      </p>
      {(subtext || trend) && (
        <div className="flex items-center gap-2 mt-2 text-[13px]">
          {trend && <TrendIndicator value={trend} />}
          {subtext && <span className="text-muted-foreground">{subtext}</span>}
        </div>
      )}
    </div>
  );

  const SectionTitle = ({ title, desc, infoKey }: { icon?: any; title: string; desc: string; infoKey?: string }) => (
    <div className="mb-5">
      <h2 className="flex items-center text-base font-semibold text-foreground">
        {title}
        {infoKey && (
          <InfoTip
            what={t(`inventory.kpi_modal.info.${infoKey}.what`)}
            tip={t(`inventory.kpi_modal.info.${infoKey}.tip`)}
          />
        )}
      </h2>
      <p className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
    </div>
  );

  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-card border rounded-lg shadow-lg border-border">
          <p className="mb-1 text-xs text-muted-foreground">{new Date(label).toLocaleDateString(currentLang)}</p>
          <p className="text-sm font-bold text-foreground">
            {formatter ? formatter(payload[0].value) : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const backButton = (
    <button
      onClick={() => navigate('/inventory')}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      <ArrowLeft size={16} />
      {t('inventory.title', 'Inventaire')}
    </button>
  );

  if (loading) {
    return (
      <PageLayout title={productName || '—'} actions={backButton}>
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground/70">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <div className="w-3 h-3 delay-75 bg-primary rounded-full animate-pulse" />
            <div className="w-3 h-3 delay-150 bg-primary rounded-full animate-pulse" />
          </div>
          <p>{t('inventory.kpi_modal.loading', 'Chargement des données...')}</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={productName || '—'} actions={backButton}>
        <div className="flex flex-col items-center justify-center py-32 text-rose-500">
          <AlertTriangle size={48} className="mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={productName}
      subtitle={`ID: #${productId}`}
      actions={backButton}
    >
      <div className="space-y-10 w-full">

        {/* OVERVIEW */}
        <section>
          <SectionTitle icon={Activity} title={t('inventory.kpi_modal.sections.overview')} desc={t('inventory.kpi_modal.sections.overview_desc')} infoKey="overview" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatCard
              title={t('inventory.kpi_modal.metrics.global_score')}
              value={`${formatInt(kpis.scoringClassification?.global_score)}/100`}
              icon={Target}
              alert={(kpis.scoringClassification?.global_score ?? 100) < 50}
            />
            <StatCard
              title={t('inventory.kpi_modal.metrics.margin_rate')}
              value={formatPercent(kpis.pricingMargin?.margin_rate)}
              icon={DollarSign}
            />
            <StatCard
              title={t('inventory.kpi_modal.metrics.current_stock')}
              value={kpis.stockAvailability?.current_stock}
              subtext={kpis.stockAvailability?.product_status
                ? t(`inventory.kpi_modal.status_values.${kpis.stockAvailability.product_status.toLowerCase()}`, kpis.stockAvailability.product_status.replace('_', ' '))
                : undefined}
              icon={Package}
            />
            <StatCard
              title={t('inventory.kpi_modal.metrics.turnover_rate')}
              value={formatNum(kpis.salesRotation?.stock_turnover_rate)}
              trend={kpis.salesRotation?.sales_trend}
              icon={RefreshCw}
            />
          </div>
          {kpis.predictionsAlerts && (
            <div className={`p-6 bg-card border rounded-xl ${kpis.predictionsAlerts.alert_status === 'stockout' ? 'border-rose-500/30' : 'border-border'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${kpis.predictionsAlerts.alert_status === 'stockout' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-accent text-primary'}`}>
                  <Zap size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground">{t('inventory.kpi_modal.ai_recommendation')}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.current_status')}</span>
                    <StatusBadge status={kpis.predictionsAlerts.alert_status} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg bg-muted/30 border-border">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.reorder_qty')}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{kpis.predictionsAlerts.optimal_reorder_quantity}</p>
                </div>
                <div className="p-3 border rounded-lg bg-muted/30 border-border">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.reorder_point')}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{kpis.predictionsAlerts.optimal_reorder_point}</p>
                </div>
                <div className="p-3 border rounded-lg bg-muted/30 border-border">
                  <p className="text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.days_coverage')}</p>
                  <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{formatInt(kpis.predictionsAlerts.days_of_coverage)}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <hr className="border-border" />

        {/* PRICING */}
        {kpis.pricingMargin && (
          <section>
            <SectionTitle icon={DollarSign} title={t('inventory.kpi_modal.sections.pricing')} desc={t('inventory.kpi_modal.sections.pricing_desc')} infoKey="pricing" />
            <div className="grid grid-cols-3 gap-5 mb-6">
              <StatCard title={t('inventory.kpi_modal.metrics.selling_price')} value={formatCurrency(kpis.pricingMargin.current_selling_price)} icon={DollarSign} />
              <StatCard title={t('inventory.kpi_modal.metrics.buying_price')} value={formatCurrency(kpis.pricingMargin.current_buying_price)} icon={DollarSign} />
              <StatCard title={t('inventory.kpi_modal.metrics.margin')} value={formatPercent(kpis.pricingMargin.margin_rate)} icon={PieChart} />
            </div>
            {kpis.priceEvolution && (
              <div className="p-6 bg-card border shadow-sm rounded-lg border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-foreground">{t('inventory.kpi_modal.metrics.price_evolution')}</h3>
                  <div className="flex gap-4 text-sm">
                    {kpis.priceEvolution.selling_price_history.length > 0 && (
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" />{t('inventory.kpi_modal.metrics.selling')}</div>
                    )}
                    {kpis.priceEvolution.buying_price_history.length > 0 && (
                      <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary" />{t('inventory.kpi_modal.metrics.buying')}</div>
                    )}
                  </div>
                </div>
                <div className="h-64">
                  {(kpis.priceEvolution.selling_price_history.length === 0 && kpis.priceEvolution.buying_price_history.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/70">
                      <Package size={40} className="mb-3 opacity-50" />
                      <p className="text-sm">{t('inventory.kpi_modal.metrics.no_price_history')}</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={kpis.priceEvolution.selling_price_history.length > 0 ? kpis.priceEvolution.selling_price_history : kpis.priceEvolution.buying_price_history}>
                        <defs>
                          <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => new Date(v).toLocaleDateString(currentLang)} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                        {kpis.priceEvolution.selling_price_history.length > 0 && (
                          <Area type="monotone" dataKey="price" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSell)" />
                        )}
                        {kpis.priceEvolution.buying_price_history.length > 0 && kpis.priceEvolution.selling_price_history.length === 0 && (
                          <Area type="monotone" dataKey="price" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBuy)" />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        <hr className="border-border" />

        {/* STOCK */}
        {kpis.stockAvailability && (
          <section>
            <SectionTitle icon={Package} title={t('inventory.kpi_modal.sections.stock')} desc={t('inventory.kpi_modal.sections.stock_desc')} infoKey="stock" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 bg-card border rounded-lg border-border">
                <h3 className="flex items-center gap-2 mb-4 font-bold text-foreground">
                  <Package className="text-muted-foreground/70" size={18} />{t('inventory.kpi_modal.metrics.current_status')}
                </h3>
                <div className="flex items-center justify-between p-4 mb-4 bg-muted/40 rounded-xl">
                  <span className="font-medium text-muted-foreground">{t('inventory.kpi_modal.metrics.availability')}</span>
                  <StatusBadge status={kpis.stockAvailability.product_status} />
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('inventory.kpi_modal.metrics.in_hand')}</span>
                    <span className="text-lg font-bold text-foreground">{kpis.stockAvailability.current_stock}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('inventory.kpi_modal.metrics.safety_level')}</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{kpis.stockAvailability.safety_stock_recommended}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card border rounded-lg border-border">
                <h3 className="flex items-center gap-2 mb-4 font-bold text-foreground">
                  <AlertTriangle className="text-muted-foreground/70" size={18} />{t('inventory.kpi_modal.metrics.stockout_analysis')}
                </h3>
                <div className="py-4 text-center">
                  <div className="mb-1 text-4xl font-bold text-foreground">{formatPercent(kpis.stockAvailability.stockout_rate)}</div>
                  <p className="text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.historical_rate')}</p>
                </div>
                <div className="w-full h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: `${Math.min(kpis.stockAvailability.stockout_rate ?? 0, 100)}%` }} />
                </div>
                <div className="flex justify-between mt-6 text-sm">
                  <div>
                    <p className="text-muted-foreground/70">{t('inventory.kpi_modal.metrics.occurrences')}</p>
                    <p className="font-medium text-foreground">{kpis.stockAvailability.stockout_count} {t('inventory.kpi_modal.labels.times')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground/70">{t('inventory.kpi_modal.metrics.avg_duration')}</p>
                    <p className="font-medium text-foreground">{formatInt(kpis.stockAvailability.avg_stockout_duration_days)} {t('inventory.kpi_modal.labels.days')}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <hr className="border-border" />

        {/* SALES */}
        {kpis.salesRotation && (
          <section>
            <SectionTitle icon={BarChart3} title={t('inventory.kpi_modal.sections.sales')} desc={t('inventory.kpi_modal.sections.sales_desc')} infoKey="sales" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-6">
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
            <div className="p-6 bg-card border rounded-lg border-border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground">{t('inventory.kpi_modal.metrics.rotation_analysis')}</h3>
                  <p className="text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.rotation_desc')}</p>
                </div>
                <StatusBadge status={kpis.salesRotation.sales_trend} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between p-4 bg-muted/40 rounded-xl">
                    <span className="text-muted-foreground">{t('inventory.kpi_modal.metrics.avg_storage')}</span>
                    <span className="font-bold text-foreground">{formatInt(kpis.salesRotation.avg_storage_duration_days)} {t('inventory.kpi_modal.labels.days')}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-muted/40 rounded-xl">
                    <span className="text-muted-foreground">{t('inventory.kpi_modal.metrics.avg_per_order')}</span>
                    <span className="font-bold text-foreground">{formatInt(kpis.salesRotation.avg_quantity_per_order)}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between p-4 bg-muted/40 rounded-xl">
                    <span className="text-muted-foreground">{t('inventory.kpi_modal.metrics.revenue')}</span>
                    <span className="font-bold text-foreground">{formatCurrency(kpis.salesRotation.revenue)}</span>
                  </div>
                  <div className="flex justify-between p-4 bg-muted/40 rounded-xl">
                    <span className="text-muted-foreground">{t('inventory.kpi_modal.metrics.sales_trend')}</span>
                    <TrendIndicator value={kpis.salesRotation.sales_trend as 'increasing' | 'stable' | 'decreasing'} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <hr className="border-border" />

        {/* PROFITABILITY */}
        {kpis.profitability && (
          <section>
            <SectionTitle icon={PieChart} title={t('inventory.kpi_modal.sections.profitability')} desc={t('inventory.kpi_modal.sections.profitability_desc')} infoKey="profitability" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-4 mb-6">
              <StatCard title={t('inventory.kpi_modal.metrics.roi')} value={formatPercent(kpis.profitability.roi)} icon={TrendingUp} />
              <StatCard title={t('inventory.kpi_modal.metrics.total_profit')} value={formatCurrency(kpis.profitability.total_profit)} icon={DollarSign} />
              <StatCard title={t('inventory.kpi_modal.metrics.avg_profit_sale')} value={formatCurrency(kpis.profitability.avg_profit_per_sale)} icon={PieChart} />
              <StatCard title={t('inventory.kpi_modal.metrics.revenue_percent')} value={formatPercent(kpis.profitability.contribution_to_total_revenue_percent)} icon={Target} />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 bg-card border rounded-xl border-border">
                <h3 className="mb-4 text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.profit_metrics')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 border-border">
                    <span className="text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.total_profit')}</span>
                    <span className="text-base font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">{formatCurrency(kpis.profitability.total_profit)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 border-border">
                    <span className="text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.roi')}</span>
                    <span className="text-base font-semibold tabular-nums text-foreground">{formatPercent(kpis.profitability.roi)}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card border rounded-xl border-border">
                <h3 className="mb-4 text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.contribution')}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-foreground/80">{t('inventory.kpi_modal.labels.revenue_share')}</span>
                      <span className="font-bold text-foreground">{formatPercent(kpis.profitability.contribution_to_total_revenue_percent)}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-muted">
                      <div className="h-full transition-all duration-1000 bg-primary rounded-full" style={{ width: `${Math.min(kpis.profitability.contribution_to_total_revenue_percent ?? 0, 100)}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="text-foreground/80">{t('inventory.kpi_modal.labels.profit_share')}</span>
                      <span className="font-bold text-foreground">{formatPercent(kpis.profitability.contribution_to_total_profit_percent)}</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-muted">
                      <div className="h-full transition-all duration-1000 rounded-full bg-emerald-600" style={{ width: `${Math.min(kpis.profitability.contribution_to_total_profit_percent ?? 0, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RESTOCK — sans réapprovisionnement enregistré, la section n'a que des N/A à montrer */}
        {kpis.restock && kpis.restock.restock_count > 0 && (
          <>
            <hr className="border-border" />
            <section>
            <SectionTitle icon={Truck} title={t('inventory.kpi_modal.sections.restock')} desc={t('inventory.kpi_modal.sections.restock_desc')} infoKey="restock" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-6">
              <StatCard title={t('inventory.kpi_modal.metrics.restock_count_label')} value={kpis.restock.restock_count} icon={Truck} />
              <StatCard title={t('inventory.kpi_modal.metrics.avg_qty_label')} value={formatInt(kpis.restock.avg_quantity_per_restock)} icon={AlertTriangle} />
              <StatCard title={t('inventory.kpi_modal.metrics.avg_delay_label')} value={`${formatInt(kpis.restock.avg_delivery_delay_days)} ${t('inventory.kpi_modal.labels.days')}`} icon={Package} />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 bg-card border rounded-lg border-border">
                <h3 className="flex items-center gap-2 mb-6 font-bold text-foreground">
                  <Truck size={18} className="text-muted-foreground/70" />{t('inventory.kpi_modal.metrics.supply_chain')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.total_restocks')}</p>
                    <p className="text-2xl font-bold text-foreground">{kpis.restock.restock_count}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.total_cost')}</p>
                    <p className="text-2xl font-bold text-foreground">{formatCurrency(kpis.restock.total_restock_cost)}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.avg_qty_label')}</p>
                    <p className="text-2xl font-bold text-foreground">{formatInt(kpis.restock.avg_quantity_per_restock)}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.reception_rate')}</p>
                    <p className="text-2xl font-bold text-foreground">{formatPercent(kpis.restock.reception_rate)}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card border rounded-xl border-border">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary">
                    <Target size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.optimal_strategy')}</h3>
                    <p className="text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.strategy_desc')}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 border rounded-lg bg-muted/30 border-border">
                    <p className="text-xs text-muted-foreground">{t('inventory.kpi_modal.metrics.frequency')}</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.every')} {formatInt(kpis.restock.restock_frequency_days)} {t('inventory.kpi_modal.labels.days')}</p>
                  </div>
                  <div className="p-3 border rounded-lg bg-muted/30 border-border">
                    <p className="text-xs text-muted-foreground">{t('inventory.kpi_modal.metrics.avg_cost')}</p>
                    <p className="mt-1 text-base font-semibold text-foreground">{formatCurrency(kpis.restock.avg_restock_cost)}</p>
                  </div>
                </div>
              </div>
            </div>
            </section>
          </>
        )}

        <hr className="border-border" />

        {/* PREDICTIONS */}
        {kpis.predictionsAlerts && (
          <section>
            <SectionTitle icon={Zap} title={t('inventory.kpi_modal.sections.predictions')} desc={t('inventory.kpi_modal.sections.predictions_desc')} infoKey="predictions" />
            <div className="p-6 mb-6 bg-card border rounded-xl border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.alert_status')}</h3>
                  <p className="text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.current_model')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg bg-muted/30 border-border">
                  <p className="mb-2 flex items-center text-xs tracking-wider uppercase text-muted-foreground">
                    {t('inventory.kpi_modal.metrics.status')}
                    <InfoTip what={t('inventory.kpi_modal.info.predictions_metrics.alert_status')} />
                  </p>
                  <StatusBadge status={kpis.predictionsAlerts.alert_status} />
                </div>
                <div className="p-4 border rounded-lg bg-muted/30 border-border">
                  <p className="mb-2 flex items-center text-xs tracking-wider uppercase text-muted-foreground">
                    {t('inventory.kpi_modal.metrics.days_coverage')}
                    <InfoTip what={t('inventory.kpi_modal.info.predictions_metrics.days_coverage')} />
                  </p>
                  <p className="text-2xl font-semibold tabular-nums text-foreground">{formatInt(kpis.predictionsAlerts.days_of_coverage)}</p>
                </div>
                <div className="p-4 border rounded-lg bg-muted/30 border-border">
                  <p className="mb-2 flex items-center text-xs tracking-wider uppercase text-muted-foreground">
                    {t('inventory.kpi_modal.metrics.stockout_date')}
                    <InfoTip what={t('inventory.kpi_modal.info.predictions_metrics.stockout_date')} />
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {kpis.predictionsAlerts.estimated_stockout_date
                      ? new Date(kpis.predictionsAlerts.estimated_stockout_date).toLocaleDateString(currentLang)
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 bg-card border rounded-xl border-border">
                <h3 className="mb-4 text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.reorder_recs')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 border-border">
                    <div>
                      <p className="flex items-center text-sm text-foreground">
                        {t('inventory.kpi_modal.metrics.optimal_qty')}
                        <InfoTip what={t('inventory.kpi_modal.info.predictions_metrics.optimal_qty')} />
                      </p>
                      <p className="text-xs text-muted-foreground">{t('inventory.kpi_modal.metrics.based_on_forecast')}</p>
                    </div>
                    <span className="text-xl font-semibold tabular-nums text-primary">{kpis.predictionsAlerts.optimal_reorder_quantity}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 border-border">
                    <div>
                      <p className="flex items-center text-sm text-foreground">
                        {t('inventory.kpi_modal.metrics.reorder_point')}
                        <InfoTip what={t('inventory.kpi_modal.info.predictions_metrics.reorder_point')} />
                      </p>
                      <p className="text-xs text-muted-foreground">{t('inventory.kpi_modal.metrics.trigger_threshold')}</p>
                    </div>
                    <span className="text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">{kpis.predictionsAlerts.optimal_reorder_point}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-card border rounded-xl border-border">
                <h3 className="mb-6 text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.coverage_analysis')}</h3>
                <div className="py-6 text-center">
                  <p className="text-5xl font-semibold tabular-nums text-foreground">{formatInt(kpis.predictionsAlerts.days_of_coverage)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('inventory.kpi_modal.labels.days')}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{t('inventory.kpi_modal.metrics.current_coverage')}</p>
                  <div className="inline-flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t('inventory.kpi_modal.metrics.ai_active')}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <hr className="border-border" />

        {/* CLASSIFICATION */}
        {kpis.scoringClassification && (
          <section>
            <SectionTitle icon={Target} title={t('inventory.kpi_modal.sections.classification')} desc={t('inventory.kpi_modal.sections.classification_desc')} infoKey="classification" />
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col justify-between p-6 bg-card border rounded-xl border-border">
                <div>
                  <p className="text-xs tracking-wider uppercase text-muted-foreground">{t('inventory.kpi_modal.metrics.abc_class')}</p>
                  <p className="mt-2 text-5xl font-semibold tracking-tight text-primary">{kpis.scoringClassification.abc_classification}</p>
                </div>
                <div className="inline-flex items-center self-start gap-2 px-3 py-1 mt-6 text-xs font-medium border rounded-full bg-accent text-primary border-primary/20">
                  <Activity size={12} />
                  <span>{kpis.scoringClassification.performance_category} {t('inventory.kpi_modal.labels.performance')}</span>
                </div>
              </div>
              <div className="p-6 bg-card border rounded-xl border-border">
                <h3 className="mb-6 text-base font-semibold text-foreground">{t('inventory.kpi_modal.metrics.score_breakdown')}</h3>
                <div className="space-y-6">
                  {['Popularity', 'Profitability', 'Reliability'].map((metric) => {
                    const key = `${metric.toLowerCase()}_score` as keyof ScoringClassificationKPI;
                    const val = kpis.scoringClassification![key] as number;
                    return (
                      <div key={metric}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-foreground/80">{t(`inventory.kpi_modal.metrics.score_${metric.toLowerCase()}`)}</span>
                          <span className="font-bold text-foreground">{formatInt(val)}/100</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div className="h-full transition-all duration-1000 bg-primary rounded-full" style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        <hr className="border-border" />

        {/* COMPARATIVE */}
        {kpis.comparative && (
          <section>
            <SectionTitle icon={RefreshCw} title={t('inventory.kpi_modal.sections.comparative')} desc={t('inventory.kpi_modal.sections.comparative_desc')} infoKey="comparative" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-6">
              <StatCard
                title={t('inventory.kpi_modal.metrics.vs_category_avg')}
                value={formatPercent(kpis.comparative.performance_vs_category_percent)}
                trend={(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? 'increasing' : 'decreasing'}
                icon={Activity}
              />
              <StatCard
                title={t('inventory.kpi_modal.metrics.category_rank')}
                value={`#${kpis.comparative.rank_in_category}`}
                subtext={t('inventory.kpi_modal.metrics.market_pos_label')}
                icon={Target}
              />
              <StatCard
                title={t('inventory.kpi_modal.metrics.market_share')}
                value={formatPercent(kpis.comparative.share_in_category_percent)}
                icon={PieChart}
              />
            </div>
            <div className="p-6 bg-card border rounded-lg border-border mb-6">
              <h3 className="mb-6 font-bold text-foreground">{t('inventory.kpi_modal.metrics.competitive_position')}</h3>
              <div className="space-y-6">
                <div>
                  <p className="mb-4 text-sm text-foreground/80">{t('inventory.kpi_modal.metrics.perf_vs_category')}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full bg-muted">
                      <div className="h-full transition-all duration-1000 bg-primary rounded-full" style={{ width: `${Math.min(Math.abs(kpis.comparative.performance_vs_category_percent ?? 0), 100)}%` }} />
                    </div>
                    <span className="w-24 text-lg font-bold text-right text-foreground">{formatPercent(kpis.comparative.performance_vs_category_percent)}</span>
                  </div>
                </div>
                <div>
                  <p className="mb-4 text-sm text-foreground/80">{t('inventory.kpi_modal.metrics.vs_supplier')}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full bg-muted">
                      <div className="h-full transition-all duration-1000 rounded-full bg-emerald-600" style={{ width: `${Math.min(Math.abs(kpis.comparative.performance_vs_supplier_percent ?? 0), 100)}%` }} />
                    </div>
                    <span className="w-24 text-lg font-bold text-right text-foreground">{formatPercent(kpis.comparative.performance_vs_supplier_percent)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-card border rounded-xl border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">{t('inventory.kpi_modal.metrics.perf_vs_avg')}</h4>
                  <TrendingUp size={16} className="text-muted-foreground" />
                </div>
                <p className={`mt-4 text-2xl font-semibold tabular-nums ${(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? '+' : ''}{formatPercent(kpis.comparative.performance_vs_category_percent)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? t('inventory.kpi_modal.metrics.above_avg') : t('inventory.kpi_modal.metrics.below_avg')}
                </p>
              </div>
              <div className="p-6 bg-card border rounded-xl border-border">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">{t('inventory.kpi_modal.metrics.market_share')}</h4>
                  <Target size={16} className="text-muted-foreground" />
                </div>
                <p className="mt-4 text-2xl font-semibold tabular-nums text-foreground">{formatPercent(kpis.comparative.share_in_category_percent)}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t('inventory.kpi_modal.metrics.rank_prefix')} #{kpis.comparative.rank_in_category} {t('inventory.kpi_modal.metrics.rank_suffix')}
                </p>
              </div>
            </div>
          </section>
        )}

      </div>
    </PageLayout>
  );
}
