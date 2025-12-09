import { FiPackage, FiTrash, FiMinus, FiPlus, FiBarChart2 } from "react-icons/fi";
import type { InventoryItem } from "@/ui/features/inventory/types";
import { useState } from "react";

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
    dot: "bg-emerald-500"
  },
  "Low Stock": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500"
  },
  "Out of Stock": {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500"
  }
};

export function InventoryCard({ item, index, onEdit, onDelete, onStockUpdate, onViewKPIs }: InventoryCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleStockChange = async (change: number) => {
    setUpdating(true);
    try {
      await onStockUpdate(item.id, change);
    } finally {
      setUpdating(false);
    }
  };

  const statusStyle = statusStyles[item.status];

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-l-4 hover:border-l-blue-500 group mb-3"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Left: Product Image Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={item.image || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80'}
            alt={item.name}
            onError={(e) => {
              e.currentTarget.src = 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80';
            }}
            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
          />
        </div>

        {/* Middle: Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-tight truncate group-hover:text-purple-600 transition-colors">
            {item.name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-500">SKU: {item.sku}</span>
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
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
              {item.status}
            </span>
          </div>

          {/* Stock Controls */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={() => handleStockChange(-1)}
              disabled={updating || item.piece <= 0}
              className="p-1.5 text-gray-600 border border-gray-200 rounded hover:text-red-600 hover:bg-red-50 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Decrease stock"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-center">
              {item.piece.toLocaleString()}
            </span>
            <button
              onClick={() => handleStockChange(1)}
              disabled={updating}
              className="p-1.5 text-gray-600 border border-gray-200 rounded hover:text-green-600 hover:bg-green-50 hover:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Increase stock"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Price */}
          <div className="flex-shrink-0 text-right min-w-[100px]">
            <p className="text-lg font-bold text-gray-900">{item.price}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <button
              onClick={() => onViewKPIs(item.id, item.name)}
              className="p-2 text-gray-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
              title="View KPIs"
            >
              <FiBarChart2 size={18} />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              title="Edit product"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id, item.name)}
              className="p-2 text-gray-600 bg-gray-50 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete product"
            >
              <FiTrash size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
