import type { InventoryItem } from "@/ui/features/inventory/types";
import { TableBody } from "@/components/ui/table";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryTableBodyProps {
  data: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number, name: string) => void;
  onStockUpdate: (id: number, change: number) => Promise<void>;
  onViewKPIs: (id: number, name: string) => void;
}

export function InventoryTableBody({
  data,
  onEdit,
  onDelete,
  onStockUpdate,
  onViewKPIs,
}: InventoryTableBodyProps) {
  return (
    <TableBody>
      {data.map((item, index) => (
        <InventoryTableRow
          key={item.id}
          item={item}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onStockUpdate={onStockUpdate}
          onViewKPIs={onViewKPIs}
        />
      ))}
    </TableBody>
  );
}
