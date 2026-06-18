/**
 * Palette centralisée des graphiques (recharts) pour le thème « Terminal ».
 * recharts ne lit pas les tokens CSS → on expose ici les couleurs en dur,
 * alignées sur la palette navy/emerald de src/ui/styles/index.css.
 */
export const CHART = {
  accent: "#818cf8", // indigo-400 — série principale
  accentSoft: "#6366f1", // indigo-500
  cyan: "#22d3ee", // série secondaire
  bar: "#475569", // slate-600 — barres neutres
  barAlt: "#64748b", // slate-500
  grid: "#1b2640", // lignes de grille (= --border)
  axis: "#64748b", // texte des axes (slate-500)
  positive: "#34d399",
  negative: "#fb7185", // rose-400
  warning: "#fbbf24", // amber-400
} as const;

/** Style commun des tooltips recharts (fond sombre). */
export const CHART_TOOLTIP_STYLE = {
  borderRadius: 6,
  border: `1px solid ${CHART.grid}`,
  background: "#0d1424",
  color: "#f1f5f9",
  fontSize: 12,
} as const;

/** Palette ordonnée pour les camemberts / séries multiples. */
export const CHART_SERIES = [CHART.accent, CHART.cyan, CHART.bar, CHART.warning, CHART.accentSoft] as const;
