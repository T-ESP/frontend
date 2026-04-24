import { Line, LineChart } from "recharts";
import { useTranslation } from "react-i18next";
import { FiLoader } from "react-icons/fi";
import type { RevenueChartProps } from "@/ui/features/dashboard/types";

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

interface Props extends RevenueChartProps {
  rangeLabel?: string;
  loading?: boolean;
}

const chartConfig = {
  revenue: {
    label: "Revenus",
    color: "#0f172a", // Dark gray/black for primary data
  },
  profit: {
    label: "Profit",
    color: "#9ca3af", // Light gray for secondary data
  },
} satisfies ChartConfig;

export function RevenueChart({ data, rangeLabel, loading }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden bg-white border border-gray-100 rounded-2xl lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-gray-100 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900">
            {t("dashboard.charts.revenue_title")}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-gray-500">
            {t("dashboard.charts.revenue_subtitle")}
          </CardDescription>
        </div>
        {/* Make the rangePicker look like the 'Export' button from the design */}
        {rangeLabel && (
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none">
            {rangeLabel}
          </button>
        )}
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[350px] text-gray-400">
            <FiLoader className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Chargement des données...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-gray-400">
            <p className="text-sm font-medium">Aucune donnée sur la période sélectionnée</p>
            <p className="text-xs mt-1 text-gray-300">Essayez une plage de dates plus large</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <ChartTooltip
                cursor={{ stroke: '#f1f5f9', strokeWidth: 1 }}
                content={<ChartTooltipContent />}
              />
              <Line
                type="natural"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ stroke: "var(--color-revenue)", strokeWidth: 2, fill: "white", r: 4 }}
                activeDot={{ stroke: "var(--color-revenue)", strokeWidth: 2, fill: "white", r: 6 }}
                connectNulls
                animationDuration={600}
              />
              <Line
                type="natural"
                dataKey="profit"
                stroke="var(--color-profit)"
                strokeWidth={2}
                dot={{ stroke: "var(--color-profit)", strokeWidth: 2, fill: "white", r: 4 }}
                activeDot={{ stroke: "var(--color-profit)", strokeWidth: 2, fill: "white", r: 6 }}
                connectNulls
                animationDuration={600}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}