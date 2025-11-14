import { FiStar, FiShoppingCart, FiArrowUpRight, FiArrowDownLeft, FiEye } from "react-icons/fi";
import type { TopProduct } from "../../../types/dashboard.types";

interface ProductItemProps {
  product: TopProduct;
}

export function ProductItem({ product }: ProductItemProps) {
  return (
    <div className="p-6 transition-colors hover:bg-gray-50/50 group">
      <div className="flex gap-4 items-center">
        <div className="shrink-0">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-16 h-16 rounded-xl ring-2 ring-white shadow-sm transition-shadow group-hover:shadow-md"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                {product.name}
              </h4>
              <div className="flex gap-3 items-center mt-2">
                <div className="flex gap-1 items-center">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                </div>
                <div className="flex gap-1 items-center">
                  <FiShoppingCart className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{product.sales.toLocaleString()} sold</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{product.revenue}</div>
              <div className="flex gap-1 items-center mt-1">
                {product.trend === 'up' ? (
                  <FiArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <FiArrowDownLeft className="w-4 h-4 text-rose-500" />
                )}
                <span className={`text-sm font-medium ${product.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                  {product.change}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <button className="p-2 text-gray-400 rounded-lg opacity-0 transition-colors hover:text-gray-600 hover:bg-white group-hover:opacity-100">
            <FiEye size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

