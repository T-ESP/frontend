import { useMemo, useState, useEffect, useRef } from "react";
import { FiFilter } from "react-icons/fi";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { Product } from "@/domain/models/Product";
import { productKpisService } from "@/infrastructure/api/services/productKpisService";
import type { TopProduct } from "../../../types/dashboard.types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface TopProductsProps {
  products: Product[];
}

type SortOption = 'stock' | 'price' | 'name';

export function TopProducts({ products }: TopProductsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<SortOption>('stock');
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterText, setFilterText] = useState("");
  // Real product ratings derived from the backend global_score (0-100 -> 0-5).
  // Cached by product id so re-sorting/filtering doesn't refetch known scores.
  const [scores, setScores] = useState<Map<number, number>>(new Map());
  const scoreCacheRef = useRef<Map<number, number>>(new Map());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleProducts = useMemo<Product[]>(() => {
    const sorted = [...products].filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));

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

    return sorted.slice(0, 10);
  }, [products, sortBy, filterText]);

  // Fetch the global_score for the products currently displayed (only the ones
  // not already cached) and expose them as the rating source.
  useEffect(() => {
    let cancelled = false;
    const ids = visibleProducts.map(p => p.id);
    const missing = ids.filter(id => !scoreCacheRef.current.has(id));

    if (missing.length === 0) {
      setScores(new Map(scoreCacheRef.current));
      return;
    }

    Promise.allSettled(missing.map(id => productKpisService.getScoringClassification(id)))
      .then(results => {
        if (cancelled) return;
        results.forEach((result, i) => {
          if (result.status === 'fulfilled') {
            scoreCacheRef.current.set(missing[i], result.value.global_score);
          }
        });
        setScores(new Map(scoreCacheRef.current));
      });

    return () => { cancelled = true; };
  }, [visibleProducts]);

  const topProducts = useMemo<TopProduct[]>(() => {
    return visibleProducts.map((product) => {
      const totalValue = product.buying_price * product.stock_quantity;
      const score = scores.get(product.id);
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
        // global_score is bounded 0-100 server-side; /20 keeps the rating within 0-5.
        rating: score != null ? Math.min(5, score / 20) : 0,
      };
    });
  }, [visibleProducts, scores, t]);

  const handleClick = (name: string, id: string | number) => {
    navigate(`/inventory?search=${encodeURIComponent(name)}&productId=${id}`);
  };

  const getBadgeClass = (trend: "up" | "down") => {
     if (trend === "up") return "text-emerald-700 bg-emerald-50 border-emerald-200";
     return "text-rose-700 bg-rose-50 border-rose-200";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl text-gray-900 w-full overflow-hidden mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-100 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{t('dashboard.top_products.title')}</h3>
          <p className="text-[14px] text-gray-500 mt-1">{t('dashboard.top_products.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Filter products..." 
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full sm:w-48 xl:w-64 border border-gray-200 rounded-lg px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-gray-200 transition-shadow" 
          />
          <div className="relative shrink-0" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center justify-center border border-gray-200 rounded-lg w-10 h-[38px] hover:bg-gray-50 transition-colors"
            >
              <FiFilter size={16} className="text-gray-600" />
            </button>
            {showFilter && (
              <div className="absolute right-0 z-10 w-40 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg text-[13px]">
                <button onClick={() => { setSortBy('stock'); setShowFilter(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'stock' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {t('dashboard.top_products.stock')}
                </button>
                <button onClick={() => { setSortBy('price'); setShowFilter(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'price' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {t('dashboard.top_products.value')}
                </button>
                <button onClick={() => { setSortBy('name'); setShowFilter(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === 'name' ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                  {t('dashboard.top_products.name')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-[14px] text-left border-collapse">
          <thead className="text-gray-500 border-b border-gray-200 bg-white">
            <tr>
              <th className="px-6 py-4 font-medium w-12"><input type="checkbox" className="rounded border-gray-300 w-4 h-4" /></th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Units Sold</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Total Value</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topProducts.map((product) => (
               <tr 
                 key={product.id} 
                 onClick={() => handleClick(product.name, product.id)}
                 className="hover:bg-gray-50/50 transition-colors cursor-pointer"
               >
                 <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="rounded border-gray-300 w-4 h-4 cursor-pointer" /></td>
                 <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                 <td className="px-6 py-4 text-gray-500">{product.sales.toLocaleString()}</td>
                 <td className="px-6 py-4 font-medium text-gray-900">{scores.has(product.id) ? `${product.rating.toFixed(1)} / 5` : '—'}</td>
                 <td className="px-6 py-4 font-medium text-gray-900">{product.revenue}</td>
                 <td className="px-6 py-4">
                   <span className={`px-3 py-0.5 text-[12px] font-medium rounded-full border ${getBadgeClass(product.trend)}`}>
                     {product.trend === "up" ? "High Demand" : "Low Stock"}
                   </span>
                 </td>
                 <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                   <button className="text-gray-400 hover:text-gray-900 transition-colors"><MoreHorizontal className="w-5 h-5"/></button>
                 </td>
               </tr>
            ))}
            {topProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  {t('dashboard.top_products.no_products')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex items-center justify-between p-4 px-6 border-t border-gray-200 text-[13px] text-gray-500">
        <div>0 of {topProducts.length} row(s) selected.</div>
        <div className="flex items-center gap-2">
           <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
             <ChevronLeft className="w-4 h-4 text-gray-700" />
           </button>
           <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
             <ChevronRight className="w-4 h-4 text-gray-700" />
           </button>
        </div>
      </div>
    </div>
  );
}

