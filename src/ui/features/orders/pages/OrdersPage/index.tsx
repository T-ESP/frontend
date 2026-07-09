import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order, OrderQueryParams, OrderSortBy, OrderSortOrder } from '@/domain/models/Order';
import { useDebouncedValue } from '@/ui/hooks/useDebouncedValue';
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
  Calendar,
} from 'lucide-react';
import { AddOrderModal } from '@/ui/features/orders/components/AddOrderModal';
import { EditOrderModal } from '@/ui/features/orders/components/EditOrderModal';
import { DeleteOrderModal } from '@/ui/features/orders/components/DeleteOrderModal';
import { ViewOrderModal } from '@/ui/features/orders/components/ViewOrderModal';
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

type DatePreset = 'all' | 'today' | 'yesterday' | '7d' | '30d' | '90d' | 'month' | 'year' | 'custom';

function getDateRange(preset: DatePreset, customFrom: string, customUntil: string): { from: Date | null; until: Date | null } {
  const now = new Date();
  const startOfDay = (d: Date) => { d.setHours(0, 0, 0, 0); return d; };

  switch (preset) {
    case 'all': return { from: null, until: null };
    case 'today': return { from: startOfDay(new Date()), until: new Date() };
    case 'yesterday': {
      const y = new Date(); y.setDate(y.getDate() - 1);
      return { from: startOfDay(new Date(y)), until: new Date(y.setHours(23, 59, 59, 999)) };
    }
    case '7d': { const d = new Date(); d.setDate(d.getDate() - 7); return { from: startOfDay(d), until: now }; }
    case '30d': { const d = new Date(); d.setDate(d.getDate() - 30); return { from: startOfDay(d), until: now }; }
    case '90d': { const d = new Date(); d.setDate(d.getDate() - 90); return { from: startOfDay(d), until: now }; }
    case 'month': { const d = new Date(now.getFullYear(), now.getMonth(), 1); return { from: d, until: now }; }
    case 'year': { const d = new Date(now.getFullYear(), 0, 1); return { from: d, until: now }; }
    case 'custom': return {
      from: customFrom ? new Date(customFrom) : null,
      until: customUntil ? new Date(new Date(customUntil).setHours(23, 59, 59, 999)) : null,
    };
    default: return { from: null, until: null };
  }
}

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

/** Bornes par défaut du filtre de montant : hors filtre, on ne les envoie pas au serveur. */
const AMOUNT_MIN_DEFAULT = 0;
const AMOUNT_MAX_DEFAULT = 10000;

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
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customUntil, setCustomUntil] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Nombre de commandes correspondant aux filtres, renvoyé par le serveur.
  const [totalCount, setTotalCount] = useState(0);
  // Nombre total de commandes en base, tous filtres confondus.
  const [grandTotal, setGrandTotal] = useState<number | null>(null);

  // La recherche et les montants se saisissent au clavier : on attend une pause
  // avant d'interroger le serveur.
  const debouncedSearch = useDebouncedValue(searchQuery);
  const debouncedAmountRange = useDebouncedValue(amountRange);

  const activeFiltersCount = [
    selectedStatus !== 'All Status',
    searchQuery !== '',
    amountRange.min > AMOUNT_MIN_DEFAULT || amountRange.max < AMOUNT_MAX_DEFAULT,
    datePreset !== 'all',
  ].filter(Boolean).length;

  const queryParams = useMemo((): OrderQueryParams => {
    const { from, until } = getDateRange(datePreset, customFrom, customUntil);
    const { min, max } = debouncedAmountRange;

    return {
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      status: selectedStatus === 'All Status' ? undefined : selectedStatus.toLowerCase(),
      search: debouncedSearch.trim() || undefined,
      // Les bornes par défaut valent « pas de filtre » : les envoyer masquerait
      // les commandes au-delà de 10 000 €.
      min_amount: min > AMOUNT_MIN_DEFAULT ? min : undefined,
      max_amount: max < AMOUNT_MAX_DEFAULT ? max : undefined,
      date_from: from?.toISOString(),
      date_until: until?.toISOString(),
      sort_by: sortBy as OrderSortBy,
      sort_order: sortOrder as OrderSortOrder,
    };
  }, [
    itemsPerPage,
    currentPage,
    selectedStatus,
    debouncedSearch,
    debouncedAmountRange,
    datePreset,
    customFrom,
    customUntil,
    sortBy,
    sortOrder,
  ]);

  // Identifie la requête en cours : une réponse plus lente d'un filtre déjà abandonné
  // ne doit pas écraser le résultat courant.
  const latestRequestId = useRef(0);

  const loadOrders = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);
    try {
      const page = await orderService.getPage(queryParams);
      if (requestId !== latestRequestId.current) return;
      setOrders(page.items);
      setTotalCount(page.total);
    } catch (err) {
      if (requestId !== latestRequestId.current) return;
      setError(t('orders.load_error'));
      addToast(t('orders.load_error_toast'), t('orders.load_retry_hint'), 'error');
      console.error('Error loading orders:', err);
    } finally {
      if (requestId === latestRequestId.current) setLoading(false);
    }
  }, [queryParams, t, addToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Le total global sert à afficher « X sur Y » quand des filtres sont actifs ;
  // il ne dépend d'aucun filtre et se recharge seulement après une modification.
  const loadGrandTotal = useCallback(async () => {
    try {
      const stats = await orderService.getStats();
      setGrandTotal(stats.total_orders);
    } catch (err) {
      console.error('Error loading order stats:', err);
    }
  }, []);

  useEffect(() => {
    loadGrandTotal();
  }, [loadGrandTotal]);

  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // Après une suppression, la page courante peut se retrouver au-delà de la dernière.
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const reload = useCallback(() => {
    loadOrders();
    loadGrandTotal();
  }, [loadOrders, loadGrandTotal]);

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
    if (shouldReload) reload();
  };

  // Changer un filtre ou un tri invalide la position courante : on repart de la page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, debouncedSearch, debouncedAmountRange, datePreset, customFrom, customUntil, sortBy, sortOrder]);

  const clearAllFilters = () => {
    setSelectedStatus('All Status');
    setSearchQuery('');
    setAmountRange({ min: AMOUNT_MIN_DEFAULT, max: AMOUNT_MAX_DEFAULT });
    setDatePreset('all');
    setCustomFrom('');
    setCustomUntil('');
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={reload}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        {t('common.refresh')}
      </button>
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary-foreground bg-primary border border-primary rounded-lg hover:bg-primary/90 transition-colors"
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
          <div className="text-center text-muted-foreground">
            <Loader2 className="w-6 h-6 mx-auto mb-3 text-primary animate-spin" />
            <div className="text-sm font-medium text-muted-foreground">{t('orders.loading')}</div>
            <p className="mt-1 text-xs text-muted-foreground">{t('orders.fetching')}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t('orders.title')}>
        <div className="flex items-center justify-center py-16">
          <div className="max-w-md p-6 text-center bg-card border border-rose-500/30 rounded-lg">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-rose-500" />
            <h2 className="mb-1 text-base font-semibold text-foreground">{t('orders.error_title')}</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={reload}
              className="flex items-center gap-2 px-4 py-2 mx-auto mt-4 text-sm font-medium text-primary-foreground transition-colors bg-primary rounded-lg hover:bg-primary/90"
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
          activeFiltersCount === 0 || grandTotal === null
            ? t('orders.subtitle', { count: totalCount })
            : `${totalCount} ${t('common.of')} ${grandTotal} ${t('orders.orders_label')}`
        }
        actions={headerActions}
      >
        {/* Filters card */}
        <div className="bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-foreground">{t('orders.list_title')}</h3>
              <span className="text-sm text-muted-foreground">
                {activeFiltersCount === 0 || grandTotal === null
                  ? `${totalCount.toLocaleString()} ${t('orders.orders_label')}`
                  : `${totalCount.toLocaleString()} ${t('common.of')} ${grandTotal.toLocaleString()} ${t('orders.orders_label')}`}
              </span>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-muted-foreground bg-muted rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-3 h-3" />
                  {t('orders.clear_filters', { count: activeFiltersCount })}
                </button>
              )}
            </div>
          </div>

          <div className="px-6 py-4 space-y-4">
            {/* Date filter row */}
            <div className="space-y-2">
              <label className="ml-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {t('orders.filters.date_period', 'Période')}
              </label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'today', 'yesterday', '7d', '30d', '90d', 'month', 'year', 'custom'] as DatePreset[]).map((preset) => {
                  const labels: Record<DatePreset, string> = {
                    all: t('orders.filters.date_all', 'Toutes'),
                    today: t('orders.filters.date_today', "Aujourd'hui"),
                    yesterday: t('orders.filters.date_yesterday', 'Hier'),
                    '7d': t('orders.filters.date_7d', '7 jours'),
                    '30d': t('orders.filters.date_30d', '30 jours'),
                    '90d': t('orders.filters.date_90d', '90 jours'),
                    month: t('orders.filters.date_month', 'Ce mois'),
                    year: t('orders.filters.date_year', 'Cette année'),
                    custom: t('orders.filters.date_custom', 'Personnalisé'),
                  };
                  return (
                    <button
                      key={preset}
                      onClick={() => setDatePreset(preset)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                        datePreset === preset
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card text-muted-foreground border-border hover:bg-muted'
                      }`}
                    >
                      {labels[preset]}
                    </button>
                  );
                })}
              </div>
              {datePreset === 'custom' && (
                <div className="flex items-center gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="ml-1 text-xs font-medium text-muted-foreground">{t('orders.filters.date_from', 'Du')}</label>
                    <Input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      className="h-9 w-40"
                    />
                  </div>
                  <span className="text-muted-foreground mt-5">—</span>
                  <div className="space-y-1">
                    <label className="ml-1 text-xs font-medium text-muted-foreground">{t('orders.filters.date_until', 'Au')}</label>
                    <Input
                      type="date"
                      value={customUntil}
                      onChange={(e) => setCustomUntil(e.target.value)}
                      className="h-9 w-40"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid items-end grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
              <div className="space-y-1.5 lg:col-span-2">
                <label className="ml-1 text-xs font-medium text-muted-foreground">
                  {t('orders.filters.search')}
                </label>
                <div className="relative">
                  <Search className="absolute w-4 h-4 text-muted-foreground/70 -translate-y-1/2 left-3 top-1/2" />
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
                      className="absolute text-muted-foreground/70 -translate-y-1/2 right-2.5 top-1/2 hover:text-muted-foreground p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="ml-1 text-xs font-medium text-muted-foreground">
                  {t('inventory.header.status_label', 'Status')}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-medium bg-card border border-border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
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
                <label className="ml-1 text-xs font-medium text-muted-foreground">
                  {t('inventory.header.sort_label', 'Sort By')}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-medium bg-card border border-border rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                >
                  <option value="date">{t('orders.filters.sort_date')}</option>
                  <option value="amount">{t('orders.filters.sort_amount')}</option>
                  <option value="status">{t('orders.filters.sort_status')}</option>
                  <option value="user">{t('orders.filters.sort_user')}</option>
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-1.5">
                  <label className="ml-1 text-xs font-medium text-muted-foreground">
                    {t('inventory.header.order_label', 'Order')}
                  </label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    {sortOrder === 'asc' ? `↑ ${t('orders.filters.asc', 'Asc')}` : `↓ ${t('orders.filters.desc', 'Desc')}`}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="ml-1 text-xs font-medium text-muted-foreground opacity-0">.</label>
                  <button
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${
                      showAdvancedFilters
                        ? 'text-primary bg-accent border-primary/30'
                        : 'text-muted-foreground bg-card border-border hover:bg-muted'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {showAdvancedFilters && (
              <div className="p-4 mt-4 space-y-3 border border-border rounded-lg bg-muted">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    {t('orders.filters.advanced', 'Advanced')}
                  </h4>
                  <button
                    onClick={() => setAmountRange({ min: 0, max: 10000 })}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {t('orders.filters.reset', 'Reset')}
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
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
        <div className="overflow-hidden bg-card border rounded-lg">
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
              {orders.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-32 px-6 text-center text-muted-foreground">
                    <ShoppingCart className="mx-auto mb-2 size-8 text-muted-foreground/50" />
                    <p className="text-sm">
                      {activeFiltersCount === 0
                        ? t('orders.table.no_orders')
                        : t('inventory.table.no_products_desc')}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
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

          {totalCount > 0 && (
            <div className="flex flex-col gap-3 px-6 py-4 border-t border-border sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {t('orders.pagination.showing', {
                    start: (currentPage - 1) * itemsPerPage + 1,
                    end: Math.min(currentPage * itemsPerPage, totalCount),
                    total: totalCount,
                  })}
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                  className="flex items-center justify-center w-8 h-8 text-muted-foreground bg-card border border-border rounded-md hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                          ? 'text-primary-foreground bg-primary border border-primary'
                          : 'text-muted-foreground bg-card border border-border hover:bg-muted'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex items-center justify-center w-8 h-8 text-muted-foreground bg-card border border-border rounded-md hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
