import type { Sale } from "@/ui/features/sales/types";
import { SalesTableRow } from "./SalesTableRow";

interface SalesTableBodyProps {
  data: Sale[];
}

export function SalesTableBody({ data }: SalesTableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-100">
      {data.map((sale, index) => (
        <SalesTableRow key={sale.id} sale={sale} index={index} />
      ))}
    </tbody>
  );
}

