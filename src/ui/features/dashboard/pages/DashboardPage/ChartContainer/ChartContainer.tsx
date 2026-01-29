import { useState, useEffect, useMemo } from "react";
import { CustomerDistributionChart } from "./CustomerDistributionChart";
import { RevenueChart } from "./RevenueChart";
import { salesService } from "@/infrastructure/api/services/salesService";
import type { Order } from "@/domain/models/Order";
import type { EvolutionDataPoint } from "@/domain/models/Sales";

interface ChartContainerProps {
  orders: Order[];
  dateRange: number;
}

export function ChartContainer({ orders }: ChartContainerProps) {
  const [revenueDataFromApi, setRevenueDataFromApi] = useState<EvolutionDataPoint[]>([]);

  // Fetch revenue data from sales API
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Get last 12 months date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const response = await salesService.getEvolutionByGrain({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          grain: 'month'
        });

        setRevenueDataFromApi(response.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setRevenueDataFromApi([]);
      }
    };

    fetchRevenueData();
  }, []);

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

  // Transform API data to chart format
  const revenueData = useMemo(() => {
    return revenueDataFromApi.map(dataPoint => {
      const date = new Date(dataPoint.date);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });

      return {
        month: monthName,
        revenue: Math.round(dataPoint.revenue),
        profit: Math.round(dataPoint.revenue * 0.7), // Estimate profit as 70% of revenue
      };
    });
  }, [revenueDataFromApi]);

  return (
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
      <RevenueChart data={revenueData} />
      <CustomerDistributionChart data={customerData} />
    </div>
  );
}


