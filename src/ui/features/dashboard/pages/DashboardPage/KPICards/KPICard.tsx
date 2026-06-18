import type { KPI } from "@/ui/features/dashboard/types";
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, LabelList, Tooltip } from "recharts";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { CHART } from "@/ui/theme/chartTheme";

function SparklineTooltip({ active, payload, title }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="px-3 py-2 border rounded-md shadow-lg bg-card border-border">
      <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
      <p className="text-sm font-bold num text-foreground">
        {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
      </p>
    </div>
  );
}

export function KPICard({ kpi }: { kpi: KPI }) {
  const isLine = kpi.chartType !== "bar";
  const chartData = kpi.sparkline && kpi.sparkline.length > 0 ? kpi.sparkline : null;
  const down = kpi.trend === "down";
  // La sparkline reste en couleur de marque ; seul le badge ↑/↓ % reflète la tendance.
  const accent = CHART.accent;

  return (
    <div className="flex flex-col justify-between p-4 transition-colors border bg-card border-border rounded-lg min-h-[180px] md:h-[240px] hover:border-primary/30">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="term-label">{kpi.title}</h3>
          {kpi.change && (
            <span
              className={`inline-flex items-center gap-0.5 text-[11px] font-bold num ${
                down ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {down ? <FiArrowDown className="w-3 h-3" /> : <FiArrowUp className="w-3 h-3" />}
              {kpi.change}
            </span>
          )}
        </div>
        <p className="mt-3 text-2xl font-bold num text-foreground">{kpi.value}</p>
        <p className="mt-1 text-[13px] text-muted-foreground">{kpi.description}</p>
      </div>

      {/* Mini Graphs Section */}
      <div className="w-full mt-6 h-20">
        {chartData === null ? (
          <div className="flex items-center justify-center h-full text-xs text-muted-foreground/50">—</div>
        ) : isLine ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 6, left: 6, bottom: 0 }}>
              <defs>
                <linearGradient id={`kpi-${kpi.title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ stroke: CHART.grid, strokeWidth: 1 }}
                content={<SparklineTooltip title={kpi.title} />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={accent}
                strokeWidth={2}
                fill={`url(#kpi-${kpi.title})`}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 18, right: 0, left: 0, bottom: 0 }} barGap={2} barCategoryGap={6}>
              <Tooltip
                cursor={{ fill: "rgba(129, 140, 248, 0.08)" }}
                content={<SparklineTooltip title={kpi.title} />}
              />
              <Bar dataKey="value" fill={accent} radius={[2, 2, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  fill={CHART.axis}
                  fontSize={10}
                  fontWeight={500}
                  offset={6}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
