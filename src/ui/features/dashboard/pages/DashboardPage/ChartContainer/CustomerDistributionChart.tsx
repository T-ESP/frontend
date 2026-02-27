import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CustomerDistributionChartProps } from "@/ui/features/dashboard/types";
import { useTranslation } from "react-i18next";

export function CustomerDistributionChart({ data }: CustomerDistributionChartProps) {
  const { t } = useTranslation();
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.charts.customer_title')}</h3>
        <p className="mt-1 text-sm text-gray-500">{t('dashboard.charts.customer_subtitle')}</p>
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
              // @ts-ignore
              formatter={(value: number) => [`${value}%`, t('common.percentage')]}
              labelStyle={{ color: '#1f2937' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-6 space-y-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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

