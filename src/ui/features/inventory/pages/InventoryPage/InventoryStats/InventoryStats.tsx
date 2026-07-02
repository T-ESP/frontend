import { useMemo } from 'react';
import type { InventoryItem } from '@/ui/features/inventory/types';
import { useTranslation } from 'react-i18next';
import { StatCard, CompositionBar, CategoryBars, ShareBar } from '@/ui/components/common/SnapshotStat/SnapshotStat';
import { SNAPSHOT_COLORS } from '@/ui/components/common/SnapshotStat/colors';

interface InventoryStatsProps {
  products: InventoryItem[];
}

const parsePrice = (s: string) => parseFloat(s.replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;

export function InventoryStats({ products }: InventoryStatsProps) {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.status === 'In Stock').length;
    const lowStock = products.filter((p) => p.status === 'Low Stock').length;
    const outOfStock = products.filter((p) => p.status === 'Out of Stock').length;
    const totalValue = products.reduce((sum, p) => sum + parsePrice(p.price) * p.piece, 0);
    return { total, inStock, lowStock, outOfStock, totalValue };
  }, [products]);

  // Top catégories par valeur de stock (prix × quantité) — vraie répartition, pas une tendance.
  const topCategories = useMemo(() => {
    const byCategory = new Map<string, number>();
    for (const p of products) {
      const key = p.category?.trim() || t('inventory.stats.uncategorized', 'Sans catégorie');
      byCategory.set(key, (byCategory.get(key) ?? 0) + parsePrice(p.price) * p.piece);
    }
    return [...byCategory.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [products, t]);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);
  const formatCompact = (v: number) =>
    new Intl.NumberFormat('fr-FR', { notation: 'compact', style: 'currency', currency: 'EUR', maximumFractionDigits: 1 }).format(v);

  return (
    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t('inventory.stats.total_products', 'Total produits')}
        value={stats.total.toString()}
        description={t('inventory.stats.in_catalog', 'au catalogue')}
      >
        <CompositionBar
          segments={[
            { label: t('inventory.stats.in_stock', 'En stock'), count: stats.inStock, color: SNAPSHOT_COLORS.success },
            { label: t('inventory.stats.low_stock', 'Stock faible'), count: stats.lowStock, color: SNAPSHOT_COLORS.warning },
            { label: t('inventory.stats.out_of_stock', 'Rupture'), count: stats.outOfStock, color: SNAPSHOT_COLORS.error },
          ]}
        />
      </StatCard>

      <StatCard
        title={t('inventory.stats.inventory_value', 'Valeur du stock')}
        value={formatCurrency(stats.totalValue)}
        description={t('inventory.stats.total_value', 'valeur totale')}
      >
        {topCategories.length > 0 && (
          <CategoryBars
            title={t('inventory.stats.top_categories', 'Top catégories par valeur')}
            rows={topCategories}
            formatValue={formatCompact}
          />
        )}
      </StatCard>

      <StatCard
        title={t('inventory.stats.low_stock', 'Stock faible')}
        value={stats.lowStock.toString()}
        description={t('inventory.stats.products_to_watch', 'produits à surveiller')}
      >
        <ShareBar
          fraction={stats.total > 0 ? stats.lowStock / stats.total : 0}
          color={SNAPSHOT_COLORS.warning}
          label={t('inventory.stats.of_catalog', {
            pct: stats.total > 0 ? Math.round((stats.lowStock / stats.total) * 100) : 0,
          })}
        />
      </StatCard>

      <StatCard
        title={t('inventory.stats.out_of_stock', 'Ruptures')}
        value={stats.outOfStock.toString()}
        description={t('inventory.stats.products_out', 'produits indisponibles')}
      >
        <ShareBar
          fraction={stats.total > 0 ? stats.outOfStock / stats.total : 0}
          color={SNAPSHOT_COLORS.error}
          label={t('inventory.stats.of_catalog', {
            pct: stats.total > 0 ? Math.round((stats.outOfStock / stats.total) * 100) : 0,
          })}
        />
      </StatCard>
    </div>
  );
}
