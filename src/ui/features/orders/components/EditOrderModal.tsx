import { useState } from "react";
import { FiX } from "react-icons/fi";
import { orderService } from "@/infrastructure/api/services/orderService";
import type { Order, UpdateOrderDto } from "@/domain/models/Order";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditOrderModal({ order, onClose, onSuccess }: EditOrderModalProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'fr-FR';

  const [formData, setFormData] = useState<UpdateOrderDto>({
    status: order.status,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await orderService.update(order.id, formData);
      addToast(
        t('orders.edit_modal.updated_toast'),
        t('orders.edit_modal.updated_msg', { id: order.id }),
        'success'
      );
      onSuccess();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t('orders.edit_modal.update_error');
      setError(errorMsg);
      addToast(t('orders.edit_modal.update_error'), errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{t('orders.edit_modal.title', { id: order.id })}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.edit_modal.user_label')}</span>
              <span className="font-medium">{t('orders.user_label')} #{order.user_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.edit_modal.date_label')}</span>
              <span className="font-medium">
                {new Date(order.order_date).toLocaleDateString(locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.edit_modal.amount_label')}</span>
              <span className="font-medium">
                {new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(order.amount)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('orders.edit_modal.status_label')}
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="pending">{t('orders.status.pending')}</option>
              <option value="confirmed">{t('orders.status.confirmed')}</option>
              <option value="shipped">{t('orders.status.shipped')}</option>
              <option value="delivered">{t('orders.status.delivered')}</option>
              <option value="cancelled">{t('orders.status.cancelled')}</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('orders.edit_modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('orders.edit_modal.updating') : t('orders.edit_modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
