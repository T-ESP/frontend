import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CustomerDistributionChartProps } from "@/ui/features/dashboard/types";



export function CustomerDistributionChart({ data }: CustomerDistributionChartProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Customer Distribution</h3>
        <p className="mt-1 text-sm text-gray-500">New vs returning customers</p>
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
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Percentage']}
              labelStyle={{ color: '#1f2937' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{item.count.toLocaleString()}</div>
                <div className="text-xs text-gray-500">{item.value}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

