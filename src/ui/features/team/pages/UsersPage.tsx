import { useState, useEffect, useMemo } from "react";
import {
  FiSearch, FiRefreshCw, FiPlus, FiMail, FiPhone, FiTrash2, FiEdit2,
  FiUser, FiCalendar, FiFilter, FiX, FiCheck, FiAlertTriangle,
} from "react-icons/fi";
import { userService } from "@/infrastructure/api/services/userService";
import { orderService } from "@/infrastructure/api/services/orderService";
import type { User } from "@/domain/models/User";
import type { Order } from "@/domain/models/Order";
import { AddUserModal } from "@/ui/features/users/components/AddUserModal";
import { EditUserModal } from "@/ui/features/users/components/EditUserModal";
import { DeleteUserModal } from "@/ui/features/users/components/DeleteUserModal";
import PageLayout from "@/ui/components/layouts/PageLayout";

// ─── Helper: compute initials colour ─────────────────────────────────────────
function getAvatarGradient(id: number) {
  const gradients = [
    "from-purple-500 to-purple-700",
    "from-blue-500 to-blue-700",
    "from-emerald-500 to-emerald-700",
    "from-rose-500 to-rose-700",
    "from-amber-500 to-amber-700",
    "from-cyan-500 to-cyan-700",
  ];
  return gradients[id % gradients.length];
}

// ─── User Profile Panel ───────────────────────────────────────────────────────
function UserProfilePanel({
  user,
  orders,
  onClose,
  onEdit,
  onDelete,
}: {
  user: User;
  orders: Order[];
  onClose: () => void;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}) {
  const userOrders = orders.filter((o) => o.user_id === user.id);
  const totalSpent = userOrders.reduce((s, o) => s + o.amount, 0);
  const gradient = getAvatarGradient(user.id);
  const initials = `${user.firstname[0] ?? ""}${user.lastname[0] ?? ""}`.toUpperCase();

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(v);

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" }) : "—";

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/30" />
      <div
        className="w-[420px] bg-white h-full shadow-2xl flex flex-col overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${gradient} p-8 text-white`}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 transition-colors">
            <FiX className="w-5 h-5" />
          </button>
          <div className="flex items-end gap-4 mt-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black border-2 border-white/30">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-black">{user.firstname} {user.lastname}</h2>
              <p className="text-white/80 text-sm mt-0.5">Utilisateur #{user.id}</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 border-b border-gray-100">
          <div className="p-5 border-r border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Commandes</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{userOrders.length}</p>
          </div>
          <div className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total dépensé</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{formatCurrency(totalSpent)}</p>
          </div>
        </div>

        {/* Contact info */}
        <div className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Informations</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Téléphone</p>
                <p className="font-medium text-gray-900">{user.phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Inscrit le</p>
                <p className="font-medium text-gray-900">{formatDate(user.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Dernière modification</p>
                <p className="font-medium text-gray-900">{formatDate(user.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order history */}
        <div className="px-6 pb-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            Commandes associées ({userOrders.length})
          </h3>
          {userOrders.length === 0 ? (
            <div className="py-6 text-center text-gray-400">
              <p className="text-sm">Aucune commande</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {userOrders.slice(0, 8).map((o) => {
                const statusColors: Record<string, string> = {
                  pending: "bg-amber-100 text-amber-700",
                  confirmed: "bg-blue-100 text-blue-700",
                  shipped: "bg-purple-100 text-purple-700",
                  delivered: "bg-emerald-100 text-emerald-700",
                  cancelled: "bg-rose-100 text-rose-700",
                };
                const sc = statusColors[o.status.toLowerCase()] ?? "bg-gray-100 text-gray-700";
                return (
                  <div key={o.id} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 text-sm">
                    <div>
                      <p className="font-medium text-gray-900">#{o.id}</p>
                      <p className="text-xs text-gray-400">{new Date(o.order_date).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${sc}`}>{o.status}</span>
                      <span className="font-bold text-gray-900">{formatCurrency(o.amount)}</span>
                    </div>
                  </div>
                );
              })}
              {userOrders.length > 8 && (
                <p className="text-xs text-center text-gray-400 pt-1">+ {userOrders.length - 8} autres commandes</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-100 mt-auto flex gap-3">
          <button
            onClick={() => onEdit(user)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
          >
            <FiEdit2 className="w-4 h-4" /> Modifier
          </button>
          <button
            onClick={() => onDelete(user)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" /> Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, ordersData] = await Promise.allSettled([
        userService.getAll(),
        orderService.getAll(),
      ]);
      if (usersData.status === "fulfilled") setUsers(usersData.value);
      if (ordersData.status === "fulfilled") setOrders(ordersData.value);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        u.firstname.toLowerCase().includes(q) ||
        u.lastname.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone ?? "").toLowerCase().includes(q);
      // Optional: filter by status if `status` field is present
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && (u.status ?? "active") === "active") ||
        (statusFilter === "inactive" && (u.status ?? "active") === "inactive");
      return matchSearch && matchStatus;
    });
  }, [users, searchQuery, statusFilter]);

  // Computed order counts per user
  const orderCountByUser = useMemo(() => {
    const map: Record<number, number> = {};
    orders.forEach((o) => {
      map[o.user_id] = (map[o.user_id] ?? 0) + 1;
    });
    return map;
  }, [orders]);

  const openEdit = (u: User) => { setSelectedUser(u); setProfileUser(null); setShowEditModal(true); };
  const openDelete = (u: User) => { setSelectedUser(u); setProfileUser(null); setShowDeleteModal(true); };

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("fr-FR", { year: "numeric", month: "short", day: "numeric" }) : "—";

  return (
    <PageLayout
      title="Gestion des Utilisateurs"
      subtitle={`${users.length} utilisateur${users.length !== 1 ? "s" : ""} enregistré${users.length !== 1 ? "s" : ""}`}
      icon={<FiUser className="w-7 h-7 text-purple-600" />}
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total utilisateurs</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actifs</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {users.filter((u) => (u.status ?? "active") === "active").length}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avec commandes</p>
          <p className="text-2xl font-black text-purple-600 mt-1">
            {users.filter((u) => (orderCountByUser[u.id] ?? 0) > 0).length}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total commandes</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{orders.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-1 gap-3 max-w-xl">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, email, téléphone..."
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              <FiPlus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 p-4 mb-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          <FiAlertTriangle className="w-5 h-5 flex-shrink-0" />
          {error}
          <button onClick={loadData} className="ml-auto px-3 py-1 bg-rose-600 text-white rounded-lg text-xs hover:bg-rose-700">Réessayer</button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white border border-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* User list */}
      {!loading && filteredUsers.length === 0 && (
        <div className="py-16 text-center bg-white border border-gray-100 rounded-xl shadow-sm">
          <FiUser className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">
            {searchQuery ? "Aucun utilisateur ne correspond à la recherche" : "Aucun utilisateur enregistré"}
          </p>
        </div>
      )}

      {!loading && filteredUsers.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 grid grid-cols-12 text-xs font-bold uppercase tracking-wider text-gray-500">
            <div className="col-span-4">Utilisateur</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Téléphone</div>
            <div className="col-span-1 text-center">Commandes</div>
            <div className="col-span-1 text-center">Statut</div>
            <div className="col-span-1 text-center">Actions</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-50">
            {filteredUsers.map((user) => {
              const gradient = getAvatarGradient(user.id);
              const initials = `${user.firstname[0] ?? ""}${user.lastname[0] ?? ""}`.toUpperCase();
              const orderCount = orderCountByUser[user.id] ?? 0;
              const isActive = (user.status ?? "active") === "active";

              return (
                <div
                  key={user.id}
                  className="px-6 py-4 grid grid-cols-12 items-center hover:bg-purple-50/30 transition-colors cursor-pointer group"
                  onClick={() => setProfileUser(user)}
                >
                  {/* Avatar + name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-sm`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-xs text-gray-400">Inscrit {formatDate(user.created_at)}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <FiMail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-span-2 text-sm text-gray-500">
                    {user.phone ? (
                      <div className="flex items-center gap-1.5">
                        <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                        {user.phone}
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </div>

                  {/* Order count */}
                  <div className="col-span-1 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${orderCount > 0 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-400"}`}>
                      {orderCount}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {isActive ? <FiCheck className="w-3 h-3" /> : <FiX className="w-3 h-3" />}
                      {isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openEdit(user)}
                      className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDelete(user)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {filteredUsers.length === users.length
                ? `${users.length} utilisateur${users.length !== 1 ? "s" : ""} au total`
                : `${filteredUsers.length} sur ${users.length} utilisateurs`}
            </p>
          </div>
        </div>
      )}

      {/* Profile side panel */}
      {profileUser && (
        <UserProfilePanel
          user={profileUser}
          orders={orders}
          onClose={() => setProfileUser(null)}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={() => { loadData(); setShowAddModal(false); }}
      />
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => { setShowEditModal(false); setSelectedUser(null); }}
        onUserUpdated={() => { loadData(); setShowEditModal(false); setSelectedUser(null); }}
        user={selectedUser}
      />
      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setSelectedUser(null); }}
        onUserDeleted={() => { loadData(); setShowDeleteModal(false); setSelectedUser(null); }}
        userId={selectedUser?.id || null}
        userName={selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : ""}
      />
    </PageLayout>
  );
}