import { useMemo } from "react";
import { FiFilter } from "react-icons/fi";
import type { Product } from "@/domain/models/Product";
import type { TopProduct } from "../../../types/dashboard.types";
import { ProductItem } from "./ProductItem";

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  // Convert real products to TopProduct format and sort by stock
  const topProducts = useMemo<TopProduct[]>(() => {
    return products
      .sort((a, b) => b.stock_quantity - a.stock_quantity)
      .slice(0, 5)
      .map((product, index) => ({
        id: product.id,
        name: product.name,
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(product.name)}&background=random&size=80`,
        sales: product.stock_quantity,
        revenue: new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(product.buying_price * product.stock_quantity),
        trend: product.stock_quantity > 50 ? "up" : "down" as "up" | "down",
        change: `${product.stock_quantity} units`,
        rating: 4.5 + (index * 0.1),
      }));
  }, [products]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Stock Products</h3>
          <p className="mt-1 text-sm text-gray-500">Products with highest inventory</p>
        </div>
        <div className="flex gap-3 items-center">
          <button 
            disabled
            className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Filter (coming soon)"
          >
            <FiFilter size={14} />
            Filter
          </button>
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

