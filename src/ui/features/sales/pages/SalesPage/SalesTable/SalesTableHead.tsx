import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SalesTableHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="px-6">Date</TableHead>
        <TableHead className="px-6">Orders Count</TableHead>
        <TableHead className="px-6">Revenue</TableHead>
        <TableHead className="px-6">Average Basket</TableHead>
      </TableRow>
    </TableHeader>
  );
}
