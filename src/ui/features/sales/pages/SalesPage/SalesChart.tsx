import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import { FiLoader } from "react-icons/fi";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  rangeLabel?: string;
  loading?: boolean;
}

const chartConfig = {
  revenue: {
    label: "Revenu",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export default function SalesChart({ data, rangeLabel, loading }: SalesChartProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || "fr-FR";

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat(currentLang, {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl ring-0 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-100 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {t("sales.charts.revenue_trend", "Tendance des revenus")}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-gray-500">
            {t("sales.charts.daily_revenue_30d", "Revenus quotidiens sur les 30 derniers jours")}
          </CardDescription>
        </div>
        {rangeLabel && (
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none">
            {rangeLabel}
          </button>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[350px] text-gray-400">
            <FiLoader className="w-6 h-6 mr-2 animate-spin" />
            <span className="text-sm">Chargement…</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-gray-400">
            <p className="text-sm font-medium">Aucune donnée sur la période</p>
            <p className="mt-1 text-xs text-gray-300">Essayez une plage plus large</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesRevenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString(currentLang, {
                    day: "numeric",
                    month: "short",
                  })
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) =>
                  new Intl.NumberFormat(currentLang, {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                    notation: "compact",
                  }).format(value)
                }
              />
              <ChartTooltip
                cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString(currentLang, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })
                    }
                    formatter={(value) => [formatCurrency(Number(value)), " " + t("sales.charts.revenue", "Revenu")]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#salesRevenueFill)"
                dot={false}
                activeDot={{ stroke: "var(--color-primary)", strokeWidth: 2, fill: "white", r: 5 }}
                animationDuration={600}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
