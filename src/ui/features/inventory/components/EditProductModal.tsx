import { useState, useEffect } from "react";
import { X, Package, Hash, Truck, Box, DollarSign, Edit3, AlertTriangle, Loader2 } from "lucide-react";
import { productService } from "@/infrastructure/api/services/productService";
import type { Product, UpdateProductDto } from "@/domain/models/Product";
import { CategorySelect } from "./CategorySelect";
import { useToast } from "@/ui/components/common/Toast";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product | null;
}

// Function to safely initialize form data from the Product object
const mapProductToUpdateDto = (product: Product): UpdateProductDto => ({
  name: product.name,
  category: product.category,
  reference: product.reference,
  supplier_id: product.supplier_id,
  stock_quantity: product.stock_quantity,
  buying_price: product.buying_price,
});

export function EditProductModal({ isOpen, onClose, onProductUpdated, product }: EditProductModalProps) {
  const [formData, setFormData] = useState<UpdateProductDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  // Sync state when the modal opens or the product data changes
  useEffect(() => {
    if (product) {
      setFormData(mapProductToUpdateDto(product));
    }
  }, [product]);

  // Centralized Change Handler (identical to AddProductModal)
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let typedValue: string | number | undefined;

    if (type === 'number') {
      if (value === '') {
        typedValue = undefined;
      } else if (name === 'buying_price') {
        typedValue = parseFloat(value);
      } else {
        typedValue = parseInt(value, 10);
      }
    } else {
      typedValue = value;
    }
    
    if (typeof typedValue === 'number' && isNaN(typedValue)) {
      return; 
    }

    setFormData(prev => ({ ...prev, [name]: typedValue }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setLoading(true);
    setError(null);

    const invalidNumber = Object.values(formData).some(val => 
        (typeof val === 'number' && (isNaN(val) || !isFinite(val)))
    );

    if (invalidNumber) {
        setError("Please ensure all number fields contain valid numbers.");
        setLoading(false);
        return;
    }

    try {
      await productService.update(product.id, formData);
      addToast("Product updated", `${product.name} has been updated successfully.`, "success");
      onProductUpdated();
      onClose();
    } catch (err) {
      console.error('API Error during product update:', err);
      const errorMsg = err instanceof Error ? err.message : "Failed to update product. Check API connectivity.";
      setError(errorMsg);
      addToast("Failed to update product", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        
        {/* Header - Matches AddProductModal Style */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Edit3 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Editing: {product.name}</h2>
              <p className="text-sm text-slate-500">Update product ID: {product.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm font-medium flex items-center gap-2">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Product Name (Full Width) */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                <Package className="w-4 h-4 text-slate-400" />
                Product Name
              </label>
              <input
                id="name"
                name="name" // Mapped name
                type="text"
                required
                value={formData.name || ""}
                onChange={handleFormChange}
                // Focus Ring matches AddProductModal (blue/purple)
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900"
                placeholder="Enter product name"
              />
            </div>

            {/* Reference */}
            <div>
              <label htmlFor="reference" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                <Hash className="w-4 h-4 text-slate-400" />
                Reference (SKU)
              </label>
              <input
                id="reference"
                name="reference" // Mapped name
                type="text"
                required
                value={formData.reference || ""}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900"
                placeholder="e.g., PROD-001"
              />
            </div>
            
            {/* Category */}
            <div>
              <CategorySelect
                value={formData.category || ""}
                onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                required
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stock_quantity" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                <Box className="w-4 h-4 text-slate-400" />
                Stock Quantity *
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity" // Mapped name
                type="number"
                required
                min="0"
                value={formData.stock_quantity ?? ''}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900"
              />
            </div>
            
            {/* Supplier ID */}
            <div>
              <label htmlFor="supplier_id" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                <Truck className="w-4 h-4 text-slate-400" />
                Supplier ID *
              </label>
              <input
                id="supplier_id"
                name="supplier_id" // Mapped name
                type="number"
                required
                min="1"
                value={formData.supplier_id ?? ''}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900"
              />
            </div>

            {/* Buying Price (Full Width) */}
            <div className="md:col-span-2">
              <label htmlFor="buying_price" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                <DollarSign className="w-4 h-4 text-slate-400" />
                Buying Price (€) *
              </label>
              <input
                id="buying_price"
                name="buying_price" // Mapped name
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.buying_price ?? ''}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white rounded-xl border border-slate-300 hover:bg-slate-50 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              // Primary button style matches AddProductModal (blue/purple focus)
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}