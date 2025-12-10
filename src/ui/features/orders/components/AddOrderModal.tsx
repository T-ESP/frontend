import { useState, useEffect } from "react";
import { X, Plus, Trash2, ShoppingCart, User, Package, Loader2, AlertTriangle } from "lucide-react"; // Switched to Lucide
import { orderService } from "@/infrastructure/api/services/orderService";
import { userService } from "@/infrastructure/api/services/userService";
import { productService } from "@/infrastructure/api/services/productService";
import type { CreateOrderDto, CreateLineItemDto } from "@/domain/models/Order";
import type { User as UserType } from "@/domain/models/User";
import type { Product as ProductType } from "@/domain/models/Product"; // Renamed Product type to avoid clash

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
  const [users, setUsers] = useState<UserType[]>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [formData, setFormData] = useState<CreateOrderDto>(INITIAL_FORM_DATA);
  const [lineItems, setLineItems] = useState<CreateLineItemDto[]>([INITIAL_LINE_ITEM]);
  const [loading, setLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            setError("Erreur lors du chargement des utilisateurs/produits.");
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
      setError("Veuillez sélectionner un utilisateur.");
      return;
    }

    if (lineItems.some(item => item.product_id === 0)) {
      setError("Veuillez sélectionner un produit pour chaque article.");
      return;
    }

    if (lineItems.some(item => item.quantity <= 0)) {
        setError("La quantité de chaque article doit être supérieure à zéro.");
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
      onSuccess();
    } catch (err) {
      console.error('API Error during order creation:', err);
      setError(err instanceof Error ? err.message : "Erreur: Échec de la création de la commande.");
    } finally {
      setLoading(false);
    }
  };

  // Modern Enterprise Modal Structure
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Create New Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium flex items-center gap-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}
          
          {isDataLoading ? (
            <div className="text-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-3" />
                <p className="text-slate-600">Loading user and product data...</p>
            </div>
          ) : (
            <>
              {/* User Select & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user_id" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                    <User size={14} className="text-slate-400" /> Utilisateur *
                  </label>
                  <select
                    id="user_id"
                    required
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-white"
                  >
                    <option value={0} disabled>Sélectionner un utilisateur</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstname} {user.lastname} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                    <AlertTriangle size={14} className="text-slate-400" /> Statut *
                  </label>
                  <select
                    id="status"
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Line Items Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Package size={14} className="text-slate-400" /> Articles de la commande *
                  </label>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="flex items-center gap-1 text-sm text-blue-600 font-medium px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Plus size={16} />
                    Ajouter un article
                  </button>
                </div>

                <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  {lineItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <select
                        required
                        value={item.product_id}
                        onChange={(e) => updateLineItem(index, 'product_id', parseInt(e.target.value))}
                        className="flex-grow px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition duration-150 text-slate-900 bg-white"
                      >
                        <option value={0} disabled>Sélectionner un produit</option>
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
                        className="w-20 text-center px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 transition duration-150 text-slate-900"
                        placeholder="Qté"
                      />
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="p-2 text-rose-600 hover:text-white hover:bg-rose-500 rounded-full transition-colors"
                          title="Supprimer cet article"
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
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || isDataLoading}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Création..." : "Créer la commande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}