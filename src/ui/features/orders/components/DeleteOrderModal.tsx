import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order } from '@/domain/models/Order';
import { useToast } from '@/ui/components/common/Toast';
import { useTranslation } from 'react-i18next';

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
        'success',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-[2px]">
      <div className="bg-card w-full max-w-md border border-border rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {t('orders.delete_modal.title')}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t('orders.delete_modal.warning')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground/70 transition-colors rounded-md hover:text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 text-sm border border-rose-500/30 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground">{t('orders.delete_modal.confirm_msg')}</p>

          <div className="overflow-hidden border border-border rounded-lg divide-y divide-border">
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{t('orders.delete_modal.id_label')}</span>
              <span className="font-medium text-foreground">#{order.id}</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{t('orders.delete_modal.user_label')}</span>
              <span className="font-medium text-foreground">
                {t('orders.user_label')} #{order.user_id}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{t('orders.delete_modal.date_label')}</span>
              <span className="font-medium text-foreground">
                {new Date(order.order_date).toLocaleDateString(locale)}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{t('orders.delete_modal.status_label')}</span>
              <span className="font-medium text-foreground">
                {t(`orders.status.${order.status.toLowerCase()}`, order.status)}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">{t('orders.delete_modal.amount_label')}</span>
              <span className="font-semibold text-foreground tabular-nums">
                {new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(order.amount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors bg-card border border-border rounded-lg hover:bg-muted"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-rose-600 border border-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? t('common.deleting') : t('orders.delete_modal.delete_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
