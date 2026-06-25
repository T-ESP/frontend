import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PackageX } from "lucide-react";

/* ============================================================
 * SECTION 4 — « Features 2 colonnes »
 * Deux cartes côte à côte (1 colonne empilée sur mobile) :
 *   · un étage VISUEL en haut (UI reconstruite en HTML, pas d'image)
 *   · puis TITRE blanc + SOUS-TITRE gris, centrés, en bas.
 * Même direction visuelle que le HERO : dark, glass, glow violet
 * subtil et diffus (jamais saturé).
 *
 * 🎨 TOKENS (mêmes valeurs que le HERO — ne pas saturer le glow) :
 *   - SECTION_BG : fond de section (= HERO_BG)
 *   - CARD_BG    : fond des cartes (légèrement + clair que le fond)
 *   - INNER_BG   : fond des encadrés internes (glass très léger)
 *   - GLOW       : violet du halo en RGB (#8b5cf6) — alpha appliqué plus bas
 *   - ACCENT     : violet d'accent (#a855f7) — spinner, détails
 *   - TEXT_2     : texte secondaire (gris clair)
 *
 * ✨ FONDUS & BORDURES
 *   - Carte        : TOUTE la carte se dissout vers le bas (CARD_FADE) —
 *                    fond + bordure + texte — comme le mockup du hero.
 *   - Bloc gauche  : DOUBLE trait décalé de ~6px, estompé VERS LE HAUT
 *                    (inverse), + léger fondu du texte en haut.
 *
 * ⚙️ RÉGLAGES RAPIDES :
 *   · intensité glow    → 1ʳᵉ valeur d'alpha dans CARD_GLOW (0.30, = hero)
 *   · diffusion glow    → blur-[...] de la div glow
 *   · pourcentages      → tableau ANALYSIS
 *   · cadence du feed   → STEP_MS (une ligne ajoutée toutes les STEP_MS)
 *   · décalage bordures → inset du 2ᵉ <GradientBorder/> (6 px)
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)"; // = HERO_BG
const CARD_BG = "var(--lp-card)"; // = fond du mockup hero (légèrement + clair)
const INNER_BG = "rgba(var(--lp-glass))"; // encadrés internes (glass léger)
const GLOW = "var(--lp-glow)"; // = HERO_GLOW (#8b5cf6)
const ACCENT = "var(--lp-accent)"; // = HERO_ACCENT
const TEXT_2 = "var(--lp-text-2)"; // = HERO_TEXT_2

/* Glow violet de la carte de droite : MÊMES alphas que le hero (0.30 → 0.10
 * → transparent) pour rester subtil et diffus. */
const CARD_GLOW = `radial-gradient(circle, rgba(${GLOW}, 0.30) 0%, rgba(${GLOW}, 0.10) 45%, transparent 75%)`;

/* Dégradés de bordure (alpha des lignes blanches le long du trait).
 *   FADE_DOWN → fort en haut, quasi nul en bas.
 *   FADE_UP   → quasi nul en haut, fort en bas. */
const BORDER_FADE_DOWN =
  "linear-gradient(to bottom, rgba(var(--lp-grid),0.14) 0%, rgba(var(--lp-grid),0.08) 35%, rgba(var(--lp-grid),0.01) 100%)";
const BORDER_FADE_UP =
  "linear-gradient(to bottom, rgba(var(--lp-grid),0.01) 0%, rgba(var(--lp-grid),0.08) 60%, rgba(var(--lp-grid),0.16) 100%)";

/* Fondus (masks). Le texte du bloc gauche s'éteint un peu en haut ;
 * la fenêtre cyclique s'estompe en haut ET en bas. */
const BOX_TEXT_FADE = "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, #000 16%)";
const WINDOW_FADE = "linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)";

/* Fondu de TOUTE la carte : même profil que sa bordure (BORDER_FADE_DOWN) →
 * pleine en haut, quasi dissoute en bas (fond + bordure + texte). Pour garder
 * le bas plus lisible, remonter les stops / l'alpha final (0.1). */
const CARD_FADE = "linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.1) 100%)";

/* Cadence du feed : une nouvelle ligne s'ajoute en haut toutes les STEP_MS,
 * poussant les autres d'un cran vers le bas. */
const ROW_H = 40; // hauteur d'une ligne en px (= h-10)
const VISIBLE = 4; // lignes visibles dans la fenêtre
const STEP_MS = 1000; // intervalle d'ajout (1 ligne / seconde)

/* Lignes du process d'analyse (carte gauche). On boucle dessus en continu :
 * une ligne s'ajoute en haut toutes les secondes (cf. <AnalysisFeed/>). */
const ANALYSIS = [
  { label: "Lecture de l'historique de ventes", value: 100 },
  { label: "Détection des tendances", value: 96 },
  { label: "Repérage des produits saisonniers", value: 88 },
  { label: "Calcul des prévisions", value: 81 },
  { label: "Analyse des pics de demande", value: 74 },
  { label: "Estimation des délais fournisseurs", value: 69 },
  { label: "Optimisation des quantités à commander", value: 63 },
  { label: "Détection des risques de rupture", value: 57 },
] as const;

/* Produits en alerte (carte droite). `tone` pilote la couleur douce du badge.
 * On en a plus que de visibles : le feed en fait défiler un nouveau à intervalle
 * régulier (cf. <AlertsFeed/>) pour simuler une surveillance en direct. */
const PRODUCTS = [
  { name: "Lait demi-écrémé 1L", badge: "Rupture dans 2 jours", tone: "amber" },
  { name: "Café moulu 250g", badge: "Stock faible", tone: "violet" },
  { name: "Yaourt nature x4", badge: "Rupture dans 3 jours", tone: "amber" },
  { name: "Pâtes penne 500g", badge: "Stock faible", tone: "violet" },
  { name: "Jus d'orange 1L", badge: "Rupture dans 4 jours", tone: "amber" },
  { name: "Beurre doux 250g", badge: "Stock faible", tone: "violet" },
  { name: "Eau minérale 6×1,5L", badge: "Rupture dans 1 jour", tone: "amber" },
] as const;

/* Cadence du feed d'alertes (carte droite) : plus lent que le process gauche,
 * une alerte « monte » toutes les ALERT_STEP_MS. */
const ALERT_ROW_H = 44; // hauteur d'un slot d'alerte en px (pastille + espace)
const ALERT_VISIBLE = 3; // alertes visibles dans la fenêtre
const ALERT_STEP_MS = 2500; // intervalle d'ajout d'une nouvelle alerte

/* Badges calmes (pas de rouge agressif) : violet / ambré doux. */
const BADGE_TONE = {
  amber: "border-amber-400/20 bg-amber-400/10 text-amber-600 dark:text-amber-300",
  violet: "border-violet-400/20 bg-violet-400/10 text-violet-600 dark:text-violet-300",
} as const;

/* --- Feed « analyse » : une ligne s'ajoute en haut chaque seconde --------
 * On garde VISIBLE+1 lignes montées (la dernière sort par le bas dans le
 * fondu). À chaque tick, on préfixe la ligne suivante du cycle ANALYSIS :
 * framer anime la descente des lignes existantes (layout) et l'apparition
 * de la nouvelle (fade). Désactivé si l'utilisateur réduit les animations. */
function AnalysisFeed() {
  const reduce = useReducedMotion();
  // File initiale : les VISIBLE premières lignes, déjà en place.
  const [rows, setRows] = useState(() =>
    Array.from({ length: VISIBLE }, (_, i) => ({ id: i, ...ANALYSIS[i % ANALYSIS.length] })),
  );

  useEffect(() => {
    if (reduce) return; // animations réduites → liste figée
    let next = VISIBLE; // prochain index source ET prochain id (unique)
    const timer = setInterval(() => {
      setRows((prev) => {
        const row = { id: next, ...ANALYSIS[next % ANALYSIS.length] };
        next += 1;
        return [row, ...prev].slice(0, VISIBLE + 1); // garde 1 ligne sortante
      });
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [reduce]);

  return (
    <div
      className="relative mt-4 overflow-hidden"
      style={{ height: ROW_H * VISIBLE, maskImage: WINDOW_FADE, WebkitMaskImage: WINDOW_FADE }}
    >
      <AnimatePresence initial={false}>
        {rows.map((row) => (
          <motion.div
            key={row.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-10 items-center justify-between gap-3 text-[13px]"
          >
            <span className="truncate" style={{ color: TEXT_2 }}>
              {row.label}
            </span>
            <span className="font-mono tabular-nums text-[var(--lp-text)]">{row.value}%</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* --- Feed « alertes » : une alerte monte périodiquement -------------------
 * Même principe que <AnalysisFeed/> mais plus lent (ALERT_STEP_MS) : une
 * nouvelle alerte produit s'insère en haut, les autres descendent, la plus
 * ancienne sort par le bas dans le fondu. Figé si animations réduites. */
function AlertsFeed() {
  const reduce = useReducedMotion();
  const [rows, setRows] = useState(() =>
    Array.from({ length: ALERT_VISIBLE }, (_, i) => ({ id: i, ...PRODUCTS[i % PRODUCTS.length] })),
  );

  useEffect(() => {
    if (reduce) return;
    let next = ALERT_VISIBLE;
    const timer = setInterval(() => {
      setRows((prev) => {
        const row = { id: next, ...PRODUCTS[next % PRODUCTS.length] };
        next += 1;
        return [row, ...prev].slice(0, ALERT_VISIBLE + 1); // garde 1 alerte sortante
      });
    }, ALERT_STEP_MS);
    return () => clearInterval(timer);
  }, [reduce]);

  return (
    <div
      className="relative mt-4 overflow-hidden"
      style={{ height: ALERT_ROW_H * ALERT_VISIBLE, maskImage: WINDOW_FADE, WebkitMaskImage: WINDOW_FADE }}
    >
      <AnimatePresence initial={false}>
        {rows.map((row) => (
          <motion.div
            key={row.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: ALERT_ROW_H }}
            className="flex items-start"
          >
            {/* Pastille (plus basse que le slot → l'écart fait l'espacement). */}
            <div
              className="flex h-9 w-full items-center justify-between gap-3 rounded-lg px-3"
              style={{ backgroundColor: "rgba(var(--lp-glass))" }}
            >
              <span className="truncate text-[13px] text-[var(--lp-text)]">{row.name}</span>
              <span
                className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${BADGE_TONE[row.tone]}`}
              >
                {row.badge}
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* --- Bordure en dégradé qui suit les coins arrondis ----------------------
 * Technique "ring" : un calque rempli du dégradé, dont on ne garde que le
 * contour via mask-composite. `gradient` = sens du fondu, `inset` = décalage
 * (pour empiler une 2ᵉ bordure intérieure). */
function GradientBorder({ radius, gradient, inset = 0 }: { radius: number; gradient: string; inset?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        inset,
        borderRadius: radius,
        padding: 1, // épaisseur du trait
        background: gradient,
        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        maskComposite: "exclude",
      }}
    />
  );
}

/* --- Coquille de carte : visuel en haut (flex-1), texte centré en bas ----
 * `glow` active le halo violet diffus (carte de droite). La bordure de la
 * carte s'estompe vers le bas (BORDER_FADE_DOWN). */
function Card({
  children,
  title,
  subtitle,
  glow = false,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
  glow?: boolean;
}) {
  return (
    <article className="relative flex h-full flex-col rounded-2xl p-7">
      {/* Calque FOND + BORDURE de la carte : c'est LUI qui se dissout vers le
          bas (CARD_FADE). Le texte est rendu PAR-DESSUS, donc jamais estompé. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
        style={{ backgroundColor: CARD_BG, maskImage: CARD_FADE, WebkitMaskImage: CARD_FADE }}
      >
        <GradientBorder radius={16} gradient={BORDER_FADE_DOWN} />

        {/* Glow violet diffus dans le coin bas-droit (rayon oblique via rotate/scale). */}
        {glow && (
          <div
            className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full blur-[90px]"
            style={{ background: CARD_GLOW, transform: "rotate(-18deg) scaleX(1.4)" }}
          />
        )}
      </div>

      {/* Étage VISUEL (occupe l'espace pour aligner les textes des 2 cartes). */}
      <div className="relative flex-1">{children}</div>

      {/* Baseline TEXTE — identique sur les deux cartes (NON masquée → lisible). */}
      <div className="relative mt-8 text-center">
        <h3 className="text-lg font-bold text-[var(--lp-text)] sm:text-xl">{title}</h3>
        <p className="mx-auto mt-2 max-w-[34ch] text-pretty text-[14px] leading-[1.6]" style={{ color: TEXT_2 }}>
          {subtitle}
        </p>
      </div>
    </article>
  );
}

/* --- Section ------------------------------------------------------------- */

export function Features2Col() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      {/* Desktop : 70 % (process) / 30 % (alertes) — empilé en 1 colonne sur mobile. */}
      <div className="mx-auto grid max-w-[1180px] gap-5 px-6 sm:px-8 md:grid-cols-[7fr_3fr]">
        {/* ===== Carte GAUCHE — process « l'IA analyse tes ventes » ===== */}
        <Card
          title="Prêt en 2 minutes"
          subtitle="De la connexion de ta caisse aux premières prévisions, pas besoin d'attendre des jours."
        >
          <p className="text-sm font-semibold text-[var(--lp-text)]">C'est parti 🎉</p>
          <p className="mt-1 text-[13px]" style={{ color: TEXT_2 }}>
            On met l'IA au travail sur ton historique.
          </p>

          {/* Bloc « process » : DOUBLE bordure (décalée de 6px) estompée vers
              le haut + léger fondu du texte en haut (BOX_TEXT_FADE). */}
          <div className="relative mt-5 overflow-hidden rounded-xl" style={{ backgroundColor: INNER_BG }}>
            <GradientBorder radius={12} gradient={BORDER_FADE_UP} inset={0} />
            <GradientBorder radius={6} gradient={BORDER_FADE_UP} inset={6} />

            <div className="relative p-4" style={{ maskImage: BOX_TEXT_FADE, WebkitMaskImage: BOX_TEXT_FADE }}>
              <div className="flex items-center gap-2.5">
                {/* Spinner custom : cercle coupé à gauche/droite (seuls les arcs
                    haut+bas sont colorés) qui tourne en continu. */}
                <span
                  aria-hidden
                  className="h-4 w-4 shrink-0 animate-spin rounded-full motion-reduce:animate-none"
                  style={{
                    border: "2px solid transparent",
                    borderTopColor: ACCENT,
                    borderBottomColor: ACCENT,
                  }}
                />
                <span className="text-[13px] font-medium text-[var(--lp-text)]">Analyse de tes ventes en cours</span>
              </div>

              {/* Feed : une ligne s'ajoute en haut chaque seconde, les autres
                  descendent d'un cran (cf. <AnalysisFeed/>). */}
              <AnalysisFeed />
            </div>
          </div>
        </Card>

        {/* ===== Carte DROITE — alerte rupture (glow violet) ===== */}
        <Card
          glow
          title="Ne tombe plus jamais en rupture"
          subtitle="On te prévient avant que ça arrive, pas une fois que le rayon est vide."
        >
          <p className="text-sm font-semibold text-[var(--lp-text)]">Alertes intelligentes</p>
          <p className="mt-1 text-[13px]" style={{ color: TEXT_2 }}>
            On surveille ton stock pour toi.
          </p>

          {/* Encadré « alerte douce » — même style que le bloc gauche :
              DOUBLE bordure décalée de 6px, estompée vers le haut, + léger
              fondu du texte en haut. */}
          <div className="relative mt-5 overflow-hidden rounded-xl" style={{ backgroundColor: INNER_BG }}>
            <GradientBorder radius={12} gradient={BORDER_FADE_UP} inset={0} />
            <GradientBorder radius={6} gradient={BORDER_FADE_UP} inset={6} />

            <div className="relative p-4" style={{ maskImage: BOX_TEXT_FADE, WebkitMaskImage: BOX_TEXT_FADE }}>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--lp-text)]">
                <PackageX className="h-4 w-4 text-amber-600 dark:text-amber-300" aria-hidden />
                3 produits bientôt en rupture
              </div>

              {/* Feed : une alerte monte périodiquement (cf. <AlertsFeed/>). */}
              <AlertsFeed />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
