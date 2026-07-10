/**
 * Les messages d'alerte sont écrits en anglais par le service Python et stockés
 * tels quels en base (`notifications.message` / `action_recommended`). Ils suivent
 * un petit nombre de gabarits fixes : on les retraduit à l'affichage plutôt que
 * de réécrire l'historique.
 *
 * Toute chaîne qui ne correspond à aucun gabarit est renvoyée inchangée.
 */

const RULES: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  // demand_forecast_handler
  [
    /^Stock will run out in ~(\d+) days?\.\s*Recommend ordering (\d+) units?\.?$/i,
    (m) => `Rupture prévue dans ~${m[1]} jours. Commander ${m[2]} unités.`,
  ],
  [
    /^Order (\d+) units? immediately$/i,
    (m) => `Commander ${m[1]} unités immédiatement`,
  ],

  // price_suggestion_handler
  [
    /^Suggested price ([\d.]+) \(current: ([\d.]+), confidence: (\d+)%\)$/i,
    (m) => `Prix suggéré ${m[1]} € (actuel : ${m[2]} €, confiance : ${m[3]} %)`,
  ],
  [
    /^Current price is optimal$/i,
    () => `Le prix actuel est optimal`,
  ],
  [
    /^Consider increasing price by ([\d.]+)% based on market trends$/i,
    (m) => `Envisager d'augmenter le prix de ${m[1]} % selon les tendances du marché`,
  ],
  [
    /^Consider decreasing price by ([\d.]+)% to improve competitiveness$/i,
    (m) => `Envisager de baisser le prix de ${m[1]} % pour rester compétitif`,
  ],

  // price_anomaly_handler
  [
    /^Price anomaly detected: current ([\d.]+), expected ([\d.]+) \(score: ([\d.-]+)\)$/i,
    (m) => `Anomalie de prix : actuel ${m[1]} €, attendu ${m[2]} € (score : ${m[3]})`,
  ],
  [
    /^Investigate unusual price change immediately$/i,
    () => `Vérifier immédiatement ce changement de prix inhabituel`,
  ],

  // sales_anomaly_handler
  [
    /^Sales anomaly detected: volume ([\d.]+), expected ([\d.]+) \(score: ([\d.-]+)\)$/i,
    (m) => `Anomalie de ventes : volume ${m[1]}, attendu ${m[2]} (score : ${m[3]})`,
  ],
  [
    /^Review sales patterns for this product$/i,
    () => `Analyser les tendances de vente de ce produit`,
  ],

  // classification_handler
  [
    /^Product classification changed from (\S+) to (\S+)$/i,
    (m) => `Classification passée de ${m[1]} à ${m[2]}`,
  ],
  [
    /^Review inventory strategy: (.+)$/i,
    (m) => `Revoir la stratégie de stock : ${m[1]}`,
  ],
];

export function translateAlertMessage(text: string | null | undefined): string {
  if (!text) return "";
  const trimmed = text.trim();
  for (const [pattern, format] of RULES) {
    const match = trimmed.match(pattern);
    if (match) return format(match);
  }
  return text;
}
