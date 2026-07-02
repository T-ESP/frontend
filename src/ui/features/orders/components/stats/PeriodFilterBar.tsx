import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DateRange, PeriodPresetId } from './statsHelpers';
import { presetRange, toApiDate } from './statsHelpers';

interface PeriodFilterBarProps {
  preset: PeriodPresetId;
  range: DateRange;
  onChange: (preset: PeriodPresetId, range: DateRange) => void;
}

const PRESET_IDS: Exclude<PeriodPresetId, 'custom'>[] = ['7d', '30d', '90d', '12m'];

/** Barre de filtre de période : presets + plage personnalisée. Pilote toute la page. */
export function PeriodFilterBar({ preset, range, onChange }: PeriodFilterBarProps) {
  const { t } = useTranslation();
  const setCustomBound = (which: 'start' | 'end', value: string) => {
    if (!value) return;
    const next: DateRange = { ...range };
    const d = new Date(value);
    if (which === 'start') {
      d.setHours(0, 0, 0, 0);
      next.start = d;
    } else {
      d.setHours(23, 59, 59, 999);
      next.end = d;
    }
    if (next.start.getTime() <= next.end.getTime()) {
      onChange('custom', next);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-3 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{t('orders.stats.period')}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {PRESET_IDS.map((id) => {
          const active = preset === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id, presetRange(id))}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {t(`orders.stats.presets.${id}`)}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <input
          type="date"
          value={toApiDate(range.start)}
          max={toApiDate(range.end)}
          onChange={(e) => setCustomBound('start', e.target.value)}
          className={`px-2.5 py-1.5 text-sm bg-background border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
            preset === 'custom' ? 'border-primary' : 'border-border'
          }`}
        />
        <span className="text-sm text-muted-foreground">→</span>
        <input
          type="date"
          value={toApiDate(range.end)}
          min={toApiDate(range.start)}
          onChange={(e) => setCustomBound('end', e.target.value)}
          className={`px-2.5 py-1.5 text-sm bg-background border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary ${
            preset === 'custom' ? 'border-primary' : 'border-border'
          }`}
        />
      </div>
    </div>
  );
}
