import PageLayout from "@/layouts/PageLayout";
import {
  Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell, BarChart, Bar, ComposedChart
} from "recharts";
import { 
  FiTrendingUp, 
  FiDollarSign,
  FiAlertTriangle,
  FiTarget,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCalendar,
  FiDownload,
  FiMoreVertical,

  FiZap,
  FiRefreshCw
} from "react-icons/fi";

// Mock data for analytics
const inventoryTurnoverData = [
  { month: "Jan", electronics: 4.2, clothing: 6.8, food: 12.5, books: 2.1 },
  { month: "Feb", electronics: 4.5, clothing: 7.2, food: 13.1, books: 2.3 },
  { month: "Mar", electronics: 4.1, clothing: 6.9, food: 12.8, books: 2.2 },
  { month: "Apr", electronics: 4.8, clothing: 8.1, food: 14.2, books: 2.4 },
  { month: "May", electronics: 5.2, clothing: 8.5, food: 15.1, books: 2.6 },
  { month: "Jun", electronics: 5.1, clothing: 8.2, food: 14.8, books: 2.5 },
];

const demandForecastData = [
  { month: "Jul", actual: 45000, predicted: 47000, upperBound: 52000, lowerBound: 42000 },
  { month: "Aug", actual: 52000, predicted: 51000, upperBound: 58000, lowerBound: 44000 },
  { month: "Sep", actual: 48000, predicted: 49000, upperBound: 56000, lowerBound: 42000 },
  { month: "Oct", actual: null, predicted: 55000, upperBound: 63000, lowerBound: 47000 },
  { month: "Nov", actual: null, predicted: 58000, upperBound: 67000, lowerBound: 49000 },
  { month: "Dec", actual: null, predicted: 62000, upperBound: 72000, lowerBound: 52000 },
];

const abcAnalysisData = [
  { category: "A Products", value: 70, count: 145, color: "#10b981" },
  { category: "B Products", value: 20, count: 89, color: "#f59e0b" },
  { category: "C Products", value: 10, count: 267, color: "#ef4444" },
];

const stockLevelsData = [
  { product: "MacBook Pro", current: 45, optimal: 60, reorderPoint: 25, category: "Electronics" },
  { product: "iPhone 15", current: 23, optimal: 80, reorderPoint: 30, category: "Electronics" },
  { product: "Winter Jacket", current: 78, optimal: 50, reorderPoint: 20, category: "Clothing" },
  { product: "Organic Coffee", current: 12, optimal: 100, reorderPoint: 40, category: "Food" },
  { product: "Programming Book", current: 35, optimal: 25, reorderPoint: 10, category: "Books" },
];

const kpiData = [
  {
    title: "Inventory Accuracy",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: FiTarget,
    color: "emerald",
    description: "vs last month"
  },
  {
    title: "Stock Turnover",
    value: "6.8x",
    change: "+0.5x",
    trend: "up",
    icon: FiRefreshCw,
    color: "blue",
    description: "vs last quarter"
  },
  {
    title: "Stockout Risk",
    value: "12 items",
    change: "-3 items",
    trend: "up",
    icon: FiAlertTriangle,
    color: "amber",
    description: "critical level"
  },
  {
    title: "Carrying Cost",
    value: "$45.2K",
    change: "-$2.1K",
    trend: "up",
    icon: FiDollarSign,
    color: "purple",
    description: "monthly avg"
  },
];

const aiRecommendations = [
  {
    type: "reorder",
    title: "Urgent Reorder Alert",
    description: "iPhone 15 stock will run out in 5 days based on current sales velocity",
    action: "Order 50 units immediately",
    priority: "high",
    impact: "+$15,000 revenue saved"
  },
  {
    type: "optimize",
    title: "Price Optimization",
    description: "Winter Jackets are overstocked. Consider 15% discount promotion",
    action: "Apply promotional pricing",
    priority: "medium",
    impact: "+25% turnover rate"
  },
  {
    type: "forecast",
    title: "Seasonal Opportunity",
    description: "Coffee sales typically spike 40% in December. Increase stock now",
    action: "Increase order by 60 units",
    priority: "medium",
    impact: "+$8,500 potential revenue"
  },
];

// Custom Tooltip Components
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InsightsPage() {
  return (
    <PageLayout 
      title="Business Insights" 
      subtitle="AI-powered analytics and predictions for smart inventory management"
      actions={
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiCalendar size={16} />
            Last 6 months
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiDownload size={16} />
            Export Report
          </button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.map((kpi, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-${kpi.color}-50 group-hover:bg-${kpi.color}-100 transition-colors`}>
                <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
              </div>
              <div className="flex items-center gap-1 text-sm">
                {kpi.trend === 'up' ? (
                  <FiArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <FiArrowDownLeft className="w-4 h-4 text-rose-500" />
                )}
                <span className={`font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Inventory Turnover Analysis - 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inventory Turnover Analysis</h3>
              <p className="text-sm text-gray-500 mt-1">Track how quickly products sell across categories</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-white border border-gray-200 text-sm px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Last 6 months</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <FiMoreVertical size={16} />
              </button>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={inventoryTurnoverData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  label={{ value: 'Turnover Rate', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line type="monotone" dataKey="electronics" stroke="#8b5cf6" strokeWidth={3} name="Electronics" />
                <Line type="monotone" dataKey="clothing" stroke="#06b6d4" strokeWidth={3} name="Clothing" />
                <Line type="monotone" dataKey="food" stroke="#10b981" strokeWidth={3} name="Food & Beverage" />
                <Line type="monotone" dataKey="books" stroke="#f59e0b" strokeWidth={3} name="Books" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ABC Analysis - 1/3 width */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">ABC Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Revenue contribution by product category</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={abcAnalysisData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={450}
                >
                  {abcAnalysisData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Revenue Share']}
                  labelStyle={{ color: '#1f2937' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-4">
              {abcAnalysisData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{item.count} products</div>
                    <div className="text-xs text-gray-500">{item.value}% revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demand Forecasting */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <FiZap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Demand Forecasting</h3>
              <p className="text-sm text-gray-500 mt-1">Predictive analytics for future inventory needs</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">
            <FiZap size={14} />
            <span className="font-medium">95% Accuracy</span>
          </div>
        </div>
        <div className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={demandForecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Area
                type="monotone"
                dataKey="upperBound"
                stackId="1"
                stroke="transparent"
                fill="#e5e7eb"
                name="Confidence Band"
              />
              <Area
                type="monotone"
                dataKey="lowerBound"
                stackId="1"
                stroke="transparent"
                fill="#ffffff"
              />
              <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={3} name="Actual Sales" />
              <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" name="AI Prediction" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stock Levels vs Optimal Levels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Stock Level Analysis</h3>
            <p className="text-sm text-gray-500 mt-1">Current vs optimal inventory levels</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="product" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="current" fill="#06b6d4" name="Current Stock" />
                <Bar dataKey="optimal" fill="#8b5cf6" name="Optimal Level" />
                <Bar dataKey="reorderPoint" fill="#f59e0b" name="Reorder Point" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <FiTarget className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                  <p className="text-sm text-gray-500 mt-1">Smart insights for optimization</p>
                </div>
              </div>
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                View All
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    rec.priority === 'high' ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    {rec.type === 'reorder' && <FiAlertTriangle className={`w-4 h-4 ${
                      rec.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                    }`} />}
                    {rec.type === 'optimize' && <FiTarget className={`w-4 h-4 ${
                      rec.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                    }`} />}
                    {rec.type === 'forecast' && <FiTrendingUp className={`w-4 h-4 ${
                      rec.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                    }`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">{rec.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.priority === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <p className="text-sm font-medium text-gray-900 mt-2">{rec.action}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-1">{rec.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

