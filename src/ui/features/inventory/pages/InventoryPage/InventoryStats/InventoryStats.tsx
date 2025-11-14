import { FiPackage, FiTrendingUp } from "react-icons/fi";
import { inventoryStats } from "@/ui/features/inventory/constants";
import { InventoryStatCard } from "./InventoryStatCard";

export function InventoryStats() {
  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
      <InventoryStatCard
        label="In Stock"
        value={inventoryStats.inStock}
        icon={FiPackage}
        color="emerald"
      />
      <InventoryStatCard
        label="Low Stock"
        value={inventoryStats.lowStock}
        icon={FiTrendingUp}
        color="amber"
      />
      <InventoryStatCard
        label="Out of Stock"
        value={inventoryStats.outOfStock}
        icon={FiPackage}
        color="rose"
      />
      <InventoryStatCard
        label="Total Products"
        value={inventoryStats.totalProducts}
        icon={FiTrendingUp}
        color="blue"
      />
    </div>
  );
}

