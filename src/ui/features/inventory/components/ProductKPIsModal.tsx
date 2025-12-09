import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, AlertTriangle, ChevronRight } from 'lucide-react';
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
  BarChart,
  Bar,
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
                    {kpis.pricingMargin && (
                      <StatCard
                        label="Margin"
                        value={`${kpis.pricingMargin.margin_percentage.toFixed(1)}%`}
                        badge={kpis.pricingMargin.market_position}
                      />
                    )}
                    {kpis.stockAvailability && (
                      <StatCard
                        label="Stock Status"
                        value={kpis.stockAvailability.current_stock}
                        badge={kpis.stockAvailability.stock_status}
                      />
                    )}
                    {kpis.salesRotation && (
                      <StatCard
                        label="Rotation"
                        value={kpis.salesRotation.rotation_rate.toFixed(1)}
                        badge={kpis.salesRotation.rotation_category}
                        trend={kpis.salesRotation.sales_trend}
                      />
                    )}
                    {kpis.profitability && (
                      <StatCard
                        label="ROI"
                        value={`${kpis.profitability.roi.toFixed(1)}%`}
                      />
                    )}
                  </div>

                  {/* Classification Badges */}
                  {kpis.scoringClassification && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Classification</h3>
                      <div className="flex flex-wrap gap-3">
                        <div className={`px-4 py-2 rounded-lg border ${getStatusColor(kpis.scoringClassification.abc_classification)}`}>
                          <span className="text-xs font-medium">ABC Classification</span>
                          <p className="text-xl font-bold mt-1">{kpis.scoringClassification.abc_classification}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border ${getStatusColor(kpis.scoringClassification.xyz_classification)}`}>
                          <span className="text-xs font-medium">XYZ Classification</span>
                          <p className="text-xl font-bold mt-1">{kpis.scoringClassification.xyz_classification}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg border ${getStatusColor(kpis.scoringClassification.strategic_importance)}`}>
                          <span className="text-xs font-medium">Strategic Importance</span>
                          <p className="text-xl font-bold mt-1 capitalize">{kpis.scoringClassification.strategic_importance}</p>
                        </div>
                        <div className="px-4 py-2 rounded-lg border bg-blue-50 border-blue-200 text-blue-600">
                          <span className="text-xs font-medium">Performance Score</span>
                          <p className="text-xl font-bold mt-1">{kpis.scoringClassification.performance_score}/100</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Alerts */}
                  {kpis.predictionsAlerts && kpis.predictionsAlerts.alerts.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Active Alerts</h3>
                      <div className="space-y-2">
                        {kpis.predictionsAlerts.alerts.slice(0, 5).map((alert, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg border ${
                              alert.severity === 'critical'
                                ? 'bg-red-50 border-red-200 text-red-900'
                                : alert.severity === 'warning'
                                ? 'bg-orange-50 border-orange-200 text-orange-900'
                                : 'bg-blue-50 border-blue-200 text-blue-900'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <p className="font-medium">{alert.message}</p>
                                {alert.action_required && (
                                  <span className="text-xs font-semibold mt-1 inline-block">ACTION REQUIRED</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pricing & Margin Tab */}
              {activeTab === 'pricing' && kpis.pricingMargin && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Current Price" value={`${kpis.pricingMargin.current_price.toFixed(2)} €`} />
                    <StatCard label="Cost Price" value={`${kpis.pricingMargin.cost_price.toFixed(2)} €`} />
                    <StatCard 
                      label="Margin" 
                      value={`${kpis.pricingMargin.margin_percentage.toFixed(1)}%`}
                      badge={kpis.pricingMargin.market_position}
                    />
                  </div>

                  {kpis.priceEvolution && kpis.priceEvolution.price_changes.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Evolution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={kpis.priceEvolution.price_changes}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => `${value.toFixed(2)} €`} />
                          <Legend />
                          <Line type="monotone" dataKey="new_price" stroke="#3b82f6" name="Price" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
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
                      badge={kpis.stockAvailability.stock_status}
                    />
                    <StatCard label="Available" value={kpis.stockAvailability.available_stock} />
                    <StatCard label="Reserved" value={kpis.stockAvailability.reserved_stock} />
                    <StatCard 
                      label="Coverage" 
                      value={`${kpis.stockAvailability.stock_coverage_days} days`}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Thresholds</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Min Threshold</span>
                        <span className="font-semibold text-orange-600">{kpis.stockAvailability.min_stock_threshold}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Current Stock</span>
                        <span className="font-semibold text-gray-900">{kpis.stockAvailability.current_stock}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Max Threshold</span>
                        <span className="font-semibold text-green-600">{kpis.stockAvailability.max_stock_threshold}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                        <div
                          className={`h-2 rounded-full ${
                            kpis.stockAvailability.stock_status === 'critical' ? 'bg-red-500' :
                            kpis.stockAvailability.stock_status === 'low' ? 'bg-orange-500' :
                            kpis.stockAvailability.stock_status === 'optimal' ? 'bg-green-500' :
                            'bg-blue-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              (kpis.stockAvailability.current_stock / kpis.stockAvailability.max_stock_threshold) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {kpis.stockAvailability.days_until_stockout !== null && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <p className="text-red-900 font-medium">
                          Estimated stockout in {kpis.stockAvailability.days_until_stockout} days
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
                      label="Rotation Rate" 
                      value={kpis.salesRotation.rotation_rate.toFixed(1)}
                      badge={kpis.salesRotation.rotation_category}
                      trend={kpis.salesRotation.sales_trend}
                    />
                    <StatCard label="Turnover Ratio" value={kpis.salesRotation.turnover_ratio.toFixed(2)} />
                    <StatCard label="Avg Daily Sales" value={kpis.salesRotation.average_daily_sales.toFixed(1)} />
                    <StatCard label="Last 30 Days" value={kpis.salesRotation.sales_last_30_days} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Sales</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Quantity Sold</p>
                          <p className="text-3xl font-bold text-gray-900">{kpis.salesRotation.total_sales_quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Value</p>
                          <p className="text-3xl font-bold text-blue-600">{kpis.salesRotation.total_sales_value.toFixed(2)} €</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Periods</h3>
                      <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={[
                          { period: 'Last 30d', value: kpis.salesRotation.sales_last_30_days },
                          { period: 'Last 90d', value: kpis.salesRotation.sales_last_90_days },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {/* Profitability Tab */}
              {activeTab === 'profitability' && kpis.profitability && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Total Revenue" value={`${kpis.profitability.total_revenue.toFixed(2)} €`} />
                    <StatCard label="Total Cost" value={`${kpis.profitability.total_cost.toFixed(2)} €`} />
                    <StatCard label="Gross Profit" value={`${kpis.profitability.gross_profit.toFixed(2)} €`} />
                    <StatCard label="ROI" value={`${kpis.profitability.roi.toFixed(1)}%`} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Metrics</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Profit Margin</span>
                            <span className="font-semibold">{kpis.profitability.profit_margin_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(kpis.profitability.profit_margin_percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Contribution to Total Profit</span>
                            <span className="font-semibold">{kpis.profitability.contribution_to_total_profit.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(kpis.profitability.contribution_to_total_profit, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Ranking</h3>
                      <div className="text-center">
                        <p className="text-6xl font-bold text-green-600">#{kpis.profitability.profitability_rank}</p>
                        <p className="text-sm text-gray-600 mt-2">Overall Ranking</p>
                        <div className="mt-4">
                          <div className="inline-block px-4 py-2 bg-white rounded-lg border border-green-200">
                            <p className="text-sm text-gray-600">Score</p>
                            <p className="text-2xl font-bold text-green-600">{kpis.profitability.profitability_score}/100</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Restock Tab */}
              {activeTab === 'restock' && kpis.restock && (
                <div className="space-y-6">
                  <div className={`p-6 rounded-lg border ${getStatusColor(kpis.restock.urgency_level)}`}>
                    <h3 className="text-lg font-semibold mb-2">Restock Urgency</h3>
                    <p className="text-3xl font-bold uppercase">{kpis.restock.urgency_level.replace('_', ' ')}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Current Stock" value={kpis.restock.current_stock} />
                    <StatCard label="Optimal Level" value={kpis.restock.optimal_stock_level} />
                    <StatCard label="Reorder Point" value={kpis.restock.reorder_point} />
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Restock Recommendation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Suggested Order Quantity</p>
                        <p className="text-4xl font-bold text-blue-600">{kpis.restock.suggested_restock_quantity}</p>
                        <p className="text-sm text-gray-500 mt-2">(Economic Order Quantity: {kpis.restock.economic_order_quantity})</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Supplier Lead Time</p>
                        <p className="text-4xl font-bold text-gray-900">{kpis.restock.supplier_lead_time_days} days</p>
                        {kpis.restock.next_suggested_order_date && (
                          <p className="text-sm text-gray-500 mt-2">
                            Order by: {new Date(kpis.restock.next_suggested_order_date).toLocaleDateString()}
                          </p>
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
                      label="7-Day Forecast" 
                      value={kpis.predictionsAlerts.predicted_demand_7_days}
                      trend={kpis.predictionsAlerts.demand_trend}
                    />
                    <StatCard 
                      label="30-Day Forecast" 
                      value={kpis.predictionsAlerts.predicted_demand_30_days}
                      trend={kpis.predictionsAlerts.demand_trend}
                    />
                    <StatCard 
                      label="Seasonality Factor" 
                      value={kpis.predictionsAlerts.seasonality_factor?.toFixed(2) || 'N/A'}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Stockout Risk</span>
                            <span className="font-semibold text-red-600">{kpis.predictionsAlerts.stockout_risk_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-red-500 h-2 rounded-full"
                              style={{ width: `${kpis.predictionsAlerts.stockout_risk_percentage}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600">Overstock Risk</span>
                            <span className="font-semibold text-orange-600">{kpis.predictionsAlerts.overstock_risk_percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{ width: `${kpis.predictionsAlerts.overstock_risk_percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 rounded-lg border ${getStatusColor(kpis.predictionsAlerts.demand_trend)}`}>
                      <h3 className="text-lg font-semibold mb-2">Demand Trend</h3>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(kpis.predictionsAlerts.demand_trend)}
                        <p className="text-2xl font-bold capitalize">{kpis.predictionsAlerts.demand_trend}</p>
                      </div>
                    </div>
                  </div>

                  {kpis.predictionsAlerts.alerts.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
                      <div className="space-y-2">
                        {kpis.predictionsAlerts.alerts.map((alert, idx) => (
                          <div
                            key={idx}
                            className={`p-4 rounded-lg border ${
                              alert.severity === 'critical'
                                ? 'bg-red-50 border-red-200'
                                : alert.severity === 'warning'
                                ? 'bg-orange-50 border-orange-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                                alert.severity === 'critical' ? 'text-red-600' :
                                alert.severity === 'warning' ? 'text-orange-600' :
                                'text-blue-600'
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs font-bold uppercase ${
                                    alert.severity === 'critical' ? 'text-red-600' :
                                    alert.severity === 'warning' ? 'text-orange-600' :
                                    'text-blue-600'
                                  }`}>
                                    {alert.severity}
                                  </span>
                                  <span className="text-xs text-gray-500">•</span>
                                  <span className="text-xs text-gray-600 capitalize">{alert.type.replace('_', ' ')}</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                                {alert.action_required && (
                                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-700">
                                    <ChevronRight className="w-3 h-3" />
                                    ACTION REQUIRED
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Classification Tab */}
              {activeTab === 'classification' && kpis.scoringClassification && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg border ${getStatusColor(kpis.scoringClassification.abc_classification)}`}>
                      <h3 className="text-sm font-medium mb-2">ABC Classification</h3>
                      <p className="text-6xl font-bold">{kpis.scoringClassification.abc_classification}</p>
                      <p className="text-sm mt-2 opacity-80">Based on revenue contribution</p>
                    </div>

                    <div className={`p-6 rounded-lg border ${getStatusColor(kpis.scoringClassification.xyz_classification)}`}>
                      <h3 className="text-sm font-medium mb-2">XYZ Classification</h3>
                      <p className="text-6xl font-bold">{kpis.scoringClassification.xyz_classification}</p>
                      <p className="text-sm mt-2 opacity-80">Based on demand variability</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                      label="Performance Score" 
                      value={`${kpis.scoringClassification.performance_score}/100`}
                    />
                    <StatCard 
                      label="Revenue Contribution" 
                      value={`${kpis.scoringClassification.revenue_contribution_percentage.toFixed(1)}%`}
                    />
                    <StatCard 
                      label="Strategic Importance" 
                      value={kpis.scoringClassification.strategic_importance.toUpperCase()}
                      badge={kpis.scoringClassification.strategic_importance}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Sales Frequency</p>
                        <p className="text-3xl font-bold text-gray-900">{kpis.scoringClassification.sales_frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Demand Variability</p>
                        <p className="text-3xl font-bold text-gray-900">{kpis.scoringClassification.demand_variability.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {kpis.scoringClassification.recommendation && (
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 Recommendation</h3>
                      <p className="text-blue-800">{kpis.scoringClassification.recommendation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Comparative Tab */}
              {activeTab === 'comparative' && kpis.comparative && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard label="Revenue Rank" value={`#${kpis.comparative.rank_by_revenue}`} />
                    <StatCard label="Profit Rank" value={`#${kpis.comparative.rank_by_profit}`} />
                    <StatCard label="Rotation Rank" value={`#${kpis.comparative.rank_by_rotation}`} />
                    <StatCard 
                      label="Overall Rank" 
                      value={`#${kpis.comparative.overall_performance_rank}`}
                      badge={kpis.comparative.performance_vs_category}
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Category Comparison: {kpis.comparative.category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Price vs Average</p>
                        <p className={`text-2xl font-bold ${
                          kpis.comparative.price_vs_category_avg > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpis.comparative.price_vs_category_avg > 0 ? '+' : ''}
                          {kpis.comparative.price_vs_category_avg.toFixed(1)}%
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Avg: {kpis.comparative.category_average_price.toFixed(2)} €
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Sales vs Average</p>
                        <p className={`text-2xl font-bold ${
                          kpis.comparative.sales_vs_category_avg > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpis.comparative.sales_vs_category_avg > 0 ? '+' : ''}
                          {kpis.comparative.sales_vs_category_avg.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Margin vs Average</p>
                        <p className={`text-2xl font-bold ${
                          kpis.comparative.margin_vs_category_avg > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {kpis.comparative.margin_vs_category_avg > 0 ? '+' : ''}
                          {kpis.comparative.margin_vs_category_avg.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {kpis.comparative.top_competitors && kpis.comparative.top_competitors.length > 0 && (
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Competitors in Category</h3>
                      <div className="space-y-2">
                        {kpis.comparative.top_competitors.map((competitor, idx) => (
                          <div key={competitor.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                              <span className="font-medium text-gray-900">{competitor.product_name}</span>
                            </div>
                            <span className="text-lg font-semibold text-blue-600">
                              {competitor.metric_value.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
