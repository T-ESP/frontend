import type { KPI } from "@/ui/features/dashboard/types";
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, Cell, Tooltip } from "recharts";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

// Palette alignée sur la page Insights : couleurs sémantiques via tokens CSS
// (theme-aware clair/sombre) plutôt que des couleurs figées.
const BRAND = "hsl(var(--brand-h) var(--brand-s) var(--brand-l))";
const BRAND_LIGHT = "hsl(var(--brand-h) calc(var(--brand-s) + 8%) calc(var(--brand-l) + 18%))";
const COLOR_UP = "var(--color-success)";
const COLOR_DOWN = "var(--color-error)";

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

  // La courbe prend la couleur de la tendance (vert ↑ / rouge ↓), comme les
  // catégories colorées d'Insights ; les barres gardent l'accent de marque.
  const lineColor = down ? COLOR_DOWN : COLOR_UP;
  const gradientId = `kpi-area-${kpi.title.replace(/\s+/g, "-")}`;
  const barGradientId = `kpi-bar-${kpi.title.replace(/\s+/g, "-")}`;

  // Met en valeur la barre la plus haute (comme « Most Day Active »).
  const maxValue = chartData ? Math.max(...chartData.map((d) => d.value)) : 0;

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
            <AreaChart data={chartData} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: "3 3" }}
                content={<SparklineTooltip title={kpi.title} />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)", fill: lineColor }}
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 18, right: 0, left: 0, bottom: 0 }} barCategoryGap={6}>
              <defs>
                <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={1} />
                  <stop offset="100%" stopColor={BRAND_LIGHT} stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ fill: "color-mix(in srgb, var(--primary) 8%, transparent)" }}
                content={<SparklineTooltip title={kpi.title} />}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive>
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.value === maxValue ? `url(#${barGradientId})` : BRAND}
                    fillOpacity={entry.value === maxValue ? 1 : 0.28}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
