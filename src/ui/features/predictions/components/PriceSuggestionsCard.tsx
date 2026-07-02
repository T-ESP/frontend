import { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { PriceSuggestion } from '@/domain/models/AiPredictions';
import { PredictionCard, PredictionEmpty } from './PredictionCard';
import { formatCurrency, toNumber } from './predictionsHelpers';

interface PriceSuggestionsCardProps {
  suggestions: PriceSuggestion[];
}

/** Suggestions d'ajustement tarifaire issues du modèle de pricing. */
export function PriceSuggestionsCard({ suggestions }: PriceSuggestionsCardProps) {
  const rows = useMemo(
    () =>
      [...suggestions]
        .map((s) => {
          const current = toNumber(s.current_price);
          const suggested = toNumber(s.suggested_price);
          const deltaPct = current > 0 ? ((suggested - current) / current) * 100 : 0;
          return { ...s, current, suggested, deltaPct };
        })
        .sort((a, b) => Math.abs(b.deltaPct) - Math.abs(a.deltaPct))
        .slice(0, 8),
    [suggestions],
  );

  return (
    <PredictionCard
      title="Suggestions de prix"
      subtitle="Ajustements tarifaires recommandés par l'IA"
    >
      {rows.length === 0 ? (
        <PredictionEmpty message="Aucune suggestion de prix" />
      ) : (
        <div className="space-y-2">
          {rows.map((s) => {
            const up = s.deltaPct >= 0;
            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-3 py-2 border-b border-border/60 last:border-0"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate text-foreground">{s.product_name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{s.reason}</div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-semibold tabular-nums text-foreground">
                      {formatCurrency(s.current)} → {formatCurrency(s.suggested)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Confiance {Math.round(toNumber(s.confidence) <= 1 ? toNumber(s.confidence) * 100 : toNumber(s.confidence))}%
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums ${
                      up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {up ? '+' : ''}
                    {s.deltaPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PredictionCard>
  );
}
