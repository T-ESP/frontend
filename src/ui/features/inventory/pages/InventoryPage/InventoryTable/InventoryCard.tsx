import { FiEdit2, FiPackage, FiTrash, FiMinus, FiPlus, FiBarChart2 } from "react-icons/fi";
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
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Card Header with Image */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <img
          src={item.image || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80'}
          alt={item.name}
          onError={(e) => {
            e.currentTarget.src = 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80';
          }}
          className="w-32 h-32 object-cover rounded-lg shadow-sm"
        />
        {/* Status Badge - Positioned on Image */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} border backdrop-blur-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
            {item.status}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        {/* Product Name & SKU */}
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
            {item.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
        </div>

        {/* Category & Price */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <FiPackage className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{item.category}</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-gray-900">{item.price}</span>
          </div>
        </div>

        {/* Stock Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Stock</span>
            <span className="text-sm font-bold text-gray-900">{item.piece.toLocaleString()} units</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleStockChange(-1)}
              disabled={updating || item.piece <= 0}
              className="flex-1 p-2 text-gray-600 border border-gray-200 rounded-lg hover:text-red-600 hover:bg-red-50 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Decrease stock"
            >
              <FiMinus className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => handleStockChange(1)}
              disabled={updating}
              className="flex-1 p-2 text-gray-600 border border-gray-200 rounded-lg hover:text-green-600 hover:bg-green-50 hover:border-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Increase stock"
            >
              <FiPlus className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onViewKPIs(item.id, item.name)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            title="View KPIs"
          >
            <FiBarChart2 size={16} />
            <span>KPIs</span>
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2.5 text-gray-600 bg-gray-50 rounded-lg hover:text-purple-600 hover:bg-purple-50 transition-colors"
            title="Edit product"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id, item.name)}
            className="p-2.5 text-gray-600 bg-gray-50 rounded-lg hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete product"
          >
            <FiTrash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
