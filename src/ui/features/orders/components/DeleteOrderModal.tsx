import { useState } from "react";
import { FiX, FiAlertTriangle } from "react-icons/fi";
import { orderService } from "@/infrastructure/api/services/orderService";
import type { Order } from "@/domain/models/Order";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";

interface DeleteOrderModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteOrderModal({ order, onClose, onSuccess }: DeleteOrderModalProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'fr-FR';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      await orderService.delete(order.id);
      addToast(
        t('orders.delete_modal.deleted_toast'),
        t('orders.delete_modal.deleted_toast_msg', { id: order.id }),
        'success'
      );
      onSuccess();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t('orders.delete_modal.delete_error_toast');
      setError(errorMsg);
      addToast(t('orders.delete_modal.delete_error_toast'), errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">{t('orders.delete_modal.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg mb-6">
            <FiAlertTriangle className="text-red-600 mt-0.5 shrink-0" size={20} />
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">
                {t('orders.delete_modal.confirm_msg')}
              </p>
              <p className="text-red-700">
                {t('orders.delete_modal.warning')}
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.delete_modal.id_label')}:</span>
              <span className="font-medium">#{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.delete_modal.user_label')}:</span>
              <span className="font-medium">{t('orders.user_label')} #{order.user_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.delete_modal.date_label')}:</span>
              <span className="font-medium">
                {new Date(order.order_date).toLocaleDateString(locale)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.delete_modal.status_label')}:</span>
              <span className="font-medium">{t(`orders.status.${order.status.toLowerCase()}`, order.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('orders.delete_modal.amount_label')}:</span>
              <span className="font-medium">
                {new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(order.amount)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.deleting') : t('orders.delete_modal.delete_btn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
