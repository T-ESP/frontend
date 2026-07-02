import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { SupplierScore } from '@/domain/models/AiPredictions';
import { CHART, CHART_SERIES, CHART_TOOLTIP_STYLE } from '@/ui/theme/chartTheme';
import { PredictionCard, PredictionEmpty } from './PredictionCard';
import { toNumber } from './predictionsHelpers';

interface SupplierScoresChartProps {
  scores: SupplierScore[];
}

const DIMENSIONS = [
  { key: 'delivery_score', labelKey: 'predictions.suppliers.delivery' },
  { key: 'quality_score', labelKey: 'predictions.suppliers.quality' },
  { key: 'lead_time_score', labelKey: 'predictions.suppliers.lead_time' },
  { key: 'fulfillment_score', labelKey: 'predictions.suppliers.fulfillment' },
] as const;

/** Comparaison radar des meilleurs fournisseurs sur leurs 4 dimensions de score. */
export function SupplierScoresChart({ scores }: SupplierScoresChartProps) {
  const { t } = useTranslation();
  const { data, suppliers } = useMemo(() => {
    const top = [...scores]
      .sort((a, b) => toNumber(b.overall_score) - toNumber(a.overall_score))
      .slice(0, 5);

    const rows = DIMENSIONS.map((dim) => {
      const row: Record<string, string | number> = { dimension: t(dim.labelKey) };
      for (const s of top) {
        row[s.supplier_name] = toNumber(s[dim.key]);
      }
      return row;
    });

    return { data: rows, suppliers: top.map((s) => s.supplier_name) };
  }, [scores, t]);

  return (
    <PredictionCard
      title={t('predictions.suppliers.title')}
      subtitle={t('predictions.suppliers.subtitle')}
    >
      {suppliers.length === 0 ? (
        <PredictionEmpty message={t('predictions.suppliers.empty')} />
      ) : (
        <div style={{ height: 340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} outerRadius="70%">
              <PolarGrid stroke={CHART.grid} />
              <PolarAngleAxis dataKey="dimension" tick={{ fill: CHART.axis, fontSize: 12 }} />
              {suppliers.map((name, i) => (
                <Radar
                  key={name}
                  name={name}
                  dataKey={name}
                  stroke={CHART_SERIES[i % CHART_SERIES.length]}
                  fill={CHART_SERIES[i % CHART_SERIES.length]}
                  fillOpacity={0.12}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </PredictionCard>
  );
}
