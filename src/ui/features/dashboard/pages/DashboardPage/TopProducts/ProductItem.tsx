import { FiStar, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { TopProduct } from "../../../types/dashboard.types";
import { useTranslation } from "react-i18next";

interface ProductItemProps {
  product: TopProduct;
}

export function ProductItem({ product }: ProductItemProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/inventory?search=${encodeURIComponent(product.name)}&productId=${product.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-6 transition-colors cursor-pointer hover:bg-gray-50/50 group"
    >
      <div className="flex items-center gap-4">
        <div className="shrink-0">
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
                {product.name}
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiShoppingCart className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{product.sales.toLocaleString()} {t('common.sold')}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{product.revenue}</div>
              {/* <div className="flex items-center gap-1 mt-1">
                {product.trend === 'up' ? (
                  <FiArrowUpRight className="w-4 h-4 text-emerald-500" />
                ) : (
                  <FiArrowDownLeft className="w-4 h-4 text-rose-500" />
                )}
                <span className={`text-sm font-medium ${product.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                  {product.change}
                </span>
              </div> */}
            </div>
          </div>
        </div>
        {/* <div className="shrink-0">
          <button
            className="p-2 text-gray-400 transition-colors rounded-lg opacity-0 hover:text-gray-600 hover:bg-white group-hover:opacity-100"
            title={t('common.view_details')}
          >
            <FiEye size={16} />
          </button>
        </div> */}
      </div>
    </div>
  );
}

