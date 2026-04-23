import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { RevenueChartProps } from "@/ui/features/dashboard/types";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/components/ui/card";

export function RevenueChart({ data }: RevenueChartProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.charts.revenue_title")}</CardTitle>
        <CardDescription>{t("dashboard.charts.revenue_subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b5fa2" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#7b5fa2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7b5fa2"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name={t("dashboard.charts.revenue")}
              connectNulls={true}
              animationDuration={800}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorProfit)"
              name={t("dashboard.charts.profit")}
              connectNulls={true}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
