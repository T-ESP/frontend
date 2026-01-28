import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CustomerDistributionChart } from "./CustomerDistributionChart";
import { RevenueChart } from "./RevenueChart";
import { salesService } from "@/infrastructure/api/services/salesService";
import type { Order } from "@/domain/models/Order";
import type { EvolutionDataPoint } from "@/domain/models/Sales";

interface ChartContainerProps {
  orders: Order[];
  dateRange: number;
}

export function ChartContainer({ orders, dateRange }: ChartContainerProps) {
  const { t } = useTranslation();
  const [revenueDataFromApi, setRevenueDataFromApi] = useState<EvolutionDataPoint[]>([]);

  // Fetch revenue data from sales API
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Calculate start date based on dateRange (or default to 12 months if dateRange is small/irrelevant for this chart?)
        // Actually, the revenue chart seems to be monthly evolution. Usually this implies a longer range. 
        // If dateRange is "Last 30 days", monthly evolution is boring (1 point). 
        // But for consistency let's use it or just accept it to fix the type error.
        // Let's assume dateRange is days.

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        // If range is large (> 90 days), use month grain, else day/week? 
        // The original code used 'month' grain and 12 months fixed.
        // Let's stick to the previous behavior if dateRange is not passed or handled specially?
        // But the error is that `dateRange` prop does not exist.
        // Let's just fix the interface locally.

        const response = await salesService.getEvolutionByGrain({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          grain: dateRange > 90 ? 'month' : 'day'
        });

        setRevenueDataFromApi(response.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setRevenueDataFromApi([]);
      }
    };

    fetchRevenueData();
  }, [dateRange]);

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
        name: t('dashboard.charts.new_customers'),
        value: parseFloat(newPercentage.toFixed(1)),
        count: newCustomers,
        color: "#8b5cf6"
      },
      {
        name: t('dashboard.charts.returning_customers'),
        value: parseFloat(returningPercentage.toFixed(1)),
        count: returningCustomers,
        color: "#06b6d4"
      },
    ];
  }, [orders, t]);

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


