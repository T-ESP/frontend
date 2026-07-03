import { useRef, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValue,
  type MotionValue,
} from "framer-motion";
import { TrendingUp, Bell, Zap } from "lucide-react";
import { ClientLogos } from "./ClientLogos";
import { HorizonSection } from "./HorizonSection";
import { Features2Col } from "./Features2Col";
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

/* --- Carte 3D : inclinaison au survol souris + reflet qui suit le curseur ---
 * Reprise du hero de Kae (TiltCard) : la carte s'incline légèrement vers la
 * souris (rotateX/rotateY lissés par spring) et un reflet blanc balaie sa
 * surface horizontalement en suivant le curseur. */
function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const gX = useMotionValue(50);
  const srX = useSpring(rX, { stiffness: 80, damping: 18 });
  const srY = useSpring(rY, { stiffness: 80, damping: 18 });
  const sgX = useSpring(gX, { stiffness: 80, damping: 18 });
  const glare = useTransform(
    sgX,
    (v) => `radial-gradient(ellipse 85% 42% at ${v}% 18%, rgba(255,255,255,0.10) 0%, transparent 55%)`,
  );

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      rX.set(-cy * 5);
      rY.set(cx * 5);
      gX.set((cx + 0.5) * 100);
    },
    [rX, rY, gX],
  );
  const onLeave = useCallback(() => {
    rX.set(0);
    rY.set(0);
    gX.set(50);
  }, [rX, rY, gX]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", willChange: "transform" }}
      className="relative w-full"
    >
      {children}
      {/* Reflet blanc qui balaie la carte en suivant le curseur. */}
      <motion.div style={{ background: glare }} className="pointer-events-none absolute inset-0 z-10 rounded-xl" />
    </motion.div>
  );
}

/* --- Pin d'annotation « flottant » au-dessus du dashboard ------------------
 * Pastille colorée + halo qui pulse en boucle + étiquette glass. Positionné
 * en % (top/left) relativement au conteneur du mockup. */
function AnnotationPin({
  top,
  left,
  icon,
  label,
  delay,
  color,
}: {
  top: string;
  left: string;
  icon: ReactNode;
  label: string;
  delay: number;
  color: string;
}) {
  return (
    <div className="absolute z-20 flex items-center gap-2" style={{ top, left }}>
      <div className="relative shrink-0">
        <div className="h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 0 3px ${color}30` }} />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay }}
          style={{ background: color }}
        />
      </div>
      <div
        className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold backdrop-blur-md"
        style={{
          background: "rgba(10,6,26,0.78)",
          border: `1px solid ${color}28`,
          color: "#fff",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
        }}
      >
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
    </div>
  );
}

/* Pins posés sur le mockup (top/left en % du conteneur du dashboard). */
const PINS = [
  { top: "12%", left: "3%", icon: <TrendingUp size={12} />, label: "Prévisions IA", delay: 0.2, color: "#a855f7" },
  { top: "27%", left: "71%", icon: <Bell size={12} />, label: "Alerte rupture", delay: 0.5, color: "#f59e0b" },
  { top: "55%", left: "12%", icon: <Zap size={12} />, label: "Réappro auto", delay: 0.8, color: "#8b5cf6" },
] as const;

/* Bloc titre + sous-titre + CTA (réutilisé dans le rendu animé ET statique). */
function HeroHeadline() {
  return (
    <div className="mx-auto flex max-w-[820px] flex-col items-center text-center">
      {/* Titre — très gros, blanc, tracking serré */}
      <h1 className="text-balance text-5xl font-bold leading-[1.05] tracking-tight text-[var(--lp-text)] sm:text-6xl lg:text-7xl">
        Votre stock, piloté par l'IA
      </h1>

      {/* Sous-titre — 1-2 lignes, gris clair, largeur contenue */}
      <p className="mt-6 max-w-[600px] text-pretty text-base leading-[1.6] sm:text-lg" style={{ color: HERO_TEXT_2 }}>
        Anticipez la demande, évitez les ruptures et le surstock. StockS transforme vos données de vente en
        décisions claires.
      </p>

      {/* Bloc CTA — input + bouton collés dans un conteneur glass arrondi.
          pointer-events-auto : reste cliquable même si le calque titre est
          globalement transparent aux événements (pour laisser le dashboard
          en dessous réagir à la souris). */}
      <form
        className="pointer-events-auto mt-9 flex w-full max-w-[440px] items-center gap-2 rounded-full p-1.5 backdrop-blur-md"
        style={{ background: "rgba(var(--lp-glass))", border: `1px solid ${HERO_BORDER}` }}
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
  );
}

/* Quadrillage en perspective (fond haut du hero). */
function HeroGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-[260px] overflow-hidden"
      style={{
        maskImage: "radial-gradient(ellipse 70% 100% at 50% 0%, black 20%, transparent 65%)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 100% at 50% 0%, black 20%, transparent 65%)",
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
  );
}

/* Le dashboard (mockup + glow + tilt souris + pins), sans le pilotage scroll. */
function HeroDashboard({ glowOp, pinsOp }: { glowOp?: MotionValue<number>; pinsOp?: MotionValue<number> }) {
  return (
    <div className="relative mx-auto w-full max-w-[940px]">
      {/* Glow violet qui apparaît quand le dashboard vient se poser. */}
      <motion.div aria-hidden style={glowOp ? { opacity: glowOp } : undefined} className="pointer-events-none absolute -inset-24 -z-10">
        <div
          className="h-full w-full rounded-full blur-[90px]"
          style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(${HERO_GLOW},0.42) 0%, transparent 65%)` }}
        />
      </motion.div>

      <TiltCard>
        <AppMockup />
      </TiltCard>

      {/* Pins flottants (apparaissent en fin de reveal via pinsOp). */}
      <motion.div style={pinsOp ? { opacity: pinsOp } : undefined} className="pointer-events-none absolute inset-0">
        {PINS.map((p) => (
          <AnnotationPin key={p.label} {...p} />
        ))}
      </motion.div>
    </div>
  );
}

/* ============================================================
 * HERO — reveal « scroll-jacké » repris du hero de Kae :
 * la section est TALL (h-[260vh]) et son contenu est STICKY. Pendant qu'on
 * la traverse, le TITRE s'efface + remonte, et le DASHBOARD glisse depuis la
 * droite (x) en se redressant du 3D (rotateY/X/Z) → vient se poser à plat,
 * grandit, s'éclaircit ; puis le glow + les pins apparaissent.
 * S'ajoute le tilt 3D + reflet qui suit la souris (TiltCard).
 * prefers-reduced-motion → rendu statique classique (pas de scroll-jack).
 * ============================================================ */
function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Amplitudes réduites sur mobile — réactif au resize.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  // Progression 0 → 1 sur TOUTE la hauteur (tall) de la section.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.0001 });

  // LAYER 1 — le titre s'efface et remonte légèrement.
  const hlOp = useTransform(smooth, [0.08, 0.36], [1, 0]);
  const hlY = useTransform(smooth, [0, 0.36], ["0%", "-14%"]);
  const hlScale = useTransform(smooth, [0, 0.36], [1, 0.92]);

  // LAYER 2 — le dashboard glisse depuis la droite et se redresse du 3D.
  const imgX = useTransform(smooth, [0, 0.48], [isMobile ? "12%" : "42%", "0%"]);
  const imgRotY = useTransform(smooth, [0, 0.48], [isMobile ? -15 : -32, 0]);
  const imgRotX = useTransform(smooth, [0, 0.48], [isMobile ? 10 : 14, 0]);
  const imgRotZ = useTransform(smooth, [0, 0.48], [isMobile ? -2 : -4, 0]);
  const imgScale = useTransform(smooth, [0, 0.48], [isMobile ? 1.05 : 1.12, 1]);
  const imgOpacity = useTransform(smooth, [0, 0.42], [0.35, 1]);
  const glowOp = useTransform(smooth, [0.25, 0.7], [0, 1]);
  const pinsOp = useTransform(smooth, [0.5, 0.62], [0, 1]);

  // Rendu statique (accessibilité) : titre puis dashboard, sans scroll-jack.
  if (reduce) {
    return (
      <section className="relative isolate overflow-hidden" style={{ backgroundColor: HERO_BG }}>
        <HeroGrid />
        <div className="relative mx-auto max-w-[1180px] px-6 pb-24 pt-32 sm:px-8 sm:pt-40">
          <HeroHeadline />
          <div className="relative mt-16">
            <HeroDashboard />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ backgroundColor: HERO_BG, height: isMobile ? "210vh" : "260vh" }}>
      {/* Fenêtre STICKY : le contenu reste figé à l'écran pendant qu'on scrolle
          à travers la hauteur de la section (c'est ce qui « scroll-jacke »). */}
      <div className="sticky top-0 h-screen overflow-hidden isolate">
        <HeroGrid />

        {/* LAYER 1 — titre (pointer-events-none pour laisser passer la souris
            vers le dashboard ; seul le CTA re-active les events). */}
        <motion.div
          style={{ opacity: hlOp, y: hlY, scale: hlScale }}
          className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[1180px] flex-col items-center px-6 pt-28 sm:px-8 sm:pt-32"
        >
          <HeroHeadline />
        </motion.div>

        {/* LAYER 2 — dashboard qui glisse depuis la droite et se redresse. */}
        <motion.div
          style={{
            x: imgX,
            rotateX: imgRotX,
            rotateY: imgRotY,
            rotateZ: imgRotZ,
            scale: imgScale,
            opacity: imgOpacity,
            transformStyle: "preserve-3d",
            perspective: "1600px",
            willChange: "transform, opacity",
          }}
          className="absolute inset-x-0 bottom-[-8%] z-10 mx-auto flex w-full max-w-[1080px] justify-center px-6 sm:bottom-[-6%] sm:px-8"
        >
          <HeroDashboard glowOp={glowOp} pinsOp={pinsOp} />
        </motion.div>
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
