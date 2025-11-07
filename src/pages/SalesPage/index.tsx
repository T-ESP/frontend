import SalesChart from "@/components/sales/SalesChart";
import SalesTable from "@/components/sales/SalesTable";
import StatCard from "@/components/ui/StatCard";

export default function SalesPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Sales Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Sales" value="€21,340" />
        <StatCard title="Revenue This Month" value="€4,920" />
        <StatCard title="Average Order Value" value="€53.30" />
        <StatCard title="Conversion Rate" value="2.4%" />
      </div>

      {/* Chart */}
      <SalesChart />

      {/* Table */}
      <SalesTable />
    </div>
  );
}
