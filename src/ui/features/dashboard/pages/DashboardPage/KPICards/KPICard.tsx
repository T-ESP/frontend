import type { KPI } from "@/ui/features/dashboard/types";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, LabelList } from "recharts";

export function KPICard({ kpi }: { kpi: KPI }) {
  const isLine = kpi.chartType !== "bar";
  const chartData = kpi.sparkline && kpi.sparkline.length > 0 ? kpi.sparkline : null;

  return (
    <div className="p-6 transition-all duration-300 bg-white border border-gray-200 rounded-2xl flex flex-col justify-between min-h-[200px] md:h-[280px]">
      <div>
        <h3 className="font-semibold text-[15px] text-gray-900">{kpi.title}</h3>
        <p className="mt-5 text-2xl font-bold tracking-tight text-gray-900 tabular-nums">
          {kpi.value}
        </p>
        <div className="flex items-center gap-1.5 mt-2 text-[13px]">
          {/* Trend color matcher based on standard UI */}
          <span className={`font-semibold tracking-wide ${kpi.trend === "down" ? "text-rose-500" : "text-emerald-500"}`}>
            {kpi.change}
          </span>
          <span className="text-gray-500">{kpi.description}</span>
        </div>
      </div>

      {/* Mini Graphs Section */}
      <div className="mt-8 h-24 w-full">
        {chartData === null ? (
          <div className="flex items-center justify-center h-full text-xs text-gray-300">—</div>
        ) : isLine ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <Line
                type="linear"
                dataKey="value"
                stroke="#0f172a"
                strokeWidth={2}
                dot={{ stroke: "#0f172a", strokeWidth: 2, fill: "white", r: 4.5 }}
                activeDot={{ stroke: "#0f172a", strokeWidth: 2, fill: "white", r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barGap={2} barCategoryGap={6}>
              <Bar dataKey="value" fill="#0f172a" radius={[3, 3, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#374151"
                  fontSize={11}
                  fontWeight={500}
                  offset={8}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
