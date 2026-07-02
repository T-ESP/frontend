import { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import PageLayout from '@/ui/components/layouts/PageLayout';
import { aiPredictionsService } from '@/infrastructure/api/services/aiPredictionsService';
import { globalKpisService, type ForecastKpis } from '@/infrastructure/api/services/globalKpisService';
import type {
  DemandForecast,
  UrgentRestock,
  ProductClassification,
  PriceAnomaly,
  SalesAnomaly,
  PriceSuggestion,
  SupplierScore,
} from '@/domain/models/AiPredictions';

import { ForecastKpiBand } from '../../components/ForecastKpiBand';
import { DemandForecastChart } from '../../components/DemandForecastChart';
import { ClassificationMatrix } from '../../components/ClassificationMatrix';
import { SupplierScoresChart } from '../../components/SupplierScoresChart';
import { UrgentRestocksCard } from '../../components/UrgentRestocksCard';
import { PriceSuggestionsCard } from '../../components/PriceSuggestionsCard';
import { AnomaliesCard } from '../../components/AnomaliesCard';

const EMPTY_FORECAST: ForecastKpis = {
  forecasted_revenue_next_month: 0,
  forecasted_revenue_next_3_months: 0,
  cash_needed_for_restocks: 0,
  predicted_stockouts_count: 0,
  optimization_opportunities_count: 0,
};

function settled<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === 'fulfilled' ? result.value : fallback;
}

export default function PredictionsPage() {
  const { t } = useTranslation();

  const [forecast, setForecast] = useState<ForecastKpis>(EMPTY_FORECAST);
  const [demand, setDemand] = useState<DemandForecast[]>([]);
  const [restocks, setRestocks] = useState<UrgentRestock[]>([]);
  const [classifications, setClassifications] = useState<ProductClassification[]>([]);
  const [supplierScores, setSupplierScores] = useState<SupplierScore[]>([]);
  const [priceSuggestions, setPriceSuggestions] = useState<PriceSuggestion[]>([]);
  const [priceAnomalies, setPriceAnomalies] = useState<PriceAnomaly[]>([]);
  const [salesAnomalies, setSalesAnomalies] = useState<SalesAnomaly[]>([]);

  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        forecastR,
        demandR,
        restocksR,
        classificationsR,
        supplierScoresR,
        priceSuggestionsR,
        priceAnomaliesR,
        salesAnomaliesR,
      ] = await Promise.allSettled([
        globalKpisService.getForecast(),
        aiPredictionsService.getForecasts(),
        aiPredictionsService.getUrgentRestocks(),
        aiPredictionsService.getClassifications(),
        aiPredictionsService.getSupplierScores(),
        aiPredictionsService.getPriceSuggestions(),
        aiPredictionsService.getPriceAnomalies(true),
        aiPredictionsService.getSalesAnomalies(true),
      ]);

      // Une prédiction indisponible (modèle non encore entraîné) ne doit pas
      // faire échouer toute la page : on retombe sur des données vides.
      if (
        [
          forecastR,
          demandR,
          restocksR,
          classificationsR,
          supplierScoresR,
          priceSuggestionsR,
          priceAnomaliesR,
          salesAnomaliesR,
        ].every((r) => r.status === 'rejected')
      ) {
        throw new Error('all-rejected');
      }

      setForecast(settled(forecastR, EMPTY_FORECAST));
      setDemand(settled(demandR, []));
      setRestocks(settled(restocksR, []));
      setClassifications(settled(classificationsR, []));
      setSupplierScores(settled(supplierScoresR, []));
      setPriceSuggestions(settled(priceSuggestionsR, []));
      setPriceAnomalies(settled(priceAnomaliesR, []));
      setSalesAnomalies(settled(salesAnomaliesR, []));
    } catch {
      setError(t('predictions.load_error', 'Impossible de charger les prédictions.'));
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const title = t('predictions.title', 'Prédictions IA');
  const subtitle = t('predictions.subtitle', 'Prévisions de CA, de demande et recommandations du moteur IA');

  const headerActions = (
    <button
      onClick={loadData}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border rounded-lg text-muted-foreground bg-card border-border hover:bg-muted"
    >
      <RefreshCw className="w-4 h-4" />
      {t('common.refresh', 'Actualiser')}
    </button>
  );

  if (loading && !loaded) {
    return (
      <PageLayout title={title} subtitle={subtitle}>
        <div className="flex items-center justify-center py-24">
          <div className="text-center text-muted-foreground">
            <Loader2 className="w-6 h-6 mx-auto mb-3 text-primary animate-spin" />
            <div className="text-sm font-medium">{t('predictions.loading', 'Chargement des prédictions…')}</div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={title}>
        <div className="flex items-center justify-center py-16">
          <div className="max-w-md p-6 text-center border rounded-lg bg-card border-rose-500/30">
            <AlertTriangle className="w-8 h-8 mx-auto mb-3 text-rose-500" />
            <h2 className="mb-1 text-base font-semibold">{t('predictions.error_title', 'Erreur')}</h2>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 mx-auto mt-4 text-sm font-medium rounded-lg text-primary-foreground bg-primary hover:bg-primary/90"
            >
              <RefreshCw size={14} />
              {t('predictions.retry', 'Réessayer')}
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={title} subtitle={subtitle} actions={headerActions}>
      {/* CA prévisionnel & indicateurs globaux */}
      <ForecastKpiBand forecast={forecast} />

      {/* Demande prévue & classification */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DemandForecastChart forecasts={demand} />
        <ClassificationMatrix classifications={classifications} />
      </div>

      {/* Fournisseurs & réappros prioritaires */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SupplierScoresChart scores={supplierScores} />
        <UrgentRestocksCard restocks={restocks} />
      </div>

      {/* Suggestions de prix & anomalies */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PriceSuggestionsCard suggestions={priceSuggestions} />
        <AnomaliesCard priceAnomalies={priceAnomalies} salesAnomalies={salesAnomalies} />
      </div>
    </PageLayout>
  );
}
