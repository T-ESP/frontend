import { useMemo } from "react";
import { CustomerDistributionChart } from "./CustomerDistributionChart";
import { RevenueChart } from "./RevenueChart";
import type { Order } from "@/domain/models/Order";

interface ChartContainerProps {
  orders: Order[];
}

export function ChartContainer({ orders }: ChartContainerProps) {
  // Calculate customer distribution (new vs returning)
  const customerData = useMemo(() => {
    const userOrderCounts = new Map<number, number>();
    
    // Count orders per user
    orders.forEach(order => {
      const count = userOrderCounts.get(order.user_id) || 0;
      userOrderCounts.set(order.user_id, count + 1);
    });
    
    // Classify as new (1 order) or returning (2+ orders)
    let newCustomers = 0;
    let returningCustomers = 0;
    
    userOrderCounts.forEach(orderCount => {
      if (orderCount === 1) {
        newCustomers++;
      } else {
        returningCustomers++;
      }
    });
    
    const total = newCustomers + returningCustomers || 1;
    const newPercentage = (newCustomers / total) * 100;
    const returningPercentage = (returningCustomers / total) * 100;
    
    return [
      { 
        name: "New Customers", 
        value: parseFloat(newPercentage.toFixed(1)), 
        count: newCustomers, 
        color: "#8b5cf6" 
      },
      { 
        name: "Returning", 
        value: parseFloat(returningPercentage.toFixed(1)), 
        count: returningCustomers, 
        color: "#06b6d4" 
      },
    ];
  }, [orders]);

  // Group orders by month and calculate revenue
  const revenueData = useMemo(() => {
    // Generate last 12 months chronologically
    const last12Months: { month: string; year: number; key: string }[] = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      last12Months.push({
        month: monthName,
        year,
        key: `${year}-${String(date.getMonth() + 1).padStart(2, '0')}` // e.g., "2024-12"
      });
    }
    
    // Group orders by month-year
    const monthlyData = new Map<string, { revenue: number, orders: number }>();
    
    orders.forEach(order => {
      const date = new Date(order.order_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = monthlyData.get(monthKey) || { revenue: 0, orders: 0 };
      
      monthlyData.set(monthKey, {
        revenue: existing.revenue + order.amount,
        orders: existing.orders + 1,
      });
    });
    
    // Map the last 12 months with their data
    return last12Months.map(({ month, key }) => {
      const data = monthlyData.get(key);
      
      // If no orders in this month, use null so the chart skips it (creates continuous line)
      if (!data || data.orders === 0) {
        return {
          month,
          revenue: null,
          profit: null,
          orders: 0,
        };
      }
      
      return {
        month,
        revenue: Math.round(data.revenue),
        profit: Math.round(data.revenue * 0.7), // Estimate profit as 70% of revenue
        orders: data.orders,
      };
    });
  }, [orders]);

  return (
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
      <RevenueChart data={revenueData} />
      <CustomerDistributionChart data={customerData} />
    </div>
  );
}