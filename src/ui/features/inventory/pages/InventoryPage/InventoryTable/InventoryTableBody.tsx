import type { InventoryItem } from "@/ui/features/inventory/types";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryTableBodyProps {
  data: InventoryItem[];
}

export function InventoryTableBody({ data }: InventoryTableBodyProps) {
  return (
    <tbody className="divide-y divide-gray-100">
      {data.map((item, index) => (
        <InventoryTableRow key={item.id} item={item} index={index} />
      ))}
    </tbody>
  );
}

