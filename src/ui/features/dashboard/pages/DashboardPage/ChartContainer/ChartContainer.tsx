import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RevenueChart } from "./RevenueChart";
import { LatestPayments } from "./LatestPayments";
import { salesService } from "@/infrastructure/api/services/salesService";
import type { Order } from "@/domain/models/Order";
import type { User } from "@/domain/models/User";
import type { EvolutionDataPoint } from "@/domain/models/Sales";

interface ChartContainerProps {
  orders: Order[];
  users: User[];
  dateRange: number; // days selected globally (7, 30, 90, 365)
}

/** Pick the best grain for the API given the number of days selected. */
function grainForRange(days: number): "day" | "week" | "month" {
  if (days <= 30) return "day";
  if (days <= 90) return "week";
  return "month";
}

/** Human-readable X-axis label format per grain. */
function formatLabel(
  dateStr: string,
  grain: "day" | "week" | "month",
  locale: string
): string {
  const d = new Date(dateStr);
  if (grain === "month") {
    const label = d.toLocaleDateString(locale, { month: "short", year: "2-digit" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  if (grain === "week") {
    return d.toLocaleDateString(locale, { day: "2-digit", month: "short" });
  }
  // day
  return d.toLocaleDateString(locale, { day: "2-digit", month: "short" });
}

export function ChartContainer({ orders, users, dateRange }: ChartContainerProps) {
  const { t, i18n } = useTranslation();
  const [revenueDataFromApi, setRevenueDataFromApi] = useState<EvolutionDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  // Re-fetch whenever the global dateRange changes
  useEffect(() => {
    const fetchRevenueData = async () => {
      setLoading(true);
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - dateRange);

        const formatDate = (d: Date) => d.toISOString().split("T")[0];
        const grain = grainForRange(dateRange);

        const response = await salesService.getEvolutionByGrain({
          start_date: formatDate(startDate),
          end_date: formatDate(endDate),
          grain,
        });

        setRevenueDataFromApi(response.data);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
        setRevenueDataFromApi([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, [dateRange]); // 👈 re-runs whenever the global range changes

  // Transform API points → chart-friendly format
  const revenueData = useMemo(() => {
    const grain = grainForRange(dateRange);
    return revenueDataFromApi.map((point) => ({
      month: formatLabel(point.date, grain, i18n.language),
      revenue: Math.round(point.revenue),
      profit: Math.round(point.revenue * 0.7),
    }));
  }, [revenueDataFromApi, dateRange, i18n.language]);

  // Label shown in the chart header
  const rangeLabel = (() => {
    if (dateRange === 7) return t("common.date_range.last_7_days");
    if (dateRange === 90) return t("common.date_range.last_90_days");
    if (dateRange === 365) return t("common.date_range.last_year");
    return t("common.date_range.last_30_days");
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
      <div className="lg:col-span-2 flex flex-col">
        <RevenueChart data={revenueData} rangeLabel={rangeLabel} loading={loading} />
      </div>
      <div className="lg:col-span-1 flex flex-col min-w-0">
        <LatestPayments orders={orders} users={users} />
      </div>
    </div>
  );
}
