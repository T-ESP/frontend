import { useState, useMemo } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CustomTooltip } from "../CustomTooltip/CustomTooltip";
import type { RevenueChartProps } from "@/ui/features/dashboard/types";

export function RevenueChart({ data }: RevenueChartProps) {
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
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Analytics</h3>
          <p className="mt-1 text-sm text-gray-500">Track your revenue and profit trends</p>
        </div>
        <div className="flex gap-3 items-center">
          {/* 3. Connect the select to the state */}
          <select 
            value={range}
            onChange={(e) => setRange(Number(e.target.value))}
            className="px-3 py-2 text-sm bg-white rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
          >
            <option value={12}>Last 12 months</option>
            <option value={6}>Last 6 months</option>
            <option value={3}>Last 3 months</option>
          </select>
          <button className="p-2 text-gray-400 rounded-lg transition-colors hover:text-gray-600 hover:bg-gray-50">
            <FiMoreVertical size={16} />
          </button>
        </div>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          {/* 4. Pass the filteredData instead of the raw data */}
          <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
              stroke="#8b5cf6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
              connectNulls={true}
              animationDuration={1000} // Smooth animation when data changes
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorProfit)"
              name="Profit"
              connectNulls={true}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}