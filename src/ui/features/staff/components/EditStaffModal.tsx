import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { staffService } from "@/infrastructure/api/services/staffService";
import type { Staff, UpdateStaffDto } from "@/domain/models/Staff";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffUpdated: () => void;
  staff: Staff | null;
}

export function EditStaffModal({ isOpen, onClose, onStaffUpdated, staff }: EditStaffModalProps) {
  const [formData, setFormData] = useState<UpdateStaffDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (staff) {
      setFormData({
        firstname: staff.firstname,
        lastname: staff.lastname,
        status: staff.status,
      });
    }
  }, [staff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;

    setLoading(true);
    setError(null);

    try {
      await staffService.update(staff.id, formData);
      onStaffUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de mettre à jour l'employé");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Modifier l'employé</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground/70 hover:text-muted-foreground rounded-lg hover:bg-muted"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Email (non modifiable)
            </label>
            <Input type="email" value={staff.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Prénom
            </label>
            <Input
              type="text"
              value={formData.firstname || ""}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Nom
            </label>
            <Input
              type="text"
              value={formData.lastname || ""}
              onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Statut
            </label>
            <Select
              value={formData.status || "active"}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Un employé inactif ne peut plus se connecter.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground bg-card rounded-lg border border-border hover:bg-muted"
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
