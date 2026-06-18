import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { TopFlopProduct } from "@/infrastructure/api/services/globalKpisService";
import { useTranslation } from "react-i18next";

type FlopMode = 'sales' | 'profit';

interface FlopProductsProps {
  flopBySales: TopFlopProduct[];
  flopByProfit: TopFlopProduct[];
  loading?: boolean;
}

export function FlopProducts({ flopBySales, flopByProfit, loading }: FlopProductsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<FlopMode>('sales');

  const items = mode === 'sales' ? flopBySales : flopByProfit;

  const formatValue = (value: number) =>
    mode === 'profit'
      ? new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
      : `${value} ${t('common.units')}`;

  return (
    <div className="border shadow-sm bg-card rounded-lg border-border">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{t('dashboard.flop_products.title')}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t('dashboard.flop_products.subtitle')}</p>
        </div>
        <div className="flex gap-1 p-1 rounded-lg bg-muted">
          <button
            onClick={() => setMode('sales')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'sales' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t('dashboard.flop_products.by_sales')}
          </button>
          <button
            onClick={() => setMode('profit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'profit' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t('dashboard.flop_products.by_profit')}
          </button>
        </div>
      </div>
      <div className="divide-y divide-border">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5 animate-pulse">
              <div className="w-3/4 h-4 mb-2 rounded bg-muted" />
              <div className="w-1/3 h-3 rounded bg-muted" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">{t('dashboard.top_products.no_products')}</div>
        ) : (
          items.slice(0, 5).map((product) => (
            <div
              key={product.product_id}
              onClick={() => navigate(`/inventory?search=${encodeURIComponent(product.product_name)}&productId=${product.product_id}`)}
              className="flex items-center justify-between p-5 transition-colors cursor-pointer hover:bg-muted/50 group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 shrink-0">
                  <TrendingDown size={14} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate transition-colors text-foreground group-hover:text-primary">
                    {product.product_name}
                  </p>
                  <p className="text-xs text-muted-foreground/70">{product.category}</p>
                </div>
              </div>
              <div className="ml-4 text-right shrink-0">
                <p className="text-sm font-bold num text-rose-600 dark:text-rose-400">{formatValue(product.value)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
