import { useState, useEffect } from "react";
import { X, Plus, Trash2, ShoppingCart, User, Package, Loader2, AlertTriangle } from "lucide-react"; // Switched to Lucide
import { orderService } from "@/infrastructure/api/services/orderService";
import { userService } from "@/infrastructure/api/services/userService";
import { productService } from "@/infrastructure/api/services/productService";
import type { CreateOrderDto, CreateLineItemDto } from "@/domain/models/Order";
import type { User as UserType } from "@/domain/models/User";
import type { Product as ProductType } from "@/domain/models/Product"; // Renamed Product type to avoid clash
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";

interface AddOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

// Initial state for form clarity
const INITIAL_LINE_ITEM: CreateLineItemDto = { product_id: 0, quantity: 1 };
const INITIAL_FORM_DATA: CreateOrderDto = {
  user_id: 0,
  status: "pending",
  line_items: [],
};

export function AddOrderModal({ onClose, onSuccess }: AddOrderModalProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [formData, setFormData] = useState<CreateOrderDto>(INITIAL_FORM_DATA);
  const [lineItems, setLineItems] = useState<CreateLineItemDto[]>([INITIAL_LINE_ITEM]);
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    // Load static data concurrently
    const loadStaticData = async () => {
      setIsDataLoading(true);
      try {
        const [userData, productData] = await Promise.all([
          userService.getAll(),
          productService.getAll(),
        ]);
        setUsers(userData);
        setProducts(productData);
      } catch (err) {
        console.error("Failed to load static data:", err);
        setError("Error loading users/products.");
      } finally {
        setIsDataLoading(false);
      }
    };
    loadStaticData();
  }, []);

  // --- Line Item Management ---
  const addLineItem = () => {
    setLineItems([...lineItems, INITIAL_LINE_ITEM]);
    setError(null);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
      setError(null);
    }
  };

  const updateLineItem = (index: number, field: keyof CreateLineItemDto, value: number) => {
    const updated = [...lineItems];
    // Ensure quantity is not less than 1
    const finalValue = field === 'quantity' ? Math.max(1, value) : value;
    updated[index] = { ...updated[index], [field]: finalValue };
    setLineItems(updated);
  };

  // --- Submission ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.user_id === 0) {
      setError(t('orders.add_modal.user_error'));
      return;
    }

    if (lineItems.some(item => item.product_id === 0)) {
      setError(t('orders.add_modal.product_error'));
      return;
    }

    if (lineItems.some(item => item.quantity <= 0)) {
      setError(t('orders.add_modal.quantity_error'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Prepare the payload with the correct structure
      const finalPayload = {
        ...formData,
        // The backend explicitly asked for "line_items"
        line_items: lineItems.map(item => {
          // Find the full product details to get the price
          const productDetails = products.find(p => p.id === item.product_id);

          return {
            product_id: item.product_id,
            quantity: item.quantity,
            // 2. CRITICAL FIX: Add the price! 
            // We default to 0 if not found, but this prevents the DB crash.
            unit_price: productDetails ? productDetails.buying_price : 0
          };
        }),
      };

      // 3. Send the fixed payload
      await orderService.create(finalPayload);
      addToast(t('orders.add_modal.created_toast'), t('orders.add_modal.created_msg'), 'success');
      onSuccess();
    } catch (err) {
      console.error('API Error during order creation:', err);
      const errorMsg = err instanceof Error ? err.message : t('orders.add_modal.create_error');
      setError(errorMsg);
      addToast(t('orders.add_modal.create_error'), errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Modern Enterprise Modal Structure
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-60 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">{t('orders.add_modal.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm font-medium border rounded-lg bg-rose-50 border-rose-200 text-rose-700">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {isDataLoading ? (
            <div className="py-10 text-center">
              <Loader2 className="w-6 h-6 mx-auto mb-3 text-purple-500 animate-spin" />
              <p className="text-slate-600">{t('orders.add_modal.loading_data')}</p>
            </div>
          ) : (
            <>
              {/* User Select & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user_id" className="flex items-center gap-2 mb-1 text-sm font-semibold text-slate-700">
                    <User size={14} className="text-slate-400" /> {t('orders.add_modal.user_label')}
                  </label>
                  <select
                    id="user_id"
                    required
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 transition duration-150 bg-white border rounded-lg border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900"
                  >
                    <option value={0} disabled>{t('orders.add_modal.select_user')}</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstname} {user.lastname} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="flex items-center gap-2 mb-1 text-sm font-semibold text-slate-700">
                    <AlertTriangle size={14} className="text-slate-400" /> {t('orders.add_modal.status_label')}
                  </label>
                  <select
                    id="status"
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 transition duration-150 bg-white border rounded-lg border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-slate-900"
                  >
                    <option value="pending">{t('orders.status.pending')}</option>
                    <option value="confirmed">{t('orders.status.confirmed')}</option>
                    <option value="shipped">{t('orders.status.shipped')}</option>
                    <option value="delivered">{t('orders.status.delivered')}</option>
                    <option value="cancelled">{t('orders.status.cancelled')}</option>
                  </select>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Package size={14} className="text-slate-400" /> {t('orders.add_modal.items_label')}
                  </label>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                  >
                    <Plus size={16} />
                    {t('orders.add_modal.add_item')}
                  </button>
                </div>

                <div className="p-3 space-y-3 border bg-slate-50 border-slate-200 rounded-xl">
                  {lineItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm border-slate-100">
                      <select
                        required
                        value={item.product_id}
                        onChange={(e) => updateLineItem(index, 'product_id', parseInt(e.target.value))}
                        className="px-3 py-2 transition duration-150 bg-white border rounded-lg grow border-slate-300 focus:ring-1 focus:ring-purple-500 text-slate-900"
                      >
                        <option value={0} disabled>{t('orders.add_modal.select_product')}</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.reference}) - {product.buying_price}€
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value))}
                        className="w-20 px-3 py-2 text-center transition duration-150 border rounded-lg border-slate-300 focus:ring-1 focus:ring-purple-500 text-slate-900"
                        placeholder={t('orders.add_modal.quantity_placeholder')}
                      />
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="p-2 transition-colors rounded-full text-rose-600 hover:text-white hover:bg-rose-500"
                          title={t('orders.add_modal.delete_item')}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white rounded-xl border border-slate-300 hover:bg-slate-50 transition duration-150"
            >
              {t('orders.add_modal.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading || isDataLoading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition duration-150 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('orders.add_modal.creating') : t('orders.add_modal.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}