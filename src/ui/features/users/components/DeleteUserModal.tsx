import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useState } from "react";
import { userService } from "@/infrastructure/api/services/userService";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserDeleted: () => void;
  userId: number | null;
  userName: string;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  onUserDeleted,
  userId,
  userName,
}: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      await userService.delete(userId);
      onUserDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
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
            <h2 className="text-xl font-semibold text-foreground">Delete Member</h2>
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
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">{userName}</span> ?
            This action is irreversible.
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
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
