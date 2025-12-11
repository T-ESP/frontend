import type { InventoryItem } from "@/ui/features/inventory/types";
import { InventoryCard } from "./InventoryCard";

interface InventoryCardGridProps {
  data: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number, name: string) => void;
  onStockUpdate: (id: number, change: number) => Promise<void>;
  onViewKPIs: (id: number, name: string) => void;
}

export function InventoryCardGrid({ data, onEdit, onDelete, onStockUpdate, onViewKPIs }: InventoryCardGridProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <InventoryCard
          key={item.id}
          item={item}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onStockUpdate={onStockUpdate}
          onViewKPIs={onViewKPIs}
        />
      ))}
    </div>
  );
}
