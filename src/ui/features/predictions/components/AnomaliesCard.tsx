import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingDown, TrendingUp } from 'lucide-react';
import type { PriceAnomaly, SalesAnomaly } from '@/domain/models/AiPredictions';
import { PredictionCard, PredictionEmpty } from './PredictionCard';
import { formatCurrency, formatNumber, toNumber } from './predictionsHelpers';

interface AnomaliesCardProps {
  priceAnomalies: PriceAnomaly[];
  salesAnomalies: SalesAnomaly[];
}

/** Anomalies détectées par l'IA sur les prix et les volumes de vente. */
export function AnomaliesCard({ priceAnomalies, salesAnomalies }: AnomaliesCardProps) {
  const { t } = useTranslation();
  const prices = useMemo(
    () =>
      [...priceAnomalies]
        .filter((a) => a.is_anomaly)
        .sort((a, b) => Math.abs(b.anomaly_score) - Math.abs(a.anomaly_score))
        .slice(0, 5),
    [priceAnomalies],
  );
  const sales = useMemo(
    () =>
      [...salesAnomalies]
        .filter((a) => a.is_anomaly)
        .sort((a, b) => Math.abs(b.anomaly_score) - Math.abs(a.anomaly_score))
        .slice(0, 5),
    [salesAnomalies],
  );

  const empty = prices.length === 0 && sales.length === 0;

  return (
    <PredictionCard title={t('predictions.anomalies.title')} subtitle={t('predictions.anomalies.subtitle')}>
      {empty ? (
        <PredictionEmpty message={t('predictions.anomalies.empty')} />
      ) : (
        <div className="space-y-5">
          {prices.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                {t('predictions.anomalies.prices')}
              </h4>
              <div className="space-y-2">
                {prices.map((a) => {
                  const up = toNumber(a.current_price) >= toNumber(a.expected_price);
                  return (
                    <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-foreground">{a.product_name}</span>
                      <span className="flex items-center gap-1.5 shrink-0 tabular-nums text-muted-foreground">
                        {formatCurrency(a.current_price)}
                        <span className="text-[11px]">({t('predictions.anomalies.expected', { value: formatCurrency(a.expected_price) })})</span>
                        {up ? (
                          <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {sales.length > 0 && (
            <div>
              <h4 className="mb-2 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                {t('predictions.anomalies.sales')}
              </h4>
              <div className="space-y-2">
                {sales.map((a) => {
                  const up = a.sales_volume >= a.expected_sales;
                  return (
                    <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="truncate text-foreground">{a.product_name}</span>
                      <span className="flex items-center gap-1.5 shrink-0 tabular-nums text-muted-foreground">
                        {formatNumber(a.sales_volume)}
                        <span className="text-[11px]">({t('predictions.anomalies.expected', { value: formatNumber(a.expected_sales) })})</span>
                        {up ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </PredictionCard>
  );
}
