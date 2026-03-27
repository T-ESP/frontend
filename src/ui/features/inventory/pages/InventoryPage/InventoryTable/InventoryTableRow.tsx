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

export function InventoryTableRow({ item, onEdit, onDelete, onStockUpdate, onViewKPIs }: InventoryTableRowProps) {
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
    <tr className="transition-colors hover:bg-slate-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-3 items-center">
          <div>
            <div className="text-sm font-medium text-slate-900">{item.name}</div>
            <div className="text-xs text-slate-500 mt-0.5">SKU: {item.sku}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-700">
        <div className="flex gap-2 items-center">
          <FiPackage className="w-4 h-4 text-gray-400" />
          {item.category}
        </div>
      </td>
      <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-900">
        {item.price}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStockChange(-1)}
            disabled={updating || item.piece <= 0}
            className="p-1 text-gray-400 rounded hover:text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiMinus size={14} />
          </button>
          <span className="text-sm font-medium text-slate-700 min-w-[3rem] text-center">
            {item.piece.toLocaleString()} <span className="text-xs text-gray-400">u.</span>
          </span>
          <button
            onClick={() => handleStockChange(1)}
            disabled={updating}
            className="p-1 text-gray-400 rounded hover:text-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus size={14} />
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${statusStyles[item.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'In Stock' ? 'bg-emerald-500' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-rose-500'}`} />
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onViewKPIs(item.id, item.name)}
            className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
            title="View KPIs"
          >
            <FiBarChart2 size={16} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
            title="Edit product"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id, item.name)}
            className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-rose-50 hover:text-rose-600"
            title="Delete product"
          >
            <FiTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

