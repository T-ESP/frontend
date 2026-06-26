import { useState, type ReactNode } from 'react';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, Cell, LabelList, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

// Même palette colorée que les KPI du Dashboard (KPICard) : la courbe prend
// la couleur de la tendance (vert ↑ / rouge ↓), les barres un dégradé de marque.
const BRAND = 'hsl(var(--brand-h) var(--brand-s) var(--brand-l))';
const BRAND_LIGHT = 'hsl(var(--brand-h) calc(var(--brand-s) + 8%) calc(var(--brand-l) + 18%))';
const COLOR_UP = 'var(--color-success)';
const COLOR_DOWN = 'var(--color-error)';

function SparklineTooltip({ active, payload, title }: any) {
  if (!active || !payload || !payload.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="px-3 py-2 bg-card border border-border rounded-lg shadow-lg">
      <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
      <p className="text-sm font-bold text-foreground tabular-nums">
        {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
      </p>
    </div>
  );
}

export type KpiTrend = 'up' | 'down' | 'neutral';
export type KpiChartType = 'line' | 'bar';

export interface KpiStatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: KpiTrend;
  description?: string;
  chartData?: { value: number }[];
  chartType?: KpiChartType;
  showChartLabels?: boolean;
  icon?: ReactNode;
  infoTooltip?: string;
}

const FALLBACK_DATA = [
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
  { value: 0 },
];

function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1.5">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-muted-foreground/70 hover:text-muted-foreground transition-colors focus:outline-none"
        aria-label="Information"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-gray-900 text-white text-xs rounded-md px-3 py-2 shadow-lg pointer-events-none font-normal text-left">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

export function KpiStatCard({
  title,
  value,
  change,
  trend = 'neutral',
  description,
  chartData,
  chartType = 'line',
  showChartLabels = false,
  icon,
  infoTooltip,
}: KpiStatCardProps) {
  const data = chartData && chartData.length > 0 ? chartData : FALLBACK_DATA;

  const trendClass =
    trend === 'down' ? 'text-rose-500' : trend === 'up' ? 'text-emerald-500' : 'text-muted-foreground';

  // Couleur de la courbe selon la tendance (marque si neutre), comme KPICard.
  const lineColor = trend === 'down' ? COLOR_DOWN : trend === 'up' ? COLOR_UP : BRAND;
  const gradientId = `kpi-area-${title.replace(/\s+/g, '-')}`;
  const barGradientId = `kpi-bar-${title.replace(/\s+/g, '-')}`;
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="p-6 transition-all duration-300 bg-card border border-border rounded-lg flex flex-col justify-between h-[280px]">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[15px] text-foreground flex items-center">
            {title}
            {infoTooltip && <InfoTip text={infoTooltip} />}
          </h3>
          {icon && <span className="text-muted-foreground/70">{icon}</span>}
        </div>
        <p className="mt-5 text-2xl font-bold tracking-tight text-foreground tabular-nums">
          {value}
        </p>
        {(change || description) && (
          <div className="flex items-center gap-1.5 mt-2 text-[13px]">
            {change && (
              <span className={`font-semibold tracking-wide ${trendClass}`}>{change}</span>
            )}
            {description && <span className="text-muted-foreground">{description}</span>}
          </div>
        )}
      </div>

      <div className="mt-8 h-24 w-full">
        {chartType === 'line' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<SparklineTooltip title={title} />}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={lineColor}
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--card)', fill: lineColor }}
                isAnimationActive
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              barGap={2}
              barCategoryGap={6}
            >
              <defs>
                <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={1} />
                  <stop offset="100%" stopColor={BRAND_LIGHT} stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <Tooltip
                cursor={{ fill: 'color-mix(in srgb, var(--primary) 8%, transparent)' }}
                content={<SparklineTooltip title={title} />}
              />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.value === maxValue ? `url(#${barGradientId})` : BRAND}
                    fillOpacity={entry.value === maxValue ? 1 : 0.28}
                  />
                ))}
                {showChartLabels && (
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="var(--muted-foreground)"
                    fontSize={11}
                    fontWeight={500}
                    offset={8}
                  />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

/**
 * Helper: bucket items by day over the last N days based on a date field.
 * Returns an array of { value: number } usable directly by KpiStatCard.
 */
export function bucketByDay<T>(
  items: T[],
  dateField: (item: T) => string | undefined | null,
  reducer: (slice: T[]) => number,
  days = 7,
): { value: number }[] {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const buckets: T[][] = Array.from({ length: days }, () => []);

  items.forEach((it) => {
    const raw = dateField(it);
    if (!raw) return;
    const d = new Date(raw);
    const diffDays = Math.floor((d.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < days) {
      buckets[diffDays].push(it);
    }
  });

  return buckets.map((slice) => ({ value: reducer(slice) }));
}

/**
 * Simple distribution helper: takes the top N values, sorted desc.
 * Useful for static metrics that don't have a time series.
 */
export function topNDistribution<T>(
  items: T[],
  metric: (item: T) => number,
  n = 7,
): { value: number }[] {
  return [...items]
    .map((i) => metric(i))
    .filter((v) => Number.isFinite(v))
    .sort((a, b) => b - a)
    .slice(0, n)
    .map((v) => ({ value: v }));
}
