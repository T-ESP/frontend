import { useMemo, useState, useEffect, useRef } from "react";
import { FiFilter } from "react-icons/fi";
import type { Product } from "@/domain/models/Product";
import type { TopProduct } from "../../../types/dashboard.types";
import { ProductItem } from "./ProductItem";
import { useTranslation } from "react-i18next";

interface TopProductsProps {
  products: Product[];
}

type SortOption = 'stock' | 'price' | 'name';

export function TopProducts({ products }: TopProductsProps) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>('stock');
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Convert real products to TopProduct format with different sort options
  const topProducts = useMemo<TopProduct[]>(() => {
    let sorted = [...products];

    switch (sortBy) {
      case 'stock':
        sorted.sort((a, b) => b.stock_quantity - a.stock_quantity);
        break;
      case 'price':
        sorted.sort((a, b) => (b.buying_price * b.stock_quantity) - (a.buying_price * a.stock_quantity));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return sorted
      .slice(0, 5)
      .map((product, index) => {
        const totalValue = product.buying_price * product.stock_quantity;
        return {
          id: product.id,
          name: product.name,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random&size=80`,
          sales: product.stock_quantity,
          revenue: new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(totalValue),
          trend: product.stock_quantity > 50 ? "up" : "down" as "up" | "down",
          change: `${product.stock_quantity} ${t('common.units')}`,
          rating: 4.5 + (index * 0.1),
        };
      });
  }, [products, sortBy, t]);

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'stock': return t('dashboard.top_products.stock');
      case 'price': return t('dashboard.top_products.value');
      case 'name': return t('dashboard.top_products.name');
    }
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl">
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.top_products.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('dashboard.top_products.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <FiFilter size={14} />
              {t('dashboard.top_products.sort_by')}: {getSortLabel(sortBy)}
            </button>
            {showFilter && (
              <div className="absolute right-0 z-10 w-40 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <button
                  onClick={() => { setSortBy('stock'); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'stock' ? 'text-purple-600 font-medium' : 'text-gray-700'
                    }`}
                >
                  {t('dashboard.top_products.stock')}
                </button>
                <button
                  onClick={() => { setSortBy('price'); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price' ? 'text-purple-600 font-medium' : 'text-gray-700'
                    }`}
                >
                  {t('dashboard.top_products.value')}
                </button>
                <button
                  onClick={() => { setSortBy('name'); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'name' ? 'text-purple-600 font-medium' : 'text-gray-700'
                    }`}
                >
                  {t('dashboard.top_products.name')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {topProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            {t('dashboard.top_products.no_products')}
          </div>
        ) : (
          topProducts.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

