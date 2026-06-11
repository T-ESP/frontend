import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bell, PackageX, TrendingDown, TrendingUp, AlertTriangle,
  RefreshCw, CheckCheck, X, ChevronDown, ShieldAlert, Clock,
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
  critical: 'bg-rose-50 text-rose-700 border-rose-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-blue-50 text-blue-700 border-blue-200',
};
const STATUS_BADGE: Record<string, string> = {
  new: 'bg-gray-100 text-gray-700 border-gray-200',
  acknowledged: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-violet-50 text-violet-700 border-violet-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  dismissed: 'bg-gray-50 text-gray-400 border-gray-200',
};
const STATUS_LABEL: Record<string, string> = {
  new: 'Nouveau',
  acknowledged: 'Pris en compte',
  in_progress: 'En cours',
  resolved: 'Résolu',
  dismissed: 'Ignoré',
};
const URGENCY_COLOR: Record<string, string> = {
  URGENT: 'text-rose-600',
  HIGH: 'text-orange-600',
  MEDIUM: 'text-amber-600',
  LOW: 'text-blue-500',
};

const formatDate = (s: string) =>
  new Date(s).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });

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
        <div className="absolute right-0 z-20 w-44 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => { onUpdate(alert.id, s); setOpen(false); }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 transition-colors"
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const matchSearch = !search ||
        a.message.toLowerCase().includes(search.toLowerCase()) ||
        (a.product_name ?? '').toLowerCase().includes(search.toLowerCase());
      const matchSeverity = filterSeverity === 'all' || a.severity === filterSeverity;
      const matchStatus = filterStatus === 'all' || a.status === filterStatus;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [alerts, search, filterSeverity, filterStatus]);

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
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualiser
        </button>
      }
    >
      {/* Summary KPIs */}
      {summary && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {([
            { label: 'Critiques', count: summary.by_severity?.critical ?? 0, cardCls: 'bg-rose-50 border-rose-100', textCls: 'text-rose-700', iconCls: 'bg-rose-100 text-rose-500', Icon: ShieldAlert },
            { label: 'Hautes', count: summary.by_severity?.high ?? 0, cardCls: 'bg-orange-50 border-orange-100', textCls: 'text-orange-700', iconCls: 'bg-orange-100 text-orange-500', Icon: AlertTriangle },
            { label: 'Non traitées', count: summary.by_status?.new ?? 0, cardCls: 'bg-white border-gray-100', textCls: 'text-gray-800', iconCls: 'bg-gray-100 text-gray-400', Icon: Clock },
            { label: 'Total alertes', count: summary.total, cardCls: 'bg-white border-gray-100', textCls: 'text-gray-800', iconCls: 'bg-gray-100 text-gray-400', Icon: Bell },
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
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {([['alerts', 'Alertes', Bell], ['predictions', 'Prévisions IA', PackageX]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setSearchParams({ tab: key })}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Alertes ── */}
      {tab === 'alerts' && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="relative flex-1 min-w-48">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par produit ou message..."
                className="h-9 pl-3"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
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
              className="h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/20"
            >
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveau</option>
              <option value="acknowledged">Pris en compte</option>
              <option value="in_progress">En cours</option>
              <option value="resolved">Résolu</option>
              <option value="dismissed">Ignoré</option>
            </select>
            {selectedIds.size > 0 && (
              <button
                onClick={handleBulkResolve}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Résoudre ({selectedIds.size})
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-8 space-y-3">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
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
                      className="rounded border-gray-300"
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
                  filtered.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="px-6">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(alert.id)}
                          onChange={() => toggleSelect(alert.id)}
                          className="rounded border-gray-300"
                        />
                      </TableCell>
                      <TableCell className="px-6 font-medium">{alert.product_name ?? '—'}</TableCell>
                      <TableCell className="px-6 text-muted-foreground max-w-72">
                        <p className="truncate">{alert.message}</p>
                        {alert.action_recommended && (
                          <p className="text-xs text-gray-400 truncate mt-0.5">→ {alert.action_recommended}</p>
                        )}
                      </TableCell>
                      <TableCell className="px-6">
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {alert.model_type}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full border ${SEVERITY_BADGE[alert.severity]}`}>
                          <span className={`size-1.5 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
                          {alert.severity}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <StatusDropdown alert={alert} onUpdate={handleUpdateStatus} />
                      </TableCell>
                      <TableCell className="px-6 text-xs text-muted-foreground tabular-nums">
                        {formatDate(alert.created_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}

          <div className="px-6 py-3 border-t border-gray-100 text-xs text-muted-foreground">
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
              {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-white border border-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            <>
              {/* Urgent Restocks */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                  <PackageX className="w-4 h-4 text-orange-500" />
                  <h3 className="text-base font-semibold text-gray-900">Réapprovisionnements urgents</h3>
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
                          <TableCell className="px-6 font-medium">{r.product_name}</TableCell>
                          <TableCell className="px-6 tabular-nums">{r.current_stock}</TableCell>
                          <TableCell className="px-6 tabular-nums">{r.recommended_stock}</TableCell>
                          <TableCell className="px-6 font-semibold tabular-nums text-orange-600">+{r.reorder_quantity}</TableCell>
                          <TableCell className="px-6 tabular-nums text-muted-foreground">{Number(r.avg_daily_demand).toFixed(1)}</TableCell>
                          <TableCell className="px-6">
                            <span className={`font-semibold tabular-nums ${r.days_until_stockout <= 3 ? 'text-rose-600' : r.days_until_stockout <= 7 ? 'text-orange-600' : 'text-amber-600'}`}>
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
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="text-base font-semibold text-gray-900">Anomalies de prix</h3>
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
                            <TableCell className="px-6 font-medium">{p.product_name}</TableCell>
                            <TableCell className="px-6 tabular-nums">{formatCurrency(p.current_price)}</TableCell>
                            <TableCell className="px-6 tabular-nums text-muted-foreground">{formatCurrency(p.expected_price)}</TableCell>
                            <TableCell className="px-6 tabular-nums">
                              <span className={`flex items-center gap-1 text-sm font-medium ${diff > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
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
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                  <TrendingDown className="w-4 h-4 text-violet-500" />
                  <h3 className="text-base font-semibold text-gray-900">Anomalies de ventes</h3>
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
                            <TableCell className="px-6 font-medium">{s.product_name}</TableCell>
                            <TableCell className="px-6 tabular-nums font-semibold">{s.sales_volume}</TableCell>
                            <TableCell className="px-6 tabular-nums text-muted-foreground">{s.expected_sales.toFixed(0)}</TableCell>
                            <TableCell className="px-6 tabular-nums">
                              <span className={`flex items-center gap-1 text-sm font-medium ${diff > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
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
    </PageLayout>
  );
}
