import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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

function triggerLabel(t: TFunction, d: Discount, products: Product[]): string {
  switch (d.trigger_type) {
    case 'product': {
      const p = products.find((x) => x.id === d.trigger_product_id);
      return p
        ? t('promotions.trigger.product', { name: p.name })
        : t('promotions.trigger.product_ref', { id: d.trigger_product_id });
    }
    case 'total_amount':
      return t('promotions.trigger.amount', { amount: fmt.format(d.trigger_min_amount ?? 0) });
    case 'quantity':
      if (d.trigger_product_id) {
        const p = products.find((x) => x.id === d.trigger_product_id);
        return t('promotions.trigger.qty_product', {
          name: p ? p.name : `#${d.trigger_product_id}`,
          qty: d.trigger_min_qty,
        });
      }
      return t('promotions.trigger.qty_total', { qty: d.trigger_min_qty });
  }
}

function actionLabel(d: Discount): string {
  if (d.action_type === 'fixed_eur') return `-${fmt.format(d.action_value)}`;
  return `-${d.action_value}%`;
}

function scopeLabel(t: TFunction, d: Discount, products: Product[]): string {
  if (d.scope === 'global') return t('promotions.scope.global');
  if (d.scope_product_id) {
    const p = products.find((x) => x.id === d.scope_product_id);
    return t('promotions.scope.product', { name: p ? p.name : `#${d.scope_product_id}` });
  }
  return t('promotions.scope.per_product');
}

function validityLabel(t: TFunction, d: Discount): string {
  const from = d.valid_from ? new Date(d.valid_from).toLocaleDateString('fr-FR') : null;
  const until = d.valid_until ? new Date(d.valid_until).toLocaleDateString('fr-FR') : null;
  if (from && until) return t('promotions.validity.range', { from, until });
  if (from) return t('promotions.validity.from', { from });
  if (until) return t('promotions.validity.until', { until });
  return t('promotions.validity.unlimited');
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
  const { t } = useTranslation();
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
    if (!form.name.trim()) { setError(t('promotions.modal.err_name')); return; }
    if (!form.action_value || form.action_value <= 0) { setError(t('promotions.modal.err_value')); return; }

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
      setError(t('promotions.modal.err_save'));
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
            {isEdit ? t('promotions.modal.edit_title') : t('promotions.modal.new_title')}
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
            <label className={labelCls}>{t('promotions.modal.name_label')}</label>
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder={t('promotions.modal.name_placeholder')} />
          </div>

          {/* Trigger section */}
          <fieldset className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border">
            <legend className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1">{t('promotions.modal.trigger_legend')}</legend>

            <div>
              <label className={labelCls}>{t('promotions.modal.type')}</label>
              <select
                className={inputCls}
                value={form.trigger_type}
                onChange={(e) => set('trigger_type', e.target.value as DiscountTrigger)}
                disabled={isEdit}
              >
                <option value="total_amount">{t('promotions.modal.trigger_amount')}</option>
                <option value="quantity">{t('promotions.modal.trigger_qty')}</option>
                <option value="product">{t('promotions.modal.trigger_product')}</option>
              </select>
              {isEdit && <p className="text-[11px] text-muted-foreground/70 mt-1">{t('promotions.modal.trigger_locked')}</p>}
            </div>

            {(form.trigger_type === 'product' || form.trigger_type === 'quantity') && (
              <div>
                <label className={labelCls}>{t('promotions.modal.product_concerned')}</label>
                <select
                  className={inputCls}
                  value={form.trigger_product_id ?? ''}
                  onChange={(e) => set('trigger_product_id', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                >
                  <option value="">{t('promotions.modal.all_products')}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}

            {form.trigger_type === 'total_amount' && (
              <div>
                <label className={labelCls}>{t('promotions.modal.min_amount')}</label>
                <input
                  type="number" min={0} step={0.01} className={inputCls}
                  value={form.trigger_min_amount ?? ''}
                  onChange={(e) => set('trigger_min_amount', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                  placeholder={t('promotions.modal.min_amount_ph')}
                />
              </div>
            )}

            {form.trigger_type === 'quantity' && (
              <div>
                <label className={labelCls}>{t('promotions.modal.min_qty')}</label>
                <input
                  type="number" min={1} step={1} className={inputCls}
                  value={form.trigger_min_qty ?? ''}
                  onChange={(e) => set('trigger_min_qty', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                  placeholder={t('promotions.modal.min_qty_ph')}
                />
              </div>
            )}
          </fieldset>

          {/* Action section */}
          <fieldset className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border">
            <legend className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1">{t('promotions.modal.action_legend')}</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t('promotions.modal.discount_type')}</label>
                <select
                  className={inputCls}
                  value={form.action_type}
                  onChange={(e) => set('action_type', e.target.value as DiscountAction)}
                  disabled={isEdit}
                >
                  <option value="percentage">{t('promotions.modal.opt_percentage')}</option>
                  <option value="fixed_eur">{t('promotions.modal.opt_fixed')}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t('promotions.modal.value')}</label>
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
              <label className={labelCls}>{t('promotions.modal.scope')}</label>
              <select
                className={inputCls}
                value={form.scope}
                onChange={(e) => set('scope', e.target.value as DiscountScope)}
                disabled={isEdit}
              >
                <option value="global">{t('promotions.modal.scope_global')}</option>
                <option value="per_product">{t('promotions.modal.scope_product')}</option>
              </select>
            </div>

            {form.scope === 'per_product' && (
              <div>
                <label className={labelCls}>{t('promotions.modal.target_product')}</label>
                <select
                  className={inputCls}
                  value={form.scope_product_id ?? ''}
                  onChange={(e) => set('scope_product_id', e.target.value ? Number(e.target.value) : null)}
                  disabled={isEdit}
                >
                  <option value="">{t('promotions.modal.trigger_product_default')}</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
          </fieldset>

          {/* Options */}
          <fieldset className="space-y-3 p-4 bg-muted/40 rounded-xl border border-border">
            <legend className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide px-1">{t('promotions.modal.options_legend')}</legend>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>{t('promotions.modal.valid_from')}</label>
                <input type="date" className={inputCls} value={form.valid_from ?? ''} onChange={(e) => set('valid_from', e.target.value || null)} />
              </div>
              <div>
                <label className={labelCls}>{t('promotions.modal.valid_until')}</label>
                <input type="date" className={inputCls} value={form.valid_until ?? ''} onChange={(e) => set('valid_until', e.target.value || null)} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-foreground">{t('promotions.modal.cumulative')}</p>
                <p className="text-[12px] text-muted-foreground">{t('promotions.modal.cumulative_hint')}</p>
              </div>
              <button type="button" onClick={() => set('cumulative', !form.cumulative)} className="text-primary">
                {form.cumulative ? <FiToggleRight className="w-7 h-7" /> : <FiToggleLeft className="w-7 h-7 text-muted-foreground/50" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-foreground">{t('promotions.modal.active')}</p>
                <p className="text-[12px] text-muted-foreground">{t('promotions.modal.active_hint')}</p>
              </div>
              <button type="button" onClick={() => set('is_active', !form.is_active)} className="text-primary">
                {form.is_active ? <FiToggleRight className="w-7 h-7" /> : <FiToggleLeft className="w-7 h-7 text-muted-foreground/50" />}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            {saving ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiCheck className="w-4 h-4" />}
            {saving ? t('promotions.modal.saving') : t('promotions.modal.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete modal ──────────────────────────────────────────────────────────────

function DeleteModal({ discount, onClose, onDeleted }: { discount: Discount; onClose: () => void; onDeleted: () => void }) {
  const { t } = useTranslation();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await discountService.delete(discount.id);
      onDeleted();
    } catch {
      setError(t('promotions.delete.error'));
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-sm p-6 space-y-4">
        <p className="text-[15px] font-semibold text-foreground">{t('promotions.delete.title')}</p>
        <p className="text-[13px] text-muted-foreground">
          {t('promotions.delete.confirm', { name: discount.name })}
        </p>
        {error && <p className="text-[12px] text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted border border-border rounded-xl hover:bg-muted/80 transition-colors">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors disabled:opacity-40"
          >
            {deleting ? t('promotions.delete.deleting') : t('promotions.delete.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ discount }: { discount: Discount }) {
  const { t } = useTranslation();
  if (!discount.is_active)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground">{t('promotions.status.inactive')}</span>;
  if (isExpired(discount))
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400">{t('promotions.status.expired')}</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">{t('promotions.status.active')}</span>;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PromotionsPage() {
  const { t } = useTranslation();
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
          setError(msg || t('promotions.load_error'));
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
        title={t('promotions.title')}
        subtitle={t('promotions.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </button>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              {t('promotions.new_discount')}
            </button>
          </div>
        }
      >
        {backendUnavailable && (
          <div className="px-4 py-3 text-sm text-muted-foreground bg-muted border border-border rounded-xl">
            {t('promotions.backend_unavailable')}
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
            <p className="text-[13px] font-medium text-muted-foreground">{t('promotions.stats.active')}</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{loading ? '—' : active}</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">{t('promotions.stats.expired')}</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{loading ? '—' : expired}</p>
          </div>
          <div className="p-6 bg-card border border-border rounded-lg">
            <p className="text-[13px] font-medium text-muted-foreground">{t('promotions.stats.inactive')}</p>
            <p className="mt-3 text-3xl font-bold text-foreground tabular-nums">{loading ? '—' : inactive}</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-[15px] font-semibold text-foreground">{t('promotions.table.title')}</h2>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {loading ? t('promotions.loading') : t('promotions.table.count', { count: discounts.length })}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground/70 text-sm">{t('promotions.loading')}</div>
          ) : discounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/70 gap-3">
              <FiTag className="w-8 h-8" />
              <p className="text-sm">{t('promotions.table.empty')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.name')}</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.trigger')}</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.action')}</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.scope')}</th>
                    <th className="px-4 py-3 text-left text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.validity')}</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.usage')}</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.cumul')}</th>
                    <th className="px-4 py-3 text-center text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.status')}</th>
                    <th className="px-4 py-3 text-right text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">{t('promotions.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {discounts.map((d) => (
                    <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{d.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{triggerLabel(t, d, products)}</td>
                      <td className="px-4 py-3 font-semibold text-primary">{actionLabel(d)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{scopeLabel(t, d, products)}</td>
                      <td className="px-4 py-3 text-muted-foreground text-[12px]">{validityLabel(t, d)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openOrdersPanel(d)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                            d.usage_count > 0
                              ? 'bg-primary/10 text-primary hover:bg-primary/20'
                              : 'bg-muted text-muted-foreground/50 cursor-default'
                          }`}
                          title={d.usage_count > 0 ? t('promotions.table.usage_used') : t('promotions.table.usage_never')}
                        >
                          {d.usage_count}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {d.cumulative
                          ? <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title={t('promotions.table.cumul_yes')} />
                          : <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/30" title={t('promotions.table.cumul_no')} />}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => handleToggle(d)} title={t('promotions.table.toggle')}>
                          <StatusBadge discount={d} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditing(d)}
                            className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
                            title={t('promotions.table.edit')}
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleting(d)}
                            className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title={t('promotions.table.delete')}
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
                <p className="text-[15px] font-semibold text-foreground">{t('promotions.orders.title', { name: viewingOrders.name })}</p>
                <p className="text-[12px] text-muted-foreground mt-0.5">{t('promotions.orders.usage', { count: viewingOrders.usage_count })}</p>
              </div>
              <button onClick={() => setViewingOrders(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground/70 hover:text-muted-foreground transition-colors">
                <FiX className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingOrders ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">{t('promotions.loading')}</div>
              ) : discountOrders.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">{t('promotions.orders.empty')}</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase">{t('promotions.orders.col_order')}</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase">{t('promotions.orders.col_date')}</th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase">{t('promotions.orders.col_saving')}</th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold text-muted-foreground uppercase">{t('promotions.orders.col_total')}</th>
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
