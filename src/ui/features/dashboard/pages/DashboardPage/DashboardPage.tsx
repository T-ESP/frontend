import { useState, useEffect } from "react";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { KPICards } from "./KPICards";
import { ChartContainer } from "./ChartContainer";
import { TopProducts } from "./TopProducts";
import { PageActions } from "./PageActions/PageActions";
import { orderService } from "@/infrastructure/api/services/orderService";
import { productService } from "@/infrastructure/api/services/productService";
import { userService } from "@/infrastructure/api/services/userService";
import { salesService } from "@/infrastructure/api/services/salesService";
import type { Order } from "@/domain/models/Order";
import type { Product } from "@/domain/models/Product";
import type { User } from "@/domain/models/User";

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [evolution, setEvolution] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get date ranges (last 30 days)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      const period = {
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
      };

      // Fetch all data in parallel
      const [ordersData, productsData, usersData, revenueData, evolutionData] = await Promise.all([
        orderService.getAll(),
        productService.getAll(),
        userService.getAll(),
        salesService.getTotalRevenue(period),
        salesService.getEvolution(period),
      ]);

      setOrders(ordersData);
      setProducts(productsData);
      setUsers(usersData);
      setTotalRevenue(revenueData.total_revenue);
      setEvolution(evolutionData.evolution_percentage);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Monitor your business performance in real-time"
      actions={<PageActions />}
    >
      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100" />
            ))}
          </div>
          <div className="h-96 bg-white rounded-2xl animate-pulse border border-gray-100" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <KPICards 
            orders={orders}
            products={products}
            users={users}
            totalRevenue={totalRevenue}
            evolution={evolution}
          />

          <ChartContainer orders={orders} />

          <TopProducts products={products} />
        </>
      )}
    </PageLayout>
  );
}