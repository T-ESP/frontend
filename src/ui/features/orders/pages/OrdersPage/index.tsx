import { useState, useEffect, useMemo } from 'react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order } from '@/domain/models/Order';
import { Edit, Trash2, Eye, ShoppingCart, Loader2, RefreshCw, AlertTriangle, Search, Filter, X, ChevronDown } from 'lucide-react'; // Switched to Lucide
import { AddOrderModal } from '@/ui/features/orders/components/AddOrderModal';
import { EditOrderModal } from '@/ui/features/orders/components/EditOrderModal';
import { DeleteOrderModal } from '@/ui/features/orders/components/DeleteOrderModal';
import { ViewOrderModal } from '@/ui/features/orders/components/ViewOrderModal';
import { OrderStats } from '@/ui/features/orders/components/OrderStats';
import { useToast } from '@/ui/components/common/Toast';
import { useTranslation } from 'react-i18next';

// --- Helper Functions (Refined for Consistency) ---

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const formatDate = (dateString: string, locale: string) => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateString: string, locale: string) => {
  return new Date(dateString).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Map status to consistent enterprise colors (matching our KPI badge logic)
const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  const colors: Record<string, string> = {
    'pending': 'bg-amber-100 text-amber-800 ring-amber-200',
    'confirmed': 'bg-blue-100 text-blue-800 ring-blue-200',
    'shipped': 'bg-purple-100 text-purple-800 ring-purple-200',
    'delivered': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    'cancelled': 'bg-rose-100 text-rose-800 ring-rose-200',
  };
  return colors[statusLower] || 'bg-slate-100 text-slate-800 ring-slate-200';
};

// --- Component ---

export default function OrdersPage() {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language || 'fr-FR';
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false to show skeleton initially if desired
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [amountRange, setAmountRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Pagination states
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

  // Centralized Modal Handlers
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

    // Clear selection after closing edit/delete/view modals
    if (type !== 'add') setSelectedOrder(null);

    if (shouldReload) loadOrders();
  };

  // Advanced filtering and sorting logic
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = [...orders];

    // Status filter
    if (selectedStatus !== "All Status") {
      filtered = filtered.filter(o => o.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toString().includes(query) ||
        o.user_id.toString().includes(query) ||
        o.status.toLowerCase().includes(query)
      );
    }

    // Amount range filter
    filtered = filtered.filter(o =>
      o.amount >= amountRange.min && o.amount <= amountRange.max
    );

    // Sorting
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
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [orders, selectedStatus, searchQuery, sortBy, sortOrder, amountRange]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedOrders, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery, amountRange]);

  const activeFiltersCount = [
    selectedStatus !== "All Status",
    searchQuery !== "",
    amountRange.min > 0 || amountRange.max < 10000
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedStatus("All Status");
    setSearchQuery("");
    setAmountRange({ min: 0, max: 10000 });
  };
  // --- Render Loading/Error States ---

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center text-slate-500">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-purple-600 animate-spin" />
          <div className="text-xl font-medium">{t('orders.loading')}</div>
          <p className="mt-1 text-sm">{t('orders.fetching')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="p-6 text-center border rounded-xl border-rose-200 bg-rose-50 text-rose-700">
          <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
          <h2 className="mb-2 text-xl font-bold">{t('orders.error_title')}</h2>
          <p>{error}</p>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 px-4 py-2 mx-auto mt-4 text-white transition-colors rounded-lg bg-rose-600 hover:bg-rose-700"
          >
            <RefreshCw size={16} />
            {t('orders.retry')}
          </button>
        </div>
      </div>
    );
  }

  // --- Main Render ---

  return (
    <>
      <div className="min-h-screen p-8 bg-slate-50">

        {/* Header Component (Consistent Styling) */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-slate-900">
              {t('orders.title')}
            </h1>
            <p className="mt-2 text-slate-500">
              {filteredAndSortedOrders.length === orders.length
                ? t('orders.subtitle', { count: orders.length })
                : `${filteredAndSortedOrders.length} ${t('common.of')} ${orders.length} ${t('orders.orders_label')}`}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700"
          >
            {t('orders.new_order')}
          </button>
        </div>

        {/* Order Stats Cards */}
        <OrderStats orders={orders} />

        {/* Filter and Search Bar */}
        <div className="mb-6 bg-white border shadow-xl rounded-2xl border-slate-200">
          {/* Header Row */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{t('orders.list_title')}</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  {filteredAndSortedOrders.length === orders.length
                    ? `${orders.length.toLocaleString()} ${t('orders.orders_label')}`
                    : `${filteredAndSortedOrders.length.toLocaleString()} ${t('common.of')} ${orders.length.toLocaleString()} ${t('orders.orders_label')}`}
                </p>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('orders.clear_filters', { count: activeFiltersCount })}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors bg-white border rounded-lg text-slate-700 border-slate-300 hover:bg-slate-50"
                title={t('common.refresh')}
              >
                <RefreshCw className="w-4 h-4" />
                {t('common.refresh')}
              </button>
              {/* <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-emerald-600 hover:bg-emerald-700"
                title={t('common.export')}
              >
                <Download className="w-4 h-4" />
                {t('common.export')}
              </button> */}
            </div>
          </div>

          {/* Search and Quick Filters Row */}
          <div className="px-6 py-4 space-y-4">
            <div className="flex gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('orders.filters.search')}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-slate-300 transition-all cursor-pointer min-w-40"
              >
                <option value="All Status">{t('orders.filters.all_status')}</option>
                <option value="Pending">{t('orders.filters.pending')}</option>
                <option value="Confirmed">{t('orders.filters.confirmed')}</option>
                <option value="Shipped">{t('orders.filters.shipped')}</option>
                <option value="Delivered">{t('orders.filters.delivered')}</option>
                <option value="Cancelled">{t('orders.filters.cancelled')}</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-slate-300 transition-all cursor-pointer min-w-40"
              >
                <option value="date">{t('orders.filters.sort_date')}</option>
                <option value="amount">{t('orders.filters.sort_amount')}</option>
                <option value="status">{t('orders.filters.sort_status')}</option>
                <option value="user">{t('orders.filters.sort_user')}</option>
              </select>

              {/* Sort Order */}
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                title={sortOrder === 'asc' ? t('orders.filters.asc') : t('orders.filters.desc')}
              >
                {sortOrder === 'asc' ? t('orders.filters.asc') : t('orders.filters.desc')}
              </button>

              {/* Advanced Filters Toggle */}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${showAdvancedFilters
                  ? 'text-purple-700 bg-purple-50 border-purple-200'
                  : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <Filter className="w-4 h-4" />
                {t('orders.filters.btn')}
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="p-4 space-y-4 duration-200 border rounded-lg bg-slate-50 border-slate-200 animate-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-700">{t('orders.filters.advanced')}</h4>
                  <button
                    onClick={() => {
                      setAmountRange({ min: 0, max: 10000 });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t('orders.filters.reset')}
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {/* Amount Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                      {t('orders.filters.amount_range')}
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={amountRange.min}
                        onChange={(e) => setAmountRange({ ...amountRange, min: Number(e.target.value) })}
                        placeholder={t('orders.filters.min')}
                        className="flex-1 px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <span className="text-slate-400">—</span>
                      <input
                        type="number"
                        value={amountRange.max}
                        onChange={(e) => setAmountRange({ ...amountRange, max: Number(e.target.value) })}
                        placeholder={t('orders.filters.max')}
                        className="flex-1 px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Data Grid Container */}
        <div className="overflow-hidden bg-white border shadow-xl rounded-2xl border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/70">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                    {t('orders.table.id')}
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                    {t('orders.table.user')}
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                    {t('orders.table.date')}
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-slate-600">
                    {t('orders.table.status')}
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right uppercase text-slate-600">
                    {t('orders.table.amount')}
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-center uppercase text-slate-600">
                    {t('orders.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center bg-white text-slate-500">
                      <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      {orders.length === 0 ? t('orders.table.no_orders') : t('inventory.table.no_products_desc')}
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-700">
                        {t('orders.user_label')} #{order.user_id}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        <div className="font-medium text-slate-700">{formatDate(order.order_date, currentLocale)}</div>
                        <div className="text-xs">{formatTime(order.order_date, currentLocale)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${getStatusColor(order.status)}`}>
                          {t(`orders.status.${order.status.toLowerCase()}`, order.status).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-right whitespace-nowrap text-slate-900">
                        {formatAmount(order.amount)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal('view', order)}
                            className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
                            title={t('common.view_details')}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit', order)}
                            className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
                            title={t('common.edit')}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal('delete', order)}
                            className="p-2 text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-rose-50 hover:text-rose-600"
                            title={t('common.delete')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredAndSortedOrders.length > 0 && (
          <div className="px-6 py-4 mt-6 bg-white border shadow-xl rounded-2xl border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600">
                  {t('orders.pagination.showing', { start: ((currentPage - 1) * itemsPerPage) + 1, end: Math.min(currentPage * itemsPerPage, filteredAndSortedOrders.length), total: filteredAndSortedOrders.length })}
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={10}>10 {t('orders.pagination.per_page')}</option>
                  <option value={25}>25 {t('orders.pagination.per_page')}</option>
                  <option value={50}>50 {t('orders.pagination.per_page')}</option>
                  <option value={100}>100 {t('orders.pagination.per_page')}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('orders.pagination.first')}
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('orders.pagination.previous')}
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                          ? 'text-white bg-purple-600'
                          : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('orders.pagination.next')}
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('orders.pagination.last')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals are placed outside the main content flow */}
      {showAddModal && (
        <AddOrderModal
          onClose={() => handleCloseModal('add')}
          onSuccess={() => handleCloseModal('add', true)}
        />
      )}

      {showEditModal && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => handleCloseModal('edit')}
          onSuccess={() => handleCloseModal('edit', true)}
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
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => handleCloseModal('view')}
        />
      )}
    </>
  );
}