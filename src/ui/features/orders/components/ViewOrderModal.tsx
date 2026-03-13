import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { orderService } from "@/infrastructure/api/services/orderService";
import type { Order, LineItem } from "@/domain/models/Order";
import { useTranslation } from "react-i18next";

interface ViewOrderModalProps {
  order: Order;
  onClose: () => void;
}

export function ViewOrderModal({ order, onClose }: ViewOrderModalProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'fr-FR';

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLineItems();
  }, [order.id]);

  const loadLineItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await orderService.getOrderItems(order.id);
      setLineItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('orders.view_modal.loading_items'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('orders.view_modal.title', { id: order.id })}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 rounded-lg hover:text-gray-600 hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="mb-1 text-sm text-gray-600">{t('orders.view_modal.user_label')}</div>
              <div className="font-medium text-gray-900">{t('orders.user_label')} #{order.user_id}</div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="mb-1 text-sm text-gray-600">{t('orders.view_modal.date_label')}</div>
              <div className="font-medium text-gray-900">
                {new Date(order.order_date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="mb-1 text-sm text-gray-600">{t('orders.view_modal.status_label')}</div>
              <div>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {t(`orders.status.${order.status.toLowerCase()}`, order.status)}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="mb-1 text-sm text-gray-600">{t('orders.view_modal.amount_label')}</div>
              <div className="text-lg font-bold text-gray-900">
                {formatCurrency(order.amount)}
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">{t('orders.view_modal.items_title')}</h3>

            {loading ? (
              <div className="py-8 text-center text-gray-500">
                {t('orders.view_modal.loading_items')}
              </div>
            ) : error ? (
              <div className="p-4 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                {error}
              </div>
            ) : lineItems.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                {t('orders.view_modal.no_items')}
              </div>
            ) : (
              <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        {t('orders.view_modal.col_product')}
                      </th>
                      <th className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        {t('orders.view_modal.col_qty')}
                      </th>
                      <th className="px-4 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                        {t('orders.view_modal.col_total')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {t('orders.view_modal.product_label')} #{item.product_id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                          {formatCurrency(item.line_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-4 py-3 text-sm font-semibold text-right text-gray-900">
                        {t('orders.view_modal.total_label')}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-right text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="pt-4 space-y-1 text-xs text-gray-500 border-t border-gray-200">
            <div>{t('orders.view_modal.created_at')}: {new Date(order.created_at).toLocaleString(locale)}</div>
            <div>{t('orders.view_modal.updated_at')}: {new Date(order.updated_at).toLocaleString(locale)}</div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white rounded-lg bg-primary-plus hover:bg-primary"
            >
              {t('orders.view_modal.close_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
