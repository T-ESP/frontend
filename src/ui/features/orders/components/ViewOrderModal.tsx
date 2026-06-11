import { useState, useEffect } from 'react';
import { X, Loader2, AlertTriangle, ShoppingCart } from 'lucide-react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order, LineItem } from '@/domain/models/Order';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ViewOrderModalProps {
  order: Order;
  onClose: () => void;
}

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  shipped: 'bg-violet-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-rose-500',
};

const getStatusDot = (status: string) =>
  STATUS_DOT[status.toLowerCase()] ?? 'bg-muted-foreground';

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

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-[2px]">
      <div className="bg-white w-full max-w-2xl border border-gray-200 rounded-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 text-purple-600">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {t('orders.view_modal.title', { id: order.id })}
              </h2>
              <p className="mt-0.5 text-xs text-gray-500">
                {new Date(order.order_date).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 transition-colors rounded-md hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5 overflow-y-auto">
          {/* Summary grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-xs font-medium text-gray-500">
                {t('orders.view_modal.user_label')}
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                #{order.user_id}
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-xs font-medium text-gray-500">
                {t('orders.view_modal.date_label')}
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {new Date(order.order_date).toLocaleDateString(locale, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-xs font-medium text-gray-500">
                {t('orders.view_modal.status_label')}
              </div>
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <span className={`size-1.5 rounded-full ${getStatusDot(order.status)}`} />
                  {t(`orders.status.${order.status.toLowerCase()}`, order.status)}
                </span>
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="text-xs font-medium text-gray-500">
                {t('orders.view_modal.amount_label')}
              </div>
              <div className="mt-1 text-sm font-semibold text-gray-900 tabular-nums">
                {formatCurrency(order.amount)}
              </div>
            </div>
          </div>

          {/* Line items */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              {t('orders.view_modal.items_title')}
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500 border border-gray-200 rounded-lg bg-gray-50/50">
                <Loader2 className="w-4 h-4 mr-2 text-purple-600 animate-spin" />
                <span className="text-sm">{t('orders.view_modal.loading_items')}</span>
              </div>
            ) : error ? (
              <div className="flex items-start gap-2 px-3 py-2.5 text-sm border border-rose-200 rounded-lg bg-rose-50 text-rose-700">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : lineItems.length === 0 ? (
              <div className="py-10 text-sm text-center text-gray-500 border border-gray-200 rounded-lg bg-gray-50/50">
                {t('orders.view_modal.no_items')}
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-3">{t('orders.view_modal.col_product')}</TableHead>
                      <TableHead className="px-3">{t('orders.view_modal.col_qty')}</TableHead>
                      <TableHead className="px-3 text-right">{t('orders.view_modal.col_total')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="px-3 text-muted-foreground">
                          {t('orders.view_modal.product_label')} #{item.product_id}
                        </TableCell>
                        <TableCell className="px-3 text-muted-foreground">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="px-3 text-right font-medium tabular-nums">
                          {formatCurrency(item.line_total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="px-3 text-right font-medium">
                        {t('orders.view_modal.total_label')}
                      </TableCell>
                      <TableCell className="px-3 text-right font-semibold tabular-nums">
                        {formatCurrency(order.amount)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            )}
          </div>

          <div className="pt-3 space-y-1 text-xs text-gray-500 border-t border-gray-100">
            <div>
              {t('orders.view_modal.created_at')}: {new Date(order.created_at).toLocaleString(locale)}
            </div>
            <div>
              {t('orders.view_modal.updated_at')}: {new Date(order.updated_at).toLocaleString(locale)}
            </div>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700"
          >
            {t('orders.view_modal.close_btn')}
          </button>
        </div>
      </div>
    </div>
  );
}
