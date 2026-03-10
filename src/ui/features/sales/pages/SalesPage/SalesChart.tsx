import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

interface SalesChartProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export default function SalesChart({ data }: SalesChartProps) {
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language || 'fr-FR';
  const formatExtCurrency = (val: number) =>
    new Intl.NumberFormat(currentLang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="p-6 bg-white border shadow-sm rounded-xl border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{t('sales.charts.revenue_trend', 'Tendance des revenus')}</h3>
          <p className="text-sm text-slate-500">{t('sales.charts.daily_revenue_30d', 'Revenus quotidiens sur les 30 derniers jours')}</p>
        </div>
      </div>

      <div className="h-75 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7b5fa2" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#7b5fa2" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString(currentLang, { day: 'numeric', month: 'numeric' });
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={(value) => {
                // Format compact for YAxis
                return new Intl.NumberFormat(currentLang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, notation: "compact" }).format(value);
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => [formatExtCurrency(value), t('sales.charts.revenue', 'Revenu')]}
              labelFormatter={(label) => new Date(label).toLocaleDateString(currentLang, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#7b5fa2"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
