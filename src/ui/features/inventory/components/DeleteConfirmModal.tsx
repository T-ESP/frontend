import { AlertTriangle, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { productService } from "@/infrastructure/api/services/productService";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductDeleted: () => void;
  productId: number | null;
  productName: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onProductDeleted,
  productId,
  productName,
}: DeleteConfirmModalProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const handleDelete = async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      await productService.delete(productId);
      addToast("Product deleted", `${productName} has been removed from inventory.`, "success");
      onProductDeleted();
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete product";
      setError(errorMsg);
      addToast("Failed to delete product", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-card border shadow-xl rounded-xl border-border animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-destructive/10 text-destructive">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">{t('inventory.delete_modal.title')}</h2>
              <p className="text-xs text-muted-foreground">{t('inventory.delete_modal.subtitle', 'This action is permanent')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 transition-colors rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm border rounded-lg bg-destructive/5 border-destructive/20 text-destructive">
              <AlertTriangle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            {t('inventory.delete_modal.message', { name: productName })}
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium transition-colors bg-card border rounded-lg border-border text-foreground hover:bg-muted disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center justify-center h-10 gap-2 px-4 text-sm font-medium text-white transition-colors rounded-lg bg-destructive hover:bg-destructive/90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? t('common.deleting') : t('inventory.form.delete_submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
