import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
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
    // Série principale = couleur de marque (identique à Insights & Sales).
    color: "var(--color-primary)",
  },
  profit: {
    label: "Profit",
    // Série secondaire = nuance claire de la marque (cf. Insights ABC).
    color: "hsl(var(--brand-h) calc(var(--brand-s) + 8%) calc(var(--brand-l) + 18%))",
  },
} satisfies ChartConfig;

/** Format compact pour l'axe des ordonnées : 1 200 → « 1,2 k€ ». */
const formatCompactEUR = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export function RevenueChart({ data, rangeLabel, loading }: Props) {
  const { t } = useTranslation();

  return (
    <Card className="overflow-hidden border bg-card border-border rounded-lg lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">
            {t("dashboard.charts.revenue_title")}
          </CardTitle>
          <CardDescription className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.charts.revenue_subtitle")}
          </CardDescription>
        </div>
        {/* Make the rangePicker look like the 'Export' button from the design */}
        {rangeLabel}
      </CardHeader>

      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-[350px] text-muted-foreground">
            <FiLoader className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Chargement des données...</span>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
            <p className="text-sm font-medium">Aucune donnée sur la période sélectionnée</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Essayez une plage de dates plus large</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <LineChart data={data} margin={{ top: 20, right: 20, left: 8, bottom: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={24}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                width={64}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                tickFormatter={(v) => formatCompactEUR(Number(v))}
              />
              <ChartTooltip
                cursor={{ stroke: '#f1f5f9', strokeWidth: 1 }}
                content={<ChartTooltipContent labelKey="month" />}
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