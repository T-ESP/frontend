import { FiPackage, FiTrash, FiMinus, FiPlus, FiBarChart2, FiEdit } from "react-icons/fi";
import type { InventoryItem } from "@/ui/features/inventory/types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface InventoryCardProps {
  item: InventoryItem;
  index: number;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number, name: string) => void;
  onStockUpdate: (id: number, change: number) => Promise<void>;
  onViewKPIs: (id: number, name: string) => void;
}

const statusStyles = {
  "In Stock": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    key: "inventory.status.in_stock"
  },
  "Low Stock": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    key: "inventory.status.low_stock"
  },
  "Out of Stock": {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
    key: "inventory.status.out_of_stock"
  }
};

export function InventoryCard({ item, index, onEdit, onDelete, onStockUpdate, onViewKPIs }: InventoryCardProps) {
  const { t } = useTranslation();
  const [updating, setUpdating] = useState(false);

  const handleStockChange = async (change: number) => {
    setUpdating(true);
    try {
      await onStockUpdate(item.id, change);
    } finally {
      setUpdating(false);
    }
  };

  const statusStyle = statusStyles[item.status as keyof typeof statusStyles];

  return (
    <div
      className="mb-3 transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md group"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Left: Product Image Thumbnail */}
        {/* <div className="shrink-0">
          <img
            src={item.image || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80'}
            alt={item.name}
            onError={(e) => {
              e.currentTarget.src = 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80';
            }}
            className="object-cover w-16 h-16 border border-gray-200 rounded-lg"
          />
        </div> */}

        {/* Middle: Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold leading-tight text-gray-900 truncate transition-colors group-hover:text-purple-600">
            {item.name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">{t('inventory.card.sku')}: {item.sku}</span>
            <span className="text-gray-300">•</span>
            <div className="flex items-center gap-1.5 text-gray-600">
              <FiPackage className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-sm">{item.category}</span>
            </div>
          </div>
        </div>

        {/* Right: Stock Badge, Price, Stock Controls, Actions */}
        <div className="flex items-center gap-6">
          {/* Status Badge */}
          <div className="shrink-0">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle?.bg} ${statusStyle?.text} ${statusStyle?.border} border`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle?.dot}`}></span>
              {statusStyle ? t(statusStyle.key) : item.status}
            </span>
          </div>

          {/* Stock Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleStockChange(-1)}
              disabled={updating || item.piece <= 0}
              className="p-1.5 text-gray-600 border border-gray-200 rounded hover:text-red-600 hover:bg-red-50 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={t('inventory.card.decrease_stock')}
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-semibold text-center text-gray-900 min-w-15">
              {item.piece.toLocaleString()}
            </span>
            <button
              onClick={() => handleStockChange(1)}
              disabled={updating}
              className="p-1.5 text-gray-600 border border-gray-200 rounded hover:text-green-600 hover:bg-green-50 hover:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title={t('inventory.card.increase_stock')}
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Price */}
          <div className="text-right shrink-0 min-w-25">
            <p className="text-lg font-bold text-gray-900">{item.price}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewKPIs(item.id, item.name)}
              className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
              title={t('inventory.card.view_kpis')}
            >
              <FiBarChart2 size={16} />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
              title={t('inventory.card.edit_product')}
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={() => onDelete(item.id, item.name)}
              className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
              title={t('inventory.card.delete_product')}
            >
              <FiTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
