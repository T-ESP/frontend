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
  const monthly = forecast.forecasted_revenue_next_month ?? 0;
  const quarterly = forecast.forecasted_revenue_next_3_months ?? 0;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <KpiStatCard
        title="CA prévu (30 j)"
        value={formatCurrency(monthly)}
        description="Prochain mois"
        infoTooltip="Chiffre d'affaires projeté sur 30 jours par extrapolation linéaire du CA récent."
      />
      <KpiStatCard
        title="CA prévu (90 j)"
        value={formatCurrency(quarterly)}
        description="Prochain trimestre"
        infoTooltip="Chiffre d'affaires projeté sur 90 jours par extrapolation linéaire du CA récent."
      />
      <KpiStatCard
        title="Trésorerie réappro"
        value={formatCurrency(forecast.cash_needed_for_restocks)}
        description="Réappros en attente"
        infoTooltip="Montant total nécessaire pour honorer les réapprovisionnements en attente."
      />
      <KpiStatCard
        title="Ruptures prévues"
        value={forecast.predicted_stockouts_count.toString()}
        description={`${forecast.optimization_opportunities_count} opportunités d'optimisation`}
        trend={forecast.predicted_stockouts_count > 0 ? 'down' : 'up'}
        infoTooltip="Nombre de produits dont la couverture de stock est inférieure à 7 jours."
      />
    </div>
  );
}
