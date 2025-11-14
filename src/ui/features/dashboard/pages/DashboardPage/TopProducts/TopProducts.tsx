import { FiFilter } from "react-icons/fi";
import type { TopProduct } from "../../../types/dashboard.types";
import { ProductItem } from "./ProductItem";

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
          <p className="mt-1 text-sm text-gray-500">Best selling products this month</p>
        </div>
        <div className="flex gap-3 items-center">
          <button className="flex gap-2 items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
            <FiFilter size={14} />
            Filter
          </button>
          <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
            View All
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

