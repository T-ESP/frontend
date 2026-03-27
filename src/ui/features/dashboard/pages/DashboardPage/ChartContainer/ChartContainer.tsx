import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RevenueChart } from "./RevenueChart";
import { salesService } from "@/infrastructure/api/services/salesService";
import type { Order } from "@/domain/models/Order";
import type { EvolutionDataPoint } from "@/domain/models/Sales";

interface ChartContainerProps {
  orders: Order[];
  dateRange: number;
}

export function ChartContainer({ dateRange }: ChartContainerProps) {
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

        const grain = dateRange > 0 && dateRange <= 30 ? "day" : "month";

        const response = await salesService.getEvolutionByGrain({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          grain,
        });

        setRevenueDataFromApi(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setRevenueDataFromApi([]);
      }
    };

    fetchRevenueData();
  }, [dateRange]);

  // Transform API data to chart format
  const { i18n } = useTranslation();
  const revenueData = useMemo(() => {
    return revenueDataFromApi.map((dataPoint) => {
      const date = new Date(dataPoint.date);
      let label: string;

      if (dateRange > 0 && dateRange <= 30) {
        // day grain → "14 Mar"
        label = date.toLocaleDateString(i18n.language, { day: "numeric", month: "short" });
      } else {
        // month grain → "Mar."
        label = date.toLocaleDateString(i18n.language, { month: "short" });
      }

      label = label.charAt(0).toUpperCase() + label.slice(1);

      return {
        month: label,
        revenue: Math.round(dataPoint.revenue),
        profit: dataPoint.profit != null ? Math.round(dataPoint.profit) : Math.round(dataPoint.revenue * 0.7),
      };
    });
  }, [revenueDataFromApi, i18n.language, dateRange]);

  return (
    <div className="mb-8">
      <RevenueChart data={revenueData} />
      {/* <CustomerDistributionChart data={customerData} /> */}
    </div>
  );
}


