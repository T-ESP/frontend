import { useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import dashboardImage from '@/assets/images/image.png';
import { Logo } from "@/ui/components/common/Logo";
import {
  BarChart2, Zap, Package, Menu, X, ChevronRight, Play,
  Sparkles,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import { useAuth } from "@/ui/features/auth/hooks/useAuth";

// ─── 3D Tilt card ─────────────────────────────────────────────────────────────
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rX = useMotionValue(0), rY = useMotionValue(0), gX = useMotionValue(50);
  const srX = useSpring(rX, { stiffness: 100, damping: 20 });
  const srY = useSpring(rY, { stiffness: 100, damping: 20 });
  const sgX = useSpring(gX, { stiffness: 100, damping: 20 });
  const glare = useTransform(sgX, v =>
    `radial-gradient(ellipse 85% 42% at ${v}% 18%, rgba(255,255,255,0.16) 0%, transparent 55%)`
  );
  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    rX.set(-cy * 7); rY.set(cx * 7); gX.set((cx + 0.5) * 100);
  }, [rX, rY, gX]);
  const onLeave = useCallback(() => { rX.set(0); rY.set(0); gX.set(50); }, [rX, rY, gX]);

  return (
    <motion.div
      ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d", willChange: "transform" }}
      className="relative"
    >
      {children}
      <motion.div style={{ background: glare }} className="absolute inset-0 rounded-[2.4rem] pointer-events-none z-10" />
    </motion.div>
  );
}

// ─── Scroll-driven bar chart ──────────────────────────────────────────────────
// progress: 0→1 motion value that drives bar heights
function ScrollBars({ values, color = "#7b5fa2", progress }: {
  values: number[]; color?: string; progress: MotionValue<any>;
}) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-[3px] h-full w-full">
      {values.map((v, i) => {
        // Each bar starts animating slightly after the previous one (stagger via offset)
        const barProgress = useTransform(progress as any, [i / values.length * 0.6, Math.min((i / values.length * 0.6) + 0.5, 1)], [0, 1]);
        const height = useTransform(barProgress, p => `${(p as number) * (v / max) * 100}%`);
        return (
          <motion.div
            key={i}
            style={{
              height,
              background: i === values.length - 1 ? color : `${color}38`,
              transformOrigin: "bottom",
              flex: 1,
              borderRadius: 3,
              minHeight: 2,
              willChange: "height",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Scroll-driven bar chart ──────────────────────────────────────────────────

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

  // ── Scroll keypoints ─────────────────────────────────────────────────────
  // Section is 350vh. Headline lives in [0, 0.38]. Dashboard lives in [0.28, 0.85].
  // The overlap [0.28, 0.38] is where both are visible — that's the handoff moment.

  // Headline
  const hlOp = useTransform(smooth, [0.08, 0.38], [1, 0]);
  const hlY = useTransform(smooth, [0, 0.38], ["0%", "-14%"]);
  const hlScale = useTransform(smooth, [0, 0.38], [1, 0.88]);
  const topFade = useTransform(smooth, [0.05, 0.26], [1, 0]);
  const ctaOp = useTransform(smooth, [0.05, 0.26], [1, 0]);

  // Dashboard outer: starts centered but scaled down + tilted, arrives fully by 0.78
  // FIX: use translateY from center (not bottom-anchor) so card is fully visible
  const dashY = useTransform(smooth, [0.28, 0.78], ["60%", "0%"]);
  const dashScale = useTransform(smooth, [0.28, 0.78], [0.78, 1]);
  const dashOp = useTransform(smooth, [0.28, 0.42], [0, 1]);
  const dashRotateX = useTransform(smooth, [0.28, 0.75], [18, 0]);

  // Internal dashboard animations — driven by a sub-range of scroll
  // "content progress" goes 0→1 between scroll 0.40 and 0.85
  const contentProgress = useTransform(smooth, [0.40, 0.85], [0, 1]);

  // Floating cards: each converges from a different direction
  // They start offset and move toward the main card as dashY settles
  const floatOp = useTransform(smooth, [0.35, 0.55], [0, 1]);

  // LEFT card: starts far left + up, converges inward
  const floatLeftX = useTransform(smooth, [0.28, 0.72], ["-80px", "0px"]);
  const floatLeftY = useTransform(smooth, [0.28, 0.72], ["-40px", "0px"]);

  // RIGHT card: starts far right + up
  const floatRightX = useTransform(smooth, [0.28, 0.72], ["80px", "0px"]);
  const floatRightY = useTransform(smooth, [0.28, 0.72], ["-40px", "0px"]);

  // SIDE card: starts from right, mid-height
  const floatSideX = useTransform(smooth, [0.35, 0.75], ["60px", "0px"]);

  // Ambient glow
  const glowOp = useTransform(smooth, [0.28, 0.60], [0, 0.7]);

  // Combined headline scale (scroll-driven × velocity-driven)
  const combinedHlScale = useTransform(
    [hlScale, velocityScale] as any,
    ([s, vs]: number[]) => (s as number) * (vs as number)
  );

  return (
    // 350vh — generous scroll range for a slow, considered pace
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

        .glass {
          background: rgba(20, 15, 34, 0.4);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          /* border: 1px solid rgba(255,255,255,0.86); */
        }
        .glass-card {
          background: rgba(255,255,255,0.74);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.86);
        }
        .glass-purple {
          background: rgba(123,95,162,0.06);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(123,95,162,0.14);
        }
        .btn-primary {
          background: linear-gradient(135deg, #7b5fa2, #7b5fa2);
          box-shadow: 0 6px 28px rgba(123,95,162,0.36), inset 0 1px 0 rgba(255,255,255,0.18);
          transition: all 0.24s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 44px rgba(123,95,162,0.44); }
        .btn-ghost {
          background: rgba(255,255,255,0.1); color: white;
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          transition: all 0.24s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-ghost:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

        .nav-link { position: relative; }
        .nav-link::after {
          content: ''; position: absolute; bottom: -3px; left: 0;
          height: 1.5px; width: 0; background: #7b5fa2; border-radius: 2px;
          transition: width 0.22s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .float-a { animation: fa 5.3s ease-in-out infinite; }
        .float-b { animation: fa 6.7s ease-in-out infinite reverse; animation-delay: -2.1s; }
        .float-c { animation: fa 4.9s ease-in-out infinite; animation-delay: -1.4s; }
        @keyframes fa { 0%,100%{transform:translateY(0)} 48%{transform:translateY(-9px)} }

        /* Top-edge light on dashboard card */
        .card-edge::before {
          content: '';
          position: absolute; top: 0; left: 8%; right: 8%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(123,95,162,0.35), transparent);
        }
      `}</style>

      {/* ── Sticky viewport ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 h-screen">

        {/* ── Navbar ────────────────────────────────────────────────────────── */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-50 flex items-center justify-between px-6 md:px-14 py-5 glass border-b border-white/10"
        >
          <Link to="/" className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="p-1.5 rounded-xl"
              style={{ background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)", boxShadow: "0 4px 14px rgba(123,95,162,0.38)" }}
            >
              <Logo className="w-5 h-5 brightness-0 invert" />
            </motion.div>
            <span className="text-[1.15rem] font-extrabold text-white tracking-tight">Stocks</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {[["#features", "Fonctionnalités"], ["#advantages", "Avantages"]].map(([h, l]) => (
              <a key={l} href={h} className="nav-link text-purple-100 hover:text-white transition-colors">{l}</a>
            ))}
            <Link to="/tarifs" className="nav-link text-purple-100 hover:text-white transition-colors">Tarifs</Link>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-[0_4px_14px_rgba(123,95,162,0.38)] transition-transform hover:scale-105"
                style={{ background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)" }}
                title="Mon profil"
              >
                {email ? email.charAt(0).toUpperCase() : (firstname ? firstname.charAt(0).toUpperCase() : "U")}
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-sm font-semibold text-purple-100 hover:text-white px-3 py-2 transition-colors">
                  Se connecter
                </Link>
                <Link to="/register" className="btn-primary text-white text-sm font-bold px-6 py-2.5 rounded-full">
                  S'inscrire
                </Link>
              </>
            )}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(o => !o)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-4 right-4 mt-2 glass rounded-2xl p-6 flex flex-col gap-5 md:hidden"
                style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.07)", zIndex: 99 }}
              >
                {[["#features", "Fonctionnalités"], ["#advantages", "Avantages"], ["/tarifs", "Tarifs"]].map(([h, l]) => (
                  <a key={l} href={h} className="text-base font-bold text-white" onClick={() => setMobileOpen(false)}>{l}</a>
                ))}
                <div className="border-t border-white/10 pt-4">
                  {isAuthenticated ? (
                    <Link to="/profile" className="block text-center font-bold text-purple-100" onClick={() => setMobileOpen(false)}>Aller au profil</Link>
                  ) : (
                    <Link to="/login" className="block text-center font-bold text-purple-100" onClick={() => setMobileOpen(false)}>Se connecter</Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* ── Stage: full remaining viewport height ─────────────────────────── */}
        <div className="relative h-[calc(100vh-73px)] overflow-hidden">

          {/* ── LAYER 1: Headline ──────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-x-0 top-0 z-20 flex flex-col items-center lg:items-start text-center lg:text-left pt-14 md:pt-20 px-6 lg:px-20 max-w-7xl mx-auto"
            style={{
              opacity: hlOp,
              y: hlY,
              scale: combinedHlScale,
              transformOrigin: "top center",
              willChange: "transform, opacity",
            }}
          >
            <motion.div
              style={{ opacity: topFade }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 pl-1.5 pr-5 py-1.5 rounded-full glass-purple mb-8"
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)" }}>
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-[11px] font-bold text-[#7b5fa2] tracking-wide uppercase">IA au service de vos stocks</span>
            </motion.div>

            <motion.h1
              className="text-[clamp(3rem,7vw,6.5rem)] font-[900] text-white leading-[0.95] tracking-[-0.04em] mb-7"
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              Gérez vos stocks.<br />
              <span className="grad-text">Libérez votre temps.</span>
            </motion.h1>

            <motion.p
              className="text-purple-100/90 text-lg md:text-xl max-w-xl leading-relaxed mb-10 font-light"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              La plateforme tout-en-un pour les équipes ambitieuses. Anticipez la demande, automatisez les commandes, maximisez vos marges.
            </motion.p>

            <motion.div
              style={{ opacity: ctaOp }}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-white font-bold px-9 py-4 rounded-2xl text-[0.95rem]">
                Commencer gratuitement <ChevronRight size={18} />
              </Link>
              <button className="btn-ghost inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-[0.95rem] font-bold text-gray-200">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)", boxShadow: "0 4px 14px rgba(123,95,162,0.3)" }}>
                  <Play size={11} className="text-white fill-white ml-0.5" />
                </div>
                Voir la démo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
              style={{ opacity: topFade }}
              className="mt-10 flex flex-col items-center lg:items-start gap-2"
            >
              <motion.div
                animate={{ y: [0, 7, 0] }} transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
                className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
              >
                <div className="w-1 h-1.5 rounded-full bg-gray-300" />
              </motion.div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-300 pl-1">Scroll</span>
            </motion.div>

            {/* Dashboard Preview - Absolute Right Side */}
            <div 
              className="hidden lg:block absolute top-[5%] -right-[15%] w-[850px] pointer-events-none z-0"
              style={{ perspective: "2000px" }}
            >
              <motion.div
                initial={{ opacity: 0, x: 150, rotateY: -35, rotateX: 15, rotateZ: -5 }}
                animate={{ opacity: 0.35, x: 0, rotateY: -25, rotateX: 10, rotateZ: -2 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="relative"
              >
                {/* The dashboard image */}
                <img 
                  src={dashboardImage} 
                  alt="App Preview" 
                  className="w-full h-auto rounded-3xl"
                  style={{
                    boxShadow: "-20px 40px 100px rgba(123, 95, 162, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                  }}
                />

                {/* The "Fade Out" effect overlays */}
                {/* 1. Fades the right edge into the dark background */}
                <div className="absolute inset-0 bg-gradient-to-l from-[#0c071e] via-transparent to-transparent rounded-3xl" />
                
                {/* 2. Fades the bottom edge */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c071e] via-[#0c071e]/40 to-transparent rounded-b-3xl" />
              </motion.div>
            </div>

          </motion.div>

          {/* ── LAYER 2: Dashboard — centered, fully visible ───────────────────
               FIX: absolute inset-0 flex centering replaces bottom-0 anchor.
               The card is always centered in the viewport — scroll drives scale/rotateX.
               This guarantees the full card is visible at arrival.              */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-4 md:px-10 z-10"
            style={{
              y: dashY,
              scale: dashScale,
              opacity: dashOp,
              rotateX: dashRotateX,
              transformStyle: "preserve-3d",
              perspective: "1400px",
              willChange: "transform, opacity",
            }}
          >
            <div className="relative w-full max-w-[860px]">

              {/* Ambient glow */}
              <motion.div style={{ opacity: glowOp }} className="absolute -inset-16 pointer-events-none -z-10">
                <div className="w-full h-full rounded-full"
                  style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(123,95,162,0.2) 0%, transparent 65%)", filter: "blur(48px)" }} />
              </motion.div>

              {/* ── Floating card LEFT (Performances) ─────────────────────────
                   scroll-driven x/y converge to 0,0 as dashboard arrives        */}
              <motion.div
                style={{ x: floatLeftX, y: floatLeftY, opacity: floatOp }}
                className="float-b absolute -top-14 -left-6 md:-left-12 z-30"
              >
                <div className="glass-card rounded-2xl px-4 py-3.5 w-52"
                  style={{ boxShadow: "0 20px 48px rgba(123,95,162,0.13)" }}>
                  <p className="text-[9px] font-bold text-gray-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-[0.14em]">
                    <BarChart2 size={10} className="text-[#7b5fa2]" /> Performances
                  </p>
                  {/* This mini chart is also scroll-driven */}
                  <div className="h-12">
                    <ScrollBars values={[60, 75, 65, 85, 90, 80, 95]} progress={contentProgress} />
                  </div>
                </div>
              </motion.div>

              {/* ── Floating card RIGHT (AI) ──────────────────────────────────
                   starts top-right, converges inward                           */}
              <motion.div
                style={{ x: floatRightX, y: floatRightY, opacity: floatOp }}
                className="float-a absolute -top-14 -right-6 md:-right-12 z-30"
              >
                <div className="glass-card rounded-2xl px-4 py-4 w-64"
                  style={{ boxShadow: "0 20px 48px rgba(123,95,162,0.13)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", boxShadow: "0 4px 12px rgba(251,146,60,0.18)" }}>
                      <Zap size={15} className="text-orange-400" fill="currentColor" />
                    </div>
                    <div>
                      <p className="text-[12px] font-extrabold text-gray-800 mb-0.5">Assistant IA</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        Réapprovisionnez vos stocks bio — demande{" "}
                        <span className="text-[#7b5fa2] font-bold">+45%</span> ce week-end.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Floating card SIDE (Alert) ────────────────────────────────
                   starts from right, mid-height                                */}
              <motion.div
                style={{ x: floatSideX, opacity: floatOp }}
                className="float-c absolute top-[28%] -right-4 md:-right-14 z-30 hidden md:block"
              >
                <div className="glass-card rounded-2xl px-4 py-4 w-52"
                  style={{ boxShadow: "0 20px 48px rgba(239,68,68,0.08)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#fff1f2,#ffe4e6)" }}>
                      <Package size={15} className="text-rose-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest mb-0.5">Stock Critique</p>
                      <p className="text-[11px] text-gray-500 leading-relaxed">32 références sous le seuil.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── Main dashboard card ──────────────────────────────────────── */}
              <TiltCard>
                <div
                  className="card-edge relative bg-white/5 rounded-[2.4rem] border border-white/10 p-3"
                  style={{ boxShadow: "0 32px 80px -16px rgba(123,95,162,0.18), 0 0 0 1px rgba(123,95,162,0.05)" }}
                >
                  <img 
                    src={dashboardImage} 
                    alt="Dashboard Preview" 
                    className="w-full h-auto rounded-[2rem] shadow-2xl" 
                  />
                </div>
              </TiltCard>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}