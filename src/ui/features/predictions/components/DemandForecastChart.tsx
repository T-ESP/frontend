import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
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
import { URGENCY_HEX, formatNumber, toNumber } from './predictionsHelpers';

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
  t,
}: {
  active?: boolean;
  payload?: { payload: DemandDatum }[];
  t: TFunction;
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={CHART_TOOLTIP_STYLE} className="px-3 py-2">
      <p className="text-[12px] font-semibold" style={{ color: '#f1f5f9' }}>{d.name}</p>
      <p className="text-[11px]" style={{ color: '#cbd5e1' }}>
        {t('predictions.demand.tooltip_demand', { value: formatNumber(d.demand) })}
      </p>
      <p className="text-[11px]" style={{ color: '#cbd5e1' }}>
        {t('predictions.demand.tooltip_urgency', { label: t(`predictions.urgency.${d.urgency}`) })}
      </p>
    </div>
  );
}

/** Top produits par demande prévue sur l'horizon, colorés par niveau d'urgence. */
export function DemandForecastChart({ forecasts }: DemandForecastChartProps) {
  const { t } = useTranslation();
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
      title={t('predictions.demand.title')}
      subtitle={t('predictions.demand.subtitle')}
    >
      {data.length === 0 ? (
        <PredictionEmpty message={t('predictions.demand.empty')} />
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
              <Tooltip cursor={{ fill: 'rgba(148,163,184,0.08)' }} content={<DemandTip t={t} />} />
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
