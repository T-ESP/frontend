import { useState, useEffect, useMemo } from "react";
import {
  FiSave, FiRefreshCw, FiSearch, FiX,
  FiUser, FiChevronRight, FiAward,
} from "react-icons/fi";
import { loyaltyService } from "@/infrastructure/api/services/loyaltyService";
import { userService } from "@/infrastructure/api/services/userService";
import type { LoyaltyConfig, LoyaltyUserStats } from "@/domain/models/Loyalty";
import type { User } from "@/domain/models/User";
import PageLayout from "@/ui/components/layouts/PageLayout";

// ─── User loyalty modal ───────────────────────────────────────────────────────

interface UserLoyaltyModalProps {
  user: User;
  onClose: () => void;
}

function UserLoyaltyModal({ user, onClose }: UserLoyaltyModalProps) {
  const [stats, setStats] = useState<LoyaltyUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);
  const [adjustOk, setAdjustOk] = useState(false);

  const loadStats = () => {
    setLoading(true);
    setError(null);
    loyaltyService
      .getUserStats(user.id)
      .then(setStats)
      .catch(() => setError("Impossible de charger les points de cet utilisateur."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadStats(); }, [user.id]);

  const handleAdjust = async () => {
    const n = parseInt(points, 10);
    if (isNaN(n) || n === 0) return;
    setAdjusting(true);
    setAdjustError(null);
    setAdjustOk(false);
    try {
      const updated = await loyaltyService.adjustPoints(user.id, { points: n, reason: reason || undefined });
      setStats(updated);
      setPoints("");
      setReason("");
      setAdjustOk(true);
      setTimeout(() => setAdjustOk(false), 3000);
    } catch {
      setAdjustError("Échec de l'ajustement. Veuillez réessayer.");
    } finally {
      setAdjusting(false);
    }
  };

  const parsedPoints = parseInt(points, 10);
  const isValid = !isNaN(parsedPoints) && parsedPoints !== 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <FiUser className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-gray-900">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-[12px] text-gray-500">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Points counter */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-[12px] font-medium text-gray-500 uppercase tracking-wide">Points actuels</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums mt-1">
                {loading ? "—" : (stats?.total_points ?? 0)}
                <span className="text-base font-semibold text-gray-400 ml-1">pts</span>
              </p>
            </div>
            <FiAward className="w-8 h-8 text-gray-300" />
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Adjust form */}
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-gray-700">Ajuster les points</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder="ex: +50 ou -20"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Raison (optionnel)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
            />
            {adjustError && (
              <p className="text-[12px] text-red-600">{adjustError}</p>
            )}
            <button
              onClick={handleAdjust}
              disabled={!isValid || adjusting || loading}
              className="w-full py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {adjusting
                ? "Ajustement…"
                : adjustOk
                  ? "Ajusté ✓"
                  : isValid && parsedPoints > 0
                    ? `Ajouter ${parsedPoints} pts`
                    : isValid && parsedPoints < 0
                      ? `Retirer ${Math.abs(parsedPoints)} pts`
                      : "Appliquer l'ajustement"}
            </button>
          </div>

          {/* Transactions */}
          {!loading && stats && stats.transactions.length > 0 && (
            <div className="space-y-2">
              <p className="text-[13px] font-semibold text-gray-700">
                Historique ({stats.transactions.length})
              </p>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
                {stats.transactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-[13px] text-gray-700">
                        {tx.reason ?? (tx.order_id ? `Commande #${tx.order_id}` : "Ajustement manuel")}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(tx.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className={`text-[13px] font-semibold tabular-nums ${tx.points >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {tx.points >= 0 ? "+" : ""}{tx.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && stats && stats.transactions.length === 0 && (
            <p className="text-[13px] text-gray-400 text-center py-4">Aucune transaction pour cet utilisateur.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LoyaltyPage() {
  // Config state
  const [config, setConfig] = useState<LoyaltyConfig>({
    euros_per_point: 10,
    points_required: 100,
    discount_percent: 5,
  });
  const [draft, setDraft] = useState<LoyaltyConfig>(config);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const load = () => {
    setLoading(true);
    setBackendUnavailable(false);
    setError(null);
    loyaltyService
      .getConfig()
      .then((c) => { setConfig(c); setDraft(c); })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("Failed to fetch") || msg.includes("timeout") || msg.includes("NetworkError")) {
          setBackendUnavailable(true);
        } else {
          setError(msg || "Erreur lors du chargement de la configuration.");
        }
      })
      .finally(() => setLoading(false));
  };

  const loadUsers = () => {
    setUsersLoading(true);
    userService
      .getAll()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  };

  useEffect(() => { load(); loadUsers(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await loyaltyService.updateConfig({
        euros_per_point: draft.euros_per_point,
        points_required: draft.points_required,
        discount_percent: draft.discount_percent,
      });
      setConfig(updated);
      setDraft(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (field: keyof Omit<LoyaltyConfig, "id">, raw: string) => {
    const n = parseFloat(raw);
    if (!isNaN(n) && n >= 0) setDraft((p) => ({ ...p, [field]: n }));
  };

  const ptsPerEuro = draft.euros_per_point > 0
    ? (1 / draft.euros_per_point).toFixed(3)
    : "0";

  const exampleSpend = 85;
  const examplePts = draft.euros_per_point > 0
    ? Math.floor(exampleSpend / draft.euros_per_point)
    : 0;
  const ordersToRedeem = draft.euros_per_point > 0 && draft.points_required > 0
    ? Math.ceil((draft.points_required * draft.euros_per_point) / exampleSpend)
    : 0;

  const isDirty =
    draft.euros_per_point !== config.euros_per_point ||
    draft.points_required !== config.points_required ||
    draft.discount_percent !== config.discount_percent;

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter((u) =>
      u.firstname.toLowerCase().includes(q) ||
      u.lastname.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <>
      <PageLayout
        title="Programme de fidélité"
        subtitle="Configurez les règles d'attribution et gérez les points des utilisateurs"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading || !isDirty}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
            </button>
          </div>
        }
      >
        {backendUnavailable && (
          <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl">
            Backend non disponible — valeurs par défaut affichées. La configuration sera créée lors du premier enregistrement.
          </div>
        )}
        {error && (
          <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl">
            <p className="text-[13px] font-medium text-gray-500">Euros par point</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 tabular-nums">
              {loading ? "—" : config.euros_per_point}
              <span className="text-base font-semibold text-gray-400 ml-1">€ / pt</span>
            </p>
            <p className="mt-2 text-[13px] text-gray-500">
              {loading ? "" : `Soit ${(1 / config.euros_per_point).toFixed(3)} pt par euro dépensé`}
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-2xl">
            <p className="text-[13px] font-medium text-gray-500">Points pour remise</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 tabular-nums">
              {loading ? "—" : config.points_required}
              <span className="text-base font-semibold text-gray-400 ml-1">pts</span>
            </p>
            <p className="mt-2 text-[13px] text-gray-500">
              {loading ? "" : `Soit ${(config.points_required * config.euros_per_point).toLocaleString("fr-FR")} € dépensés`}
            </p>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-2xl">
            <p className="text-[13px] font-medium text-gray-500">Remise accordée</p>
            <p className="mt-3 text-3xl font-bold text-gray-900 tabular-nums">
              {loading ? "—" : config.discount_percent}
              <span className="text-base font-semibold text-gray-400 ml-1">%</span>
            </p>
            <p className="mt-2 text-[13px] text-gray-500">À la prochaine commande du client</p>
          </div>
        </div>

        {/* Config form */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900">Modifier la configuration</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">Les modifications s'appliquent aux nouvelles commandes uniquement</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-400 text-sm">Chargement…</div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-gray-700">Euros par point</label>
                  <div className="relative">
                    <input
                      type="number" min="0.1" step="1" value={draft.euros_per_point}
                      onChange={(e) => setField("euros_per_point", e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-medium pointer-events-none">€</span>
                  </div>
                  <p className="text-[12px] text-gray-400">1 point = {draft.euros_per_point} € dépensés ({ptsPerEuro} pt/€)</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-gray-700">Points requis pour remise</label>
                  <div className="relative">
                    <input
                      type="number" min="1" step="10" value={draft.points_required}
                      onChange={(e) => setField("points_required", e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-medium pointer-events-none">pts</span>
                  </div>
                  <p className="text-[12px] text-gray-400">Seuil de déclenchement de la remise</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-gray-700">Pourcentage de remise</label>
                  <div className="relative">
                    <input
                      type="number" min="1" max="100" step="1" value={draft.discount_percent}
                      onChange={(e) => setField("discount_percent", e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-medium pointer-events-none">%</span>
                  </div>
                  <p className="text-[12px] text-gray-400">Remise appliquée à la prochaine commande</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[15px] font-semibold text-gray-900">Comment ça fonctionne</h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Simulation avec une commande type de <strong>{exampleSpend} €</strong>
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-px md:grid-cols-3 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
              <div className="bg-white px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-[13px] font-semibold text-gray-900">Achat → Points gagnés</p>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  À chaque commande, le client gagne automatiquement :<br />
                  <code className="text-gray-900 font-mono text-[12px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                    ⌊{exampleSpend} ÷ {draft.euros_per_point}⌋ = <strong>{examplePts} pts</strong>
                  </code>
                </p>
              </div>
              <div className="bg-white px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-[13px] font-semibold text-gray-900">Accumulation</p>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Le client doit atteindre <strong className="text-gray-900">{draft.points_required} pts</strong> pour déclencher une remise.
                  {examplePts > 0 ? ` Avec des commandes à ${exampleSpend} €, il y arrivera en ${ordersToRedeem} commande${ordersToRedeem > 1 ? "s" : ""}.` : ""}
                </p>
              </div>
              <div className="bg-white px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-[13px] font-semibold text-gray-900">Remise appliquée</p>
                </div>
                <p className="text-[13px] text-gray-500 leading-relaxed">
                  Dès le seuil atteint, le client reçoit <strong className="text-gray-900">{draft.discount_percent} %</strong> de remise sur sa prochaine commande. Les points sont réinitialisés.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Users section ───────────────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900">Utilisateurs</h2>
              <p className="text-[13px] text-gray-500 mt-0.5">
                {usersLoading ? "Chargement…" : `${users.length} utilisateur${users.length > 1 ? "s" : ""} — cliquez pour voir et modifier les points`}
              </p>
            </div>
            <button
              onClick={loadUsers}
              disabled={usersLoading}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-40"
            >
              <FiRefreshCw className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pt-4 pb-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          {usersLoading ? (
            <div className="flex items-center justify-center py-14 text-gray-400 text-sm">
              Chargement des utilisateurs…
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-400 gap-2">
              <FiUser className="w-7 h-7" />
              <p className="text-sm">{search ? "Aucun résultat pour cette recherche." : "Aucun utilisateur trouvé."}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                      <span className="text-[12px] font-semibold text-gray-600">
                        {user.firstname[0]}{user.lastname[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-gray-900 truncate">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-[12px] text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-[12px] text-gray-400 hidden sm:block">Voir les points</span>
                    <FiChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {!usersLoading && filteredUsers.length > 0 && search && (
            <div className="px-6 py-3 border-t border-gray-100 text-[12px] text-gray-400">
              {filteredUsers.length} résultat{filteredUsers.length > 1 ? "s" : ""} pour « {search} »
            </div>
          )}
        </div>
      </PageLayout>

      {/* Modal */}
      {selectedUser && (
        <UserLoyaltyModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
