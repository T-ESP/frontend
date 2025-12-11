import { useMemo } from "react";
import { customerData } from "@/ui/features/dashboard/constants";
import { CustomerDistributionChart } from "./CustomerDistributionChart";
import { RevenueChart } from "./RevenueChart";
import type { Order } from "@/domain/models/Order";

interface ChartContainerProps {
  orders: Order[];
}

export function ChartContainer({ orders }: ChartContainerProps) {
  // Group orders by month and calculate revenue
  const revenueData = useMemo(() => {
    const monthlyData = new Map<string, { revenue: number, orders: number }>();
    
    orders.forEach(order => {
      const date = new Date(order.order_date);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      const existing = monthlyData.get(monthKey) || { revenue: 0, orders: 0 };
      // Ensure amount is treated as a number
      const amount = typeof order.amount === 'number' ? order.amount : parseFloat(order.amount.toString());
      
      monthlyData.set(monthKey, {
        revenue: existing.revenue + amount,
        orders: existing.orders + 1,
      });
    });

    // Get last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map(month => {
      const data = monthlyData.get(month) || { revenue: 0, orders: 0 };
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