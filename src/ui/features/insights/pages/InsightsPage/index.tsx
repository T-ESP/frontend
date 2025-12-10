import { useState, useEffect } from "react";
import PageLayout from "@/ui/components/layouts/PageLayout";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, LineChart, Line
} from "recharts";
import { 
  FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiPackage, 
  FiActivity, FiTruck, FiRefreshCw 
} from "react-icons/fi"; // Switched to Feather icons (fi) consistent with your imports
import { productService } from "@/infrastructure/api/services/productService";
import type { Product } from "@/domain/models/Product";

// Colors for charts
const COLORS = {
  A: "#10b981", // Emerald (High Value)
  B: "#3b82f6", // Blue (Med Value)
  C: "#f59e0b", // Amber (Low Value)
  stockout: "#ef4444",
  low: "#f59e0b",
  healthy: "#10b981",
  overstock: "#8b5cf6"
};

export default function InsightsPage() {
  const [loading, setLoading] = useState(true);
  
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
      setLoading(true);
      // Fetch all products to perform client-side aggregation
      // In a real huge app, the backend should provide /analytics/summary endpoints
      const products = await productService.getAll();
      
      processStockHealth(products);
      processABCAnalysis(products);
      identifyRisks(products);
      
    } catch (error) {
      console.error("Failed to load insights", error);
    } finally {
      setLoading(false);
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
      { name: "Out of Stock", value: stockout, color: COLORS.stockout },
      { name: "Low Stock", value: low, color: COLORS.low },
      { name: "Healthy", value: healthy, color: COLORS.healthy },
      { name: "Overstock", value: overstock, color: COLORS.overstock },
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
      { name: "Class A (High Value)", value: countA, color: COLORS.A },
      { name: "Class B (Med Value)", value: countB, color: COLORS.B },
      { name: "Class C (Low Value)", value: countC, color: COLORS.C },
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
      title="Inventory Intelligence" 
      subtitle="Stock optimization, health monitoring, and risk prediction"
    >
      {/* 1. Global Inventory KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="Inventory Value" 
          value={formatCurrency(globalStats.totalValue)} 
          icon={FiDollarSign} 
          color="emerald" 
          trend="up" 
          change="+12% vs last month"
        />
        <KpiCard 
          title="Stock Turnover" 
          value={`${globalStats.turnoverRate}x`} 
          icon={FiRefreshCw} 
          color="blue" 
          trend="up" 
          change="Efficient"
        />
        <KpiCard 
          title="Stockout Risk" 
          value={globalStats.stockoutCount.toString()} 
          icon={FiAlertTriangle} 
          color="rose" 
          trend="down" 
          change="Items out of stock"
        />
        <KpiCard 
          title="Overstock Alerts" 
          value={globalStats.overstockCount.toString()} 
          icon={FiPackage} 
          color="purple" 
          trend="up" 
          change="Capital tied up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* 2. Stock Health Distribution (Pie Chart) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Stock Health Status</h3>
            <p className="text-sm text-gray-500">Distribution of inventory levels</p>
          </div>
          <div className="flex-1 min-h-[250px]">
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
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. ABC Analysis (Bar Chart) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">ABC Classification</h3>
            <p className="text-sm text-gray-500">Pareto Analysis (80/20 Rule)</p>
          </div>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={abcStats} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {abcStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-xs text-gray-500 text-center">
            Class A: Vital products generating 80% of revenue.
          </div>
        </div>

        {/* 4. Actionable Risks (Table) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <div>
               <h3 className="text-lg font-bold text-gray-900">Critical Alerts</h3>
               <p className="text-sm text-gray-500">High value items running low</p>
             </div>
             <FiActivity className="text-rose-500" />
           </div>
           <div className="flex-1 overflow-auto p-2">
             <table className="w-full">
               <tbody className="divide-y divide-gray-50">
                 {riskProducts.map((p) => (
                   <tr key={p.id} className="hover:bg-gray-50">
                     <td className="py-3 px-4">
                       <p className="text-sm font-medium text-gray-900">{p.name}</p>
                       <p className="text-xs text-gray-500">{p.category}</p>
                     </td>
                     <td className="py-3 px-4 text-right">
                       <div className="flex items-center justify-end gap-2 text-rose-600">
                         <FiAlertTriangle size={14} />
                         <span className="text-sm font-bold">{p.stock_quantity} left</span>
                       </div>
                       <p className="text-xs text-gray-400">Reorder now</p>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
           <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700">
                View full Restock Plan
              </button>
           </div>
        </div>

      </div>

      {/* 5. Supplier Reliability Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <FiTruck size={20} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-gray-900">Supplier Reliability Forecast</h3>
                <p className="text-sm text-gray-500">Based on recent restock delays</p>
            </div>
        </div>
        {/* Placeholder for Supplier Chart - Use SalesChart component logic here but for delivery times */}
        <div className="h-48 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-dashed border-slate-200">
            Chart: Delivery Delays vs Supplier Promise (Coming Soon)
        </div>
      </div>
    </PageLayout>
  );
}

// Simple internal component for KPI Cards
function KpiCard({ title, value, icon: Icon, color, change, trend }: any) {
    // ... (Your existing KPI card logic)
    // To save space in this message, reuse the same KPI card design you already have!
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                    <Icon size={24} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {change}
                </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
    )
}
import { FiDollarSign } from "react-icons/fi";