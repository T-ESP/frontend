import { useMemo } from 'react';
import type { ProductClassification } from '@/domain/models/AiPredictions';
import { PredictionCard, PredictionEmpty } from './PredictionCard';

interface ClassificationMatrixProps {
  classifications: ProductClassification[];
}

const ABC = ['A', 'B', 'C'] as const;
const XYZ = ['X', 'Y', 'Z'] as const;

const ABC_HINT: Record<string, string> = {
  A: 'Fort CA',
  B: 'CA moyen',
  C: 'Faible CA',
};
const XYZ_HINT: Record<string, string> = {
  X: 'Demande stable',
  Y: 'Demande variable',
  Z: 'Demande erratique',
};

/**
 * Matrice ABC × XYZ : croise la contribution au CA (A/B/C) avec la
 * régularité de la demande (X/Y/Z). L'intensité reflète le nombre de produits.
 */
export function ClassificationMatrix({ classifications }: ClassificationMatrixProps) {
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
      title="Classification ABC / XYZ"
      subtitle={`Répartition de ${total} produits par valeur et régularité de la demande`}
    >
      {total === 0 ? (
        <PredictionEmpty message="Aucune classification disponible" />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-[auto_repeat(3,1fr)] gap-1.5">
            <div />
            {XYZ.map((x) => (
              <div key={x} className="text-center">
                <div className="text-sm font-semibold text-foreground">{x}</div>
                <div className="text-[11px] text-muted-foreground">{XYZ_HINT[x]}</div>
              </div>
            ))}
            {ABC.map((a) => (
              <div key={a} className="contents">
                <div className="flex flex-col justify-center pr-2 text-right">
                  <div className="text-sm font-semibold text-foreground">{a}</div>
                  <div className="text-[11px] text-muted-foreground">{ABC_HINT[a]}</div>
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
            Lignes : contribution au chiffre d'affaires · Colonnes : prévisibilité de la demande.
            Les produits <span className="font-medium text-foreground">AX</span> sont prioritaires
            (fort CA, demande stable).
          </p>
        </div>
      )}
    </PredictionCard>
  );
}
