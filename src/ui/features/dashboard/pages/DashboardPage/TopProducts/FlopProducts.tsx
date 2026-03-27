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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.flop_products.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('dashboard.flop_products.subtitle')}</p>
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setMode('sales')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'sales' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t('dashboard.flop_products.by_sales')}
          </button>
          <button
            onClick={() => setMode('profit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${mode === 'profit' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t('dashboard.flop_products.by_profit')}
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/3" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-500">{t('dashboard.top_products.no_products')}</div>
        ) : (
          items.slice(0, 5).map((product) => (
            <div
              key={product.product_id}
              onClick={() => navigate(`/inventory?search=${encodeURIComponent(product.product_name)}&productId=${product.product_id}`)}
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/50 group transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 shrink-0">
                  <TrendingDown size={14} className="text-rose-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                    {product.product_name}
                  </p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-bold text-rose-500">{formatValue(product.value)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
