import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useState } from "react";
import { staffService } from "@/infrastructure/api/services/staffService";

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStaffDeleted: () => void;
  staffId: number | null;
  staffName: string;
}

export function DeleteStaffModal({
  isOpen,
  onClose,
  onStaffDeleted,
  staffId,
  staffName,
}: DeleteStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!staffId) return;

    setLoading(true);
    setError(null);

    try {
      await staffService.delete(staffId);
      onStaffDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de supprimer l'employé");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/15 rounded-lg">
              <FiAlertTriangle className="text-red-600 dark:text-red-400" size={20} />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Supprimer l'employé</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground/70 hover:text-muted-foreground rounded-lg hover:bg-muted"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <p className="text-muted-foreground">
            Es-tu sûr de vouloir supprimer{" "}
            <span className="font-semibold text-foreground">{staffName}</span> ?
            Cette action est irréversible et l'employé ne pourra plus se connecter.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground bg-card rounded-lg border border-border hover:bg-muted disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
