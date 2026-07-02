import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
      .catch(() => setError(t("loyalty.modal.load_error")))
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
      setAdjustError(t("loyalty.modal.adjust_error"));
    } finally {
      setAdjusting(false);
    }
  };

  const parsedPoints = parseInt(points, 10);
  const isValid = !isNaN(parsedPoints) && parsedPoints !== 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <FiUser className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-foreground">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-[12px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Points counter */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border">
            <div>
              <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{t("loyalty.modal.current_points")}</p>
              <p className="text-3xl font-bold text-foreground tabular-nums mt-1">
                {loading ? "—" : (stats?.total_points ?? 0)}
                <span className="text-base font-semibold text-muted-foreground/70 ml-1">{t("loyalty.cards.pts")}</span>
              </p>
            </div>
            <FiAward className="w-8 h-8 text-muted-foreground/60" />
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl">
              {error}
            </div>
          )}

          {/* Adjust form */}
          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-muted-foreground">{t("loyalty.modal.adjust")}</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="number"
                  placeholder={t("loyalty.modal.points_placeholder")}
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder={t("loyalty.modal.reason_placeholder")}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all"
            />
            {adjustError && (
              <p className="text-[12px] text-red-600 dark:text-red-400">{adjustError}</p>
            )}
            <button
              onClick={handleAdjust}
              disabled={!isValid || adjusting || loading}
              className="w-full py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {adjusting
                ? t("loyalty.modal.adjusting")
                : adjustOk
                  ? t("loyalty.modal.adjusted")
                  : isValid && parsedPoints > 0
                    ? t("loyalty.modal.add_pts", { n: parsedPoints })
                    : isValid && parsedPoints < 0
                      ? t("loyalty.modal.remove_pts", { n: Math.abs(parsedPoints) })
                      : t("loyalty.modal.apply")}
            </button>
          </div>

          {/* Transactions */}
          {!loading && stats && stats.transactions.length > 0 && (
            <div className="space-y-2">
              <p className="text-[13px] font-semibold text-muted-foreground">
                {t("loyalty.modal.history", { n: stats.transactions.length })}
              </p>
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {stats.transactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted transition-colors">
                    <div>
                      <p className="text-[13px] text-muted-foreground">
                        {tx.reason ?? (tx.order_id ? t("loyalty.modal.order_ref", { id: tx.order_id }) : t("loyalty.modal.manual_adjust"))}
                      </p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                        {new Date(tx.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span className={`text-[13px] font-semibold tabular-nums ${tx.points >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                      {tx.points >= 0 ? "+" : ""}{tx.points} {t("loyalty.cards.pts")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && stats && stats.transactions.length === 0 && (
            <p className="text-[13px] text-muted-foreground/70 text-center py-4">{t("loyalty.modal.no_transactions")}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LoyaltyPage() {
  const { t } = useTranslation();
  // Config state
  const [config, setConfig] = useState<LoyaltyConfig>({
    euros_per_point: 10,
    points_required: 100,
    discount_percent: 5,
  });
  // Editable form values are kept as strings so the user can clear a field or
  // type intermediate values ("", "8.") without the controlled <input> fighting back.
  const [draft, setDraft] = useState({
    euros_per_point: "10",
    points_required: "100",
    discount_percent: "5",
  });
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
      .then((c) => {
        setConfig(c);
        setDraft({
          euros_per_point: String(c.euros_per_point),
          points_required: String(c.points_required),
          discount_percent: String(c.discount_percent),
        });
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("Failed to fetch") || msg.includes("timeout") || msg.includes("NetworkError")) {
          setBackendUnavailable(true);
        } else {
          setError(msg || t("loyalty.load_error"));
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
        euros_per_point: eurosPerPoint,
        points_required: pointsRequired,
        discount_percent: discountPercent,
      });
      setConfig(updated);
      setDraft({
        euros_per_point: String(updated.euros_per_point),
        points_required: String(updated.points_required),
        discount_percent: String(updated.discount_percent),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError(t("loyalty.save_error"));
    } finally {
      setSaving(false);
    }
  };

  const setField = (field: keyof typeof draft, raw: string) => {
    // Keep only an optional numeric string; "" stays allowed so the field can be cleared.
    if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
      setDraft((p) => ({ ...p, [field]: raw }));
    }
  };

  const eurosPerPoint = Number(draft.euros_per_point) || 0;
  const pointsRequired = Number(draft.points_required) || 0;
  const discountPercent = Number(draft.discount_percent) || 0;

  const ptsPerEuro = eurosPerPoint > 0
    ? (1 / eurosPerPoint).toFixed(3)
    : "0";

  const exampleSpend = 85;
  const examplePts = eurosPerPoint > 0
    ? Math.floor(exampleSpend / eurosPerPoint)
    : 0;
  const ordersToRedeem = eurosPerPoint > 0 && pointsRequired > 0
    ? Math.ceil((pointsRequired * eurosPerPoint) / exampleSpend)
    : 0;

  const isFormValid = eurosPerPoint > 0 && pointsRequired > 0 && discountPercent > 0;
  const isDirty =
    eurosPerPoint !== config.euros_per_point ||
    pointsRequired !== config.points_required ||
    discountPercent !== config.discount_percent;

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
        title={t("loyalty.title")}
        subtitle={t("loyalty.subtitle")}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {t("common.refresh")}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading || !isDirty || !isFormValid}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiSave className="w-4 h-4" />
              {saving ? t("loyalty.saving") : saved ? t("loyalty.saved") : t("loyalty.save")}
            </button>
          </div>
        }
      >
        {backendUnavailable && (
          <div className="px-4 py-3 text-sm text-muted-foreground bg-muted border border-border rounded-xl">
            {t("loyalty.backend_unavailable")}
          </div>
        )}
        {error && (
          <div className="px-4 py-3 text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl">
            {error}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">{t("loyalty.cards.euros_per_point")}</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">
              {loading ? "—" : config.euros_per_point}
              <span className="text-base font-semibold text-muted-foreground/70 ml-1">{t("loyalty.cards.per_pt")}</span>
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {loading ? "" : t("loyalty.cards.euros_per_point_hint", { value: (1 / config.euros_per_point).toFixed(3) })}
            </p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">{t("loyalty.cards.points_required")}</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">
              {loading ? "—" : config.points_required}
              <span className="text-base font-semibold text-muted-foreground/70 ml-1">{t("loyalty.cards.pts")}</span>
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">
              {loading ? "" : t("loyalty.cards.points_required_hint", { value: (config.points_required * config.euros_per_point).toLocaleString("fr-FR") })}
            </p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">{t("loyalty.cards.discount")}</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">
              {loading ? "—" : config.discount_percent}
              <span className="text-base font-semibold text-muted-foreground/70 ml-1">%</span>
            </p>
            <p className="mt-2 text-[13px] text-muted-foreground">{t("loyalty.cards.discount_hint")}</p>
          </div>
        </div>

        {/* Config form */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-[15px] font-semibold text-foreground">{t("loyalty.form.title")}</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">{t("loyalty.form.subtitle")}</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground/70 text-sm">{t("loyalty.loading")}</div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-muted-foreground">{t("loyalty.form.euros_per_point")}</label>
                  <div className="relative">
                    <input
                      type="number" inputMode="decimal" min="0" step="1" value={draft.euros_per_point}
                      onChange={(e) => setField("euros_per_point", e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground/70 font-medium pointer-events-none">€</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground/70">{t("loyalty.form.euros_per_point_hint", { euros: eurosPerPoint, rate: ptsPerEuro })}</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-muted-foreground">{t("loyalty.form.points_required")}</label>
                  <div className="relative">
                    <input
                      type="number" inputMode="numeric" min="0" step="10" value={draft.points_required}
                      onChange={(e) => setField("points_required", e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground/70 font-medium pointer-events-none">pts</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground/70">{t("loyalty.form.points_required_hint")}</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-muted-foreground">{t("loyalty.form.discount_percent")}</label>
                  <div className="relative">
                    <input
                      type="number" inputMode="numeric" min="0" max="100" step="1" value={draft.discount_percent}
                      onChange={(e) => setField("discount_percent", e.target.value)}
                      className="w-full px-4 py-2.5 pr-10 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground/70 font-medium pointer-events-none">%</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground/70">{t("loyalty.form.discount_percent_hint")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-[15px] font-semibold text-foreground">{t("loyalty.how.title")}</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {t("loyalty.how.subtitle", { amount: exampleSpend })}
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-px md:grid-cols-3 bg-muted rounded-xl overflow-hidden border border-border">
              <div className="bg-card px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <p className="text-[13px] font-semibold text-foreground">{t("loyalty.how.step1_title")}</p>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {t("loyalty.how.step1_text")}<br />
                  <code className="text-foreground font-mono text-[12px] bg-muted px-1.5 py-0.5 rounded border border-border">
                    ⌊{exampleSpend} ÷ {eurosPerPoint}⌋ = <strong>{examplePts} pts</strong>
                  </code>
                </p>
              </div>
              <div className="bg-card px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <p className="text-[13px] font-semibold text-foreground">{t("loyalty.how.step2_title")}</p>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {t("loyalty.how.step2_text", { points: pointsRequired })}
                  {examplePts > 0 ? t("loyalty.how.step2_orders", { count: ordersToRedeem, amount: exampleSpend }) : ""}
                </p>
              </div>
              <div className="bg-card px-6 py-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                  <p className="text-[13px] font-semibold text-foreground">{t("loyalty.how.step3_title")}</p>
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  {t("loyalty.how.step3_text", { percent: discountPercent })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Users section ───────────────────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">{t("loyalty.users.title")}</h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {usersLoading ? t("loyalty.loading") : t("loyalty.users.subtitle", { count: users.length })}
              </p>
            </div>
            <button
              onClick={loadUsers}
              disabled={usersLoading}
              className="p-2 rounded-lg text-muted-foreground/70 hover:text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              <FiRefreshCw className={`w-4 h-4 ${usersLoading ? "animate-spin" : ""}`} />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pt-4 pb-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
              <input
                type="text"
                placeholder={t("loyalty.users.search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          {usersLoading ? (
            <div className="flex items-center justify-center py-14 text-muted-foreground/70 text-sm">
              {t("loyalty.users.loading")}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-muted-foreground/70 gap-2">
              <FiUser className="w-7 h-7" />
              <p className="text-sm">{search ? t("loyalty.users.no_results") : t("loyalty.users.no_users")}</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted transition-colors text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 group-hover:bg-muted transition-colors">
                      <span className="text-[12px] font-semibold text-muted-foreground">
                        {user.firstname[0]}{user.lastname[0]}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-medium text-foreground truncate">
                        {user.firstname} {user.lastname}
                      </p>
                      <p className="text-[12px] text-muted-foreground/70 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-[12px] text-muted-foreground/70 hidden sm:block">{t("loyalty.users.view_points")}</span>
                    <FiChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-muted-foreground transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {!usersLoading && filteredUsers.length > 0 && search && (
            <div className="px-6 py-3 border-t border-border text-[12px] text-muted-foreground/70">
              {t("loyalty.users.results", { count: filteredUsers.length, query: search })}
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
