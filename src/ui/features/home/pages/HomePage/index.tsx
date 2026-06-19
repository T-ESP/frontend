import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";
import { ClientLogos } from "./ClientLogos";
import { HorizonSection } from "./HorizonSection";
import { Features2Col } from "./Features2Col";
import { AuroraSection } from "./AuroraSection";
import { SmartIndicators } from "./SmartIndicators";
import { HowItWorks } from "./HowItWorks";
import { TableExperience } from "./TableExperience";
import { Stats } from "./Stats";
import { Testimonials } from "./Testimonials";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";
import { DashboardPreview } from "./DashboardPreview";
import { MarketingLayout } from "../../components/MarketingLayout";

/* ============================================================
 * Landing page « dark éditorial » — structure inspirée de la LP
 * bakerprod, adaptée à StockS, en palette Terminal (navy/emerald).
 * ============================================================ */

/* ============================================================
 * HERO — dark premium "data-driven" : glow violet diffus
 * derrière un dashboard en glassmorphism.
 *
 * 🎨 TOKENS COULEUR (tout est regroupé ici pour ajuster vite) :
 *   - HERO_BG      : fond bleu-violet quasi noir
 *   - HERO_GLOW    : couleur du halo radial (alpha géré plus bas)
 *   - HERO_ACCENT  : violet d'accent (bouton, focus)
 *   - HERO_BORDER  : bordures "glass"
 *   - HERO_TEXT_2  : texte secondaire (gris clair)
 *
 * ⚠️ Le glow doit rester SUBTIL : pour l'adoucir, baisser l'alpha
 *    de HERO_GLOW dans `glowBackground` OU augmenter `blur-[...]`.
 *    En cas de doute → baisser l'opacité.
 * ============================================================ */
// Tokens theme-aware (clair/sombre) — définis dans index.css (:root / .dark).
const HERO_BG = "var(--lp-bg)"; // fond plein écran
const HERO_GLOW = "var(--lp-glow)"; // rgb du halo (alpha appliqué à l'usage)
const HERO_ACCENT = "var(--lp-accent)"; // violet d'accent
const HERO_BORDER = "rgba(var(--lp-border))"; // bordures glass
const HERO_TEXT_2 = "var(--lp-text-2)"; // texte secondaire

/* Mockup d'un dashboard StockS en glassmorphism.
 * Le <div> intérieur "Placeholder" est à remplacer par la vraie capture. */
function AppMockup() {
  return (
    <div
      className="relative mx-auto w-full max-w-[940px] overflow-hidden rounded-xl"
      style={{
        // Le mockup reste SOMBRE dans les 2 thèmes (c'est une « capture » de
        // l'app, dont le DashboardPreview est forcé en .dark) → couleurs en dur.
        background: "#0f0a1d",
        border: "1px solid rgba(255,255,255,0.08)",
        // Fondu sur TOUT le mockup (fond + bordure + contenu) : le bas se
        // dissout dans le hero, on ne voit plus la fin du bloc.
        // (Pas d'ombre portée : elle "flotterait" sous un bloc qui disparaît.)
        maskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 100%)",
      }}
    >
      {/* Fausse barre de navigateur */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
        <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
        {/* Barre d'URL */}
        <div
          className="ml-3 hidden h-7 flex-1 items-center rounded-md px-3 text-xs sm:flex"
          style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af" }}
        >
          app.stocks.io/dashboard
        </div>
      </div>

      {/* Aperçu du dashboard (vrais composants, données mock).
          Le maskImage fait DISPARAÎTRE le bas en fondu (effet "peek").
          - Hauteur visible avant fondu → le 1ᵉʳ stop (55%)
          - Douceur du fondu            → écart entre les 2 stops */}
      {/* Conteneur à hauteur fixe : on ne montre qu'un "peek" du dashboard
          (le fondu qui efface le bas est porté par la racine d'AppMockup).
          - Hauteur visible (donc le scroll global) → height (540px) */}
      <div
        className="pointer-events-none select-none overflow-hidden"
        style={{ height: 470 }}
      >
        {/* Légère réduction pour la compacité tout en restant LISIBLE :
            rendu à 125 % de largeur puis scale(0.8) → pleine largeur du cadre.
            transform (≠ zoom) ne casse pas les breakpoints responsive.
            (Pour ajuster : garder width = 100/scale, ex. 0.7 ↔ 143 %.) */}
        <div
          style={{
            width: "125%",
            transformOrigin: "top left",
            transform: "scale(0.8)",
          }}
        >
          <DashboardPreview />
        </div>
      </div>
    </div>
  );
}

/* Révélation 3D du dashboard PILOTÉE PAR LE SCROLL (réintégrée de l'ancien
 * Hero) : à mesure qu'il entre dans le viewport, le mockup se redresse
 * (incliné → à plat), monte légèrement, grandit et s'éclaircit.
 * Réglages : l'angle de départ (18deg), le scale (0.92) et l'opacité (0.4).
 * Respecte prefers-reduced-motion (rendu statique). */
function ScrollRevealDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Progress 0 → 1 pendant que le mockup remonte du bas du viewport vers le centre.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0004 });
  const rotateX = useTransform(p, [0, 1], [18, 0]);
  const scale = useTransform(p, [0, 1], [0.92, 1]);
  const y = useTransform(p, [0, 1], [40, 0]);
  const opacity = useTransform(p, [0, 0.55], [0.4, 1]);

  if (reduce) {
    return (
      <div className="relative z-10">
        <AppMockup />
      </div>
    );
  }

  return (
    // `perspective` sur le parent pour que rotateX donne un vrai effet 3D.
    <div ref={ref} className="relative z-10" style={{ perspective: 1500 }}>
      <motion.div
        style={{ rotateX, scale, y, opacity, transformOrigin: "center top", willChange: "transform, opacity" }}
      >
        <AppMockup />
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: HERO_BG }}
    >
      {/* Quadrillage en perspective au-dessus du titre.
          - Le plan est incliné via `perspective() rotateX()` → les lignes
            s'évasent vers le bas et convergent vers le haut.
          - Réglages :
              · espacement des cases  → backgroundSize (60px)
              · intensité des lignes  → alpha des rgba (0.08)
              · inclinaison/évasement → perspective (700px) + rotateX (62deg)
              · hauteur de la zone     → h-[460px] du conteneur
          - Le maskImage fait disparaître la grille en fondu sur les bords. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[260px] overflow-hidden"
        style={{
          // Fondu vertical : la grille s'éteint en bas (avant le titre).
          maskImage:
            "radial-gradient(ellipse 70% 100% at 50% 0%, black 20%, transparent 65%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 100% at 50% 0%, black 20%, transparent 65%)",
        }}
      >
        <div
          className="absolute left-1/2 top-0 h-[900px] w-[180%] -translate-x-1/2"
          style={{
            transform: "perspective(700px) rotateX(62deg)",
            transformOrigin: "50% 0%",
            backgroundImage:
              "linear-gradient(rgba(var(--lp-grid),0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--lp-grid),0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* pt-* réserve l'espace du futur header sticky (à ajuster une fois posé). */}
      <div className="relative mx-auto max-w-[1180px] px-6 pb-0 pt-32 sm:px-8 sm:pt-40">
        <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
          {/* Titre — très gros, blanc, tracking serré */}
          <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-[var(--lp-text)] sm:text-6xl lg:text-7xl">
            {/* [TITRE À REMPLIR] */}
            Votre stock, piloté par l'IA
          </h1>

          {/* Sous-titre — 1-2 lignes, gris clair, largeur contenue */}
          <p
            className="mt-6 max-w-[600px] text-pretty text-base leading-[1.6] sm:text-lg"
            style={{ color: HERO_TEXT_2 }}
          >
            {/* [SOUS-TITRE À REMPLIR] */}
            Anticipez la demande, évitez les ruptures et le surstock. StockS
            transforme vos données de vente en décisions claires.
          </p>

          {/* Bloc CTA — input + bouton collés dans un conteneur glass arrondi */}
          <form
            className="mt-9 flex w-full max-w-[440px] items-center gap-2 rounded-full p-1.5 backdrop-blur-md"
            style={{
              background: "rgba(var(--lp-glass))",
              border: `1px solid ${HERO_BORDER}`,
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Votre email"
              aria-label="Votre adresse email"
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-[var(--lp-text)] placeholder:text-neutral-500 focus:outline-none focus-visible:outline-none focus-visible:ring-2"
              style={{ ["--tw-ring-color" as string]: HERO_ACCENT }}
            />
            <button
              type="submit"
              className="shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                background: HERO_ACCENT,
                // Anneau de focus clavier visible (offset = couleur du fond)
                ["--tw-ring-color" as string]: HERO_ACCENT,
                ["--tw-ring-offset-color" as string]: HERO_BG,
              }}
            >
              Commencer
            </button>
          </form>

          {/* Réassurance */}
          <p className="mt-4 text-xs" style={{ color: HERO_TEXT_2 }}>
            Sans carte bancaire · Essai gratuit 14 jours
          </p>
        </div>

        {/* ====== Décor du bas : même système que le haut, centré sur le
                dashboard. Tout est anchoré sur ce wrapper `relative`. ====== */}
        <div className="relative mt-12">
          {/* 1) Grille en perspective (sol "horizon"), DERRIÈRE le glow : la
                lumière la recouvre au centre et elle réapparaît sur les côtés,
                donc elle se fond naturellement dans le halo (pas de coupe).
                Le fondu vertical (maskImage) dissout le haut (convergence) et
                le bas. Réglages :
                  · où elle commence/finit → -top-* et h-* du conteneur
                  · douceur du fondu       → les stops du linear-gradient
                  · évasement              → rotateX(62deg)/perspective(520px)
                  · densité / intensité    → backgroundSize / alpha */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-[520px] overflow-hidden"
            style={{
              // Double fondu COMBINÉ (intersection) : vertical (haut/bas) ET
              // horizontal (gauche/droite) → plus aucune arête coupée, les
              // côtés se dissolvent en douceur.
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%), linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 35%, black 70%, transparent 100%), linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskComposite: "source-in",
            }}
          >
            <div
              className="absolute left-1/2 top-0 h-[1000px] w-[320%] -translate-x-1/2"
              style={{
                transform: "perspective(520px) rotateX(62deg)",
                transformOrigin: "50% 0%",
                backgroundImage:
                  "linear-gradient(rgba(var(--lp-grid),0.17) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--lp-grid),0.17) 1px, transparent 1px)",
                backgroundSize: "66px 66px",
              }}
            />
          </div>

          {/* 2) Radial PUISSANT : centré sur le BORD HAUT du dashboard. C'est
                LUI qui déborde sur les côtés (ellipse plus large que le
                dashboard) et descend en s'éteignant vers le tiers supérieur.
                - Largeur du débordement latéral → w-[2500px]
                - Hauteur d'extinction (où ça s'arrête en bas) → h-[520px] */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[2500px] max-w-[230vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
            style={{
              background: `radial-gradient(closest-side, rgba(${HERO_GLOW}, 1) 0%, rgba(${HERO_GLOW}, 0.48) 36%, rgba(${HERO_GLOW}, 0.19) 62%, transparent 84%)`,
            }}
          />
          {/* 2bis) Cœur ardent : spot quasi blanc surimposé, calé lui aussi sur
                le bord haut du dashboard. Baisser l'alpha si trop fort. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-[220px] w-[440px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
            style={{
              background:
                "radial-gradient(circle, rgba(216,180,254,0.95) 0%, rgba(168,85,247,0.6) 40%, transparent 70%)",
            }}
          />

          {/* Dashboard mockup — révélation 3D au scroll (z-10), au-dessus du halo. */}
          <ScrollRevealDashboard />
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <MarketingLayout hideFooter>
      <Hero />
      <ClientLogos />
      <HorizonSection />
      <Features2Col />
      <AuroraSection />
      <SmartIndicators />
      <HowItWorks />
      <TableExperience />
      <Stats />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </MarketingLayout>
  );
}
