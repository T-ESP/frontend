import { useState } from "react";
import { X, PackagePlus, Loader2, AlertTriangle } from "lucide-react"; // Using Lucide icons for consistency
import { productService } from "@/infrastructure/api/services/productService";
import type { CreateProductDto } from "@/domain/models/Product";
import { CategorySelect } from "./CategorySelect";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

// Initial state for form clarity
const INITIAL_STATE: CreateProductDto = {
  name: "",
  category: "",
  reference: "",
  supplier_id: 1, // Assume 1 is a valid default for a quick prototype
  stock_quantity: 0,
  buying_price: 0,
};

export function AddProductModal({ isOpen, onClose, onProductAdded }: AddProductModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateProductDto>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    let typedValue: string | number;

    if (type === 'number') {
      // Use parseFloat/parseInt only if the value is not empty to handle clear operations gracefully
      if (value === '') {
        typedValue = 0;
      } else if (name === 'buying_price') {
        typedValue = parseFloat(value);
      } else {
        typedValue = parseInt(value, 10);
      }
    } else {
      typedValue = value;
    }

    setFormData({ ...formData, [name]: typedValue });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation check for number types being NaN or infinite
    const invalidNumber = Object.values(formData).some(val =>
      (typeof val === 'number' && (isNaN(val) || !isFinite(val)))
    );

    if (invalidNumber) {
      setError(t('inventory.form.error.numbers'));
      setLoading(false);
      return;
    }

    try {
      await productService.create(formData);
      addToast("Product created", `${formData.name} has been added to inventory.`, "success");
      onProductAdded();
      onClose();
      // Reset form on successful submission
      setFormData(INITIAL_STATE);
    } catch (err) {
      // Centralize error logging and display
      console.error('API Error during product creation:', err);
      const errorMsg = err instanceof Error ? err.message : "Failed to create product. Check API connectivity.";
      setError(errorMsg);
      addToast("Failed to create product", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Modern Enterprise Modal Styling
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-60 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-200">

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <PackagePlus className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-slate-900">{t('inventory.add_modal.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 transition-colors rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm font-medium border rounded-lg bg-rose-50 border-rose-200 text-rose-700">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          {/* Form Fields - Modern Inputs */}

          <div className="grid grid-cols-2 gap-4">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-slate-700">
                {t('inventory.form.product_name')} *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-4 py-2 transition duration-150 border rounded-lg border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Name"
              />
            </div>

            {/* Reference (SKU) */}
            <div>
              <label htmlFor="reference" className="block mb-1 text-sm font-medium text-slate-700">
                {t('inventory.form.reference')} *
              </label>
              <input
                id="reference"
                name="reference"
                type="text"
                required
                value={formData.reference}
                onChange={handleFormChange}
                className="w-full px-4 py-2 transition duration-150 border rounded-lg border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="PROD-001"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <CategorySelect
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Buying Price */}
            <div>
              <label htmlFor="buying_price" className="block mb-1 text-sm font-medium text-slate-700">
                {t('inventory.form.buying_price')} *
              </label>
              <input
                id="buying_price"
                name="buying_price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.buying_price}
                onChange={handleFormChange}
                className="w-full px-4 py-2 transition duration-150 border rounded-lg border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label htmlFor="stock_quantity" className="block mb-1 text-sm font-medium text-slate-700">
                {t('inventory.form.stock_quantity')} *
              </label>
              <input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                required
                min="0"
                value={formData.stock_quantity}
                onChange={handleFormChange}
                className="w-full px-4 py-2 transition duration-150 border rounded-lg border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            {/* Supplier ID */}
            <div>
              <label htmlFor="supplier_id" className="block mb-1 text-sm font-medium text-slate-700">
                {t('inventory.form.supplier_id')} *
              </label>
              <input
                id="supplier_id"
                name="supplier_id"
                type="number"
                required
                min="1"
                value={formData.supplier_id}
                onChange={handleFormChange}
                className="w-full px-4 py-2 transition duration-150 border rounded-lg border-slate-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white rounded-xl border border-slate-300 hover:bg-slate-50 transition duration-150"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition duration-150 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('common.creating') : t('inventory.form.create_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}