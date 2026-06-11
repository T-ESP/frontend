import { useMemo } from 'react';
import type { InventoryItem } from '@/ui/features/inventory/types';
import { useTranslation } from 'react-i18next';
import {
  KpiStatCard,
  bucketByDay,
  topNDistribution,
} from '@/ui/components/common/KpiStatCard/KpiStatCard';

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

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v);

  // Distribution: top 7 stock levels
  const stockSeries = useMemo(
    () => topNDistribution(products, (p) => p.piece, 7),
    [products],
  );

  // Distribution: top 7 product values (price × stock)
  const valueSeries = useMemo(
    () => topNDistribution(products, (p) => parsePrice(p.price) * p.piece, 7),
    [products],
  );

  // Time series for low stock items added recently (lastUpdated)
  const lowStockSeries = useMemo(
    () =>
      bucketByDay(
        products.filter((p) => p.status === 'Low Stock'),
        (p) => p.lastUpdated,
        (slice) => slice.length,
        7,
      ),
    [products],
  );

  // Time series for out of stock items
  const outStockSeries = useMemo(
    () =>
      bucketByDay(
        products.filter((p) => p.status === 'Out of Stock'),
        (p) => p.lastUpdated,
        (slice) => slice.length,
        7,
      ),
    [products],
  );

  return (
    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        title={t('inventory.stats.total_products', 'Total produits')}
        value={stats.total.toString()}
        description={t('inventory.stats.in_catalog', 'au catalogue')}
        chartData={stockSeries}
        chartType="bar"
      />
      <KpiStatCard
        title={t('inventory.stats.inventory_value', 'Valeur du stock')}
        value={formatCurrency(stats.totalValue)}
        description={t('inventory.stats.total_value', 'valeur totale')}
        chartData={valueSeries}
        chartType="line"
      />
      <KpiStatCard
        title={t('inventory.stats.low_stock', 'Stock faible')}
        value={stats.lowStock.toString()}
        description={t('inventory.stats.products_to_watch', 'produits à surveiller')}
        chartData={lowStockSeries}
        chartType="bar"
      />
      <KpiStatCard
        title={t('inventory.stats.out_of_stock', 'Ruptures')}
        value={stats.outOfStock.toString()}
        description={t('inventory.stats.products_out', 'produits indisponibles')}
        chartData={outStockSeries}
        chartType="bar"
      />
    </div>
  );
}
