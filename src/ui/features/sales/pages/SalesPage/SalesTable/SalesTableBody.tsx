import { TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SalesTableBodyProps {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export function SalesTableBody({ data }: SalesTableBodyProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (data.length === 0) {
    return (
      <TableBody>
        <TableRow className="hover:bg-transparent">
          <TableCell colSpan={4} className="h-24 px-6 text-center text-muted-foreground">
            No sales data available
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {data.map((row) => (
        <TableRow key={row.date}>
          <TableCell className="px-6 py-4 font-medium">{formatDate(row.date)}</TableCell>
          <TableCell className="hidden px-6 py-4 text-muted-foreground tabular-nums md:table-cell">
            {row.orders}
          </TableCell>
          <TableCell className="px-6 py-4 font-semibold tabular-nums">
            {formatCurrency(row.revenue)}
          </TableCell>
          <TableCell className="hidden px-6 py-4 text-muted-foreground tabular-nums md:table-cell">
            {row.orders > 0 ? formatCurrency(row.revenue / row.orders) : "-"}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}
