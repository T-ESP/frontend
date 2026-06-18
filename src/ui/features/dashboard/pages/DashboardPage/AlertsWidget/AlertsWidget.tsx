import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, PackageX, TrendingDown } from 'lucide-react';
import { alertService } from '@/infrastructure/api/services/alertService';
import { aiPredictionsService } from '@/infrastructure/api/services/aiPredictionsService';
import type { Alert, AlertSummary } from '@/domain/models/Alert';
import type { UrgentRestock } from '@/domain/models/AiPredictions';

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

const URGENCY_COLOR: Record<string, string> = {
  URGENT: 'text-rose-600 dark:text-rose-400',
  HIGH: 'text-orange-600 dark:text-orange-400',
  MEDIUM: 'text-amber-600 dark:text-amber-400',
  LOW: 'text-blue-600 dark:text-blue-400',
};

export function AlertsWidget() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertSummary | null>(null);
  const [restocks, setRestocks] = useState<UrgentRestock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      alertService.getAll({ status: 'new', limit: 4 }),
      alertService.getSummary(),
      aiPredictionsService.getUrgentRestocks(),
    ]).then(([alertsRes, summaryRes, restocksRes]) => {
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value);
      if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value);
      if (restocksRes.status === 'fulfilled') setRestocks(restocksRes.value.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const highCount = alerts.filter((a) => a.severity === 'high').length;
  const newCount = summary?.by_status?.new ?? 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 border bg-card border-border rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (newCount === 0 && restocks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Alertes critiques */}
      <div className="overflow-hidden border shadow-sm bg-card border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-semibold text-foreground">Alertes actives</span>
            {newCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold border rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30">
                {newCount} non traitées
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/alerts')}
            className="flex items-center gap-1 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Tout voir <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-5 py-3 space-y-2.5">
          {/* Summary badges */}
          <div className="flex items-center gap-2 pb-1">
            {criticalCount > 0 && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${SEVERITY_BADGE.critical}`}>
                <span className="size-1.5 rounded-full bg-rose-500" />
                {criticalCount} critique{criticalCount > 1 ? 's' : ''}
              </span>
            )}
            {highCount > 0 && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${SEVERITY_BADGE.high}`}>
                <span className="size-1.5 rounded-full bg-orange-500" />
                {highCount} haute{highCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {alerts.length === 0 ? (
            <p className="py-4 text-sm text-center text-muted-foreground">Aucune alerte critique en cours</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 transition-colors rounded-lg bg-muted hover:bg-secondary">
                <span className={`mt-1.5 size-2 rounded-full shrink-0 ${SEVERITY_DOT[alert.severity] ?? 'bg-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{alert.product_name ?? '—'}</p>
                  <p className="text-xs truncate text-muted-foreground mt-0.5">{alert.message}</p>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${SEVERITY_BADGE[alert.severity]}`}>
                  {alert.severity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Réapprovisionnements urgents */}
      <div className="overflow-hidden border shadow-sm bg-card border-border rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <PackageX className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-semibold text-foreground">Réapprovisionnements urgents</span>
          </div>
          <button
            onClick={() => navigate('/alerts?tab=predictions')}
            className="flex items-center gap-1 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground"
          >
            Tout voir <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-5 py-3 space-y-2.5">
          {restocks.length === 0 ? (
            <p className="py-4 text-sm text-center text-muted-foreground">Aucun réapprovisionnement urgent</p>
          ) : (
            restocks.map((r) => (
              <div key={r.product_id} className="flex items-center gap-3 p-3 transition-colors rounded-lg bg-muted hover:bg-secondary">
                <TrendingDown className={`w-4 h-4 shrink-0 ${URGENCY_COLOR[r.urgency] ?? 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{r.product_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Stock : <strong>{r.current_stock}</strong> — J-{r.days_until_stockout} avant rupture
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xs font-semibold ${URGENCY_COLOR[r.urgency] ?? 'text-muted-foreground'}`}>{r.urgency}</p>
                  <p className="text-xs text-muted-foreground/70">+{r.reorder_quantity} à commander</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
