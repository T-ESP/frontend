import { FiAlertTriangle, FiX } from "react-icons/fi";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="text-red-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{t('inventory.delete_modal.title')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <p className="text-gray-600">
            {t('inventory.delete_modal.message', { name: productName })}
          </p>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.deleting') : t('inventory.form.delete_submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
