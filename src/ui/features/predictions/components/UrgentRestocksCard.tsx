import { useMemo } from 'react';
import type { UrgentRestock } from '@/domain/models/AiPredictions';
import { PredictionCard, PredictionEmpty } from './PredictionCard';
import { URGENCY_BADGE, URGENCY_LABEL, URGENCY_RANK, formatNumber } from './predictionsHelpers';

interface UrgentRestocksCardProps {
  restocks: UrgentRestock[];
}

/** Produits à réapprovisionner en priorité selon les prévisions de demande. */
export function UrgentRestocksCard({ restocks }: UrgentRestocksCardProps) {
  const rows = useMemo(
    () =>
      [...restocks]
        .sort(
          (a, b) =>
            URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency] ||
            a.days_until_stockout - b.days_until_stockout,
        )
        .slice(0, 8),
    [restocks],
  );

  return (
    <PredictionCard
      title="Réapprovisionnements prioritaires"
      subtitle="Produits à risque de rupture selon la demande prévue"
    >
      {rows.length === 0 ? (
        <PredictionEmpty message="Aucun réapprovisionnement urgent" />
      ) : (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.product_id}
              className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium truncate text-foreground">{r.product_name}</div>
                <div className="text-[11px] text-muted-foreground">
                  Stock {r.current_stock} → cible {r.recommended_stock} · commander{' '}
                  <span className="font-medium text-foreground">{r.reorder_quantity}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums text-foreground">
                    {r.days_until_stockout} j
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {formatNumber(r.avg_daily_demand)}/j
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border ${URGENCY_BADGE[r.urgency]}`}
                >
                  {URGENCY_LABEL[r.urgency]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PredictionCard>
  );
}
