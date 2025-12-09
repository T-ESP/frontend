import { useState, useEffect } from "react";
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiRefreshCw } from "react-icons/fi";
import SalesChart from "@/ui/features/sales/pages/SalesPage/SalesChart";
import { SalesTable } from "@/ui/features/sales/pages/SalesPage/SalesTable";
import { salesService } from "@/infrastructure/api/services/salesService";
import { orderService } from "@/infrastructure/api/services/orderService";

export default function SalesPage() {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [evolution, setEvolution] = useState<number>(0);
  const [averageBasket, setAverageBasket] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSalesData();
  }, []);

  const loadSalesData = async () => {
    try {
      setLoading(true);
      
      // Get date ranges (last 30 days for current period)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const period = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };

      // Fetch data in parallel with error handling
      const [revenueData, evolutionData, basketData, ordersData] = await Promise.allSettled([
        salesService.getTotalRevenue(period),
        salesService.getEvolution(period),
        salesService.getAverageBasket(period),
        orderService.getAll(),
      ]);

      // Safely extract values with defaults
      if (revenueData.status === 'fulfilled' && revenueData.value) {
        setTotalRevenue(revenueData.value.total_revenue || 0);
      }
      
      if (evolutionData.status === 'fulfilled' && evolutionData.value) {
        setEvolution(evolutionData.value.evolution_percentage || 0);
      }
      
      if (basketData.status === 'fulfilled' && basketData.value) {
        setAverageBasket(basketData.value.average_basket || 0);
      }
      
      if (ordersData.status === 'fulfilled' && ordersData.value) {
        setTotalOrders(ordersData.value.length || 0);
      }
    } catch (error) {
      console.error('Error loading sales data:', error);
      // Set defaults on error
      setTotalRevenue(0);
      setEvolution(0);
      setAverageBasket(0);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | undefined | null) => {
    const numValue = value || 0;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercentage = (value: number | undefined | null) => {
    const numValue = value || 0;
    const sign = numValue >= 0 ? '+' : '';
    return `${sign}${numValue.toFixed(1)}%`;
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      change: formatPercentage(evolution),
      trend: evolution >= 0 ? "up" : "down",
      icon: FiDollarSign,
      color: "emerald",
      description: "Last 30 days"
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "+0.0%",
      trend: "up",
      icon: FiShoppingCart,
      color: "blue",
      description: "All time"
    },
    {
      title: "Average Basket",
      value: formatCurrency(averageBasket),
      change: "+0.0%",
      trend: "up",
      icon: FiTrendingUp,
      color: "purple",
      description: "Last 30 days"
    },
    {
      title: "Revenue Growth",
      value: formatPercentage(evolution),
      change: formatPercentage(evolution),
      trend: evolution >= 0 ? "up" : "down",
      icon: FiTrendingUp,
      color: "amber",
      description: "vs previous period"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Sales Dashboard</h3>
            <p className="text-sm text-gray-500 mt-0.5">Track your sales performance and revenue</p>
          </div>
          <button 
            onClick={loadSalesData}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl animate-pulse border border-gray-100 shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all">
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
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <SalesChart />

      {/* Table */}
      <SalesTable />
    </div>
  );
}
