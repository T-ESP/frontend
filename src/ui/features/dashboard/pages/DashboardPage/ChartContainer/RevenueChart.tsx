import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { RevenueChartProps } from "@/ui/features/dashboard/types";
import { useTranslation } from "react-i18next";

export function RevenueChart({ data }: RevenueChartProps) {
  const { t } = useTranslation();
  // 1. Add state to track the selected range (default to 12 months)
  const [range, setRange] = useState<number>(12);

  // 2. Filter the data based on the selected range
  // We use useMemo so it only recalculates when data or range changes
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // slice(-range) takes the last 'range' items from the array
    // e.g., if range is 6, it takes the last 6 months
    return data.slice(-range);
  }, [data, range]);

  return (
    <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-2xl lg:col-span-2">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.charts.revenue_title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('dashboard.charts.revenue_subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* 3. Connect the select to the state */}
          <select
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg outline-none cursor-pointer focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={12}>{t('dashboard.charts.range.last_12')}</option>
            <option value={6}>{t('dashboard.charts.range.last_6')}</option>
            <option value={3}>{t('dashboard.charts.range.last_3')}</option>
          </select>
          {/*   <button className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-50">
            <FiMoreVertical size={16} />
          </button> */}
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          {/* 4. Pass the filteredData instead of the raw data */}
          <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7b5fa2"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name={t('dashboard.charts.revenue')}
              connectNulls={true}
              animationDuration={1000} // Smooth animation when data changes
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#a480d1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProfit)"
              name={t('dashboard.charts.profit')}
              connectNulls={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}