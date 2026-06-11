import { useState, useEffect, useMemo } from 'react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order } from '@/domain/models/Order';
import PageLayout from '@/ui/components/layouts/PageLayout';
import {
  Edit,
  Eye,
  ShoppingCart,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Plus,
} from 'lucide-react';
import { AddOrderModal } from '@/ui/features/orders/components/AddOrderModal';
import { EditOrderModal } from '@/ui/features/orders/components/EditOrderModal';
import { DeleteOrderModal } from '@/ui/features/orders/components/DeleteOrderModal';
import { ViewOrderModal } from '@/ui/features/orders/components/ViewOrderModal';
import { OrderStats } from '@/ui/features/orders/components/OrderStats';
import { useToast } from '@/ui/components/common/Toast';
import { useTranslation } from 'react-i18next';
import { useExportInvoice } from '@/ui/features/orders/hooks/useExportInvoice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);

const formatDate = (dateString: string, locale: string) =>
  new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const formatTime = (dateString: string, locale: string) =>
  new Date(dateString).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-500',
  confirmed: 'bg-blue-500',
  shipped: 'bg-violet-500',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-rose-500',
};

const getStatusDot = (status: string) =>
  STATUS_DOT[status.toLowerCase()] ?? 'bg-muted-foreground';

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language || 'fr-FR';
  const { exportInvoice, isExporting } = useExportInvoice();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [amountRange, setAmountRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError(t('orders.load_error'));
      addToast(t('orders.load_error_toast'), t('orders.load_retry_hint'), 'error');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: 'view' | 'edit' | 'delete', order: Order) => {
    setSelectedOrder(order);
    if (type === 'view') setShowViewModal(true);
    if (type === 'edit') setShowEditModal(true);
    if (type === 'delete') setShowDeleteModal(true);
  };

  const handleCloseModal = (type: 'add' | 'edit' | 'delete' | 'view', shouldReload = false) => {
    if (type === 'add') setShowAddModal(false);
    if (type === 'edit') setShowEditModal(false);
    if (type === 'delete') setShowDeleteModal(false);
    if (type === 'view') setShowViewModal(false);
    if (type !== 'add') setSelectedOrder(null);
    if (shouldReload) loadOrders();
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    if (selectedStatus !== 'All Status') {
      filtered = filtered.filter((o) => o.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toString().includes(query) ||
          o.user_id.toString().includes(query) ||
          o.status.toLowerCase().includes(query),
      );
    }

    filtered = filtered.filter((o) => o.amount >= amountRange.min && o.amount <= amountRange.max);

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.order_date).getTime() - new Date(b.order_date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'user':
          comparison = a.user_id - b.user_id;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, selectedStatus, searchQuery, sortBy, sortOrder, amountRange]);

  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery, amountRange]);

  const activeFiltersCount = [
    selectedStatus !== 'All Status',
    searchQuery !== '',
    amountRange.min > 0 || amountRange.max < 10000,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedStatus('All Status');
    setSearchQuery('');
    setAmountRange({ min: 0, max: 10000 });
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={loadOrders}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        {t('common.refresh')}
      </button>
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {t('orders.new_order')}
      </button>
    </div>
  );

  if (loading && orders.length === 0) {
    return (
      <PageLayout title={t('orders.title')} subtitle={t('orders.subtitle', { count: 0 })}>
        <div className="flex items-center justify-center py-24">
          <div className="text-center text-gray-500">
            <Loader2 className="w-6 h-6 mx-auto mb-3 text-purple-600 animate-spin" />
            <div className="text-sm font-medium text-gray-700">{t('orders.loading')}</div>
            <p className="mt-1 text-xs text-gray-500">{t('orders.fetching')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t('orders.title')}>
        <div className="flex items-center justify-center py-16">
          <div className="max-w-md p-6 text-center bg-white border border-rose-200 rounded-2xl">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-rose-500" />
            <h2 className="mb-1 text-base font-semibold text-gray-900">{t('orders.error_title')}</h2>
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={loadOrders}
              className="flex items-center gap-2 px-4 py-2 mx-auto mt-4 text-sm font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              <RefreshCw size={14} />
              {t('orders.retry')}
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title={t('orders.title')}
        subtitle={
          filteredAndSortedOrders.length === orders.length
            ? t('orders.subtitle', { count: orders.length })
            : `${filteredAndSortedOrders.length} ${t('common.of')} ${orders.length} ${t('orders.orders_label')}`
        }
        actions={headerActions}
      >
        <OrderStats orders={orders} />

        {/* Filters card */}
        <div className="bg-white border border-gray-200 rounded-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-gray-900">{t('orders.list_title')}</h3>
              <span className="text-sm text-gray-500">
                {filteredAndSortedOrders.length === orders.length
                  ? `${orders.length.toLocaleString()} ${t('orders.orders_label')}`
                  : `${filteredAndSortedOrders.length.toLocaleString()} ${t('common.of')} ${orders.length.toLocaleString()} ${t('orders.orders_label')}`}
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('orders.clear_filters', { count: activeFiltersCount })}
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="grid items-end grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
              <div className="space-y-1.5 lg:col-span-2">
                <label className="ml-1 text-xs font-medium text-gray-500">
                  {t('orders.filters.search')}
                </label>
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('orders.filters.search')}
                    className="h-9 pl-9 pr-8"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute text-gray-400 -translate-y-1/2 right-2.5 top-1/2 hover:text-gray-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-medium text-gray-500">
                  {t('inventory.header.status_label', 'Status')}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-shadow"
                >
                  <option value="All Status">{t('orders.filters.all_status')}</option>
                  <option value="Pending">{t('orders.filters.pending')}</option>
                  <option value="Confirmed">{t('orders.filters.confirmed')}</option>
                  <option value="Shipped">{t('orders.filters.shipped')}</option>
                  <option value="Delivered">{t('orders.filters.delivered')}</option>
                  <option value="Cancelled">{t('orders.filters.cancelled')}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-medium text-gray-500">
                  {t('inventory.header.sort_label', 'Sort By')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-shadow"
                >
                  <option value="date">{t('orders.filters.sort_date')}</option>
                  <option value="amount">{t('orders.filters.sort_amount')}</option>
                  <option value="status">{t('orders.filters.sort_status')}</option>
                  <option value="user">{t('orders.filters.sort_user')}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-1.5">
                  <label className="ml-1 text-xs font-medium text-gray-500">
                    {t('inventory.header.order_label', 'Order')}
                  </label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === 'asc' ? `↑ ${t('orders.filters.asc', 'Asc')}` : `↓ ${t('orders.filters.desc', 'Desc')}`}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="ml-1 text-xs font-medium text-gray-500 opacity-0">.</label>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                      showAdvancedFilters
                        ? 'text-purple-700 bg-purple-50 border-purple-200'
                        : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="p-4 mt-4 space-y-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-gray-700">
                    {t('orders.filters.advanced', 'Advanced')}
                  </h4>
                  <button
                    onClick={() => setAmountRange({ min: 0, max: 10000 })}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t('orders.filters.reset', 'Reset')}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('orders.filters.amount_range')}
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={amountRange.min}
                      onChange={(e) => setAmountRange({ ...amountRange, min: Number(e.target.value) })}
                      placeholder={t('orders.filters.min')}
                      className="h-9"
                    />
                    <span className="text-muted-foreground">—</span>
                    <Input
                      type="number"
                      value={amountRange.max}
                      onChange={(e) => setAmountRange({ ...amountRange, max: Number(e.target.value) })}
                      placeholder={t('orders.filters.max')}
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders table */}
        <div className="overflow-hidden bg-card border rounded-2xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">{t('orders.table.id')}</TableHead>
                <TableHead className="px-6">{t('orders.table.user')}</TableHead>
                <TableHead className="px-6">{t('orders.table.date')}</TableHead>
                <TableHead className="px-6">{t('orders.table.status')}</TableHead>
                <TableHead className="px-6 text-right">{t('orders.table.amount')}</TableHead>
                <TableHead className="px-6 text-center">{t('orders.table.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-32 px-6 text-center text-muted-foreground">
                    <ShoppingCart className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                    <p className="text-sm">
                      {orders.length === 0
                        ? t('orders.table.no_orders')
                        : t('inventory.table.no_products_desc')}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="px-6 py-4 font-medium">#{order.id}</TableCell>
                    <TableCell className="px-6 py-4 text-muted-foreground">
                      {t('orders.user_label')} #{order.user_id}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="font-medium">{formatDate(order.order_date, currentLocale)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(order.order_date, currentLocale)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <span className={`size-1.5 rounded-full ${getStatusDot(order.status)}`} />
                        {t(`orders.status.${order.status.toLowerCase()}`, order.status)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-semibold tabular-nums">
                      {formatAmount(order.amount)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenModal('view', order)}
                          title={t('common.view_details')}
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleOpenModal('edit', order)}
                          title={t('common.edit')}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => exportInvoice(order, currentLocale)}
                          disabled={isExporting === order.id}
                          title={t('orders.export_invoice', 'Exporter la facture')}
                        >
                          <FileDown />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {filteredAndSortedOrders.length > 0 && (
            <div className="flex flex-col gap-3 px-6 py-4 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">
                  {t('orders.pagination.showing', {
                    start: (currentPage - 1) * itemsPerPage + 1,
                    end: Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length),
                    total: filteredAndSortedOrders.length,
                  })}
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500"
                >
                  <option value={10}>10 {t('orders.pagination.per_page')}</option>
                  <option value={25}>25 {t('orders.pagination.per_page')}</option>
                  <option value={50}>50 {t('orders.pagination.per_page')}</option>
                  <option value={100}>100 {t('orders.pagination.per_page')}</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center w-8 h-8 text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-w-[32px] h-8 px-2 text-xs font-medium rounded-md transition-colors ${
                        currentPage === pageNum
                          ? 'text-white bg-purple-600 border border-purple-600'
                          : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center w-8 h-8 text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </PageLayout>

      {showAddModal && (
        <AddOrderModal onClose={() => handleCloseModal('add')} onSuccess={() => handleCloseModal('add', true)} />
      )}

      {showEditModal && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => handleCloseModal('edit')}
          onSuccess={() => handleCloseModal('edit', true)}
          onDeleteRequest={() => {
            handleCloseModal('edit');
            handleOpenModal('delete', selectedOrder);
          }}
        />
      )}

      {showDeleteModal && selectedOrder && (
        <DeleteOrderModal
          order={selectedOrder}
          onClose={() => handleCloseModal('delete')}
          onSuccess={() => handleCloseModal('delete', true)}
        />
      )}

      {showViewModal && selectedOrder && (
        <ViewOrderModal order={selectedOrder} onClose={() => handleCloseModal('view')} />
      )}
    </>
  );
}
