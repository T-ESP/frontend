import { useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import dashboardImage from '@/assets/images/image.png';
import { Logo } from "@/ui/components/common/Logo";
import {
  Menu, X, ChevronRight, Play, Sparkles,
  TrendingUp, Bell, Zap,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
  AnimatePresence,
  useMotionTemplate,
} from "framer-motion";
import { useAuth } from "@/ui/features/auth/hooks/useAuth";

// ─── Mouse-tracking mesh gradient ─────────────────────────────────────────────
// Separated into its own component so its useMotionValue calls are isolated.
function MeshGradient() {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const smx = useSpring(mx, { stiffness: 32, damping: 16 });
  const smy = useSpring(my, { stiffness: 32, damping: 16 });
  const px = useTransform(smx, v => `${(v * 100).toFixed(1)}%`);
  const py = useTransform(smy, v => `${(v * 100).toFixed(1)}%`);
  const bg = useMotionTemplate`radial-gradient(ellipse 70% 55% at ${px} ${py}, rgba(123,95,162,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 45% at 80% 20%, rgba(176,142,224,0.10) 0%, transparent 55%)`;

  // addEventListener in a ref-callback so it runs once and cleans up
  const attachRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  return <motion.div ref={attachRef} className="absolute inset-0 pointer-events-none z-0" style={{ background: bg }} />;
}

// ─── 3D Tilt card ─────────────────────────────────────────────────────────────
// Hover-driven rotateX/Y. Operates on separate transform properties from the
// scroll-driven wrapper, so the two systems don't fight each other.
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rX = useMotionValue(0), rY = useMotionValue(0), gX = useMotionValue(50);
  const srX = useSpring(rX, { stiffness: 80, damping: 18 });
  const srY = useSpring(rY, { stiffness: 80, damping: 18 });
  const sgX = useSpring(gX, { stiffness: 80, damping: 18 });
  const glare = useTransform(sgX, v =>
    `radial-gradient(ellipse 85% 42% at ${v}% 18%, rgba(255,255,255,0.12) 0%, transparent 55%)`
  );
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    rX.set(-cy * 5); rY.set(cx * 5); gX.set((cx + 0.5) * 100);
  }, [rX, rY, gX]);
  const onLeave = useCallback(() => { rX.set(0); rY.set(0); gX.set(50); }, [rX, rY, gX]);

  return (
    <motion.div
      ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", willChange: "transform" }}
      className="relative w-full"
    >
      {children}
      <motion.div
        style={{ background: glare }}
        className="absolute inset-0 rounded-[2rem] pointer-events-none z-10"
      />
    </motion.div>
  );
}

// ─── Annotation pin ────────────────────────────────────────────────────────────
// Positioned by % relative to the image card so it scales with the card.
// Appears only after the image has fully arrived (driven by pinsOp in Hero).
// Pulse ring provides the "live" signal feel.
function AnnotationPin({
  top, left, icon, label, delay, color,
}: {
  top: string; left: string;
  icon: React.ReactNode; label: string;
  delay: number; color: string;
}) {
  return (
    <motion.div
      className="absolute z-20 flex items-center gap-2 pointer-events-none"
      style={{ top, left }}
      initial={{ opacity: 0, scale: 0.7, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Dot with pulse ring */}
      <div className="relative shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: color, boxShadow: `0 0 0 3px ${color}30` }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: delay + 0.4 }}
          style={{ background: color }}
        />
      </div>
      {/* Label pill */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap"
        style={{
          background: "rgba(10,6,26,0.78)",
          border: `1px solid ${color}28`,
          backdropFilter: "blur(14px)",
          color: "#fff",
          boxShadow: `0 4px 16px rgba(0,0,0,0.35), 0 0 0 1px ${color}18`,
        }}
      >
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, email, firstname } = useAuth();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 55, damping: 22, restDelta: 0.0004 });
  const velocity = useVelocity(smooth);
  const velocityScale = useTransform(velocity, [-0.5, 0, 0.5], [1.03, 1, 0.97]);

  // ── Headline keypoints ────────────────────────────────────────────────────
  const hlOp = useTransform(smooth, [0.08, 0.36], [1, 0]);
  const hlY = useTransform(smooth, [0, 0.36], ["0%", "-12%"]);
  const hlScale = useTransform(smooth, [0, 0.36], [1, 0.9]);
  const topFade = useTransform(smooth, [0.05, 0.24], [1, 0]);
  const ctaOp = useTransform(smooth, [0.05, 0.24], [1, 0]);

  const combinedHlScale = useTransform(
    [hlScale, velocityScale] as any,
    ([s, vs]: number[]) => (s as number) * (vs as number)
  );

  // ── Dashboard image: ONE continuous scroll-driven animation ──────────────
  //
  // Three acts, zero scene switching:
  //
  // ACT 1 [0 → 0.1]   Image is present from frame 1, oblique and semi-transparent.
  //                    It coexists with the headline as part of the composition.
  //                    The right/bottom edge fades keep it from competing with the text.
  //
  // ACT 2 [0.1 → 0.72] As the user scrolls, all skew values interpolate to 0.
  //                     Opacity, scale, and blur also resolve simultaneously.
  //                     The headline is fading in [0.08–0.36] — they overlap.
  //                     This overlap is the handoff: the image responds to the
  //                     user leaving the headline, creating one continuous motion
  //                     instead of two sequential scenes.
  //
  // ACT 3 [0.72+]      Image rests. Annotation pins appear.
  //                     Edge fades are fully dissolved. TiltCard hover activates.

  const imgX = useTransform(smooth, [0, 0.72], ["45%", "0%"]);
  const imgRotY = useTransform(smooth, [0, 0.72], [-35, 0]);
  const imgRotX = useTransform(smooth, [0, 0.72], [15, 0]);
  const imgRotZ = useTransform(smooth, [0, 0.72], [-4, 0]);
  const imgOpacity = useTransform(smooth, [0, 0.62], [0.4, 1]);
  const imgScale = useTransform(smooth, [0, 0.72], [1.15, 1]);
  const imgBlur = useTransform(smooth, [0, 0.55], [2, 0]);
  const imgFilter = useTransform(imgBlur, v => `blur(${v}px)`);

  // Edge gradients — dissolve as image arrives so they don't look wrong at rest
  const edgeRightOp = useTransform(smooth, [0.20, 0.65], [1, 0]);
  const edgeBottomOp = useTransform(smooth, [0.20, 0.65], [1, 0]);

  // Ambient glow — grows behind image as it arrives
  const glowOp = useTransform(smooth, [0.25, 0.70], [0, 0.85]);

  // Annotation pins — appear after image has settled
  const pinsOp = useTransform(smooth, [0.70, 0.84], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[350vh]"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&display=swap');

        .grad-text {
          background: linear-gradient(120deg, #a480d1 0%, #ffffff 50%, #a480d1 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 6s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }

        .glass-nav {
          background: rgba(12,7,30,0.45);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
        }
        .glass-purple {
          background: rgba(123,95,162,0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(123,95,162,0.18);
        }
        .btn-primary {
          background: linear-gradient(135deg, #7b5fa2, #9d7bdd);
          box-shadow: 0 6px 28px rgba(123,95,162,0.40), inset 0 1px 0 rgba(255,255,255,0.18);
          transition: all 0.24s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 44px rgba(123,95,162,0.50);
        }
        .btn-ghost {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(12px);
          transition: all 0.24s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }
        .nav-link { position: relative; }
        .nav-link::after {
          content: ''; position: absolute; bottom: -3px; left: 0;
          height: 1.5px; width: 0; background: #9d7bdd; border-radius: 2px;
          transition: width 0.22s ease;
        }
        .nav-link:hover::after { width: 100%; }
        .hero-dot-grid {
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

      {/* ── Sticky viewport ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Background */}
        <div
          className="absolute inset-0 z-0"
          style={{ background: "linear-gradient(155deg, #0c071e 0%, #110a2a 45%, #0e0820 100%)" }}
        />
        <div className="absolute inset-0 z-0 hero-dot-grid" />
        <MeshGradient />

        {/* ── Navbar ──────────────────────────────────────────────────────── */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 flex items-center justify-between px-6 md:px-14 py-5 glass-nav border-b border-white/[0.07]"
        >
          <Link to="/" className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="p-1.5 rounded-xl"
              style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 4px 14px rgba(123,95,162,0.42)" }}
            >
              <Logo className="w-5 h-5 brightness-0 invert" />
            </motion.div>
            <span className="text-[1.15rem] font-extrabold text-white tracking-tight">Stocks</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {[["#features", "Fonctionnalités"], ["#advantages", "Avantages"]].map(([h, l]) => (
              <a key={l} href={h} className="nav-link text-purple-200/70 hover:text-white transition-colors">{l}</a>
            ))}
            <Link to="/tarifs" className="nav-link text-purple-200/70 hover:text-white transition-colors">Tarifs</Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 4px 14px rgba(123,95,162,0.38)" }}
                title="Mon profil"
              >
                {email ? email.charAt(0).toUpperCase() : (firstname ? firstname.charAt(0).toUpperCase() : "U")}
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-purple-200/70 hover:text-white px-3 py-2 transition-colors">
                  Se connecter
                </Link>
                <Link to="/register" className="btn-primary text-white text-sm font-bold px-6 py-2.5 rounded-full">
                  S'inscrire
                </Link>
              </>
            )}
            <button className="md:hidden p-2 text-purple-200/60" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-4 right-4 mt-2 rounded-2xl p-6 flex flex-col gap-5 md:hidden"
                style={{
                  background: "rgba(12,7,30,0.92)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
                  zIndex: 99,
                }}
              >
                {[["#features", "Fonctionnalités"], ["#advantages", "Avantages"], ["/tarifs", "Tarifs"]].map(([h, l]) => (
                  <a key={l} href={h} className="text-base font-bold text-white" onClick={() => setMobileOpen(false)}>{l}</a>
                ))}
                <div className="border-t border-white/10 pt-4">
                  {isAuthenticated ? (
                    <Link to="/profile" className="block text-center font-bold text-purple-200/70" onClick={() => setMobileOpen(false)}>
                      Aller au profil
                    </Link>
                  ) : (
                    <Link to="/login" className="block text-center font-bold text-purple-200/70" onClick={() => setMobileOpen(false)}>
                      Se connecter
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* ── Stage ──────────────────────────────────────────────────────────── */}
        <div className="relative h-[calc(100vh-73px)] overflow-hidden">

          {/* ── LAYER 1: Headline ───────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-x-0 top-0 z-20 flex flex-col items-center lg:items-start text-center lg:text-left pt-14 md:pt-20 px-6 lg:px-20 max-w-7xl mx-auto"
            style={{
              opacity: hlOp,
              y: hlY,
              scale: combinedHlScale,
              transformOrigin: "top left",
              willChange: "transform, opacity",
            }}
          >
            <motion.div
              style={{ opacity: topFade }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 pl-1.5 pr-5 py-1.5 rounded-full glass-purple mb-8"
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)" }}>
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-[11px] font-bold text-purple-300 tracking-wide uppercase">
                IA au service de vos stocks
              </span>
            </motion.div>

            <motion.h1
              className="text-[clamp(3rem,7vw,6.5rem)] font-[900] text-white leading-[0.95] tracking-[-0.04em] mb-7"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Gérez vos stocks.<br />
              <span className="grad-text">Libérez votre temps.</span>
            </motion.h1>

            <motion.p
              className="text-purple-200/65 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              Ne tombez plus jamais en rupture. Notre IA anticipe la demande avec 94% de précision et automatise vos réassorts en 2 clics.
            </motion.p>

            <motion.div
              style={{ opacity: ctaOp }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Demo is now the primary action */}
              <Link to="/demo"
                className="btn-primary inline-flex items-center gap-3 px-9 py-4 rounded-2xl text-[0.95rem] font-bold text-white">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-md">
                  <Play size={10} className="text-white fill-white ml-0.5" />
                </div>
                Voir la démo interactive
              </Link>
              <Link to="/register"
                className="btn-ghost inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-2xl text-[0.95rem]">
                Essai gratuit 14 jours <ChevronRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              style={{ opacity: topFade }}
              className="mt-10 flex flex-col items-center lg:items-start gap-2"
            >
              <motion.div
                animate={{ y: [0, 7, 0] }}
                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
              >
                <div className="w-1 h-1.5 rounded-full bg-white/30" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/25 pl-1">Scroll</span>
            </motion.div>
          </motion.div>

          {/* ── LAYER 2: Dashboard — single continuous scroll animation ─────────
               This div starts oblique (right-biased, rotated, faded) and
               smoothly resolves to centered + flat + full opacity as scroll
               progresses. No scene switching. No second sticky section.
               One object. One motion.                                          */}
          <div className="absolute inset-0 flex items-center justify-center z-10"
            style={{ paddingLeft: "clamp(1rem,5vw,8rem)", paddingRight: "clamp(1rem,5vw,8rem)" }}>
            <motion.div
              className="w-full max-w-[860px]"
              style={{
                x: imgX,
                rotateY: imgRotY,
                rotateX: imgRotX,
                rotateZ: imgRotZ,
                scale: imgScale,
                opacity: imgOpacity,
                filter: imgFilter,
                transformStyle: "preserve-3d",
                perspective: "1800px",
                willChange: "transform, opacity, filter",
              }}
            >
              {/* Ambient glow — grows as image arrives */}
              <motion.div
                style={{ opacity: glowOp }}
                className="absolute -inset-20 pointer-events-none -z-10"
              >
                <div style={{
                  width: "100%", height: "100%",
                  background: "radial-gradient(ellipse at 50% 55%, rgba(123,95,162,0.30) 0%, transparent 65%)",
                  filter: "blur(48px)",
                }} />
              </motion.div>

              {/* TiltCard: hover-driven rotateX/Y on top of scroll-driven transforms */}
              <TiltCard>
                <div
                  className="relative rounded-[2rem] overflow-hidden"
                  style={{
                    boxShadow: "0 40px 100px -20px rgba(123,95,162,0.38), 0 0 0 1px rgba(255,255,255,0.08), -20px 20px 60px rgba(0,0,0,0.45)",
                  }}
                >
                  <img
                    src={dashboardImage}
                    alt="Stocks — Tableau de bord"
                    className="w-full h-auto block"
                    draggable={false}
                  />

                  {/* Right edge fade: hides the cut-off edge during ACT 1 */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to left, #0c071e 0%, #0c071e 6%, transparent 38%)",
                      opacity: edgeRightOp,
                    }}
                  />

                  {/* Bottom edge fade: grounds the image during ACT 1 */}
                  <motion.div
                    className="absolute inset-x-0 bottom-0 pointer-events-none"
                    style={{
                      background: "linear-gradient(to top, #0c071e 0%, rgba(12,7,30,0.5) 28%, transparent 62%)",
                      height: "55%",
                      opacity: edgeBottomOp,
                    }}
                  />

                  {/* Top-edge highlight: always on */}
                  <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 5%, rgba(123,95,162,0.45) 50%, transparent 95%)" }}
                  />
                </div>

                {/* ── Annotation pins ──────────────────────────────────────────
                     Appear after the image lands. Positioned by % of the card
                     so they stay anchored to the dashboard regions they point at.
                     Each has a pulse ring to signal "live data".               */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{ opacity: pinsOp }}
                >
                  <AnnotationPin
                    top="16%"
                    left="5%"
                    icon={<TrendingUp size={11} />}
                    label="CA en temps réel"
                    delay={0.05}
                    color="#9d7bdd"
                  />
                  <AnnotationPin
                    top="10%"
                    left="56%"
                    icon={<Zap size={11} />}
                    label="Alertes IA"
                    delay={0.18}
                    color="#f59e0b"
                  />
                  <AnnotationPin
                    top="46%"
                    left="72%"
                    icon={<Bell size={11} />}
                    label="Alertes critiques"
                    delay={0.30}
                    color="#ef4444"
                  />
                </motion.div>
              </TiltCard>

              {/* ── Outcome Metrics Strip ──────────────────────────────────────
                   Fades in along with the pins using pinsOp to answer "so what?"
                   after the image has landed. */}
              <motion.div
                style={{ opacity: pinsOp }}
                className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 w-full"
              >
                {[
                  { value: "10+", label: "Modules disponibles" },
                  { value: "−30%", label: "De surstockage moyen" },
                  { value: "En direct", label: "Alertes prix & stocks" },
                  { value: "Inclus", label: "Assistant IA intégré" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <span className="text-3xl font-[900] text-white tracking-[-0.03em] leading-none mb-2">{stat.value}</span>
                    <span className="text-[10px] font-bold text-purple-200/50 uppercase tracking-[0.16em] leading-snug">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}