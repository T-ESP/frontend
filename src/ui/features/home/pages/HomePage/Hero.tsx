import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/ui/components/common/Logo";
import {
  TrendingUp, BarChart2, Zap, Package, Menu, X, ChevronRight, Play,
  ArrowUpRight, Sparkles
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";

// ─── Cursor orb ───────────────────────────────────────────────────────────────
function CursorOrb() {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const sx = useSpring(x, { stiffness: 70, damping: 18 });
  const sy = useSpring(y, { stiffness: 70, damping: 18 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  return (
    <motion.div
      style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%", pointerEvents: "none" }}
      className="fixed z-0 w-[700px] h-[700px] rounded-full"
      aria-hidden
    >
      <div className="w-full h-full rounded-full bg-[#7b5fa2] opacity-[0.06] blur-[120px]" />
    </motion.div>
  );
}

// ─── 3D tilt card ─────────────────────────────────────────────────────────────
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rX = useMotionValue(0);
  const rY = useMotionValue(0);
  const srX = useSpring(rX, { stiffness: 130, damping: 22 });
  const srY = useSpring(rY, { stiffness: 130, damping: 22 });
  const gPos = useMotionValue(0.5);
  const sgPos = useSpring(gPos, { stiffness: 130, damping: 22 });
  const glareX = useTransform(sgPos, [0, 1], ["0%", "100%"]);
  const glareStyle = useTransform(glareX, (x) =>
    `radial-gradient(ellipse at ${x} 25%, rgba(255,255,255,0.14) 0%, transparent 60%)`
  );

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = (e.clientX - r.left) / r.width - 0.5;
    const cy = (e.clientY - r.top) / r.height - 0.5;
    rX.set(-cy * 11);
    rY.set(cx * 11);
    gPos.set(cx + 0.5);
  }, [rX, rY, gPos]);

  const onLeave = useCallback(() => {
    rX.set(0); rY.set(0); gPos.set(0.5);
  }, [rX, rY, gPos]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: srX, rotateY: srY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div style={{ background: glareStyle }} className="absolute inset-0 rounded-[2.2rem] pointer-events-none z-10" />
    </motion.div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
interface CounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

function Counter({ to, duration = 1.5, suffix = "", prefix = "" }: CounterProps) {
  const [val, setVal] = useState(0);
  const nodeRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: DOMHighResTimeStamp) => {
          const p = Math.min((now - t0) / (duration * 1000), 1);
          setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (nodeRef.current) obs.observe(nodeRef.current);
    return () => obs.disconnect();
  }, [to, duration]);

  return <span ref={nodeRef}>{prefix}{val.toLocaleString("fr-FR")}{suffix}</span>;
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
interface MiniChartProps {
  values: number[];
  color?: string;
}

function MiniChart({ values, color = "#7b5fa2" }: MiniChartProps) {
  const max = Math.max(...values);
  return (
    <div className="flex items-end gap-[3px] h-full w-full">
      {values.map((v, i) => {
        const isLast = i === values.length - 1;
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.5 + i * 0.035, ease: "easeOut" }}
            style={{
              height: `${(v / max) * 100}%`,
              background: isLast ? color : `${color}38`,
              transformOrigin: "bottom",
              flexShrink: 0,
              flex: 1,
              borderRadius: "3px",
            }}
          />
        );
      })}
    </div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
interface SparklineProps {
  values: number[];
  color?: string;
  w?: number;
  h?: number;
}

function Sparkline({ values, color = "#7b5fa2", w = 88, h = 30 }: SparklineProps) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const rng = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / rng) * (h - 6) - 3}`)
    .join(" ");
  const id = `sg${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const BARS = [40, 60, 45, 70, 55, 80, 50, 75, 65, 90, 70, 100, 85];
const SPARK = [30, 45, 38, 60, 55, 72, 65, 80, 74, 90, 84, 95, 100];

// ─── Cinematic sequences ──────────────────────────────────────────────────────
// Scene timeline (seconds):
//  0.0 – 0.4 : overlay lifts (scene opens)
//  0.5 – 1.0 : badge + eyebrow slide in
//  0.8 – 1.6 : headline words wipe in sequentially
//  1.5 – 2.0 : subtext fades up
//  1.9 – 2.3 : CTAs pop
//  0.3 – 1.2 : dashboard card rises
//  0.9 – 1.6 : floating cards stagger in

const WORD_DELAY = 0.11; // gap between headline words

// Container that just orchestrates children
const scene: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.55 } },
};

// Generic fade-up (badge, sub, CTA)
const fadeUp: any = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

// Headline word wipe — clip-path reveal from bottom
const wordReveal: any = {
  hidden: { clipPath: "inset(0 0 110% 0)", opacity: 0, y: 18 },
  show: {
    clipPath: "inset(0 0 0% 0)", opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] }
  },
};

// CTA: spring pop
const ctaPop: any = {
  hidden: { opacity: 0, scale: 0.92, y: 14 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
  },
};

// Card bloom up
const cardBloom: any = {
  hidden: { opacity: 0, y: 64, scale: 0.91, filter: "blur(12px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }
  },
};

// ─── Cinematic overlay (scene-open flash) ─────────────────────────────────────
function CinematicOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[999] bg-white pointer-events-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
    />
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
export default function Hero() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Split headline into animatable words
  const line1 = "Gérez vos stocks".split(" ");
  const line2 = "en un clin d'œil.".split(" ");

  return (
    <section className="relative min-h-screen flex flex-col bg-[#fafafc] overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      <CinematicOverlay />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300&display=swap');

        .grad-text {
          background: linear-gradient(125deg, #6d4c96 0%, #a07cd0 45%, #7b5fa2 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }

        .glass {
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.92);
        }
        .glass-purple {
          background: rgba(123,95,162,0.055);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(123,95,162,0.14);
        }

        .btn-primary {
          background: linear-gradient(135deg, #7b5fa2 0%, #9d7bdd 100%);
          box-shadow: 0 6px 28px rgba(123,95,162,0.38), inset 0 1px 0 rgba(255,255,255,0.18);
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-primary:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 14px 44px rgba(123,95,162,0.48), inset 0 1px 0 rgba(255,255,255,0.18);
        }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
        }
        .btn-ghost:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }

        .nav-link { position: relative; }
        .nav-link::after {
          content: ''; position: absolute;
          bottom: -3px; left: 0; height: 1.5px; width: 0;
          background: #7b5fa2; border-radius: 2px;
          transition: width 0.22s ease;
        }
        .nav-link:hover::after { width: 100%; }

        .card-float { animation: cfloat 5.5s ease-in-out infinite; }
        .card-float-2 { animation: cfloat 6.5s ease-in-out infinite reverse; animation-delay: -1.8s; }
        .card-float-3 { animation: cfloat 7s ease-in-out infinite; animation-delay: -3.5s; }

        @keyframes cfloat {
          0%,100% { transform: translateY(0px); }
          40% { transform: translateY(-9px); }
          70% { transform: translateY(-4px); }
        }

        .stat-hover {
          transition: all 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .stat-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(123,95,162,0.13);
        }

        .noise-overlay::before {
          content: '';
          position: absolute; inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 2; opacity: 0.55;
        }
      `}</style>

      {/* Cursor orb */}
      <CursorOrb />

      {/* Mesh background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 70% 55% at 15% 5%,  rgba(123,95,162,0.11) 0%, transparent 65%),
          radial-gradient(ellipse 55% 45% at 88% 18%, rgba(176,142,224,0.09) 0%, transparent 60%),
          radial-gradient(ellipse 45% 40% at 55% 90%, rgba(123,95,162,0.06) 0%, transparent 60%),
          #fafafc`
      }} />

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]" style={{
        backgroundImage: "radial-gradient(#7b5fa2 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      {/* Animated blobs */}
      <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 6, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] right-[-8%] w-[60%] h-[60%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(157,123,221,0.16) 0%, transparent 70%)", filter: "blur(70px)" }} />
      <motion.div animate={{ scale: [1, 1.06, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute bottom-0 -left-[12%] w-[50%] h-[50%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(123,95,162,0.1) 0%, transparent 70%)", filter: "blur(90px)" }} />

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="relative z-50 sticky top-0 flex items-center justify-between px-6 md:px-14 py-4 glass border-b border-white/60">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div whileHover={{ scale: 1.1, rotate: 4 }} transition={{ type: "spring", stiffness: 380 }}
            className="p-1.5 rounded-xl"
            style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 4px 14px rgba(123,95,162,0.38)" }}>
            <Logo className="w-5 h-5 brightness-0 invert" />
          </motion.div>
          <span className="text-[1.15rem] font-extrabold text-gray-900 tracking-tight">Stocks</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a href="#features" className="nav-link text-gray-500 hover:text-gray-900 transition-colors">Fonctionnalités</a>
          <a href="#advantages" className="nav-link text-gray-500 hover:text-gray-900 transition-colors">Avantages</a>
          <Link to="/tarifs" className="nav-link text-gray-500 hover:text-gray-900 transition-colors">Tarifs</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-sm font-semibold text-gray-500 hover:text-gray-800 px-3 py-2 transition-colors">
            Se connecter
          </Link>
          <Link to="/register" className="btn-primary text-white text-sm font-bold px-6 py-2.5 rounded-full">
            S'inscrire
          </Link>
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-4 right-4 mt-2 glass rounded-2xl p-6 flex flex-col gap-5 md:hidden"
              style={{ boxShadow: "0 32px 64px rgba(0,0,0,0.07)" }}
            >
              {[["#features", "Fonctionnalités"], ["#advantages", "Avantages"], ["/tarifs", "Tarifs"]].map(([href, label]) => (
                <a key={label} href={href} className="text-[1rem] font-bold text-gray-800" onClick={() => setMobileOpen(false)}>{label}</a>
              ))}
              <div className="border-t border-gray-100 pt-4">
                <Link to="/login" className="block text-center font-bold text-gray-500">Se connecter</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-center gap-12 xl:gap-20 px-6 md:px-14 py-14 md:py-20 w-full max-w-[1380px] mx-auto">

        {/* Left */}
        <motion.div
          variants={scene} initial="hidden" animate="show"
          className="w-full lg:w-[52%] flex flex-col items-start"
        >
          {/* Pill badge */}
          <motion.div variants={fadeUp} className="mb-7">
            <div className="inline-flex items-center gap-2 pl-1.5 pr-5 py-1.5 rounded-full glass-purple">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#7b5fa2,#b08ee0)" }}>
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-[11px] font-bold text-[#7b5fa2] tracking-wide uppercase">IA au service de vos stocks</span>
            </div>
          </motion.div>

          {/* ── Cinematic Headline: word-by-word wipe ─────────────────── */}
          <div className="mb-6 overflow-visible">
            {/* Line 1 */}
            <div className="flex flex-wrap gap-x-[0.3em] gap-y-0">
              {line1.map((word, i) => (
                <motion.span
                  key={`l1-${i}`}
                  variants={wordReveal}
                  className="text-[clamp(2.75rem,5.2vw,5rem)] font-[900] text-gray-900 leading-[1.05] tracking-[-0.03em] block"
                  style={{ display: "inline-block" }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            {/* Line 2 — gradient colored */}
            <div className="flex flex-wrap gap-x-[0.3em] gap-y-0 mt-[-0.06em]">
              {line2.map((word, i) => (
                <motion.span
                  key={`l2-${i}`}
                  variants={wordReveal}
                  transition={{ delay: line1.length * WORD_DELAY + i * WORD_DELAY } as any}
                  className="grad-text text-[clamp(2.75rem,5.2vw,5rem)] font-[900] leading-[1.05] tracking-[-0.03em] block"
                  style={{ display: "inline-block" }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Sub */}
          <motion.p variants={fadeUp}
            className="text-gray-400 text-[1.05rem] md:text-[1.15rem] leading-[1.75] mb-10 max-w-[480px]"
            style={{ fontWeight: 300 }}
          >
            La plateforme tout-en-un pour les entreprises ambitieuses. Suivez, analysez et anticipez vos stocks — en temps réel.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={ctaPop} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
            <Link to="/register"
              className="btn-primary inline-flex items-center justify-center gap-2 text-white font-bold px-9 py-4 rounded-2xl text-[0.95rem]">
              Commencer gratuitement
              <ChevronRight size={18} />
            </Link>
            <button className="btn-ghost glass inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl text-[0.95rem] font-bold text-gray-700">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#7b5fa2,#b08ee0)", boxShadow: "0 4px 14px rgba(123,95,162,0.3)" }}>
                <Play size={11} className="text-white fill-white ml-0.5" />
              </div>
              Voir la démo
            </button>
          </motion.div>

          {/* Social proof row */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["#c4b5fd", "#a78bfa", "#8b5cf6", "#7c3aed"].map((bg, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-[2.5px] border-white flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: bg, zIndex: 4 - i }}>
                    {["ML", "SA", "TD", "JR"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900"><Counter to={2400} suffix="+" /> clients</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  {[...Array(5)].map((_, i) => <span key={i} className="text-[#7b5fa2] text-xs leading-none">★</span>)}
                  <span className="text-[10px] text-gray-400 ml-1.5">4.9/5</span>
                </div>
              </div>
            </div>

            <div className="w-px h-9 bg-gray-200 hidden sm:block" />

            <div className="flex gap-6">
              {[{ v: 99, s: "%", l: "Uptime SLA" }, { v: 50, p: "<", s: "ms", l: "Latence API" }].map(({ v, s, p, l }) => (
                <div key={l}>
                  <p className="text-sm font-extrabold text-gray-900 tabular-nums">
                    <Counter to={v} suffix={s} prefix={p || ""} />
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{l}</p>
                </div>
              ))}
            </div>

            <div className="w-px h-9 bg-gray-200 hidden sm:block" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block">RGPD · Données FR</p>
          </motion.div>
        </motion.div>

        {/* Right — 3D dashboard */}
        <div className="w-full lg:w-[48%] flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-[570px]">

            {/* Floating — Performances */}
            <motion.div
              variants={cardBloom}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.72, duration: 0.7, ease: [0.16, 1, 0.3, 1] } as any}
              className="card-float absolute -top-10 -left-10 z-20"
            >
              <div className="glass rounded-2xl px-4 py-3.5 w-52" style={{ boxShadow: "0 20px 56px rgba(123,95,162,0.14)" }}>
                <p className="text-[9px] font-bold text-gray-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-[0.14em]">
                  <BarChart2 size={10} className="text-[#7b5fa2]" /> Performances
                </p>
                <div className="h-14">
                  <MiniChart values={[60, 75, 65, 85, 90, 80, 95]} color="#7b5fa2" />
                </div>
              </div>
            </motion.div>

            {/* Floating — AI insight */}
            <motion.div
              initial={{ opacity: 0, x: 26, y: -12 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="card-float-2 absolute -top-14 -right-4 z-20"
            >
              <div className="glass rounded-2xl px-4 py-4 w-[262px]" style={{ boxShadow: "0 20px 56px rgba(123,95,162,0.14)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", boxShadow: "0 4px 12px rgba(251,146,60,0.2)" }}>
                    <Zap size={15} className="text-orange-400" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[12px] font-extrabold text-gray-800 mb-0.5">Assistant IA</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Réapprovisionnez vos stocks bio — demande <span className="text-[#7b5fa2] font-bold">+45%</span> ce week-end.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating — Alert */}
            <motion.div
              initial={{ opacity: 0, x: 18, y: 28 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="card-float-3 absolute -bottom-8 -right-12 z-20"
            >
              <div className="glass rounded-2xl px-4 py-4 w-[238px]" style={{ boxShadow: "0 20px 56px rgba(239,68,68,0.09)" }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#fff1f2,#ffe4e6)" }}>
                    <Package size={15} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest mb-0.5">Stock Critique</p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">32 références sous le seuil minimal.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main dashboard card */}
            <motion.div
              variants={cardBloom}
              initial="hidden"
              animate="show"
            >
              <TiltCard className="noise-overlay">
                <div className="bg-white rounded-[2.2rem] p-7 border border-gray-100"
                  style={{ boxShadow: "0 48px 96px -24px rgba(123,95,162,0.2), 0 0 0 1px rgba(123,95,162,0.06), 0 1px 0 rgba(255,255,255,0.9) inset" }}>

                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.16em] mb-1">Tableau de bord</p>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-[1.2rem] font-[900] text-gray-900 tracking-tight">Vue d'ensemble</h3>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          En direct
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {[["bg-red-300", "opacity-60"], ["bg-yellow-300", "opacity-60"], ["bg-green-400", "opacity-70"]].map(([c, o], i) => (
                        <span key={i} className={`w-3 h-3 rounded-full ${c} ${o}`} />
                      ))}
                    </div>
                  </div>

                  {/* Revenue block */}
                  <div className="flex items-center justify-between rounded-[1.2rem] px-5 py-5 mb-5"
                    style={{ background: "linear-gradient(135deg, rgba(123,95,162,0.07) 0%, rgba(157,123,221,0.07) 100%)", border: "1px solid rgba(123,95,162,0.1)" }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 8px 20px rgba(123,95,162,0.3)" }}>
                        <TrendingUp size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CA Mensuel</p>
                        <p className="text-2xl font-[900] text-gray-900 tabular-nums">€248.5K</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-bold text-[11px] border border-emerald-100">
                        <ArrowUpRight size={12} /> +14.2%
                      </div>
                      <Sparkline values={SPARK} color="#7b5fa2" />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: "Stocks Actifs", val: "1,284", emoji: "📦", up: true, delta: "+7% ce mois" },
                      { label: "Commandes", val: "42", emoji: "🛒", up: false, delta: "−2 ce mois" },
                    ].map(({ label, val, emoji, up, delta }) => (
                      <div key={label} className="stat-hover rounded-[1.1rem] px-4 py-4 border border-gray-100 bg-gray-50/70 cursor-default">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{label}</p>
                          <span className="text-[1rem]">{emoji}</span>
                        </div>
                        <p className="text-[1.4rem] font-[900] text-gray-900 tabular-nums mb-0.5">{val}</p>
                        <p className={`text-[10px] font-bold ${up ? "text-emerald-500" : "text-rose-400"}`}>{delta}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bar chart */}
                  <div className="rounded-[1.1rem] p-4 border border-gray-100 bg-gray-50/70">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Activité — 13 semaines</p>
                      <span className="text-[10px] font-bold text-[#7b5fa2]">+31.4% ↑</span>
                    </div>
                    <div className="h-20">
                      <MiniChart values={BARS} color="#7b5fa2" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}