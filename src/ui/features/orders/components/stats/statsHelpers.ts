import type { Order } from '@/domain/models/Order';

// ----------------------------------------------------------------------------
// Recharts
// ----------------------------------------------------------------------------

/** Props minimales d'un tooltip recharts custom (évite `any`). */
export interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: { value: number; dataKey?: string | number; name?: string }[];
}

// ----------------------------------------------------------------------------
// Période
// ----------------------------------------------------------------------------

export type PeriodPresetId = '7d' | '30d' | '90d' | '12m' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

/** Construit une plage [start 00:00 ; end 23:59:59] à partir d'un preset. */
export function presetRange(preset: Exclude<PeriodPresetId, 'custom'>): DateRange {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date(end);
  switch (preset) {
    case '7d':
      start.setDate(end.getDate() - 6);
      break;
    case '30d':
      start.setDate(end.getDate() - 29);
      break;
    case '90d':
      start.setDate(end.getDate() - 89);
      break;
    case '12m':
      start.setMonth(end.getMonth() - 12);
      break;
  }
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

/** Format "YYYY-MM-DD" pour les endpoints back. */
export function toApiDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function rangeSpanDays(range: DateRange): number {
  return Math.round((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24));
}

/** Filtre les commandes dont order_date tombe dans la plage. */
export function filterOrders(orders: Order[], range: DateRange): Order[] {
  const s = range.start.getTime();
  const e = range.end.getTime();
  return orders.filter((o) => {
    const t = new Date(o.order_date).getTime();
    return t >= s && t <= e;
  });
}

/** Plage précédente de même durée, accolée juste avant la plage courante. */
export function previousRange(range: DateRange): DateRange {
  const span = range.end.getTime() - range.start.getTime();
  return {
    start: new Date(range.start.getTime() - span),
    end: new Date(range.start.getTime() - 1),
  };
}

// ----------------------------------------------------------------------------
// Grain temporel & buckets
// ----------------------------------------------------------------------------

export type TimeGrain = 'day' | 'week' | 'month';

/** Grain adaptatif selon l'étendue de la période. */
export function adaptiveGrain(range: DateRange): TimeGrain {
  const days = rangeSpanDays(range);
  if (days <= 31) return 'day';
  if (days <= 120) return 'week';
  return 'month';
}

export interface TimeBucket {
  key: string;
  label: string;
  start: number;
  end: number;
}

const startOfWeek = (d: Date): Date => {
  const r = new Date(d);
  const day = (r.getDay() + 6) % 7; // lundi = 0
  r.setDate(r.getDate() - day);
  r.setHours(0, 0, 0, 0);
  return r;
};

/** Génère les buckets temporels couvrant la plage selon le grain. */
export function buildBuckets(range: DateRange, grain: TimeGrain): TimeBucket[] {
  const buckets: TimeBucket[] = [];
  const cursor = new Date(range.start);

  if (grain === 'day') {
    cursor.setHours(0, 0, 0, 0);
    while (cursor.getTime() <= range.end.getTime()) {
      const start = new Date(cursor);
      const end = new Date(cursor);
      end.setHours(23, 59, 59, 999);
      buckets.push({
        key: toApiDate(start),
        label: start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        start: start.getTime(),
        end: end.getTime(),
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  } else if (grain === 'week') {
    let w = startOfWeek(range.start);
    while (w.getTime() <= range.end.getTime()) {
      const start = new Date(w);
      const end = new Date(w);
      end.setDate(end.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      buckets.push({
        key: toApiDate(start),
        label: start.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
        start: start.getTime(),
        end: end.getTime(),
      });
      w = new Date(end.getTime() + 1);
    }
  } else {
    let m = new Date(range.start.getFullYear(), range.start.getMonth(), 1);
    while (m.getTime() <= range.end.getTime()) {
      const start = new Date(m);
      const end = new Date(m.getFullYear(), m.getMonth() + 1, 0, 23, 59, 59, 999);
      buckets.push({
        key: `${start.getFullYear()}-${start.getMonth() + 1}`,
        label: start.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
        start: start.getTime(),
        end: end.getTime(),
      });
      m = new Date(m.getFullYear(), m.getMonth() + 1, 1);
    }
  }

  return buckets;
}

/** Répartit les commandes dans les buckets fournis. */
export function bucketize(orders: Order[], buckets: TimeBucket[]): Order[][] {
  const slices: Order[][] = buckets.map(() => []);
  orders.forEach((o) => {
    const t = new Date(o.order_date).getTime();
    const idx = buckets.findIndex((b) => t >= b.start && t <= b.end);
    if (idx >= 0) slices[idx].push(o);
  });
  return slices;
}

// ----------------------------------------------------------------------------
// Statuts
// ----------------------------------------------------------------------------

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Couleur de marque par statut (variables CSS du thème). */
export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: 'var(--color-success)',
  cancelled: 'var(--color-error)',
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
};

export const normalizeStatus = (s: string): OrderStatus | null => {
  const v = s.toLowerCase() as OrderStatus;
  return (ORDER_STATUSES as readonly string[]).includes(v) ? v : null;
};

// ----------------------------------------------------------------------------
// Montants & formatage
// ----------------------------------------------------------------------------

/** Montant net robuste (le back sérialise Decimal en string). */
export const amountOf = (o: Order): number => Number(o.amount) || 0;
export const discountOf = (o: Order): number => Number(o.discount_amount) || 0;

export const sumAmount = (orders: Order[]): number =>
  orders.reduce((s, o) => s + amountOf(o), 0);

export const formatCurrency = (v: number, max = 0): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: max,
  }).format(v);

export const formatCompactEUR = (v: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(v);

export const formatNumber = (v: number): string => new Intl.NumberFormat('fr-FR').format(v);

export const formatPct = (v: number, withSign = true): string => {
  const sign = withSign && v >= 0 ? '+' : '';
  return `${sign}${v.toFixed(1)}%`;
};

/** Évolution en % entre deux valeurs. */
export const evolution = (curr: number, prev: number): number => {
  if (prev === 0) return curr === 0 ? 0 : 100;
  return ((curr - prev) / prev) * 100;
};
