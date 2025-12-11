import { SalesTableBody } from "./SalesTableBody";
import { SalesTableHead } from "./SalesTableHead";

interface SalesTableProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export default function SalesTable({ data }: SalesTableProps) {
  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-bold text-gray-900">Daily Performance</h3>
        <p className="text-sm text-gray-500">Breakdown of sales by day</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <SalesTableHead />
          <SalesTableBody data={data} />
        </table>
      </div>
    </div>
  );
}
