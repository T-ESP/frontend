import { useState, type ReactNode } from 'react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, LabelList, Tooltip } from 'recharts';
import { Info } from 'lucide-react';

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
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <Tooltip
                cursor={{ stroke: '#1b2640', strokeWidth: 1 }}
                content={<SparklineTooltip title={title} />}
              />
              <Line
                type="linear"
                dataKey="value"
                stroke="#818cf8"
                strokeWidth={2}
                dot={{ stroke: '#818cf8', strokeWidth: 2, fill: '#0d1424', r: 4.5 }}
                activeDot={{ stroke: '#818cf8', strokeWidth: 2, fill: '#0d1424', r: 6 }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              barGap={2}
              barCategoryGap={6}
            >
              <Tooltip
                cursor={{ fill: 'rgba(129, 140, 248, 0.08)' }}
                content={<SparklineTooltip title={title} />}
              />
              <Bar dataKey="value" fill="#818cf8" radius={[3, 3, 0, 0]}>
                {showChartLabels && (
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="#94a3b8"
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
