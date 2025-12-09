import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ProductKPIsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productName: string;
}

type TabType = 
  | 'overview' 
  | 'pricing' 
  | 'stock' 
  | 'sales' 
  | 'profitability' 
  | 'restock' 
  | 'predictions' 
  | 'classification' 
  | 'comparative';

export function ProductKPIsModal({ isOpen, onClose, productId, productName }: ProductKPIsModalProps) {
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

  // Helper functions to safely format numbers
  const formatNumber = (value: number | null | undefined, decimals: number = 2): string => {
    return value != null ? value.toFixed(decimals) : 'N/A';
  };

  const formatCurrency = (value: number | null | undefined): string => {
    return value != null ? `${value.toFixed(2)} €` : 'N/A';
  };

  const formatPercent = (value: number | null | undefined, decimals: number = 1): string => {
    return value != null ? `${value.toFixed(decimals)}%` : 'N/A';
  };

  useEffect(() => {
    if (isOpen && productId) {
      loadKPIs();
    }
  }, [isOpen, productId]);

  const loadKPIs = async () => {
    setLoading(true);
    setError(null);
    try {
      const allKpis = await productKpisService.getAllKPIs(productId);
      setKpis(allKpis);
    } catch (err) {
      console.error('Error loading KPIs:', err);
      setError('Failed to load KPIs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'pricing', label: '💰 Pricing & Margin', icon: '💰' },
    { id: 'stock', label: '📦 Stock Availability', icon: '📦' },
    { id: 'sales', label: '🔄 Sales Rotation', icon: '🔄' },
    { id: 'profitability', label: '💵 Profitability', icon: '💵' },
    { id: 'restock', label: '🚚 Restock Analysis', icon: '🚚' },
    { id: 'predictions', label: '🔮 Predictions', icon: '🔮' },
    { id: 'classification', label: '🏆 Classification', icon: '🏆' },
    { id: 'comparative', label: '📈 Comparative', icon: '📈' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      critical: 'text-red-600 bg-red-50 border-red-200',
      low: 'text-orange-600 bg-orange-50 border-orange-200',
      warning: 'text-orange-600 bg-orange-50 border-orange-200',
      optimal: 'text-green-600 bg-green-50 border-green-200',
      excess: 'text-blue-600 bg-blue-50 border-blue-200',
      fast: 'text-green-600 bg-green-50 border-green-200',
      medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      slow: 'text-red-600 bg-red-50 border-red-200',
      high: 'text-purple-600 bg-purple-50 border-purple-200',
      A: 'text-green-600 bg-green-50 border-green-200',
      B: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      C: 'text-orange-600 bg-orange-50 border-orange-200',
      X: 'text-green-600 bg-green-50 border-green-200',
      Y: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      Z: 'text-red-600 bg-red-50 border-red-200',
      above: 'text-green-600 bg-green-50 border-green-200',
      average: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      below: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4 border-t-2 border-gray-400" />;
  };

  const StatCard = ({ label, value, trend, badge }: { 
    label: string; 
    value: string | number; 
    trend?: 'increasing' | 'stable' | 'decreasing';
    badge?: string;
  }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{label}</p>
        {trend && getTrendIcon(trend)}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {badge && (
        <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(badge)}`}>
          {badge.toUpperCase()}
        </span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[95vw] h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Product KPIs</h2>
              <p className="text-sm text-gray-600 mt-1">{productName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/80 transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading KPIs...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.pricingMargin?.margin_rate != null && (
                      <StatCard
                        label="Margin Rate"
                        value={formatPercent(kpis.pricingMargin.margin_rate)}
                      />
                    )}
                    {kpis.stockAvailability && (
                      <StatCard
                        label="Stock Status"
                        value={kpis.stockAvailability.current_stock ?? 'N/A'}
                        badge={kpis.stockAvailability.product_status}
                      />
                    )}
                    {kpis.salesRotation?.stock_turnover_rate != null && (
                      <StatCard
                        label="Stock Turnover"
                        value={formatNumber(kpis.salesRotation.stock_turnover_rate, 1)}
                        trend={kpis.salesRotation.sales_trend as 'increasing' | 'stable' | 'decreasing' | undefined}
                      />
                    )}
                    {kpis.profitability?.roi != null && (
                      <StatCard
                        label="ROI"
                        value={formatPercent(kpis.profitability.roi)}
                      />
                    )}
                  </div>

                  {/* Classification Badges */}
                  {kpis.scoringClassification && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Classification</h3>
                      <div className="flex flex-wrap gap-3">
                        <div className={`px-4 py-2 rounded-lg border ${
                          kpis.scoringClassification.abc_classification === 'A' ? 'bg-green-50 border-green-200 text-green-600' :
                          kpis.scoringClassification.abc_classification === 'B' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          'bg-orange-50 border-orange-200 text-orange-600'
                        }`}>
                          <span className="text-xs font-medium">ABC Classification</span>
                          <p className="text-xl font-bold mt-1">{kpis.scoringClassification.abc_classification}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border ${
                          kpis.scoringClassification.performance_category === 'star' ? 'bg-yellow-50 border-yellow-200 text-yellow-600' :
                          kpis.scoringClassification.performance_category === 'growth' ? 'bg-green-50 border-green-200 text-green-600' :
                          kpis.scoringClassification.performance_category === 'stable' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                          'bg-red-50 border-red-200 text-red-600'
                        }`}>
                          <span className="text-xs font-medium">Performance Category</span>
                          <p className="text-xl font-bold mt-1 capitalize">{kpis.scoringClassification.performance_category}</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg border bg-indigo-50 border-indigo-200 text-indigo-600">
                          <span className="text-xs font-medium">Global Score</span>
                          <p className="text-xl font-bold mt-1">{formatNumber(kpis.scoringClassification.global_score, 1)}/100</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alert Status */}
                  {kpis.predictionsAlerts && (
                    <div className={`p-6 rounded-lg border ${
                      kpis.predictionsAlerts.alert_status === 'stockout' ? 'bg-red-50 border-red-200' :
                      kpis.predictionsAlerts.alert_status === 'low_stock' ? 'bg-orange-50 border-orange-200' :
                      kpis.predictionsAlerts.alert_status === 'overstock' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        <div>
                          <h3 className="text-lg font-semibold">Stock Alert</h3>
                          <p className="text-sm mt-1">
                            Status: <span className="font-bold uppercase">{kpis.predictionsAlerts.alert_status}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing & Margin Tab */}
              {activeTab === 'pricing' && kpis.pricingMargin && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Selling Price" value={formatCurrency(kpis.pricingMargin.current_selling_price)} />
                    <StatCard label="Buying Price" value={formatCurrency(kpis.pricingMargin.current_buying_price)} />
                    <StatCard 
                      label="Margin Rate" 
                      value={formatPercent(kpis.pricingMargin.margin_rate)}
                    />
                  </div>

                  {/* Price Evolution Chart */}
                  {kpis.priceEvolution && (
                    (kpis.priceEvolution.buying_price_history?.length > 0 || kpis.priceEvolution.selling_price_history?.length > 0) && (
                      <div className="bg-white p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Evolution</h3>
                        {kpis.priceEvolution.buying_price_history?.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">Buying Price History</h4>
                            <ResponsiveContainer width="100%" height={250}>
                              <LineChart data={kpis.priceEvolution.buying_price_history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="date" 
                                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <YAxis />
                                <Tooltip 
                                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                  formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke="#ef4444" 
                                  name="Buying Price"
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                        {kpis.priceEvolution.selling_price_history?.length > 0 && (
                          <div>
                            <h4 className="text-md font-medium text-gray-700 mb-2">Selling Price History</h4>
                            <ResponsiveContainer width="100%" height={250}>
                              <LineChart data={kpis.priceEvolution.selling_price_history}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="date" 
                                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                                />
                                <YAxis />
                                <Tooltip 
                                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                  formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke="#22c55e" 
                                  name="Selling Price"
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Stock Availability Tab */}
              {activeTab === 'stock' && kpis.stockAvailability && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard 
                      label="Current Stock" 
                      value={kpis.stockAvailability.current_stock}
                      badge={kpis.stockAvailability.product_status}
                    />
                    <StatCard 
                      label="Safety Stock" 
                      value={kpis.stockAvailability.safety_stock_recommended ?? 'N/A'} 
                    />
                    <StatCard 
                      label="Stockout Rate" 
                      value={formatPercent(kpis.stockAvailability.stockout_rate, 2)}
                    />
                    <StatCard 
                      label="Days Since Restock" 
                      value={kpis.stockAvailability.days_since_last_restock ?? 'N/A'}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Status</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Product Status</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            kpis.stockAvailability.product_status === 'in_stock' ? 'bg-green-50 text-green-700 border-green-200' :
                            kpis.stockAvailability.product_status === 'out_of_stock' ? 'bg-red-50 text-red-700 border-red-200' :
                            kpis.stockAvailability.product_status === 'discontinued' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {kpis.stockAvailability.product_status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Current Stock</span>
                          <span className="font-semibold text-gray-900">{kpis.stockAvailability.current_stock}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Safety Stock Recommended</span>
                          <span className="font-semibold text-orange-600">
                            {kpis.stockAvailability.safety_stock_recommended ?? 'N/A'}
                          </span>
                        </div>
                        {kpis.stockAvailability.last_restock_date && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Last Restock Date</span>
                            <span className="font-semibold text-blue-600">
                              {new Date(kpis.stockAvailability.last_restock_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stockout Analysis</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Stockout Rate</span>
                            <span className="font-semibold">{formatPercent(kpis.stockAvailability.stockout_rate, 2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${Math.min(kpis.stockAvailability.stockout_rate ?? 0, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Total Stockouts</span>
                          <span className="font-semibold text-red-600">{kpis.stockAvailability.stockout_count}</span>
                        </div>
                        {kpis.stockAvailability.avg_stockout_duration_days && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Avg Stockout Duration</span>
                            <span className="font-semibold text-orange-600">
                              {kpis.stockAvailability.avg_stockout_duration_days.toFixed(1)} days
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {kpis.stockAvailability.current_stock < (kpis.stockAvailability.safety_stock_recommended ?? 0) && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <p className="text-orange-900 font-medium">
                          Current stock ({kpis.stockAvailability.current_stock}) is below safety stock level ({kpis.stockAvailability.safety_stock_recommended})
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Sales Rotation Tab */}
              {activeTab === 'sales' && kpis.salesRotation && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard 
                      label="Quantity Sold" 
                      value={kpis.salesRotation.quantity_sold}
                    />
                    <StatCard label="Total Revenue" value={formatCurrency(kpis.salesRotation.revenue)} />
                    <StatCard label="Order Count" value={kpis.salesRotation.order_count} />
                    <StatCard 
                      label="Sales Velocity" 
                      value={`${formatNumber(kpis.salesRotation.sales_velocity_per_day, 2)}/day`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Metrics</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Avg Quantity per Order</span>
                          <span className="font-semibold text-gray-900">{formatNumber(kpis.salesRotation.avg_quantity_per_order, 1)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Avg Basket Value</span>
                          <span className="font-semibold text-blue-600">{formatCurrency(kpis.salesRotation.avg_basket_value)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Sales Trend</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                            kpis.salesRotation.sales_trend === 'increasing' ? 'bg-green-50 text-green-700 border-green-200' :
                            kpis.salesRotation.sales_trend === 'decreasing' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-gray-50 text-gray-700 border-gray-200'
                          }`}>
                            {kpis.salesRotation.sales_trend.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Rotation</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Turnover Rate</span>
                          <span className="font-semibold text-purple-600">{formatNumber(kpis.salesRotation.stock_turnover_rate, 2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Avg Storage Duration</span>
                          <span className="font-semibold text-orange-600">{formatNumber(kpis.salesRotation.avg_storage_duration_days, 1)} days</span>
                        </div>
                        {kpis.salesRotation.sales_variation_percent !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Sales Variation</span>
                            <span className={`font-semibold ${
                              kpis.salesRotation.sales_variation_percent > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatPercent(kpis.salesRotation.sales_variation_percent)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profitability Tab */}
              {activeTab === 'profitability' && kpis.profitability && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Profit" value={formatCurrency(kpis.profitability.total_profit)} />
                    <StatCard label="Avg Profit per Sale" value={formatCurrency(kpis.profitability.avg_profit_per_sale)} />
                    <StatCard label="ROI" value={formatPercent(kpis.profitability.roi)} />
                    <StatCard 
                      label="Revenue Contribution" 
                      value={formatPercent(kpis.profitability.contribution_to_total_revenue_percent)} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profit Contribution</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Revenue Contribution</span>
                            <span className="font-semibold">{formatPercent(kpis.profitability.contribution_to_total_revenue_percent)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(kpis.profitability.contribution_to_total_revenue_percent ?? 0, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Profit Contribution</span>
                            <span className="font-semibold">{formatPercent(kpis.profitability.contribution_to_total_profit_percent)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(kpis.profitability.contribution_to_total_profit_percent ?? 0, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Overview</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Total Profit</p>
                          <p className="text-3xl font-bold text-green-600">{formatCurrency(kpis.profitability.total_profit)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Profit per Sale</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.profitability.avg_profit_per_sale)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">ROI</p>
                          <p className="text-2xl font-bold text-blue-600">{formatPercent(kpis.profitability.roi)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Restock Tab */}
              {activeTab === 'restock' && kpis.restock && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Restock Count" value={kpis.restock.restock_count} />
                    <StatCard label="Total Restocked" value={kpis.restock.total_restocked_quantity} />
                    <StatCard 
                      label="Avg per Restock" 
                      value={formatNumber(kpis.restock.avg_quantity_per_restock, 1)} 
                    />
                    <StatCard 
                      label="Restock Frequency" 
                      value={kpis.restock.restock_frequency_days ? `${formatNumber(kpis.restock.restock_frequency_days, 1)} days` : 'N/A'} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Total Restock Cost</p>
                          <p className="text-3xl font-bold text-blue-600">{formatCurrency(kpis.restock.total_restock_cost)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Cost per Restock</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(kpis.restock.avg_restock_cost)}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reliability Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Reception Rate</span>
                            <span className="font-semibold text-green-600">{formatPercent(kpis.restock.reception_rate)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(kpis.restock.reception_rate ?? 0, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Cancellation Rate</span>
                            <span className="font-semibold text-red-600">{formatPercent(kpis.restock.cancellation_rate)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${Math.min(kpis.restock.cancellation_rate ?? 0, 100)}%` }}
                            />
                          </div>
                        </div>
                        {kpis.restock.avg_delivery_delay_days !== null && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Avg Delivery Delay</span>
                            <span className="font-semibold text-orange-600">{formatNumber(kpis.restock.avg_delivery_delay_days, 1)} days</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Predictions Tab */}
              {activeTab === 'predictions' && kpis.predictionsAlerts && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                      label="Optimal Reorder Quantity" 
                      value={kpis.predictionsAlerts.optimal_reorder_quantity ?? 'N/A'}
                    />
                    <StatCard 
                      label="Optimal Reorder Point" 
                      value={kpis.predictionsAlerts.optimal_reorder_point ?? 'N/A'}
                    />
                    <StatCard 
                      label="Days of Coverage" 
                      value={formatNumber(kpis.predictionsAlerts.days_of_coverage, 0)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reorder Recommendations</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Optimal Reorder Quantity</span>
                          <span className="text-2xl font-bold text-blue-600">{kpis.predictionsAlerts.optimal_reorder_quantity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Optimal Reorder Point</span>
                          <span className="text-2xl font-bold text-orange-600">{kpis.predictionsAlerts.optimal_reorder_point}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Days of Coverage</span>
                          <span className="text-2xl font-bold text-green-600">{formatNumber(kpis.predictionsAlerts.days_of_coverage, 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-lg border ${
                      kpis.predictionsAlerts.alert_status === 'stockout' ? 'bg-red-50 border-red-200' :
                      kpis.predictionsAlerts.alert_status === 'low_stock' ? 'bg-orange-50 border-orange-200' :
                      kpis.predictionsAlerts.alert_status === 'overstock' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-green-50 border-green-200'
                    }`}>
                      <h3 className="text-lg font-semibold mb-2">Alert Status</h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          kpis.predictionsAlerts.alert_status === 'stockout' ? 'bg-red-100 text-red-800' :
                          kpis.predictionsAlerts.alert_status === 'low_stock' ? 'bg-orange-100 text-orange-800' :
                          kpis.predictionsAlerts.alert_status === 'overstock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {kpis.predictionsAlerts.alert_status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {kpis.predictionsAlerts.estimated_stockout_date && (
                    <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-orange-900 mb-2">⚠️ Stockout Prediction</h3>
                      <p className="text-orange-800">
                        Estimated stockout date: <span className="font-bold">
                          {new Date(kpis.predictionsAlerts.estimated_stockout_date).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Classification Tab */}
              {activeTab === 'classification' && kpis.scoringClassification && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg border ${
                      kpis.scoringClassification.abc_classification === 'A' ? 'bg-green-50 border-green-200' :
                      kpis.scoringClassification.abc_classification === 'B' ? 'bg-blue-50 border-blue-200' :
                      'bg-orange-50 border-orange-200'
                    }`}>
                      <h3 className="text-sm font-medium mb-2">ABC Classification</h3>
                      <p className="text-6xl font-bold">{kpis.scoringClassification.abc_classification}</p>
                      <p className="text-sm mt-2 opacity-80">Based on revenue contribution</p>
                    </div>

                    <div className={`p-6 rounded-lg border ${
                      kpis.scoringClassification.performance_category === 'star' ? 'bg-yellow-50 border-yellow-200' :
                      kpis.scoringClassification.performance_category === 'growth' ? 'bg-green-50 border-green-200' :
                      kpis.scoringClassification.performance_category === 'stable' ? 'bg-blue-50 border-blue-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <h3 className="text-sm font-medium mb-2">Performance Category</h3>
                      <p className="text-4xl font-bold capitalize">{kpis.scoringClassification.performance_category}</p>
                      <p className="text-sm mt-2 opacity-80">Product lifecycle stage</p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Popularity Score</span>
                          <span className="font-semibold text-blue-600">{formatNumber(kpis.scoringClassification.popularity_score, 1)}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(kpis.scoringClassification.popularity_score ?? 0, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Profitability Score</span>
                          <span className="font-semibold text-green-600">{formatNumber(kpis.scoringClassification.profitability_score, 1)}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min(kpis.scoringClassification.profitability_score ?? 0, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Reliability Score</span>
                          <span className="font-semibold text-purple-600">{formatNumber(kpis.scoringClassification.reliability_score, 1)}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${Math.min(kpis.scoringClassification.reliability_score ?? 0, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-base font-semibold text-gray-900">Global Score</span>
                          <span className="text-3xl font-bold text-indigo-600">{formatNumber(kpis.scoringClassification.global_score, 1)}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comparative Tab */}
              {activeTab === 'comparative' && kpis.comparative && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatCard 
                      label="Rank in Category" 
                      value={`#${kpis.comparative.rank_in_category}`}
                    />
                    <StatCard 
                      label="Category Market Share" 
                      value={formatPercent(kpis.comparative.share_in_category_percent)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Category</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Performance Difference</span>
                        <span className={`text-3xl font-bold ${
                          (kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(kpis.comparative.performance_vs_category_percent ?? 0) > 0 ? '+' : ''}
                          {formatNumber(kpis.comparative.performance_vs_category_percent, 1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Compared to category average
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance vs Supplier</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Performance Difference</span>
                        <span className={`text-3xl font-bold ${
                          (kpis.comparative.performance_vs_supplier_percent ?? 0) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(kpis.comparative.performance_vs_supplier_percent ?? 0) > 0 ? '+' : ''}
                          {formatNumber(kpis.comparative.performance_vs_supplier_percent, 1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Compared to supplier average
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Position</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Category Rank</p>
                        <p className="text-5xl font-bold text-blue-600">#{kpis.comparative.rank_in_category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Market Share in Category</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-5xl font-bold text-green-600">{formatNumber(kpis.comparative.share_in_category_percent, 1)}</p>
                          <span className="text-2xl text-gray-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
