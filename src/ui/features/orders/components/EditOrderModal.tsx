import { useState } from 'react';
import { X, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order, UpdateOrderDto } from '@/domain/models/Order';
import { useToast } from '@/ui/components/common/Toast';
import { useTranslation } from 'react-i18next';

interface EditOrderModalProps {
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
  onDeleteRequest?: () => void;
}

export function EditOrderModal({ order, onClose, onSuccess, onDeleteRequest }: EditOrderModalProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language || 'fr-FR';

  const [formData, setFormData] = useState<UpdateOrderDto>({ status: order.status });
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
        'success',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-[2px]">
      <div className="bg-white w-full max-w-md border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              {t('orders.edit_modal.title', { id: order.id })}
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              {t('orders.edit_modal.subtitle', 'Modifier le statut de la commande')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 text-sm border border-rose-200 rounded-lg bg-rose-50 text-rose-700">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="overflow-hidden border border-gray-200 rounded-lg divide-y divide-gray-100">
              <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-gray-500">{t('orders.edit_modal.user_label')}</span>
                <span className="font-medium text-gray-900">
                  {t('orders.user_label')} #{order.user_id}
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-gray-500">{t('orders.edit_modal.date_label')}</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.order_date).toLocaleDateString(locale)}
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2.5 text-sm">
                <span className="text-gray-500">{t('orders.edit_modal.amount_label')}</span>
                <span className="font-semibold text-gray-900 tabular-nums">
                  {new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(order.amount)}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500">
                {t('orders.edit_modal.status_label')}
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-shadow"
              >
                <option value="pending">{t('orders.status.pending')}</option>
                <option value="confirmed">{t('orders.status.confirmed')}</option>
                <option value="shipped">{t('orders.status.shipped')}</option>
                <option value="delivered">{t('orders.status.delivered')}</option>
                <option value="cancelled">{t('orders.status.cancelled')}</option>
              </select>
            </div>

            {onDeleteRequest && (
              <button
                type="button"
                onClick={onDeleteRequest}
                className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-rose-600 transition-colors bg-white border border-rose-200 rounded-lg hover:bg-rose-50"
              >
                <Trash2 size={14} />
                {t('orders.edit_modal.delete_order', 'Supprimer cette commande')}
              </button>
            )}
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {t('orders.edit_modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('orders.edit_modal.updating') : t('orders.edit_modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
