import { Table } from "@/components/ui/table";
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
    <div className="overflow-hidden rounded-2xl border bg-card text-card-foreground">
      <div className="border-b px-6 py-4">
        <h3 className="text-lg font-semibold">Daily Performance</h3>
        <p className="text-sm text-muted-foreground">Breakdown of sales by day</p>
      </div>
      <Table>
        <SalesTableHead />
        <SalesTableBody data={data} />
      </Table>
    </div>
  );
}
