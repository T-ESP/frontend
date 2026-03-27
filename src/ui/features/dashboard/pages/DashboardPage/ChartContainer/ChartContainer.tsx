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

  // Fetch revenue data using the global date range
  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        if (dateRange === 0) {
          startDate.setFullYear(2000, 0, 1);
        } else {
          startDate.setDate(startDate.getDate() - dateRange);
        }

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const response = await salesService.getEvolutionByGrain({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          grain: "month",
        });

        setRevenueDataFromApi(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
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
        color: "#7b5fa2"
      },
      {
        name: t('dashboard.charts.returning_customers'),
        value: parseFloat(returningPercentage.toFixed(1)),
        count: returningCustomers,
        color: "#a480d1"
      },
    ];
  }, [orders, t]);

  // Transform API data to chart format
  const { i18n } = useTranslation();
  const revenueData = useMemo(() => {
    return revenueDataFromApi.map((dataPoint) => {
      const date = new Date(dataPoint.date);
      // Since we forced grain='month', we always show the month
      // Use current i18n language for proper locale translation
      let label = date.toLocaleDateString(i18n.language, { month: "short" });

      // Capitalize first letter (often cleaner for UI)
      label = label.charAt(0).toUpperCase() + label.slice(1);

      return {
        month: label,
        revenue: Math.round(dataPoint.revenue),
        profit: dataPoint.profit != null ? Math.round(dataPoint.profit) : Math.round(dataPoint.revenue * 0.7),
      };
    });
  }, [revenueDataFromApi, i18n.language]);

  return (
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
      <RevenueChart data={revenueData} />
      <CustomerDistributionChart data={customerData} />
    </div>
  );
}


