import type { ReactNode } from "react";
import { RevealGroup, RevealItem } from "./landingMotion";

/* ============================================================
 * SECTION — « Smart Indicators » (3 × 2 cartes)
 * Eyebrow + gros titre 2 lignes, puis 6 cartes : chacune a une
 * ZONE VISUELLE (SVG animé, ~160px) + titre + description.
 *
 * ♻️ Réutilise EXACTEMENT la charte des sections existantes
 *    (Hero / Features2Col) : fond #0a0613, cartes glass à bordure
 *    fine rgba(var(--lp-grid),0.08), glow violet #8b5cf6/#a855f7, même typo.
 *
 * 🎬 Les visuels sont des SVG animés (vague, courbe, radar…). Les
 *    animations sont définies dans index.css (classes `si-*`) et se
 *    coupent automatiquement si `prefers-reduced-motion: reduce`.
 *
 * ⚙️ RÉGLAGES :
 *   · contenu/ordre des cartes → tableau FEATURES (visual, titre, desc)
 *   · halo violet (1–2 cartes) → champ `glow: true`
 *   · vitesses d'animation     → durées des classes `si-*` dans index.css
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)"; // = HERO_BG
const CARD_BG = "var(--lp-card)"; // = fond du mockup hero
const VISUAL_BG = "var(--lp-card)"; // fond du panneau visuel (≈ images d'origine)
const BORDER = "rgba(var(--lp-border))"; // bordure fine glass (= hero)
const GLOW = "var(--lp-glow)"; // = HERO_GLOW (#8b5cf6)
const ACCENT = "var(--lp-accent)"; // = HERO_ACCENT
const ACCENT_2 = "#c4b5fd"; // violet pâle (eyebrow / traits)
const TEXT_2 = "var(--lp-text-2)"; // = HERO_TEXT_2

const CARD_GLOW = `radial-gradient(circle, rgba(${GLOW}, 0.30) 0%, rgba(${GLOW}, 0.10) 45%, transparent 75%)`;
const NEON = `drop-shadow(0 0 6px rgba(${GLOW}, 0.85))`; // halo néon des traits

/* ============================================================
 * 6 mini-visuels SVG animés. viewBox 320×160, cadrés "slice"
 * (comme object-cover). Néon violet sur fond sombre.
 * ============================================================ */

/* Path d'une vague sinusoïdale large (3 périodes) — translatée en boucle. */
const WAVE = (() => {
  let d = "";
  for (let x = -160; x <= 480; x += 8) {
    const y = 80 - 26 * Math.sin((x / 160) * Math.PI * 2);
    d += `${x === -160 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d.trim();
})();

/* 1) Saisonnalité — vague néon qui défile horizontalement. */
function VisualSeasonality() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <g className="si-wave">
        <path
          d={WAVE}
          fill="none"
          stroke={ACCENT_2}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: NEON }}
        />
      </g>
    </svg>
  );
}

/* 2) Rupture imminente — courbe qui chute sous un seuil + point d'alerte qui pulse. */
function VisualRupture() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {/* Seuil de sécurité (pointillés ambre). */}
      <line x1="0" y1="86" x2="320" y2="86" stroke="rgba(251,191,36,0.45)" strokeWidth="1.5" strokeDasharray="6 6" />
      {/* Courbe de stock qui descend. */}
      <polyline
        points="10,36 70,48 130,58 196,92 252,116 312,134"
        fill="none"
        stroke={ACCENT_2}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: NEON }}
      />
      {/* Point de rupture (au passage sous le seuil) + halo qui pulse. */}
      <circle className="si-ping" cx="196" cy="92" r="6" fill="#fbbf24" />
      <circle cx="196" cy="92" r="5" fill="#fbbf24" style={{ filter: "drop-shadow(0 0 6px rgba(251,191,36,0.9))" }} />
    </svg>
  );
}

/* 3) Produit qui dort — ligne plate qui « respire » + zzz qui montent. */
function VisualDormant() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <line
        className="si-breathe"
        x1="40"
        y1="96"
        x2="280"
        y2="96"
        stroke={ACCENT_2}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ filter: NEON }}
      />
      {/* zzz du sommeil (décalés dans le temps). */}
      {[
        { x: 196, y: 78, s: 16, d: "0s" },
        { x: 216, y: 66, s: 20, d: "0.7s" },
        { x: 238, y: 52, s: 26, d: "1.4s" },
      ].map((z, i) => (
        <text
          key={i}
          className="si-zzz"
          x={z.x}
          y={z.y}
          fontSize={z.s}
          fontWeight={700}
          fill={ACCENT_2}
          style={{ animationDelay: z.d }}
        >
          Z
        </text>
      ))}
    </svg>
  );
}

/* 4) Réappro suggéré — colis avec un anneau qui tourne + badge « + » qui pulse. */
function VisualReappro() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {/* Anneau orbital (rotation). */}
      <circle
        className="si-spin"
        cx="160"
        cy="80"
        r="48"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeDasharray="6 10"
        opacity="0.85"
        style={{ filter: NEON }}
      />
      {/* Colis (carton). */}
      <g stroke={ACCENT_2} strokeWidth="2" fill={`rgba(${GLOW},0.12)`} strokeLinejoin="round">
        <rect x="138" y="60" width="44" height="40" rx="4" />
        <line x1="138" y1="73" x2="182" y2="73" />
        <line x1="160" y1="60" x2="160" y2="73" />
      </g>
      {/* Badge « + » qui pulse. */}
      <g className="si-pulse">
        <circle cx="194" cy="56" r="11" fill={ACCENT} />
        <path d="M194,51 v10 M189,56 h10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/* 5) Remontées en temps réel — radar : anneaux concentriques qui se propagent. */
function VisualRealtime() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      {/* Anneau de base statique (le radar n'est jamais vide entre 2 pulses). */}
      <circle cx="160" cy="80" r="44" fill="none" stroke={`rgba(${GLOW},0.18)`} strokeWidth="1.5" />
      {["0s", "0.85s", "1.7s"].map((delay, i) => (
        <circle
          key={i}
          className="si-ping"
          cx="160"
          cy="80"
          r="22"
          fill="none"
          stroke={ACCENT}
          strokeWidth="2"
          style={{ animationDelay: delay }}
        />
      ))}
      <circle cx="160" cy="80" r="6" fill={ACCENT_2} style={{ filter: NEON }} />
    </svg>
  );
}

/* 6) Fidélité & demande — deux anneaux croisés en rotation inverse + cœur qui pulse. */
function VisualLoyalty() {
  return (
    <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <ellipse
        className="si-spin"
        cx="160"
        cy="80"
        rx="70"
        ry="40"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeDasharray="4 10"
        opacity="0.7"
        style={{ filter: NEON }}
      />
      <ellipse
        className="si-spinrev"
        cx="160"
        cy="80"
        rx="46"
        ry="64"
        fill="none"
        stroke={ACCENT_2}
        strokeWidth="2"
        strokeDasharray="4 10"
        opacity="0.6"
      />
      <circle className="si-pulse" cx="160" cy="80" r="8" fill="#fff" style={{ filter: NEON }} />
    </svg>
  );
}

/* ============================================================
 * Données des 6 cartes. `glow` n'est activé que sur 1–2 cartes
 * pour rythmer (comme les sections précédentes), pas sur toutes.
 * ============================================================ */
const FEATURES = [
  {
    visual: <VisualSeasonality />,
    title: "Saisonnalité",
    desc: "Repère les produits qui marchent selon la saison, et anticipe les pics.",
  },
  {
    visual: <VisualRupture />,
    title: "Rupture imminente",
    desc: "On te prévient quand un produit va manquer, avant que ça arrive.",
    glow: true, // ← halo violet (1/2)
  },
  {
    visual: <VisualDormant />,
    title: "Produit qui dort",
    desc: "Identifie le stock qui ne tourne pas et immobilise ton argent.",
  },
  {
    visual: <VisualReappro />,
    title: "Réappro suggéré",
    desc: "On te dit quoi commander, et en quelle quantité.",
  },
  {
    visual: <VisualRealtime />,
    title: "Remontées en temps réel",
    desc: "Connecté à l'app de scan, ton stock se met à jour à chaque passage en caisse.",
    glow: true, // ← halo violet (2/2)
  },
  {
    visual: <VisualLoyalty />,
    title: "Fidélité & demande",
    desc: "L'IA croise ton programme de fidélité avec tes ventes pour affiner les prévisions.",
  },
] as const;

/* --- Carte unitaire --------------------------------------------------------
 * Bordure fine glass + (optionnel) glow violet diffus. Focusable au
 * clavier avec un anneau de focus visible. */
function Card({
  visual,
  title,
  desc,
  glow = false,
}: {
  visual: ReactNode;
  title: string;
  desc: string;
  glow?: boolean;
}) {
  return (
    <article
      tabIndex={0}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        ["--tw-ring-color" as string]: ACCENT,
        ["--tw-ring-offset-color" as string]: SECTION_BG,
      }}
    >
      {/* Glow violet diffus (coin bas-droit) — seulement si `glow`. */}
      {glow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full blur-[90px]"
          style={{ background: CARD_GLOW, transform: "rotate(-18deg) scaleX(1.4)" }}
        />
      )}

      {/* ===== ZONE VISUELLE (SVG animé, ~160px) ===== */}
      <div
        className="relative h-40 overflow-hidden rounded-lg"
        style={{
          background: `radial-gradient(circle at 50% 60%, rgba(${GLOW},0.06), transparent 70%), ${VISUAL_BG}`,
          border: `1px solid ${BORDER}`,
        }}
      >
        {visual}
      </div>

      {/* ===== TEXTE ===== */}
      <div className="relative pt-5">
        <h3 className="text-[15px] font-bold text-[var(--lp-text)]">{title}</h3>
        <p className="mt-2 text-pretty text-[13px] leading-[1.6]" style={{ color: TEXT_2 }}>
          {desc}
        </p>
      </div>
    </article>
  );
}

/* --- Section ---------------------------------------------------------------*/
export function SmartIndicators() {
  return (
    <section
      className="relative isolate overflow-hidden py-20 sm:py-28"
      style={{ backgroundColor: SECTION_BG }}
    >
      {/* Halo violet subtil et diffus derrière le titre (continuité LP). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[900px] max-w-[120vw] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[120px]"
        style={{ background: `radial-gradient(closest-side, rgba(${GLOW},0.20) 0%, transparent 75%)` }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        {/* En-tête centré */}
        <div className="mx-auto max-w-[760px] text-center">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl">
            Vois les problèmes
            <br />
            avant qu'ils arrivent
          </h2>
        </div>

        {/* Grille 3 × 2 — 1 col (mobile) / 2 col (tablette) / 3 col (desktop). */}
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <RevealItem key={f.title} className="h-full">
              <Card visual={f.visual} title={f.title} desc={f.desc} glow={"glow" in f ? f.glow : false} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
