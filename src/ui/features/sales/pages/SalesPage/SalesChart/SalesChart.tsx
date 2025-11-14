import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockSalesData } from "@/ui/features/sales/constants";

export function SalesChart() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-gray-800">Sales Details</p>
        <select className="px-3 py-1 text-sm bg-gray-100 rounded-md outline-none">
          <option>October</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={mockSalesData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

