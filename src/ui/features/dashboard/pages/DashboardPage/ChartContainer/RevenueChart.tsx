import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { RevenueChartProps } from "@/ui/features/dashboard/types";
import { useTranslation } from "react-i18next";
import { FiLoader } from "react-icons/fi";

interface Props extends RevenueChartProps {
  rangeLabel?: string;
  loading?: boolean;
}

export function RevenueChart({ data, rangeLabel, loading }: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t("dashboard.charts.revenue_title")}</h3>
          <p className="mt-1 text-sm text-gray-500">{t("dashboard.charts.revenue_subtitle")}</p>
        </div>
        {/* Display the globally-selected range instead of an independent picker */}
        {rangeLabel && (
          <span className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-lg">
            {rangeLabel}
          </span>
        )}
      </div>

      <div className="p-6">
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
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7b5fa2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7b5fa2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a480d1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a480d1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                // Avoid label crowding on wide datasets
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(v) => `€${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#7b5fa2"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name={t("dashboard.charts.revenue")}
                connectNulls
                animationDuration={600}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#a480d1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorProfit)"
                name={t("dashboard.charts.profit")}
                connectNulls
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}