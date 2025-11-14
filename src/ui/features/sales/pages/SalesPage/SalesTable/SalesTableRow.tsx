import type { Sale } from "@/ui/features/sales/types";

interface SalesTableRowProps {
  sale: Sale;
  index: number;
}

const statusStyles = {
  Delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Cancelled: "bg-rose-50 text-rose-700 border border-rose-200"
};

export function SalesTableRow({ sale, index }: SalesTableRowProps) {
  return (
    <tr
      key={sale.id}
      className="transition-colors duration-150 hover:bg-purple-50/30 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="px-6 py-4">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <img
              src={sale.avatar}
              alt={sale.product}
              className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="font-medium text-gray-900 transition-colors group-hover:text-purple-600">
            {sale.product}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 items-center text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{sale.location}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{sale.date}</span>
          <span className="text-xs text-gray-500">{sale.time}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex gap-1 items-center font-medium text-gray-700">
          {sale.quantity.toLocaleString()}
          <span className="text-xs text-gray-400">pcs</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-base font-semibold text-gray-900">
          {sale.amount}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[sale.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sale.status === 'Delivered' ? 'bg-emerald-500' :
            sale.status === 'Pending' ? 'bg-amber-500' :
              'bg-rose-500'
            }`}></span>
          {sale.status}
        </span>
      </td>
    </tr>
  );
}

