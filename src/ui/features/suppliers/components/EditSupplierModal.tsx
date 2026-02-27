import { useState, useEffect } from "react";
import { X, Truck, Mail, Phone, MapPin, Edit3, Loader2, AlertTriangle } from "lucide-react";
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

  // Sync state when the modal opens or the supplier data changes
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

  // Centralized Change Handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
      console.error('API Error during supplier update:', err);
      setError(err instanceof Error ? err.message : "Failed to update supplier. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !supplier) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">

        {/* Header - Consistent with EditProductModal */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Edit3 className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Editing Supplier</h2>
              <p className="text-sm text-slate-500">{supplier.name_sup}</p>
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

          {/* Supplier Name */}
          <div>
            <label htmlFor="name_sup" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
              <Truck className="w-4 h-4 text-slate-400" />
              Supplier Name
            </label>
            <input
              id="name_sup"
              name="name_sup"
              type="text"
              value={formData.name_sup || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 placeholder:text-slate-400"
              placeholder="Ex: Acme Corp"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email_sup" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                <Mail className="w-4 h-4 text-slate-400" />
                Email
              </label>
              <input
                id="email_sup"
                name="email_sup"
                type="email"
                value={formData.email_sup || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 placeholder:text-slate-400"
                placeholder="contact@acme.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone_sup" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
                <Phone className="w-4 h-4 text-slate-400" />
                Phone
              </label>
              <input
                id="phone_sup"
                name="phone_sup"
                type="tel"
                value={formData.phone_sup || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 placeholder:text-slate-400"
                placeholder="+33 1 23 45 67 89"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address_sup" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              Address
            </label>
            <textarea
              id="address_sup"
              name="address_sup"
              value={formData.address_sup || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 text-slate-900 placeholder:text-slate-400 resize-none"
              placeholder="123 Rue Example, 75001 Paris"
              rows={3}
            />
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
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Updating..." : "Update Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}