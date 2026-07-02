import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DemandForecast } from '@/domain/models/AiPredictions';
import { CHART, CHART_TOOLTIP_STYLE } from '@/ui/theme/chartTheme';
import { PredictionCard, PredictionEmpty } from './PredictionCard';
import { URGENCY_HEX, URGENCY_LABEL, formatNumber, toNumber } from './predictionsHelpers';

interface DemandForecastChartProps {
  forecasts: DemandForecast[];
}

interface DemandDatum {
  name: string;
  demand: number;
  urgency: string;
}

function DemandTip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DemandDatum }[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={CHART_TOOLTIP_STYLE} className="px-3 py-2">
      <p className="text-[12px] font-semibold" style={{ color: '#f1f5f9' }}>{d.name}</p>
      <p className="text-[11px]" style={{ color: '#cbd5e1' }}>
        Demande prévue : {formatNumber(d.demand)} u.
      </p>
      <p className="text-[11px]" style={{ color: '#cbd5e1' }}>
        Urgence : {URGENCY_LABEL[d.urgency as keyof typeof URGENCY_LABEL] ?? d.urgency}
      </p>
    </div>
  );
}

/** Top produits par demande prévue sur l'horizon, colorés par niveau d'urgence. */
export function DemandForecastChart({ forecasts }: DemandForecastChartProps) {
  const data = useMemo(
    () =>
      [...forecasts]
        .map((f) => ({
          name: f.product_name,
          demand: toNumber(f.total_predicted_demand),
          urgency: f.urgency,
        }))
        .sort((a, b) => b.demand - a.demand)
        .slice(0, 12),
    [forecasts],
  );

  return (
    <PredictionCard
      title="Prévisions de demande"
      subtitle="Top 12 produits par demande prévue (modèle Prophet)"
    >
      {data.length === 0 ? (
        <PredictionEmpty message="Aucune prévision de demande disponible" />
      ) : (
        <div style={{ height: Math.max(280, data.length * 34) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
            >
              <XAxis
                type="number"
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={140}
                tick={{ fill: CHART.axis, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} content={<DemandTip />} />
              <Bar dataKey="demand" radius={[0, 4, 4, 0]}>
                {data.map((d, i) => (
                  <Cell key={i} fill={URGENCY_HEX[d.urgency] ?? CHART.accent} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </PredictionCard>
  );
}
