import StatCard from "@/components/ui/StatCard";
import SalesChart from "@/ui/features/sales/pages/SalesPage/SalesChart";
import { SalesTable } from "@/ui/features/sales/pages/SalesPage/SalesTable";

export default function SalesPage() {
  return (
    <div className="bg-[#f9fafc] min-h-screen px-6 py-8 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Sales</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value="40,689"
          growth="+8.5%"
          status="up"
          description="Up from yesterday"
        />
        <StatCard
          title="Total Orders"
          value="10,293"
          growth="+1.3%"
          status="up"
          description="Up from past week"
        />
        <StatCard
          title="Total Sales"
          value="$89,000"
          growth="-4.3%"
          status="down"
          description="Down from yesterday"
        />
        <StatCard
          title="Total Pending"
          value="2,040"
          growth="+1.8%"
          status="up"
          description="Up from yesterday"
        />
      </div>

      {/* Chart */}
      <SalesChart />

      {/* Table */}
      <SalesTable />
    </div>
  );
}
