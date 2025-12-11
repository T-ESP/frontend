import { useMemo, useState, useEffect, useRef } from "react";
import { FiFilter } from "react-icons/fi";
import type { Product } from "@/domain/models/Product";
import type { TopProduct } from "../../../types/dashboard.types";
import { ProductItem } from "./ProductItem";

interface TopProductsProps {
  products: Product[];
}

type SortOption = 'stock' | 'price' | 'name';

export function TopProducts({ products }: TopProductsProps) {
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
          change: `${product.stock_quantity} units`,
          rating: 4.5 + (index * 0.1),
        };
      });
  }, [products, sortBy]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Stock Products</h3>
          <p className="mt-1 text-sm text-gray-500">Products with highest inventory</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100"
            >
              <FiFilter size={14} />
              Sort by: {sortBy === 'stock' ? 'Stock' : sortBy === 'price' ? 'Value' : 'Name'}
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => { setSortBy('stock'); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === 'stock' ? 'text-purple-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Stock Quantity
                </button>
                <button
                  onClick={() => { setSortBy('price'); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === 'price' ? 'text-purple-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Total Value
                </button>
                <button
                  onClick={() => { setSortBy('name'); setShowFilter(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                    sortBy === 'name' ? 'text-purple-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  Product Name
                </button>
              </div>
            )}
          </div>
          <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {topProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No products found
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

