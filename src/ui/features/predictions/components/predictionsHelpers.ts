import type { ForecastUrgency } from '@/domain/models/AiPredictions';

/** Format monétaire €, aligné sur le reste de l'app. */
export const formatCurrency = (v: string | number | null | undefined) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number(v ?? 0));

/** Format monétaire compact (ex. 12,3 k€) pour les axes de graphiques. */
export const formatCompactEUR = (v: number) =>
  new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 1,
  }).format(v);

export const formatNumber = (v: string | number | null | undefined) =>
  new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(Number(v ?? 0));

export const toNumber = (v: string | number | null | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/** Couleur associée au niveau d'urgence d'une prévision de réappro. */
export const URGENCY_HEX: Record<ForecastUrgency, string> = {
  URGENT: '#fb7185', // rose-400
  HIGH: '#fb923c', // orange-400
  MEDIUM: '#fbbf24', // amber-400
  LOW: '#818cf8', // indigo-400
};

export const URGENCY_LABEL: Record<ForecastUrgency, string> = {
  URGENT: 'Urgent',
  HIGH: 'Élevée',
  MEDIUM: 'Moyenne',
  LOW: 'Faible',
};

export const URGENCY_BADGE: Record<ForecastUrgency, string> = {
  URGENT: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
  HIGH: 'bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
  MEDIUM: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
  LOW: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
};

/** Ordre de tri : le plus urgent en premier. */
export const URGENCY_RANK: Record<ForecastUrgency, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};
