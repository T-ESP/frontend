import { useState, useEffect } from "react";
import StatCard from "@/components/ui/StatCard";
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

      // Fetch data in parallel
      const [revenueData, evolutionData, basketData, ordersData] = await Promise.all([
        salesService.getTotalRevenue(period),
        salesService.getEvolution(period),
        salesService.getAverageBasket(period),
        orderService.getAll(),
      ]);

      setTotalRevenue(revenueData.total_revenue);
      setEvolution(evolutionData.evolution_percentage);
      setAverageBasket(basketData.average_basket);
      setTotalOrders(ordersData.length);
    } catch (error) {
      console.error('Error loading sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-[#f9fafc] min-h-screen px-6 py-8 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Sales</h1>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            growth={formatPercentage(evolution)}
            status={evolution >= 0 ? "up" : "down"}
            description="Last 30 days"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toString()}
            growth="+0.0%"
            status="up"
            description="All time"
          />
          <StatCard
            title="Average Basket"
            value={formatCurrency(averageBasket)}
            growth="+0.0%"
            status="up"
            description="Last 30 days"
          />
          <StatCard
            title="Revenue Growth"
            value={formatPercentage(evolution)}
            growth={formatPercentage(evolution)}
            status={evolution >= 0 ? "up" : "down"}
            description="vs previous period"
          />
        </div>
      )}

      {/* Chart */}
      <SalesChart />

      {/* Table */}
      <SalesTable />
    </div>
  );
}
