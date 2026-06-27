import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { globalKpisService, type TopFlopProduct } from '@/infrastructure/api/services/globalKpisService';
import { StatsCard, StatsEmpty } from './StatsCard';
import { type DateRange, formatNumber, toApiDate } from './statsHelpers';

interface TopProductsOrderedProps {
  range: DateRange;
}

type Metric = 'volume' | 'revenue';

/** Classement des produits les plus commandés sur la période (endpoint /kpis/top-flop). */
export function TopProductsOrdered({ range }: TopProductsOrderedProps) {
  const [metric, setMetric] = useState<Metric>('volume');
  const [byVolume, setByVolume] = useState<TopFlopProduct[]>([]);
  const [byRevenue, setByRevenue] = useState<TopFlopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    globalKpisService
      .getTopFlop({ start_date: toApiDate(range.start), end_date: toApiDate(range.end) })
      .then((res) => {
        if (cancelled) return;
        setByVolume(res.top_10_by_volume ?? []);
        setByRevenue(res.top_10_by_revenue ?? []);
      })
      .catch(() => !cancelled && setFailed(true))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [range]);

  const list = (metric === 'volume' ? byVolume : byRevenue).slice(0, 8);
  const maxValue = Math.max(1, ...list.map((p) => p.value));

  const fmt = (v: number) =>
    metric === 'volume'
      ? `${formatNumber(v)} u.`
      : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

  const toggle = (
    <div className="flex p-0.5 bg-muted rounded-md">
      {(['volume', 'revenue'] as Metric[]).map((mtr) => (
        <button
          key={mtr}
          onClick={() => setMetric(mtr)}
          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
            metric === mtr ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          {mtr === 'volume' ? 'Volume' : 'CA'}
        </button>
      ))}
    </div>
  );

  return (
    <StatsCard title="Top produits commandés" subtitle="Classement sur la période" action={toggle}>
      {loading ? (
        <div className="flex items-center justify-center h-[260px] text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      ) : failed ? (
        <StatsEmpty message="Donnée indisponible" />
      ) : list.length === 0 ? (
        <StatsEmpty message="Aucun produit sur la période" />
      ) : (
        <div className="space-y-3">
          {list.map((p, i) => (
            <div key={p.product_id} className="flex items-center gap-3">
              <span className="w-5 text-xs font-semibold text-center text-muted-foreground tabular-nums">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="font-medium truncate text-foreground">{p.product_name}</span>
                  <span className="ml-2 font-semibold tabular-nums text-foreground shrink-0">{fmt(p.value)}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(p.value / maxValue) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </StatsCard>
  );
}
