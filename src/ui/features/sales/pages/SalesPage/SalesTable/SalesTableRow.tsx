import type { Order } from "@/domain/models/Order";

interface SalesTableRowProps {
  order: Order;
  index: number;
}

const getStatusStyle = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'delivered') return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (statusLower === 'pending') return "bg-amber-50 text-amber-700 border border-amber-200";
  if (statusLower === 'cancelled') return "bg-rose-50 text-rose-700 border border-rose-200";
  if (statusLower === 'confirmed') return "bg-blue-50 text-blue-700 border border-blue-200";
  if (statusLower === 'shipped') return "bg-purple-50 text-purple-700 border border-purple-200";
  return "bg-gray-50 text-gray-700 border border-gray-200";
};

const getStatusDotColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'delivered') return 'bg-emerald-500';
  if (statusLower === 'pending') return 'bg-amber-500';
  if (statusLower === 'cancelled') return 'bg-rose-500';
  if (statusLower === 'confirmed') return 'bg-blue-500';
  if (statusLower === 'shipped') return 'bg-purple-500';
  return 'bg-gray-500';
};

export function SalesTableRow({ order, index }: SalesTableRowProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <tr
      className="transition-colors duration-150 hover:bg-purple-50/30 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="px-6 py-4">
        <div className="flex gap-3 items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm bg-linear-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
              #{order.id}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <span className="font-medium text-gray-900 transition-colors group-hover:text-purple-600">
            Order #{order.id}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2 items-center text-gray-600">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-sm">User #{order.user_id}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{formatDate(order.order_date)}</span>
          <span className="text-xs text-gray-500">{formatTime(order.order_date)}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-base font-semibold text-gray-900">
          {formatAmount(order.amount)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${getStatusStyle(order.status)}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(order.status)}`}></span>
          {order.status}
        </span>
      </td>
    </tr>
  );
}

