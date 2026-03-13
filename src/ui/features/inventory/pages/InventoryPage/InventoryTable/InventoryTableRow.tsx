import { FiEdit2, FiPackage, FiTrash, FiMinus, FiPlus, FiBarChart2 } from "react-icons/fi";
import type { InventoryItem } from "@/ui/features/inventory/types";
import { useState } from "react";

interface InventoryTableRowProps {
  item: InventoryItem;
  index: number;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number, name: string) => void;
  onStockUpdate: (id: number, change: number) => Promise<void>;
  onViewKPIs: (id: number, name: string) => void;
}

const statusStyles = {
  "In Stock": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Low Stock": "bg-amber-50 text-amber-700 border border-amber-200",
  "Out of Stock": "bg-rose-50 text-rose-700 border border-rose-200"
};

export function InventoryTableRow({ item, index, onEdit, onDelete, onStockUpdate, onViewKPIs }: InventoryTableRowProps) {
  const [updating, setUpdating] = useState(false);

  const handleStockChange = async (change: number) => {
    setUpdating(true);
    try {
      await onStockUpdate(item.id, change);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <tr
      key={item.id}
      className="transition-colors duration-150 hover:bg-purple-50/30 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="px-6 py-4">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <img
              src={item.image || 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80'}
              alt={item.name}
              onError={(e) => {
                e.currentTarget.src = 'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80';
              }}
              className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <span className="font-medium text-gray-900 transition-colors group-hover:text-purple-600">
              {item.name}
            </span>
            <div className="text-xs text-gray-500 mt-0.5">
              SKU: {item.sku}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 items-center text-gray-600">
          <FiPackage className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{item.category}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-base font-semibold text-gray-900">
          {item.price}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStockChange(-1)}
            disabled={updating || item.piece <= 0}
            className="p-1 text-gray-400 rounded hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Decrease stock"
          >
            <FiMinus size={14} />
          </button>
          <span className="inline-flex gap-1 items-center font-medium text-gray-700 min-w-15 justify-center">
            {item.piece.toLocaleString()}
            <span className="text-xs text-gray-400">units</span>
          </span>
          <button
            onClick={() => handleStockChange(1)}
            disabled={updating}
            className="p-1 text-gray-400 rounded hover:text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Increase stock"
          >
            <FiPlus size={14} />
          </button>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[item.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'In Stock' ? 'bg-emerald-500' :
            item.status === 'Low Stock' ? 'bg-amber-500' :
              'bg-rose-500'
            }`}></span>
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onViewKPIs(item.id, item.name)}
            className="p-2 text-gray-400 rounded-lg transition-all duration-150 hover:text-blue-600 hover:bg-blue-50"
            title="View KPIs"
          >
            <FiBarChart2 size={16} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 rounded-lg transition-all duration-150 hover:text-purple-600 hover:bg-purple-50"
            title="Edit product"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id, item.name)}
            className="p-2 text-gray-400 rounded-lg transition-all duration-150 hover:text-rose-600 hover:bg-rose-50"
            title="Delete product"
          >
            <FiTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

