import { useMemo } from "react";
import { KpiCard } from "@/ui/components/common/KpiCard";
import type { InventoryItem } from "@/ui/features/inventory/types";
import { useTranslation } from "react-i18next";

interface InventoryStatsProps {
  products: InventoryItem[];
}

export function InventoryStats({ products }: InventoryStatsProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    // Keep internal logic associated with English status strings returned by backend or default
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
      <KpiCard
        label={t('inventory.stats.in_stock')}
        value={stats.inStock}
        color="primary"
      />
      <KpiCard
        label={t('inventory.stats.low_stock')}
        value={stats.lowStock}
        color="primary"
      />
      <KpiCard
        label={t('inventory.stats.out_of_stock')}
        value={stats.outOfStock}
        color="primary"
      />
      <KpiCard
        label={t('inventory.stats.total_products')}
        value={stats.totalProducts}
        color="primary"
      />
    </div>
  );
}
