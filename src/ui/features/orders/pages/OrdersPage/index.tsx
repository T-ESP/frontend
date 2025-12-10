import { useState, useEffect } from 'react';
import { orderService } from '@/infrastructure/api/services/orderService';
import type { Order } from '@/domain/models/Order';
import { Edit, Trash2, Plus, Eye, ShoppingCart, Loader2, RefreshCw, AlertTriangle } from 'lucide-react'; // Switched to Lucide
import { AddOrderModal } from '@/ui/features/orders/components/AddOrderModal';
import { EditOrderModal } from '@/ui/features/orders/components/EditOrderModal';
import { DeleteOrderModal } from '@/ui/features/orders/components/DeleteOrderModal';
import { ViewOrderModal } from '@/ui/features/orders/components/ViewOrderModal';

// --- Helper Functions (Refined for Consistency) ---

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('fr-FR', {
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false); // Changed to false to show skeleton initially if desired
  const [error, setError] = useState<string | null>(null);
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      setError('Failed to load orders. Check API connection.');
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

  // --- Render Loading/Error States ---

  if (loading) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="text-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <div className="text-xl font-medium">Loading orders...</div>
            <p className="text-sm mt-1">Fetching {orders.length > 0 ? 'latest data' : 'initial data'} from server.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div className="text-center p-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-700">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
                onClick={loadOrders}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors mx-auto"
            >
                <RefreshCw size={16} />
                Try Again
            </button>
        </div>
      </div>
    );
  }

  // --- Main Render ---

  return (
    <>
      <div className="p-8 bg-slate-50 min-h-screen">
        
        {/* Header Component (Consistent Styling) */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 text-blue-600" />
                Orders Management
            </h1>
            <p className="text-slate-500 mt-2">
              {orders.length} order{orders.length !== 1 ? 's' : ''} currently registered in the system.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New Order
          </button>
        </div>

        {/* Modern Data Grid Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-100/70">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 bg-white">
                      <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      No orders found. Click "New Order" to get started.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        User #{order.user_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="font-medium text-slate-700">{formatDate(order.order_date)}</div>
                        <div className="text-xs">{formatTime(order.order_date)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ring-1 ring-inset ${getStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-slate-900">
                        {formatAmount(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal('view', order)}
                            className="p-2 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal('edit', order)}
                            className="p-2 text-amber-600 rounded-full hover:bg-amber-50 transition-colors"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenModal('delete', order)}
                            className="p-2 text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
                            title="Delete"
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