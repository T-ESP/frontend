import { useMemo } from "react";
import { FiPackage, FiTrendingUp } from "react-icons/fi";
import { InventoryStatCard } from "./InventoryStatCard";
import type { InventoryItem } from "@/ui/features/inventory/types";

interface InventoryStatsProps {
  products: InventoryItem[];
}

export function InventoryStats({ products }: InventoryStatsProps) {
  const stats = useMemo(() => {
    const inStock = products.filter(p => p.status === "In Stock").length;
    const lowStock = products.filter(p => p.status === "Low Stock").length;
    const outOfStock = products.filter(p => p.status === "Out of Stock").length;
    const totalProducts = products.length;
    
    return {
      inStock,
      lowStock,
      outOfStock,
      totalProducts
    };
  }, [products]);

  return (
    <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
      <InventoryStatCard
        label="In Stock"
        value={stats.inStock}
        icon={FiPackage}
        color="emerald"
      />
      <InventoryStatCard
        label="Low Stock"
        value={stats.lowStock}
        icon={FiTrendingUp}
        color="amber"
      />
      <InventoryStatCard
        label="Out of Stock"
        value={stats.outOfStock}
        icon={FiPackage}
        color="rose"
      />
      <InventoryStatCard
        label="Total Products"
        value={stats.totalProducts}
        icon={FiTrendingUp}
        color="blue"
      />
    </div>
  );
}

