import { useState } from 'react';
import { Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface InfoTipProps {
  /** What the KPI is for. */
  what: string;
  /** Best-practice advice (optional). */
  tip?: string;
  className?: string;
}

/**
 * Small (i) icon that reveals an explanatory popover on hover/focus.
 * Used next to KPI section titles to explain what the metrics mean
 * and the associated best practices.
 */
export function InfoTip({ what, tip, className = '' }: InfoTipProps) {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  return (
    <span className={`relative inline-flex items-center ml-2 align-middle ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="text-muted-foreground/60 hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-full"
        aria-label={t('inventory.kpi_modal.info.aria_label', 'Plus d’informations')}
      >
        <Info className="w-4 h-4" />
      </button>
      {show && (
        <span
          role="tooltip"
          className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 rounded-lg bg-gray-900 px-4 py-3 text-left text-xs font-normal leading-relaxed text-white shadow-xl pointer-events-none"
        >
          <span className="block text-white/90">{what}</span>
          {tip && (
            <span className="block mt-2 pt-2 border-t border-white/15">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                {t('inventory.kpi_modal.info.best_practice', 'Bonne pratique')} :{' '}
              </span>
              <span className="text-white/80">{tip}</span>
            </span>
          )}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
}

export default InfoTip;
