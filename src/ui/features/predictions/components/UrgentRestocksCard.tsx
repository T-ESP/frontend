import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UrgentRestock } from '@/domain/models/AiPredictions';
import { PredictionCard, PredictionEmpty } from './PredictionCard';
import { URGENCY_BADGE, URGENCY_RANK, formatNumber } from './predictionsHelpers';

interface UrgentRestocksCardProps {
  restocks: UrgentRestock[];
}

/** Produits à réapprovisionner en priorité selon les prévisions de demande. */
export function UrgentRestocksCard({ restocks }: UrgentRestocksCardProps) {
  const { t } = useTranslation();
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
      title={t('predictions.restocks.title')}
      subtitle={t('predictions.restocks.subtitle')}
    >
      {rows.length === 0 ? (
        <PredictionEmpty message={t('predictions.restocks.empty')} />
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
                  {t('predictions.restocks.stock')} {r.current_stock} → {t('predictions.restocks.target')}{' '}
                  {r.recommended_stock} · {t('predictions.restocks.order')}{' '}
                  <span className="font-medium text-foreground">{r.reorder_quantity}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums text-foreground">
                    {t('predictions.restocks.days', { d: r.days_until_stockout })}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {t('predictions.restocks.per_day', { value: formatNumber(r.avg_daily_demand) })}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border ${URGENCY_BADGE[r.urgency]}`}
                >
                  {t(`predictions.urgency.${r.urgency}`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PredictionCard>
  );
}
