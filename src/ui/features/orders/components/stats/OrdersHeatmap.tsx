import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Order } from '@/domain/models/Order';
import { StatsCard, StatsEmpty } from './StatsCard';

interface OrdersHeatmapProps {
  orders: Order[];
}

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const SLOTS = [
  { label: '0–4h', from: 0 },
  { label: '4–8h', from: 4 },
  { label: '8–12h', from: 8 },
  { label: '12–16h', from: 12 },
  { label: '16–20h', from: 16 },
  { label: '20–24h', from: 20 },
];

/** Heatmap jour de semaine × créneau horaire : repère les pics de commande. */
export function OrdersHeatmap({ orders }: OrdersHeatmapProps) {
  const { t } = useTranslation();
  const { grid, max, peak } = useMemo(() => {
    const g: number[][] = WEEKDAY_KEYS.map(() => SLOTS.map(() => 0));
    orders.forEach((o) => {
      const d = new Date(o.order_date);
      const wd = (d.getDay() + 6) % 7; // lundi = 0
      const slot = Math.min(SLOTS.length - 1, Math.floor(d.getHours() / 4));
      g[wd][slot] += 1;
    });
    let mx = 0;
    let pk = { wd: -1, slot: -1, n: 0 };
    g.forEach((row, wi) =>
      row.forEach((n, si) => {
        if (n > mx) mx = n;
        if (n > pk.n) pk = { wd: wi, slot: si, n };
      }),
    );
    return { grid: g, max: mx, peak: pk };
  }, [orders]);

  const cellColor = (n: number) => {
    if (n === 0) return 'var(--muted)';
    const ratio = max > 0 ? n / max : 0;
    // Opacité croissante sur la couleur de marque.
    return `color-mix(in srgb, var(--primary) ${Math.round(15 + ratio * 85)}%, transparent)`;
  };

  const peakLabel =
    peak.wd >= 0 && peak.n > 0
      ? t('orders.stats.heatmap.peak', {
          day: t(`orders.stats.weekdays.${WEEKDAY_KEYS[peak.wd]}`),
          slot: SLOTS[peak.slot].label,
          n: peak.n,
        })
      : t('orders.stats.heatmap.fallback');

  return (
    <StatsCard title={t('orders.stats.heatmap.title')} subtitle={peakLabel}>
      {orders.length === 0 ? (
        <StatsEmpty message={t('orders.stats.heatmap.empty')} />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[420px]">
            <div className="grid" style={{ gridTemplateColumns: `42px repeat(${SLOTS.length}, 1fr)` }}>
              <div />
              {SLOTS.map((s) => (
                <div key={s.label} className="pb-2 text-[11px] text-center text-muted-foreground">
                  {s.label}
                </div>
              ))}
              {WEEKDAY_KEYS.map((wdKey, wi) => {
                const wd = t(`orders.stats.weekdays.${wdKey}`);
                return (
                  <FragmentRow key={wdKey} label={wd}>
                    {SLOTS.map((s, si) => (
                      <div key={si} className="p-0.5">
                        <div
                          className="flex items-center justify-center h-9 rounded-md text-[11px] font-medium tabular-nums text-foreground/80"
                          style={{ backgroundColor: cellColor(grid[wi][si]) }}
                          title={t('orders.stats.heatmap.cell', { day: wd, slot: s.label, n: grid[wi][si] })}
                        >
                          {grid[wi][si] || ''}
                        </div>
                      </div>
                    ))}
                  </FragmentRow>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </StatsCard>
  );
}

function FragmentRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div className="flex items-center pr-2 text-[11px] font-medium text-muted-foreground">{label}</div>
      {children}
    </>
  );
}
