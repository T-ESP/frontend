import PageLayout from "@/layouts/PageLayout";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiTrendingUp, 
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiShoppingCart,
  FiEye,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiCalendar,
  FiFilter,
  FiDownload,
  FiMoreVertical,
  FiStar,
  FiHeart
} from "react-icons/fi";

// Enhanced data with more realistic values and better formatting
const revenueData = [
  { month: "Jan", revenue: 42000, profit: 28000, orders: 340 },
  { month: "Feb", revenue: 51000, profit: 35000, orders: 420 },
  { month: "Mar", revenue: 48000, profit: 32000, orders: 385 },
  { month: "Apr", revenue: 67000, profit: 45000, orders: 580 },
  { month: "May", revenue: 73000, profit: 52000, orders: 640 },
  { month: "Jun", revenue: 89000, profit: 61000, orders: 720 },
  { month: "Jul", revenue: 95000, profit: 68000, orders: 810 },
  { month: "Aug", revenue: 87000, profit: 59000, orders: 690 },
  { month: "Sep", revenue: 102000, profit: 74000, orders: 890 },
  { month: "Oct", revenue: 118000, profit: 85000, orders: 980 },
  { month: "Nov", revenue: 124000, profit: 89000, orders: 1050 },
  { month: "Dec", revenue: 135000, profit: 98000, orders: 1180 },
];

const customerData = [
  { name: "New Customers", value: 68.4, count: 34249, color: "#8b5cf6" },
  { name: "Returning", value: 31.6, count: 15824, color: "#06b6d4" },
];

const topProducts = [
  { 
    id: 1, 
    name: "MacBook Pro 16\"", 
    image: "https://i.imgur.com/mbNua4x.png", 
    sales: 2847, 
    revenue: "$428,050", 
    trend: "up", 
    change: "+12.5%",
    rating: 4.8 
  },
  { 
    id: 2, 
    name: "iPhone 15 Pro", 
    image: "https://i.imgur.com/7j9X5Kw.png", 
    sales: 1923, 
    revenue: "$192,300", 
    trend: "up", 
    change: "+8.3%",
    rating: 4.9 
  },
  { 
    id: 3, 
    name: "AirPods Pro", 
    image: "https://i.imgur.com/9wQm5Nx.png", 
    sales: 1456, 
    revenue: "$36,240", 
    trend: "down", 
    change: "-2.1%",
    rating: 4.7 
  },
];

const kpiData = [
  {
    title: "Total Revenue",
    value: "$1.2M",
    change: "+12.5%",
    trend: "up",
    icon: FiDollarSign,
    color: "emerald",
    description: "vs last month"
  },
  {
    title: "Total Orders",
    value: "8,540",
    change: "+8.3%", 
    trend: "up",
    icon: FiShoppingCart,
    color: "blue",
    description: "vs last month"
  },
  {
    title: "Active Customers",
    value: "2,847",
    change: "+15.2%",
    trend: "up", 
    icon: FiUsers,
    color: "purple",
    description: "vs last month"
  },
  {
    title: "Conversion Rate",
    value: "3.6%",
    change: "-0.8%",
    trend: "down",
    icon: FiTrendingUp,
    color: "amber",
    description: "vs last month"
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
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  return (
    <PageLayout 
      title="Dashboard" 
      subtitle="Monitor your business performance in real-time"
      actions={
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiCalendar size={16} />
            Last 30 days
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FiDownload size={16} />
            Export
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
        {/* Revenue Chart - 2/3 width */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
              <p className="text-sm text-gray-500 mt-1">Track your revenue and profit trends</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="bg-white border border-gray-200 text-sm px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>Last 3 months</option>
              </select>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <FiMoreVertical size={16} />
              </button>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Distribution - 1/3 width */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Customer Distribution</h3>
            <p className="text-sm text-gray-500 mt-1">New vs returning customers</p>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={customerData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  startAngle={90}
                  endAngle={450}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                  labelStyle={{ color: '#1f2937' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-4">
              {customerData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{item.count.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            <p className="text-sm text-gray-500 mt-1">Best selling products this month</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <FiFilter size={14} />
              Filter
            </button>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {topProducts.map((product, index) => (
            <div key={product.id} className="p-6 hover:bg-gray-50/50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-sm group-hover:shadow-md transition-shadow"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiShoppingCart className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{product.sales.toLocaleString()} sold</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{product.revenue}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {product.trend === 'up' ? (
                          <FiArrowUpRight className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <FiArrowDownLeft className="w-4 h-4 text-rose-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          product.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {product.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <FiEye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
