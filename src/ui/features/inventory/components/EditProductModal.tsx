import { useState, useEffect } from "react";
import { X, Edit3, AlertTriangle, Loader2 } from "lucide-react";
import { productService } from "@/infrastructure/api/services/productService";
import type { Product, UpdateProductDto } from "@/domain/models/Product";
import { CategorySelect } from "./CategorySelect";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: () => void;
  product: Product | null;
}

const mapProductToUpdateDto = (product: Product): UpdateProductDto => ({
  name: product.name,
  category: product.category,
  reference: product.reference,
  supplier_id: product.supplier_id,
  stock_quantity: product.stock_quantity,
  buying_price: product.buying_price,
});

const labelClass = "block mb-1.5 text-sm font-medium text-foreground";

export function EditProductModal({ isOpen, onClose, onProductUpdated, product }: EditProductModalProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<UpdateProductDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (product) {
      setFormData(mapProductToUpdateDto(product));
    }
  }, [product]);

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
      setError(t('inventory.form.error.numbers'));
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
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border shadow-xl rounded-xl border-border animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{t('inventory.edit_modal.title', { name: product.name })}</h2>
              <p className="text-xs text-muted-foreground">{t('inventory.edit_modal.subtitle', { id: product.id })}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm border rounded-lg bg-destructive/5 border-destructive/20 text-destructive">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className={labelClass}>
              {t('inventory.form.product_name')} <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name || ""}
              onChange={handleFormChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="reference" className={labelClass}>
                {t('inventory.form.reference')} <span className="text-destructive">*</span>
              </label>
              <Input
                id="reference"
                name="reference"
                type="text"
                required
                value={formData.reference || ""}
                onChange={handleFormChange}
                placeholder="PROD-001"
              />
            </div>

            <CategorySelect
              value={formData.category || ""}
              onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="buying_price" className={labelClass}>
                {t('inventory.form.buying_price')} <span className="text-destructive">*</span>
              </label>
              <Input
                id="buying_price"
                name="buying_price"
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.buying_price ?? ''}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="stock_quantity" className={labelClass}>
                {t('inventory.form.stock_quantity')} <span className="text-destructive">*</span>
              </label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                required
                min="0"
                value={formData.stock_quantity ?? ''}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label htmlFor="supplier_id" className={labelClass}>
                {t('inventory.form.supplier_id')} <span className="text-destructive">*</span>
              </label>
              <Input
                id="supplier_id"
                name="supplier_id"
                type="number"
                required
                min="1"
                value={formData.supplier_id ?? ''}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium transition-colors bg-white border rounded-lg border-border text-foreground hover:bg-muted"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center h-10 gap-2 px-4 text-sm font-medium transition-colors rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('common.updating') : t('inventory.form.update_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
