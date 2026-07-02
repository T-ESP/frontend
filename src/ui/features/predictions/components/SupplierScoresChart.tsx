import { useMemo } from 'react';
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
  { key: 'delivery_score', label: 'Livraison' },
  { key: 'quality_score', label: 'Qualité' },
  { key: 'lead_time_score', label: 'Délai' },
  { key: 'fulfillment_score', label: 'Exécution' },
] as const;

/** Comparaison radar des meilleurs fournisseurs sur leurs 4 dimensions de score. */
export function SupplierScoresChart({ scores }: SupplierScoresChartProps) {
  const { data, suppliers } = useMemo(() => {
    const top = [...scores]
      .sort((a, b) => toNumber(b.overall_score) - toNumber(a.overall_score))
      .slice(0, 5);

    const rows = DIMENSIONS.map((dim) => {
      const row: Record<string, string | number> = { dimension: dim.label };
      for (const s of top) {
        row[s.supplier_name] = toNumber(s[dim.key]);
      }
      return row;
    });

    return { data: rows, suppliers: top.map((s) => s.supplier_name) };
  }, [scores]);

  return (
    <PredictionCard
      title="Scores fournisseurs"
      subtitle="Top 5 fournisseurs · livraison, qualité, délai, exécution"
    >
      {suppliers.length === 0 ? (
        <PredictionEmpty message="Aucun score fournisseur disponible" />
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
