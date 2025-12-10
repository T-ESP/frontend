import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { supplierService } from "@/infrastructure/api/services/supplierService";
import type { Supplier, UpdateSupplierDto } from "@/domain/models/Supplier";

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSupplierUpdated: () => void;
  supplier: Supplier | null;
}

export function EditSupplierModal({ isOpen, onClose, onSupplierUpdated, supplier }: EditSupplierModalProps) {
  const [formData, setFormData] = useState<UpdateSupplierDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (supplier) {
      setFormData({
        name_sup: supplier.name_sup,
        email_sup: supplier.email_sup,
        phone_sup: supplier.phone_sup,
        address_sup: supplier.address_sup,
      });
    }
  }, [supplier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;

    setLoading(true);
    setError(null);

    try {
      await supplierService.update(supplier.id, formData);
      onSupplierUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update supplier");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Modifier le fournisseur</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du fournisseur
            </label>
            <input
              type="text"
              value={formData.name_sup || ""}
              onChange={(e) => setFormData({ ...formData, name_sup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email_sup || ""}
              onChange={(e) => setFormData({ ...formData, email_sup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone_sup || ""}
              onChange={(e) => setFormData({ ...formData, phone_sup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <textarea
              value={formData.address_sup || ""}
              onChange={(e) => setFormData({ ...formData, address_sup: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
