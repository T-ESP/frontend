import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProductClassification } from '@/domain/models/AiPredictions';
import { PredictionCard, PredictionEmpty } from './PredictionCard';

interface ClassificationMatrixProps {
  classifications: ProductClassification[];
}

const ABC = ['A', 'B', 'C'] as const;
const XYZ = ['X', 'Y', 'Z'] as const;

/**
 * Matrice ABC × XYZ : croise la contribution au CA (A/B/C) avec la
 * régularité de la demande (X/Y/Z). L'intensité reflète le nombre de produits.
 */
export function ClassificationMatrix({ classifications }: ClassificationMatrixProps) {
  const { t } = useTranslation();
  const { grid, max, total } = useMemo(() => {
    const g: Record<string, number> = {};
    for (const c of classifications) {
      const key = `${c.abc_class}${c.xyz_class}`;
      g[key] = (g[key] ?? 0) + 1;
    }
    const m = Math.max(1, ...Object.values(g));
    return { grid: g, max: m, total: classifications.length };
  }, [classifications]);

  return (
    <PredictionCard
      title={t('predictions.classification.title')}
      subtitle={t('predictions.classification.subtitle', { n: total })}
    >
      {total === 0 ? (
        <PredictionEmpty message={t('predictions.classification.empty')} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-1.5">
            <div />
            {XYZ.map((x) => (
              <div key={x} className="text-center">
                <div className="text-sm font-semibold text-foreground">{x}</div>
                <div className="text-[11px] text-muted-foreground">{t(`predictions.classification.xyz.${x}`)}</div>
              </div>
            ))}
            {ABC.map((a) => (
              <div key={a} className="contents">
                <div className="flex flex-col justify-center pr-2 text-right">
                  <div className="text-sm font-semibold text-foreground">{a}</div>
                  <div className="text-[11px] text-muted-foreground">{t(`predictions.classification.abc.${a}`)}</div>
                </div>
                {XYZ.map((x) => {
                  const count = grid[`${a}${x}`] ?? 0;
                  const intensity = count / max;
                  return (
                    <div
                      key={x}
                      className="flex items-center justify-center rounded-md aspect-square min-h-14 text-sm font-semibold tabular-nums transition-colors"
                      style={{
                        backgroundColor: `hsl(var(--brand-h) var(--brand-s) var(--brand-l) / ${0.08 + intensity * 0.72})`,
                        color: intensity > 0.45 ? '#f8fafc' : 'var(--color-foreground)',
                      }}
                      title={`${a}${x} — ${count} produit(s)`}
                    >
                      {count}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t('predictions.classification.footer')}
          </p>
        </div>
      )}
    </PredictionCard>
  );
}
