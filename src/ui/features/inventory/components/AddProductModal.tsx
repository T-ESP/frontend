import { useState } from "react";
import { X, PackagePlus, Loader2, AlertTriangle } from "lucide-react";
import { productService } from "@/infrastructure/api/services/productService";
import type { CreateProductDto } from "@/domain/models/Product";
import { CategorySelect } from "./CategorySelect";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

const INITIAL_STATE: CreateProductDto = {
  name: "",
  category: "",
  reference: "",
  supplier_id: 1,
  stock_quantity: 0,
  buying_price: 0,
};

const labelClass = "block mb-1.5 text-sm font-medium text-foreground";

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
      setFormData(INITIAL_STATE);
    } catch (err) {
      console.error('API Error during product creation:', err);
      const errorMsg = err instanceof Error ? err.message : "Failed to create product. Check API connectivity.";
      setError(errorMsg);
      addToast("Failed to create product", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border shadow-xl rounded-xl border-border animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{t('inventory.add_modal.title')}</h2>
              <p className="text-xs text-muted-foreground">{t('inventory.add_modal.subtitle', 'Fill in the product details')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Name"
            />
          </div>

          <div>
            <label htmlFor="reference" className={labelClass}>
              {t('inventory.form.reference')} <span className="text-destructive">*</span>
            </label>
            <Input
              id="reference"
              name="reference"
              type="text"
              required
              value={formData.reference}
              onChange={handleFormChange}
              placeholder="PROD-001"
            />
          </div>

          <CategorySelect
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            required
          />

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
              value={formData.buying_price}
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
              value={formData.stock_quantity}
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
              value={formData.supplier_id}
              onChange={handleFormChange}
            />
          </div>

          {/* Actions */}
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
              {loading ? t('common.creating') : t('inventory.form.create_submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
