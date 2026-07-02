import { useTranslation } from 'react-i18next';
import { KpiStatCard } from '@/ui/components/common/KpiStatCard/KpiStatCard';
import type { ForecastKpis } from '@/infrastructure/api/services/globalKpisService';
import { formatCurrency } from './predictionsHelpers';

interface ForecastKpiBandProps {
  forecast: ForecastKpis;
}

/**
 * Bande d'indicateurs prévisionnels globaux (endpoint /kpis/forecast).
 * Le CA prévu est une extrapolation linéaire du CA récent côté API.
 */
export function ForecastKpiBand({ forecast }: ForecastKpiBandProps) {
  const { t } = useTranslation();
  const monthly = forecast.forecasted_revenue_next_month ?? 0;
  const quarterly = forecast.forecasted_revenue_next_3_months ?? 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        title={t('predictions.forecast.ca_30_title')}
        value={formatCurrency(monthly)}
        description={t('predictions.forecast.ca_30_desc')}
        infoTooltip={t('predictions.forecast.ca_30_info')}
      />
      <KpiStatCard
        title={t('predictions.forecast.ca_90_title')}
        value={formatCurrency(quarterly)}
        description={t('predictions.forecast.ca_90_desc')}
        infoTooltip={t('predictions.forecast.ca_90_info')}
      />
      <KpiStatCard
        title={t('predictions.forecast.cash_title')}
        value={formatCurrency(forecast.cash_needed_for_restocks)}
        description={t('predictions.forecast.cash_desc')}
        infoTooltip={t('predictions.forecast.cash_info')}
      />
      <KpiStatCard
        title={t('predictions.forecast.stockouts_title')}
        value={forecast.predicted_stockouts_count.toString()}
        description={t('predictions.forecast.stockouts_desc', { n: forecast.optimization_opportunities_count })}
        trend={forecast.predicted_stockouts_count > 0 ? 'down' : 'up'}
        infoTooltip={t('predictions.forecast.stockouts_info')}
      />
    </div>
  );
}
