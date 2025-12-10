import { useState, useEffect } from "react";
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiRefreshCw, FiArrowRight, FiPieChart, FiAward } from "react-icons/fi"; // Lucide is better if you have it, but sticking to your imports
import SalesChart from "@/ui/features/sales/pages/SalesPage/SalesChart";
import { salesService } from "@/infrastructure/api/services/salesService";
import { orderService } from "@/infrastructure/api/services/orderService";
import { productService } from "@/infrastructure/api/services/productService";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";

// --- Types for our new insights ---
interface TopProduct {
  id: number;
  name: string;
  revenue: number;
  quantity: number;
}

interface CategoryData {
  name: string;
  value: number; // Revenue
  color: string;
  [key: string]: string | number; // Index signature for Recharts
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function SalesPage() {
  // ... (Keep existing state)
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(0);
  const [averageBasket, setAverageBasket] = useState<number>(0);
  const [averageBasketEvolution, setAverageBasketEvolution] = useState<number>(0);
  const [chartData, setChartData] = useState<Array<{ date: string; revenue: number; orders: number }>>([]);
  
  // New State for Insights
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      const period = { start_date: formatDate(startDate), end_date: formatDate(endDate), grain: 'day' };

      const [revenueData, basketData, ordersData, dailyRevenueData, productsData] = await Promise.allSettled([
        salesService.getTotalRevenue(period),
        salesService.getAverageBasket(period),
        orderService.getAll(),
        salesService.getEvolutionByGrain(period),
        productService.getAll(),
      ]);

      // ... (Keep your existing safety checks for revenue/basket) ...
      if (revenueData.status === 'fulfilled' && revenueData.value) setTotalRevenue(revenueData.value.total_revenue || 0);
      if (basketData.status === 'fulfilled' && basketData.value) {
        setAverageBasket(basketData.value.average_basket || 0);
        setAverageBasketEvolution(basketData.value.evolution_percentage || 0);
      }

      // --- NEW: Process Orders for Deep Insights ---
      if (ordersData.status === 'fulfilled' && ordersData.value && 
          productsData.status === 'fulfilled' && productsData.value) {
        setOrders(ordersData.value);
        await processInsights(ordersData.value, productsData.value);
      }

      // Process daily revenue data for the chart
      if (dailyRevenueData.status === 'fulfilled' && dailyRevenueData.value) {
        const dailyData = dailyRevenueData.value.data || [];
        
        // Calculate revenue growth from the daily data
        if (dailyData.length > 0) {
          const halfPoint = Math.floor(dailyData.length / 2);
          const firstHalf = dailyData.slice(0, halfPoint);
          const secondHalf = dailyData.slice(halfPoint);
          
          const firstHalfRevenue = firstHalf.reduce((sum, d) => sum + d.revenue, 0);
          const secondHalfRevenue = secondHalf.reduce((sum, d) => sum + d.revenue, 0);
          
          if (firstHalfRevenue > 0) {
            const growth = ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100;
            setRevenueGrowth(growth);
          }
        }
        
        // Create a map to count orders per day
        const ordersByDate = new Map<string, number>();
        if (ordersData.status === 'fulfilled' && ordersData.value) {
          ordersData.value.forEach(order => {
            if (order.status !== 'Cancelled') {
              const dateStr = new Date(order.order_date).toISOString().split('T')[0];
              ordersByDate.set(dateStr, (ordersByDate.get(dateStr) || 0) + 1);
            }
          });
        }

        // Combine revenue data with order counts
        const processedData = dailyData.map(item => ({
          date: item.date,
          revenue: item.revenue,
          orders: ordersByDate.get(item.date) || 0,
        }));

        setChartData(processedData);
      }

    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC TO EXTRACT INSIGHTS FROM ORDERS ---
  const processInsights = async (orders: Order[], products: Product[]) => {
    try {
      const productMap = new Map<number, TopProduct>();
      const categoryMap = new Map<string, number>();
      const productsById = new Map(products.map(p => [p.id, p]));

      // Filter valid orders
      const validOrders = orders.filter(order => 
        order.status !== 'Cancelled' && 
        order.amount > 0
      );

      console.log(`Processing ${validOrders.length} valid orders...`);

      // Process each order to get line items and aggregate by product and category
      const orderPromises = validOrders
        .map(order => 
          orderService.getOrderItems(order.id)
            .catch(err => {
              console.warn(`Failed to fetch items for order ${order.id}:`, err);
              return [];
            })
        );
      
      const allLineItems = await Promise.all(orderPromises);
      
      let totalItemsProcessed = 0;
      let itemsWithInvalidData = 0;

      // Aggregate data by product and category
      allLineItems.forEach((lineItems, orderIndex) => {
        if (!lineItems || lineItems.length === 0) return;
        
        lineItems.forEach(item => {
          totalItemsProcessed++;
          
          const product = productsById.get(item.product_id);
          if (!product) {
            console.warn(`Product not found for item:`, item);
            return;
          }

          // Get line total, with fallback calculation
          let lineTotal = item.line_total;
          
          // Validate and handle NaN/undefined
          if (typeof lineTotal !== 'number' || isNaN(lineTotal) || lineTotal === null || lineTotal === undefined) {
            // Fallback: calculate from order amount divided by number of items
            const order = validOrders[orderIndex];
            lineTotal = order.amount / lineItems.length;
            itemsWithInvalidData++;
            console.warn(`Invalid line_total for product ${product.name}, using fallback:`, lineTotal);
          }

          // Aggregate by product
          const existing = productMap.get(item.product_id);
          if (existing) {
            existing.revenue += lineTotal;
            existing.quantity += item.quantity || 1;
          } else {
            productMap.set(item.product_id, {
              id: item.product_id,
              name: product.name,
              revenue: lineTotal,
              quantity: item.quantity || 1,
            });
          }

          // Aggregate by category
          const category = product.category || 'Uncategorized';
          const currentCategoryTotal = categoryMap.get(category) || 0;
          categoryMap.set(category, currentCategoryTotal + lineTotal);
        });
      });

      console.log(`Processed ${totalItemsProcessed} items, ${itemsWithInvalidData} had invalid data`);
      console.log('Category totals:', Array.from(categoryMap.entries()));

      // Sort and set top products
      const sortedProducts = Array.from(productMap.values())
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      setTopProducts(sortedProducts);

      // Process categories with colors
      const processedCategories: CategoryData[] = Array.from(categoryMap.entries())
        .filter(([_, value]) => value > 0) // Filter out zero values
        .map(([name, value], index) => ({
          name,
          value: Number(value) || 0, // Ensure it's a number
          color: COLORS[index % COLORS.length]
        }))
        .sort((a, b) => b.value - a.value);

      console.log('Final processed categories:', processedCategories);
      setCategoryData(processedCategories);
      
    } catch (error) {
      console.error('Error processing insights:', error);
      // Set empty data on error
      setTopProducts([]);
      setCategoryData([]);
    }
  };

  // ... (Keep formatCurrency and formatPercentage helpers) ...
  const formatCurrency = (val: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(val);
  
  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: formatPercentage(revenueGrowth),
      trend: revenueGrowth >= 0 ? "up" : "down",
      icon: FiDollarSign,
      color: "emerald",
      description: "Last 30 days"
    },
    {
      title: "Total Orders",
      value: orders.filter(o => o.status !== 'Cancelled').length.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: "Last 30 days"
    },
    {
      title: "Average Basket",
      value: formatCurrency(averageBasket),
      change: formatPercentage(averageBasketEvolution),
      trend: averageBasketEvolution >= 0 ? "up" : "down",
      icon: FiTrendingUp,
      color: "purple",
      description: "Last 30 days"
    },
    {
      title: "Revenue Growth",
      value: formatPercentage(revenueGrowth),
      change: formatPercentage(revenueGrowth),
      trend: revenueGrowth >= 0 ? "up" : "down",
      icon: FiArrowRight,
      color: "indigo",
      description: "Trend"
    }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <FiDollarSign className="w-7 h-7 text-emerald-600" />
            Sales Dashboard
          </h1>
          <p className="text-slate-500 mt-2">
            Performance overview and analytics for the last 30 days
          </p>
        </div>
        <button 
          onClick={loadSalesData} 
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
        >
          <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="mb-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-xl animate-pulse border border-slate-100 shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Main Revenue Chart */}
      <div className="mb-6">
        <SalesChart data={chartData} />
      </div>

      {/* --- NEW SECTION: PERFORMANCE INSIGHTS (Replaces the boring table) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left Panel: Top Selling Products (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <FiAward className="text-amber-500" />
                    <h3 className="font-bold text-slate-900">Top Performing Products</h3>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>
            
            <div className="flex-1 overflow-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Units Sold</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Performance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {topProducts.map((product, idx) => (
                            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-xs text-slate-600">
                                            #{idx + 1}
                                        </div>
                                        <span className="text-sm font-medium text-slate-900">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                                    {product.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-slate-900">
                                    {formatCurrency(product.revenue)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="w-24 ml-auto bg-slate-100 rounded-full h-1.5">
                                        <div 
                                            className="bg-blue-600 h-1.5 rounded-full" 
                                            style={{ width: `${(product.revenue / topProducts[0].revenue) * 100}%` }} 
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Right Panel: Sales by Category (1/3 width) */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                <FiPieChart className="text-purple-500" />
                <h3 className="font-bold text-slate-900">Sales by Category</h3>
            </div>
            
            <div className="p-6 flex-1 flex flex-col items-center justify-center">
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                {/* Category List */}
                <div className="w-full mt-4 space-y-3">
                    {categoryData.slice(0, 4).map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-slate-600">{cat.name}</span>
                            </div>
                            <span className="font-semibold text-slate-900">{formatCurrency(cat.value)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}