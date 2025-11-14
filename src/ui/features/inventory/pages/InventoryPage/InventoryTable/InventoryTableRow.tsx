import { FiEdit2, FiPackage, FiTrash } from "react-icons/fi";
import type { InventoryItem } from "@/ui/features/inventory/types";

interface InventoryTableRowProps {
  item: InventoryItem;
  index: number;
}

const statusStyles = {
  "In Stock": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Low Stock": "bg-amber-50 text-amber-700 border border-amber-200",
  "Out of Stock": "bg-rose-50 text-rose-700 border border-rose-200"
};

export function InventoryTableRow({ item, index }: InventoryTableRowProps) {
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
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
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
        <span className="inline-flex gap-1 items-center font-medium text-gray-700">
          {item.piece.toLocaleString()}
          <span className="text-xs text-gray-400">units</span>
        </span>
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
        <div className="flex gap-1.5">
          {item.colors.map((color, i) => (
            <span
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white ring-1 ring-gray-200 shadow-sm"
              style={{ backgroundColor: color }}
            ></span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 rounded-lg transition-all duration-150 hover:text-purple-600 hover:bg-purple-50">
            <FiEdit2 size={16} />
          </button>
          <button className="p-2 text-gray-400 rounded-lg transition-all duration-150 hover:text-rose-600 hover:bg-rose-50">
            <FiTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

