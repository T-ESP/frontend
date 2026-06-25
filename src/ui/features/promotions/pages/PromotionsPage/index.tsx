import { useState, useEffect } from 'react';
import {
  FiPlus, FiRefreshCw, FiEdit2, FiTrash2, FiX, FiCheck,
  FiTag, FiToggleLeft, FiToggleRight, FiAlertTriangle,
} from 'react-icons/fi';
import { discountService } from '@/infrastructure/api/services/discountService';
import { productService } from '@/infrastructure/api/services/productService';
import type { Discount, CreateDiscountDto, UpdateDiscountDto, DiscountTrigger, DiscountAction, DiscountScope, DiscountOrderSummary } from '@/domain/models/Discount';
import type { Product } from '@/domain/models/Product';
import PageLayout from '@/ui/components/layouts/PageLayout';

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

function triggerLabel(d: Discount, products: Product[]): string {
  switch (d.trigger_type) {
    case 'product': {
      const p = products.find((x) => x.id === d.trigger_product_id);
      return p ? `Produit : ${p.name}` : `Produit #${d.trigger_product_id}`;
    }
    case 'total_amount':
      return `Montant ≥ ${fmt.format(d.trigger_min_amount ?? 0)}`;
    case 'quantity':
      if (d.trigger_product_id) {
        const p = products.find((x) => x.id === d.trigger_product_id);
        return `Qté ${p ? p.name : `#${d.trigger_product_id}`} ≥ ${d.trigger_min_qty}`;
      }
      return `Qté totale ≥ ${d.trigger_min_qty}`;
  }
}

function actionLabel(d: Discount): string {
  if (d.action_type === 'fixed_eur') return `-${fmt.format(d.action_value)}`;
  return `-${d.action_value}%`;
}

function scopeLabel(d: Discount, products: Product[]): string {
  if (d.scope === 'global') return 'Sur le total';
  if (d.scope_product_id) {
    const p = products.find((x) => x.id === d.scope_product_id);
    return `Sur ${p ? p.name : `#${d.scope_product_id}`}`;
  }
  return 'Par produit';
}

function validityLabel(d: Discount): string {
  const from = d.valid_from ? new Date(d.valid_from).toLocaleDateString('fr-FR') : null;
  const until = d.valid_until ? new Date(d.valid_until).toLocaleDateString('fr-FR') : null;
  if (from && until) return `${from} → ${until}`;
  if (from) return `Depuis ${from}`;
  if (until) return `Jusqu'au ${until}`;
  return 'Illimitée';
}

function isExpired(d: Discount): boolean {
  return !!d.valid_until && new Date(d.valid_until) < new Date();
}

// ── Create / Edit modal ───────────────────────────────────────────────────────

interface DiscountModalProps {
  initial?: Discount;
  products: Product[];
  onClose: () => void;
  onSaved: () => void;
}

const BLANK: CreateDiscountDto = {
  name: '',
  trigger_type: 'total_amount',
  trigger_product_id: null,
  trigger_min_amount: null,
  trigger_min_qty: null,
  action_type: 'percentage',
  action_value: 10,
  scope: 'global',
  scope_product_id: null,
  cumulative: false,
  valid_from: null,
  valid_until: null,
  is_active: true,
};

function DiscountModal({ initial, products, onClose, onSaved }: DiscountModalProps) {
  const isEdit = !!initial;
  const [form, setForm] = useState<CreateDiscountDto>(
    initial
      ? {
          name: initial.name,
          trigger_type: initial.trigger_type,
          trigger_product_id: initial.trigger_product_id,
          trigger_min_amount: initial.trigger_min_amount,
          trigger_min_qty: initial.trigger_min_qty,
          action_type: initial.action_type,
          action_value: initial.action_value,
          scope: initial.scope,
          scope_product_id: initial.scope_product_id,
          cumulative: initial.cumulative,
          valid_from: initial.valid_from ? initial.valid_from.slice(0, 10) : null,
          valid_until: initial.valid_until ? initial.valid_until.slice(0, 10) : null,
          is_active: initial.is_active,
        }
      : BLANK,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof CreateDiscountDto>(k: K, v: CreateDiscountDto[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Le nom est requis.'); return; }
    if (!form.action_value || form.action_value <= 0) { setError('La valeur doit être > 0.'); return; }

    setSaving(true);
    setError(null);
    const toIso = (d: string | null | undefined) =>
      d ? `${d}T00:00:00Z` : null;

    try {
      if (isEdit && initial) {
        const update: UpdateDiscountDto = {
          name: form.name,
          action_value: form.action_value,
          cumulative: form.cumulative,
          valid_from: toIso(form.valid_from),
          valid_until: toIso(form.valid_until),
          is_active: form.is_active,
        };
        await discountService.update(initial.id, update);
      } else {
        await discountService.create({
          ...form,
          valid_from: toIso(form.valid_from),
          valid_until: toIso(form.valid_until),
        });
      }
      onSaved();
    } catch {
      setError('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-3 py-2 text-sm bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all';
  const labelCls = 'block text-[13px] font-semibold text-muted-foreground mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <p className="text-[15px] font-semibold text-foreground">
            {isEdit ? 'Modifier la remise' : 'Nouvelle remise'}
          </p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground/70 hover:text-muted-foreground transition-colors">
            <FiX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl">
              <FiAlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className={labelCls}>Nom *</label>
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex: Promo été 2025" />
          </div>

          {/* Trigger section */}
          <fieldset className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border">
            <legend className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1">Déclencheur</legend>

            <div>
              <label className={labelCls}>Type</label>
              <select
                className={inputCls}
                value={form.trigger_type}
                onChange={(e) => set('trigger_type', e.target.value as DiscountTrigger)}
                disabled={isEdit}
              >
                <option value="total_amount">Montant total ≥ seuil</option>
                <option value="quantity">Quantité ≥ seuil</option>
                <option value="product">Produit spécifique présent</option>
              </select>
              {isEdit && <p className="text-[11px] text-muted-foreground/70 mt-1">Le type de déclencheur ne peut pas être modifié.</p>}
            </div>

            {(form.trigger_type === 'product' || form.trigger_type === 'quantity') && (
              <div>
                <label className={labelCls}>Produit concerné (optionnel pour quantité totale)</label>
                <select
                  className={inputCls}
                  value={form.trigger_product_id ?? ''}
                  onChange={(e) => set('trigger_product_id', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                >
                  <option value="">— Tous les produits —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            {form.trigger_type === 'total_amount' && (
              <div>
                <label className={labelCls}>Montant minimum (€) *</label>
                <input
                  type="number" min={0} step={0.01} className={inputCls}
                  value={form.trigger_min_amount ?? ''}
                  onChange={(e) => set('trigger_min_amount', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                  placeholder="Ex: 100"
                />
              </div>
            )}

            {form.trigger_type === 'quantity' && (
              <div>
                <label className={labelCls}>Quantité minimum *</label>
                <input
                  type="number" min={1} step={1} className={inputCls}
                  value={form.trigger_min_qty ?? ''}
                  onChange={(e) => set('trigger_min_qty', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                  placeholder="Ex: 10"
                />
              </div>
            )}
          </fieldset>

          {/* Action section */}
          <fieldset className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border">
            <legend className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1">Action</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Type de remise</label>
                <select
                  className={inputCls}
                  value={form.action_type}
                  onChange={(e) => set('action_type', e.target.value as DiscountAction)}
                  disabled={isEdit}
                >
                  <option value="percentage">Pourcentage (%)</option>
                  <option value="fixed_eur">Montant fixe (€)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Valeur *</label>
                <div className="relative">
                  <input
                    type="number" min={0.01} step={0.01} className={`${inputCls} pr-8`}
                    value={form.action_value}
                    onChange={(e) => set('action_value', Number(e.target.value))}
                    placeholder="10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground/70 pointer-events-none">
                    {form.action_type === 'percentage' ? '%' : '€'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Portée</label>
              <select
                className={inputCls}
                value={form.scope}
                onChange={(e) => set('scope', e.target.value as DiscountScope)}
                disabled={isEdit}
              >
                <option value="global">Sur le total de la commande</option>
                <option value="per_product">Sur un produit spécifique</option>
              </select>
            </div>

            {form.scope === 'per_product' && (
              <div>
                <label className={labelCls}>Produit ciblé</label>
                <select
                  className={inputCls}
                  value={form.scope_product_id ?? ''}
                  onChange={(e) => set('scope_product_id', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                >
                  <option value="">— Produit du déclencheur —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </fieldset>

          {/* Options */}
          <fieldset className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border">
            <legend className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1">Options</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Valide du</label>
                <input type="date" className={inputCls} value={form.valid_from ?? ''} onChange={(e) => set('valid_from', e.target.value || null)} />
              </div>
              <div>
                <label className={labelCls}>Valide jusqu'au</label>
                <input type="date" className={inputCls} value={form.valid_until ?? ''} onChange={(e) => set('valid_until', e.target.value || null)} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-foreground">Cumulable</p>
                <p className="text-[12px] text-muted-foreground">Se combine avec d'autres remises cumulables</p>
              </div>
              <button type="button" onClick={() => set('cumulative', !form.cumulative)} className="text-primary">
                {form.cumulative ? <FiToggleRight className="w-7 h-7" /> : <FiToggleLeft className="w-7 h-7 text-muted-foreground/50" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-foreground">Active</p>
                <p className="text-[12px] text-muted-foreground">La remise est disponible pour les nouvelles commandes</p>
              </div>
              <button type="button" onClick={() => set('is_active', !form.is_active)} className="text-primary">
                {form.is_active ? <FiToggleRight className="w-7 h-7" /> : <FiToggleLeft className="w-7 h-7 text-muted-foreground/50" />}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            {saving ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────────

function DeleteModal({ discount, onClose, onDeleted }: { discount: Discount; onClose: () => void; onDeleted: () => void }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await discountService.delete(discount.id);
      onDeleted();
    } catch {
      setError('Impossible de supprimer cette remise.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-sm p-6 space-y-4">
        <p className="text-[15px] font-semibold text-foreground">Supprimer la remise</p>
        <p className="text-[13px] text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer <strong>« {discount.name} »</strong> ? Les commandes existantes ne sont pas affectées.
        </p>
        {error && <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors">
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors disabled:opacity-40"
          >
            {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ discount }: { discount: Discount }) {
  if (!discount.is_active)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">Inactive</span>;
  if (isExpired(discount))
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400">Expirée</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">Active</span>;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PromotionsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const [creating, setCreating]             = useState(false);
  const [editing, setEditing]               = useState<Discount | null>(null);
  const [deleting, setDeleting]             = useState<Discount | null>(null);
  const [viewingOrders, setViewingOrders]   = useState<Discount | null>(null);
  const [discountOrders, setDiscountOrders] = useState<DiscountOrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders]   = useState(false);

  const openOrdersPanel = async (d: Discount) => {
    setViewingOrders(d);
    setLoadingOrders(true);
    try {
      const orders = await discountService.getOrders(d.id);
      setDiscountOrders(orders);
    } catch {
      setDiscountOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const load = () => {
    setLoading(true);
    setError(null);
    setBackendUnavailable(false);

    productService.getAll({ limit: 500 })
      .then(setProducts)
      .catch(() => { /* non bloquant */ });

    discountService.getAll()
      .then(setDiscounts)
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : '';
        if (
          msg.includes('Failed to fetch') ||
          msg.includes('NetworkError') ||
          msg.includes('timeout') ||
          msg.includes('404') ||
          msg.includes('500') ||
          msg.includes('does not exist') ||
          msg.includes('relation')
        ) {
          setBackendUnavailable(true);
        } else {
          setError(msg || 'Impossible de charger les remises.');
        }
        setDiscounts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const onSaved = () => { setCreating(false); setEditing(null); load(); };
  const onDeleted = () => { setDeleting(null); load(); };

  const handleToggle = async (d: Discount) => {
    try {
      await discountService.update(d.id, { is_active: !d.is_active });
      load();
    } catch {
      // silent — the toggle will snap back
    }
  };

  const active   = discounts.filter((d) => d.is_active && !isExpired(d)).length;
  const inactive = discounts.filter((d) => !d.is_active).length;
  const expired  = discounts.filter((d) => d.is_active && isExpired(d)).length;

  return (
    <>
      <PageLayout
        title="Promotions & Remises"
        subtitle="Gérez les règles de remise appliquées aux commandes"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Nouvelle remise
            </button>
          </div>
        }
      >
        {backendUnavailable && (
          <div className="px-4 py-3 text-sm text-muted-foreground bg-muted border border-border rounded-xl">
            Backend non disponible — la migration V005 doit être appliquée sur la base tenant et le serveur redémarré.
            Vous pouvez créer des remises dès que le backend est à jour.
          </div>
        )}

        {error && (
          <div className="px-4 py-3 text-sm text-red-700 dark:text-red-300 bg-red-500/10 border border-red-500/30 rounded-xl">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">Remises actives</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{loading ? '—' : active}</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">Expirées</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{loading ? '—' : expired}</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">Inactives</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{loading ? '—' : inactive}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-[15px] font-semibold text-foreground">Toutes les remises</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {loading ? 'Chargement…' : `${discounts.length} remise${discounts.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground/70 text-sm">Chargement…</div>
          ) : discounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/70 gap-3">
              <FiTag className="w-8 h-8" />
              <p className="text-sm">Aucune remise configurée. Créez la première !</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Nom</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Déclencheur</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Portée</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Validité</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Utilisations</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Cumul</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Statut</th>
                    <th className="px-4 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{d.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{triggerLabel(d, products)}</td>
                      <td className="px-4 py-3 font-semibold text-primary">{actionLabel(d)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{scopeLabel(d, products)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-[12px]">{validityLabel(d)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openOrdersPanel(d)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                            d.usage_count > 0
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : 'bg-muted text-muted-foreground/50 cursor-default'
                          }`}
                          title={d.usage_count > 0 ? 'Voir les commandes' : 'Jamais utilisée'}
                        >
                          {d.usage_count}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {d.cumulative
                          ? <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Cumulable" />
                          : <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/30" title="Non cumulable" />}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleToggle(d)} title="Basculer l'état">
                          <StatusBadge discount={d} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditing(d)}
                            className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Modifier"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleting(d)}
                            className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </PageLayout>

      {(creating || editing) && (
        <DiscountModal
          initial={editing ?? undefined}
          products={products}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={onSaved}
        />
      )}

      {deleting && (
        <DeleteModal
          discount={deleting}
          onClose={() => setDeleting(null)}
          onDeleted={onDeleted}
        />
      )}

      {viewingOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewingOrders(null)} />
          <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <p className="text-[15px] font-semibold text-foreground">Commandes — {viewingOrders.name}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{viewingOrders.usage_count} utilisation{viewingOrders.usage_count > 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setViewingOrders(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground/70 hover:text-muted-foreground transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingOrders ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Chargement…</div>
              ) : discountOrders.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">Aucune commande trouvée.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase">Commande</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase">Date</th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase">Économie</th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {discountOrders.map((o) => (
                      <tr key={o.order_id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">#{o.order_id}</td>
                        <td className="px-4 py-3 text-muted-foreground text-[12px]">
                          {new Date(o.order_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          -{fmt.format(o.saving_amount)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-foreground tabular-nums">
                          {fmt.format(o.order_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
