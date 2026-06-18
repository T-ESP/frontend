import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Bell, PackageX, TrendingDown, TrendingUp, AlertTriangle,
  RefreshCw, CheckCheck, X, ChevronDown, ShieldAlert, Clock, ExternalLink,
} from 'lucide-react';
import PageLayout from '@/ui/components/layouts/PageLayout';
import { alertService } from '@/infrastructure/api/services/alertService';
import { aiPredictionsService } from '@/infrastructure/api/services/aiPredictionsService';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { Alert, AlertSummary, AlertStatus } from '@/domain/models/Alert';
import type { UrgentRestock, PriceAnomaly, SalesAnomaly } from '@/domain/models/AiPredictions';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-rose-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-400',
};
const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  high: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  low: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
};
const STATUS_BADGE: Record<string, string> = {
  new: 'bg-muted text-muted-foreground border-border',
  acknowledged: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
  in_progress: 'bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
  resolved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  dismissed: 'bg-muted text-muted-foreground/70 border-border',
};
const STATUS_LABEL: Record<string, string> = {
  new: 'Nouveau',
  acknowledged: 'Pris en compte',
  in_progress: 'En cours',
  resolved: 'Résolu',
  dismissed: 'Ignoré',
};
const URGENCY_COLOR: Record<string, string> = {
  URGENT: 'text-rose-600 dark:text-rose-400',
  HIGH: 'text-orange-600 dark:text-orange-400',
  MEDIUM: 'text-amber-600 dark:text-amber-400',
  LOW: 'text-blue-500',
};

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

const formatDateTime = (s: string) =>
  new Date(s).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

const formatCurrency = (v: string | number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(Number(v));

// ─── Status dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({ alert, onUpdate }: { alert: Alert; onUpdate: (id: number, status: AlertStatus) => void }) {
  const [open, setOpen] = useState(false);
  const statuses: AlertStatus[] = ['acknowledged', 'in_progress', 'resolved', 'dismissed'];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border transition-colors ${STATUS_BADGE[alert.status]}`}
      >
        {STATUS_LABEL[alert.status] ?? alert.status}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute right-0 z-20 w-44 mt-1 bg-card border border-border rounded-lg shadow-lg py-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { onUpdate(alert.id, s); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors"
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Alert history modal ───────────────────────────────────────────────────────

function AlertHistoryModal({
  productName,
  history,
  onClose,
}: {
  productName: string;
  history: Alert[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h3 className="text-[15px] font-semibold text-foreground">Historique des alertes</h3>
            <p className="text-[13px] text-muted-foreground mt-0.5">
              {productName} — {history.length} alerte{history.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground/70 hover:text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body: timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <ol className="relative ml-2 space-y-6 border-l border-border">
            {history.map((a, idx) => (
              <li key={a.id} className="ml-6">
                <span
                  className={`absolute -left-[7px] mt-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-4 ring-white ${SEVERITY_DOT[a.severity] ?? 'bg-muted'}`}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-medium text-foreground tabular-nums">
                    {formatDateTime(a.created_at)}
                  </span>
                  {idx === 0 && (
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                      Plus récente
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium ${SEVERITY_BADGE[a.severity]}`}>
                    {a.severity}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE[a.status]}`}>
                    {STATUS_LABEL[a.status] ?? a.status}
                  </span>
                </div>
                <p className="mt-1 text-[13px] text-muted-foreground">{a.message}</p>
                {a.action_recommended && (
                  <p className="mt-0.5 text-[12px] text-muted-foreground/70">→ {a.action_recommended}</p>
                )}
                <p className="mt-1 font-mono text-[11px] text-muted-foreground/70">{a.model_type}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─── Product link (redirige vers l'inventaire avec le filtre pré-rempli) ───────

function ProductLink({ name, onNavigate }: { name?: string | null; onNavigate: (name: string) => void }) {
  if (!name) return <>—</>;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onNavigate(name); }}
      title="Voir dans l'inventaire"
      className="inline-flex items-center gap-1.5 text-left hover:text-violet-600 dark:text-violet-400 transition-colors group"
    >
      {name}
      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redirige vers l'inventaire en pré-remplissant la recherche par nom de produit.
  const goToInventory = (productName: string) => {
    navigate(`/inventory?search=${encodeURIComponent(productName)}`);
  };

  const tab = (searchParams.get('tab') ?? 'alerts') as 'alerts' | 'predictions';

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [restocks, setRestocks] = useState<UrgentRestock[]>([]);
  const [priceAnomalies, setPriceAnomalies] = useState<PriceAnomaly[]>([]);
  const [salesAnomalies, setSalesAnomalies] = useState<SalesAnomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);

  const [search, setSearch] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('new');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [historyProductId, setHistoryProductId] = useState<number | null>(null);

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    if (tab === 'predictions') loadPredictions();
  }, [tab]);

  const loadAlerts = async () => {
    setLoading(true);
    const [alertsRes, summaryRes] = await Promise.allSettled([
      alertService.getAll({ limit: 200 }),
      alertService.getSummary(),
    ]);
    if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value);
    if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
    setLoading(false);
  };

  const loadPredictions = async () => {
    setLoadingPredictions(true);
    const [restocksRes, priceRes, salesRes] = await Promise.allSettled([
      aiPredictionsService.getUrgentRestocks(),
      aiPredictionsService.getPriceAnomalies(),
      aiPredictionsService.getSalesAnomalies(),
    ]);
    if (restocksRes.status === 'fulfilled') setRestocks(restocksRes.value);
    if (priceRes.status === 'fulfilled') setPriceAnomalies(priceRes.value);
    if (salesRes.status === 'fulfilled') setSalesAnomalies(salesRes.value);
    setLoadingPredictions(false);
  };

  const handleUpdateStatus = async (id: number, status: AlertStatus) => {
    await alertService.updateStatus(id, { status });
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const handleBulkResolve = async () => {
    if (selectedIds.size === 0) return;
    await alertService.bulkUpdateStatus({ ids: [...selectedIds], status: 'resolved' });
    setAlerts((prev) => prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: 'resolved' } : a)));
    setSelectedIds(new Set());
  };

  const handleBulkAcknowledge = async () => {
    if (selectedIds.size === 0) return;
    await alertService.bulkUpdateStatus({ ids: [...selectedIds], status: 'acknowledged' });
    setAlerts((prev) => prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: 'acknowledged' } : a)));
    setSelectedIds(new Set());
  };

  // Ne conserver que l'alerte la plus récente par produit.
  const latestPerProduct = useMemo(() => {
    const byProduct = new Map<string, Alert>();
    for (const a of alerts) {
      // Clé par produit ; les alertes sans produit restent distinctes (clé = id).
      const key = a.product_id != null ? `id:${a.product_id}` : `alert:${a.id}`;
      const existing = byProduct.get(key);
      if (!existing || new Date(a.created_at).getTime() > new Date(existing.created_at).getTime()) {
        byProduct.set(key, a);
      }
    }
    return [...byProduct.values()].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [alerts]);

  const filtered = useMemo(() => {
    return latestPerProduct.filter((a) => {
      const matchSearch = !search ||
        a.message.toLowerCase().includes(search.toLowerCase()) ||
        (a.product_name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [latestPerProduct, search, filterSeverity, filterStatus]);

  // Number of alerts per product — used to surface that a row has older history.
  const countByProduct = useMemo(() => {
    const m = new Map<number, number>();
    for (const a of alerts) {
      if (a.product_id != null) m.set(a.product_id, (m.get(a.product_id) ?? 0) + 1);
    }
    return m;
  }, [alerts]);

  // All alerts for the product being inspected, most recent first.
  const historyAlerts = useMemo(() => {
    if (historyProductId == null) return [];
    return alerts
      .filter((a) => a.product_id === historyProductId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [alerts, historyProductId]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((a) => a.id)));
    }
  };

  return (
    <PageLayout
      title="Alertes & Prévisions IA"
      subtitle="Suivez les alertes générées par les modèles IA et anticipez les besoins."
      actions={
        <button
          onClick={() => { loadAlerts(); if (tab === 'predictions') loadPredictions(); }}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      }
    >
      {/* Summary KPIs */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-4">
          {([
            { label: 'Critiques', count: summary.by_severity?.critical ?? 0, cardCls: 'bg-card border-border', textCls: 'text-foreground', iconCls: 'bg-rose-500/15 text-rose-600 dark:text-rose-400', Icon: ShieldAlert },
            { label: 'Hautes', count: summary.by_severity?.high ?? 0, cardCls: 'bg-card border-border', textCls: 'text-foreground', iconCls: 'bg-orange-500/15 text-orange-600 dark:text-orange-400', Icon: AlertTriangle },
            { label: 'Non traitées', count: summary.by_status?.new ?? 0, cardCls: 'bg-card border-border', textCls: 'text-foreground', iconCls: 'bg-muted text-muted-foreground/70', Icon: Clock },
            { label: 'Total alertes', count: summary.total, cardCls: 'bg-card border-border', textCls: 'text-foreground', iconCls: 'bg-muted text-muted-foreground/70', Icon: Bell },
          ] as const).map(({ label, count, cardCls, textCls, iconCls, Icon }) => (
            <div key={label} className={`rounded-xl border p-6 shadow-sm ${cardCls}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide opacity-60 mb-2 ${textCls}`}>{label}</p>
                  <p className={`text-3xl font-bold tabular-nums ${textCls}`}>{count}</p>
                </div>
                <div className={`rounded-lg p-2 ${iconCls}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
        {([['alerts', 'Alertes', Bell], ['predictions', 'Prévisions IA', PackageX]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setSearchParams({ tab: key })}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-muted-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Alertes ── */}
      {tab === 'alerts' && (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-border">
            <div className="relative flex-1 min-w-48">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par produit ou message..."
                className="h-9 pl-3"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="h-9 px-3 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Toutes les sévérités</option>
              <option value="critical">Critique</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Faible</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 px-3 text-sm border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveau</option>
              <option value="acknowledged">Pris en compte</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="dismissed">Ignoré</option>
            </select>
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={handleBulkAcknowledge}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Marquer comme lu ({selectedIds.size})
                </button>
                <button
                  onClick={handleBulkResolve}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Résoudre ({selectedIds.size})
                </button>
              </>
            )}
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border"
                    />
                  </TableHead>
                  <TableHead className="px-6">Produit</TableHead>
                  <TableHead className="px-6">Message</TableHead>
                  <TableHead className="px-6">Source IA</TableHead>
                  <TableHead className="px-6">Sévérité</TableHead>
                  <TableHead className="px-6">Statut</TableHead>
                  <TableHead className="px-6">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      <Bell className="mx-auto mb-2 size-6 text-muted-foreground/40" />
                      Aucune alerte trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((alert) => {
                    const hasHistory = alert.product_id != null && (countByProduct.get(alert.product_id) ?? 0) > 1;
                    const clickable = alert.product_id != null;
                    return (
                    <TableRow
                      key={alert.id}
                      className={clickable ? 'cursor-pointer' : undefined}
                      onClick={clickable ? () => setHistoryProductId(alert.product_id) : undefined}
                    >
                      <TableCell className="px-6" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(alert.id)}
                          onChange={() => toggleSelect(alert.id)}
                          className="rounded border-border"
                        />
                      </TableCell>
                      <TableCell className="px-6 font-medium">
                        <span className="flex items-center gap-2">
                          <ProductLink name={alert.product_name} onNavigate={goToInventory} />
                          {hasHistory && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {countByProduct.get(alert.product_id!)}
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 text-muted-foreground max-w-72">
                        <p className="truncate">{alert.message}</p>
                        {alert.action_recommended && (
                          <p className="text-xs text-muted-foreground/70 truncate mt-0.5">→ {alert.action_recommended}</p>
                        )}
                      </TableCell>
                      <TableCell className="px-6">
                        <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {alert.model_type}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${SEVERITY_BADGE[alert.severity]}`}>
                          <span className={`size-1.5 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                          {alert.severity}
                        </span>
                      </TableCell>
                      <TableCell className="px-6" onClick={(e) => e.stopPropagation()}>
                        <StatusDropdown alert={alert} onUpdate={handleUpdateStatus} />
                      </TableCell>
                      <TableCell className="px-6 text-xs text-muted-foreground tabular-nums">
                        {formatDate(alert.created_at)}
                      </TableCell>
                    </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}

          <div className="px-6 py-3 border-t border-border text-xs text-muted-foreground">
            {filtered.length} alerte{filtered.length > 1 ? 's' : ''}
            {selectedIds.size > 0 && ` — ${selectedIds.size} sélectionnée${selectedIds.size > 1 ? 's' : ''}`}
          </div>
        </div>
      )}

      {/* ── Tab: Prévisions IA ── */}
      {tab === 'predictions' && (
        <div className="space-y-6">
          {loadingPredictions ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-card border border-border rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Urgent Restocks */}
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                  <PackageX className="w-4 h-4 text-orange-500" />
                  <h3 className="text-base font-semibold text-foreground">Réapprovisionnements urgents</h3>
                  <span className="text-xs text-muted-foreground">Prédictions de rupture de stock imminente</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Produit</TableHead>
                      <TableHead className="px-6">Stock actuel</TableHead>
                      <TableHead className="px-6">Stock recommandé</TableHead>
                      <TableHead className="px-6">À commander</TableHead>
                      <TableHead className="px-6">Demande / jour</TableHead>
                      <TableHead className="px-6">Jours restants</TableHead>
                      <TableHead className="px-6">Urgence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {restocks.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={7} className="h-20 text-center text-muted-foreground">Aucun réapprovisionnement urgent</TableCell>
                      </TableRow>
                    ) : (
                      restocks.map((r) => (
                        <TableRow key={r.product_id}>
                          <TableCell className="px-6 font-medium">
                            <ProductLink name={r.product_name} onNavigate={goToInventory} />
                          </TableCell>
                          <TableCell className="px-6 tabular-nums">{r.current_stock}</TableCell>
                          <TableCell className="px-6 tabular-nums">{r.recommended_stock}</TableCell>
                          <TableCell className="px-6 font-semibold tabular-nums text-orange-600 dark:text-orange-400">+{r.reorder_quantity}</TableCell>
                          <TableCell className="px-6 tabular-nums text-muted-foreground">{Number(r.avg_daily_demand).toFixed(1)}</TableCell>
                          <TableCell className="px-6">
                            <span className={`font-semibold tabular-nums ${r.days_until_stockout <= 3 ? 'text-rose-600 dark:text-rose-400' : r.days_until_stockout <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-amber-600 dark:text-amber-400'}`}>
                              J-{r.days_until_stockout}
                            </span>
                          </TableCell>
                          <TableCell className="px-6">
                            <span className={`text-xs font-semibold ${URGENCY_COLOR[r.urgency]}`}>{r.urgency}</span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Price Anomalies */}
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-base font-semibold text-foreground">Anomalies de prix</h3>
                  <span className="text-xs text-muted-foreground">Prix détectés hors de la plage normale</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Produit</TableHead>
                      <TableHead className="px-6">Prix actuel</TableHead>
                      <TableHead className="px-6">Prix attendu</TableHead>
                      <TableHead className="px-6">Écart</TableHead>
                      <TableHead className="px-6">Score anomalie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {priceAnomalies.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">Aucune anomalie de prix détectée</TableCell>
                      </TableRow>
                    ) : (
                      priceAnomalies.map((p) => {
                        const diff = Number(p.current_price) - Number(p.expected_price);
                        const pct = (diff / Number(p.expected_price)) * 100;
                        return (
                          <TableRow key={p.id}>
                            <TableCell className="px-6 font-medium">
                              <ProductLink name={p.product_name} onNavigate={goToInventory} />
                            </TableCell>
                            <TableCell className="px-6 tabular-nums">{formatCurrency(p.current_price)}</TableCell>
                            <TableCell className="px-6 tabular-nums text-muted-foreground">{formatCurrency(p.expected_price)}</TableCell>
                            <TableCell className="px-6 tabular-nums">
                              <span className={`flex items-center gap-1 text-sm font-medium ${diff > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                {diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                {diff > 0 ? '+' : ''}{pct.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="px-6 tabular-nums text-muted-foreground">{p.anomaly_score.toFixed(2)}σ</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Sales Anomalies */}
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                  <TrendingDown className="w-4 h-4 text-violet-500" />
                  <h3 className="text-base font-semibold text-foreground">Anomalies de ventes</h3>
                  <span className="text-xs text-muted-foreground">Volumes de ventes inhabituels détectés par l'IA</span>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-6">Produit</TableHead>
                      <TableHead className="px-6">Volume observé</TableHead>
                      <TableHead className="px-6">Volume attendu</TableHead>
                      <TableHead className="px-6">Écart</TableHead>
                      <TableHead className="px-6">Score anomalie</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesAnomalies.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">Aucune anomalie de ventes détectée</TableCell>
                      </TableRow>
                    ) : (
                      salesAnomalies.map((s) => {
                        const diff = s.sales_volume - s.expected_sales;
                        const pct = (diff / s.expected_sales) * 100;
                        return (
                          <TableRow key={s.id}>
                            <TableCell className="px-6 font-medium">
                              <ProductLink name={s.product_name} onNavigate={goToInventory} />
                            </TableCell>
                            <TableCell className="px-6 tabular-nums font-semibold">{s.sales_volume}</TableCell>
                            <TableCell className="px-6 tabular-nums text-muted-foreground">{s.expected_sales.toFixed(0)}</TableCell>
                            <TableCell className="px-6 tabular-nums">
                              <span className={`flex items-center gap-1 text-sm font-medium ${diff > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                {diff > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                {diff > 0 ? '+' : ''}{pct.toFixed(1)}%
                              </span>
                            </TableCell>
                            <TableCell className="px-6 tabular-nums text-muted-foreground">{s.anomaly_score.toFixed(2)}σ</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      )}

      {historyProductId != null && historyAlerts.length > 0 && (
        <AlertHistoryModal
          productName={historyAlerts[0].product_name ?? '—'}
          history={historyAlerts}
          onClose={() => setHistoryProductId(null)}
        />
      )}
    </PageLayout>
  );
}
