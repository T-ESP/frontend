import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CustomerDistributionChartProps } from "@/ui/features/dashboard/types";
import { useTranslation } from "react-i18next";

interface Props extends CustomerDistributionChartProps {
  rangeLabel?: string;
}

export function CustomerDistributionChart({ data, rangeLabel }: Props) {
  const { t } = useTranslation();

  return (
    <div className="border shadow-sm bg-card border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{t("dashboard.charts.customer_title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.charts.customer_subtitle")}</p>
          </div>
          {rangeLabel && (
            <span className="ml-2 mt-0.5 px-2.5 py-1 text-xs font-semibold text-primary bg-accent border border-primary/30 rounded-lg whitespace-nowrap">
              {rangeLabel}
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              startAngle={90}
              endAngle={450}
              animationDuration={600}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              // @ts-ignore
              formatter={(value: number) => [`${value}%`, t("common.percentage")]}
              contentStyle={{ borderRadius: 6, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }}
              labelStyle={{ color: "var(--foreground)" }}
              itemStyle={{ color: "var(--muted-foreground)" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold num text-foreground">{item.count.toLocaleString()}</div>
                <div className="text-xs num text-muted-foreground">{item.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
