import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockSalesData = [
  { name: "Week 1", sales: 2400 },
  { name: "Week 2", sales: 1398 },
  { name: "Week 3", sales: 9800 },
  { name: "Week 4", sales: 3908 },
];

export default function SalesChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-800 font-semibold">Sales Details</p>
        <select className="bg-gray-100 text-sm px-3 py-1 rounded-md outline-none">
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
