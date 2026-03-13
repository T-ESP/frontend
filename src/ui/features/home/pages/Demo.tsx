import { useState, useRef, useEffect, useCallback, type JSX } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import {
    BarChart2, Package, ShoppingCart, Sparkles, Bell,
    TrendingUp, ChevronRight, ArrowLeft,
    AlertTriangle, Check, RefreshCw, Award, Play,
    Menu, X,
} from "lucide-react";
import { FiPackage as FiPkg, FiShoppingCart, FiUsers } from "react-icons/fi";
import { Logo } from "@/ui/components/common/Logo";
import { useAuth } from "@/ui/features/auth/hooks/useAuth";
import demoVideo from "@/assets/stocks-demo.mp4";

// ─── Design tokens ────────────────────────────────────────────────────────────
const BRAND = "#7b5fa2";
const BRAND_L = "#9d7bdd";

// ─── Navbar (identique LP) ────────────────────────────────────────────────────
function DemoNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated, email, firstname } = useAuth();

    // Mouse-tracking mesh gradient (même que LP)
    const mx = useMotionValue(0.5);
    const my = useMotionValue(0.5);
    const smx = useSpring(mx, { stiffness: 32, damping: 16 });
    const smy = useSpring(my, { stiffness: 32, damping: 16 });
    const px = useMotionValue("50%");
    const py = useMotionValue("50%");
    useEffect(() => {
        const unsub1 = smx.on("change", v => px.set(`${(v * 100).toFixed(1)}%`));
        const unsub2 = smy.on("change", v => py.set(`${(v * 100).toFixed(1)}%`));
        return () => { unsub1(); unsub2(); };
    }, [smx, smy, px, py]);
    const bg = useMotionTemplate`radial-gradient(ellipse 70% 55% at ${px} ${py}, rgba(123,95,162,0.18) 0%, transparent 60%)`;

    const attachRef = useCallback((node: HTMLElement | null) => {
        if (!node) return;
        const move = (e: MouseEvent) => {
            mx.set(e.clientX / window.innerWidth);
            my.set(e.clientY / window.innerHeight);
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, [mx, my]);

    return (
        <motion.nav
            ref={attachRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-50 flex items-center justify-between px-5 md:px-14 py-4 md:py-5"
            style={{
                background: "rgba(12,7,30,0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
        >
            {/* Mesh gradient */}
            <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: bg }} />

            <Link to="/" className="relative z-10 flex items-center gap-2.5">
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

            <div className="relative z-10 hidden md:flex items-center gap-8 text-sm font-semibold">
                {[["/#features", "Fonctionnalités"], ["/#advantages", "Avantages"]].map(([h, l]) => (
                    <a key={l} href={h} className="text-purple-200/70 hover:text-white transition-colors">{l}</a>
                ))}
                <Link to="/tarifs" className="text-purple-200/70 hover:text-white transition-colors">Tarifs</Link>
            </div>

            <div className="relative z-10 flex items-center gap-3">
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
                    <Link to="/login" className="hidden sm:block text-sm font-semibold text-purple-200/70 hover:text-white px-3 py-2 transition-colors">
                        Se connecter
                    </Link>
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
                        className="absolute top-full left-4 right-4 mt-2 rounded-2xl p-6 flex flex-col gap-5 md:hidden z-50"
                        style={{
                            background: "rgba(12,7,30,0.94)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            backdropFilter: "blur(24px)",
                            boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
                        }}
                    >
                        {[["/#features", "Fonctionnalités"], ["/#advantages", "Avantages"], ["/tarifs", "Tarifs"]].map(([h, l]) => (
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
    );
}

// ─── Slot vidéo ───────────────────────────────────────────────────────────────
const VIDEO_SRC = demoVideo;

function VideoSlot() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(false);

    const handlePlay = () => {
        if (!videoRef.current) return;
        videoRef.current.play();
        setPlaying(true);
    };

    // ── Placeholder (affiché tant que VIDEO_SRC est vide) ──────────────────
    if (!VIDEO_SRC) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-4xl mx-auto px-6 md:px-14 pb-4"
            >
                <div className="relative rounded-[2rem] overflow-hidden"
                    style={{
                        aspectRatio: "16 / 9",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(123,95,162,0.22)",
                        boxShadow: "0 32px 80px -16px rgba(123,95,162,0.28), 0 0 0 1px rgba(123,95,162,0.1)",
                    }}>

                    {/* Dot grid interne */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: "radial-gradient(rgba(123,95,162,0.18) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }} />

                    {/* Glow central */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(123,95,162,0.14) 0%, transparent 70%)",
                        }} />

                    {/* Contenu centré */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                        {/* Bouton play animé */}
                        <div className="relative">
                            <motion.div
                                animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0, 0.35] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full"
                                style={{ background: BRAND_L }}
                            />
                            <motion.div
                                animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0, 0.2] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
                                className="absolute -inset-4 rounded-full"
                                style={{ background: BRAND_L }}
                            />
                            <div
                                className="relative w-16 h-16 rounded-full flex items-center justify-center"
                                style={{
                                    background: `linear-gradient(135deg, ${BRAND}, ${BRAND_L})`,
                                    boxShadow: `0 8px 32px rgba(123,95,162,0.55)`,
                                }}>
                                <Play size={22} className="text-white ml-1" fill="white" />
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-white font-bold text-base mb-1">Vidéo de présentation</p>
                            <p className="text-[12px]" style={{ color: "rgba(176,142,224,0.5)" }}>
                                Disponible prochainement
                            </p>
                        </div>
                    </div>

                    {/* Badge coin haut gauche */}
                    <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                            style={{
                                background: "rgba(12,7,30,0.7)",
                                border: "1px solid rgba(123,95,162,0.25)",
                                backdropFilter: "blur(12px)",
                                color: BRAND_L,
                            }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                            Présentation
                        </span>
                    </div>
                </div>
            </motion.div>
        );
    }

    // ── Lecteur vidéo réel ─────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl mx-auto px-6 md:px-14 pb-4"
        >
            <div className="relative rounded-[2rem] overflow-hidden"
                style={{
                    aspectRatio: "16 / 9",
                    boxShadow: "0 32px 80px -16px rgba(123,95,162,0.32), 0 0 0 1px rgba(123,95,162,0.15)",
                }}>
                <video
                    ref={videoRef}
                    src={VIDEO_SRC}
                    controls
                    playsInline
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    className="w-full h-full object-cover"
                    style={{ display: "block" }}
                />

                {/* Overlay play (masqué quand la vidéo tourne) */}
                {!playing && (
                    <button
                        onClick={handlePlay}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: "rgba(12,7,30,0.45)", backdropFilter: "blur(2px)" }}
                    >
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                            style={{
                                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_L})`,
                                boxShadow: `0 8px 32px rgba(123,95,162,0.55)`,
                            }}>
                            <Play size={22} className="text-white ml-1" fill="white" />
                        </div>
                    </button>
                )}
            </div>
        </motion.div>
    );
}

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ values, active, color = BRAND_L, w = 88, h = 28 }: {
    values: number[]; active: boolean; color?: string; w?: number; h?: number;
}) {
    const min = Math.min(...values), max = Math.max(...values), rng = max - min || 1;
    const pts = values
        .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / rng) * (h - 6) - 3}`)
        .join(" ");
    return (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: "visible" }}>
            <motion.polyline
                points={pts} fill="none" stroke={color}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
        </svg>
    );
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ value, active, suffix = "" }: { value: number; active: boolean; suffix?: string }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (!active) { setDisplay(0); return; }
        const dur = 900, start = performance.now();
        const tick = (now: number) => {
            const p = Math.min((now - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(ease * value));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [active, value]);
    return <span>{display.toLocaleString("fr-FR")}{suffix}</span>;
}

// ─── MiniBar ──────────────────────────────────────────────────────────────────
function MiniBar({ values, active }: { values: number[]; active: boolean }) {
    const max = Math.max(...values);
    return (
        <div className="flex items-end gap-[3px] h-full w-full">
            {values.map((v, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: active ? `${(v / max) * 100}%` : 0 }}
                    transition={{ duration: 0.7, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        flex: 1, borderRadius: 3, minHeight: 2,
                        background: i === values.length - 1 ? BRAND_L : `${BRAND_L}40`,
                    }}
                />
            ))}
        </div>
    );
}

const BARS = [40, 55, 45, 68, 58, 80, 52, 75, 65, 88, 72, 100, 84];
const SPARK = [30, 45, 38, 58, 52, 70, 63, 78, 72, 88, 82, 93, 100];

// ─── Panel 1: Dashboard ───────────────────────────────────────────────────────
function PanelDashboard({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full flex flex-col gap-3">
            {/* Primary KPI */}
            <div className="rounded-[1.4rem] px-5 py-4"
                style={{
                    background: "linear-gradient(135deg,rgba(123,95,162,0.18),rgba(157,123,221,0.12))",
                    border: "1px solid rgba(123,95,162,0.25)"
                }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 6px 18px rgba(123,95,162,0.38)" }}>
                            <TrendingUp size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(176,142,224,0.5)" }}>CA Total</p>
                            <p className="text-[1.5rem] font-[900] tabular-nums leading-none" style={{ color: "#fff" }}>
                                €<Counter value={12480} active={active} />
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 self-start">
                        <p className="text-xs font-medium" style={{ color: "rgba(157,123,221,0.6)" }}>30 derniers jours</p>
                        <Sparkline values={SPARK} active={active} />
                    </div>
                </div>
            </div>

            {/* 3 secondary KPIs */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: "Commandes", value: 24, icon: FiShoppingCart, sub: "ce mois" },
                    { label: "Stock faible", value: 3, icon: FiPkg, sub: "références" },
                    { label: "Utilisateurs", value: 5, icon: FiUsers, sub: "actifs" },
                ].map(({ label, value, icon: Icon, sub }) => (
                    <div key={label} className="rounded-2xl px-3 py-3"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: "rgba(123,95,162,0.18)" }}>
                                <Icon className="w-4 h-4" style={{ color: BRAND_L }} />
                            </div>
                        </div>
                        <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(176,142,224,0.45)" }}>{label}</p>
                        <p className="text-[1.1rem] font-[900] tabular-nums leading-none mb-1" style={{ color: "#fff" }}>
                            <Counter value={value} active={active} />
                        </p>
                        <p className="text-[9px] font-medium" style={{ color: "rgba(176,142,224,0.4)" }}>{sub}</p>
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <div className="rounded-[1rem] p-3.5 flex-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(176,142,224,0.45)" }}>Activité — 13 semaines</p>
                    <span className="text-[9px] font-bold" style={{ color: BRAND_L }}>démo</span>
                </div>
                <div className="h-12"><MiniBar values={BARS} active={active} /></div>
            </div>
        </div>
    );
}

// ─── Panel 2: Inventory ───────────────────────────────────────────────────────
function PanelInventory({ active }: { active: boolean }) {
    const statusStyles: Record<string, string> = {
        "In Stock":     "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
        "Low Stock":    "bg-amber-500/15 text-amber-400 border border-amber-500/25",
        "Out of Stock": "bg-rose-500/15 text-rose-400 border border-rose-500/25",
    };
    const statusDot: Record<string, string> = {
        "In Stock": "bg-emerald-400",
        "Low Stock": "bg-amber-400",
        "Out of Stock": "bg-rose-400",
    };

    const items = [
        { name: "Référence A", sku: "SKU-001", category: "Épicerie", piece: 42, status: "In Stock" },
        { name: "Référence B", sku: "SKU-002", category: "Boissons",  piece: 8,  status: "Low Stock" },
        { name: "Référence C", sku: "SKU-003", category: "Épicerie",  piece: 0,  status: "Out of Stock" },
        { name: "Référence D", sku: "SKU-004", category: "Frais",     piece: 120, status: "In Stock" },
    ];

    const inStock  = items.filter(i => i.status === "In Stock").length;
    const lowStock = items.filter(i => i.status === "Low Stock").length;
    const outStock = items.filter(i => i.status === "Out of Stock").length;

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-1.5 mb-1">
                {[
                    { label: "En stock",  value: inStock,      color: "text-emerald-400", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.2)"  },
                    { label: "Faible",    value: lowStock,     color: "text-amber-400",   bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.2)" },
                    { label: "Rupture",   value: outStock,     color: "text-rose-400",    bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.2)"  },
                    { label: "Total",     value: items.length, color: "text-purple-400",  bg: "rgba(123,95,162,0.15)", border: "rgba(123,95,162,0.25)" },
                ].map(({ label, value, color, bg, border }) => (
                    <div key={label} className={`rounded-xl px-2 py-2 text-center ${color}`}
                        style={{ background: bg, border: `1px solid ${border}` }}>
                        <p className="text-[1rem] font-[900] leading-none">{value}</p>
                        <p className="text-[8px] font-bold mt-0.5 opacity-80 uppercase tracking-wide">{label}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-col gap-1.5">
                {items.map((item, i) => (
                    <motion.div
                        key={item.sku}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14 }}
                        transition={{ duration: 0.4, delay: active ? i * 0.07 : 0, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-between rounded-[1rem] px-3.5 py-2.5 transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                <FiPkg className="w-4 h-4" style={{ color: "rgba(176,142,224,0.4)" }} />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium" style={{ color: "#fff" }}>{item.name}</p>
                                <p className="text-[9px] font-mono" style={{ color: "rgba(176,142,224,0.45)" }}>SKU: {item.sku}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-[11px] font-bold tabular-nums" style={{ color: "rgba(255,255,255,0.75)" }}>{item.piece} units</p>
                            <span className={`inline-flex items-center gap-1 text-[9px] font-medium px-2 py-1 rounded-full ${statusStyles[item.status]}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[item.status]}`} />
                                {item.status}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// ─── Panel 3: Orders ──────────────────────────────────────────────────────────
function PanelSales({ active }: { active: boolean }) {
    const statusColor: Record<string, { bg: string; text: string; ring: string }> = {
        "Livré":      { bg: "rgba(16,185,129,0.12)",  text: "text-emerald-400", ring: "rgba(16,185,129,0.25)" },
        "En transit": { bg: "rgba(123,95,162,0.15)",  text: "text-purple-400",  ring: "rgba(123,95,162,0.3)" },
        "Confirmé":   { bg: "rgba(59,130,246,0.12)",  text: "text-blue-400",    ring: "rgba(59,130,246,0.25)" },
        "En attente": { bg: "rgba(245,158,11,0.12)",  text: "text-amber-400",   ring: "rgba(245,158,11,0.25)" },
    };

    const orders = [
        { id: "CMD-0012", fournisseur: "Fournisseur A", montant: "€840",  status: "Livré"      },
        { id: "CMD-0011", fournisseur: "Fournisseur B", montant: "€320",  status: "En transit" },
        { id: "CMD-0010", fournisseur: "Fournisseur C", montant: "€1 200",status: "Confirmé"   },
        { id: "CMD-0009", fournisseur: "Fournisseur A", montant: "€560",  status: "Livré"      },
        { id: "CMD-0008", fournisseur: "Fournisseur D", montant: "€190",  status: "En attente" },
    ];

    const stats = [
        { label: "Total",      value: orders.length, bg: "rgba(123,95,162,0.15)", text: "text-purple-400",  border: "rgba(123,95,162,0.25)" },
        { label: "Livrées",    value: 2,             bg: "rgba(16,185,129,0.12)", text: "text-emerald-400", border: "rgba(16,185,129,0.2)"  },
        { label: "En cours",   value: 2,             bg: "rgba(59,130,246,0.12)", text: "text-blue-400",    border: "rgba(59,130,246,0.2)"  },
        { label: "En attente", value: 1,             bg: "rgba(245,158,11,0.12)", text: "text-amber-400",   border: "rgba(245,158,11,0.2)"  },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-1.5 mb-1">
                {stats.map((s) => (
                    <div key={s.label} className={`p-2 rounded-xl text-center ${s.text}`}
                        style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                        <p className="text-[1rem] font-bold">{s.value}</p>
                        <p className="text-[8px] font-medium opacity-75 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(176,142,224,0.45)" }}>Commandes récentes</p>

            {orders.map((o, i) => {
                const sc = statusColor[o.status];
                return (
                    <motion.div
                        key={o.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
                        transition={{ duration: 0.38, delay: active ? i * 0.065 : 0, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-[1rem] px-3.5 py-2.5 flex items-center justify-between transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <div>
                            <p className="text-[10px] font-mono font-bold" style={{ color: "rgba(176,142,224,0.45)" }}>#{o.id}</p>
                            <p className="text-[12px] font-bold" style={{ color: "#fff" }}>{o.fournisseur}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-[12px] font-[900]" style={{ color: "#fff" }}>{o.montant}</p>
                            <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${sc.text}`}
                                style={{ background: sc.bg, boxShadow: `0 0 0 1px ${sc.ring}` }}>
                                {o.status}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// ─── Panel 4: Ventes ──────────────────────────────────────────────────────────
function PanelVentes({ active }: { active: boolean }) {
    const topProducts = [
        { name: "Référence A", quantity: 145, revenue: 5800, maxRev: 5800 },
        { name: "Référence C", quantity: 82,  revenue: 2460, maxRev: 5800 },
        { name: "Référence B", quantity: 45,  revenue: 900,  maxRev: 5800 },
        { name: "Référence D", quantity: 28,  revenue: 560,  maxRev: 5800 },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(176,142,224,0.45)" }}>Top Produits</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(123,95,162,0.15)", border: "1px solid rgba(123,95,162,0.25)", color: BRAND_L }}>
                    Démo
                </span>
            </div>

            <div className="flex flex-col gap-1.5">
                {topProducts.map((p, i) => (
                    <motion.div
                        key={p.name}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: active ? 1 : 0, x: active ? 0 : -12 }}
                        transition={{ duration: 0.4, delay: active ? i * 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-[1rem] px-3.5 py-3 transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(176,142,224,0.6)" }}>
                                #{i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-bold truncate" style={{ color: "#fff" }}>{p.name}</p>
                                <p className="text-[9px]" style={{ color: "rgba(176,142,224,0.45)" }}>{p.quantity} unités</p>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <p className="text-[12px] font-[900] tabular-nums" style={{ color: "#fff" }}>€{p.revenue.toLocaleString()}</p>
                                <div className="w-16 rounded-full h-1.5 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                                    <div className="h-1.5 rounded-full" style={{ width: `${(p.revenue / p.maxRev) * 100}%`, background: "#f59e0b" }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-[10px] text-center mt-1 italic" style={{ color: "rgba(176,142,224,0.35)" }}>
                Performance produit · Suivi du C.A. · Indicateurs clés
            </p>
        </div>
    );
}

// ─── Panel 5: AI Assistant ────────────────────────────────────────────────────
function PanelAI({ active }: { active: boolean }) {
    const messages = [
        { role: "user", msg: "Comment configurer une alerte de stock ?" },
        { role: "ai",   msg: "Dans Paramètres > Alertes, définissez un seuil par référence. L'application enverra une notification dès que le stock passe sous ce seuil." },
        { role: "user", msg: "Est-ce que je peux exporter mes commandes ?" },
        { role: "ai",   msg: "Oui — depuis la page Commandes, cliquez sur Exporter en haut à droite. Les formats CSV et PDF sont disponibles." },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-2.5">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg,${BRAND},${BRAND_L})` }}>
                    <Sparkles size={11} className="text-white" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(176,142,224,0.5)" }}>Assistant Stocks IA</p>
                <span className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">En ligne</span>
                </span>
            </div>

            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                {messages.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
                        transition={{ duration: 0.4, delay: active ? i * 0.2 : 0 }}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className="text-[11px] px-3.5 py-2.5 leading-relaxed max-w-[90%]"
                            style={m.role === "user"
                                ? {
                                    background: `linear-gradient(135deg,${BRAND},${BRAND_L})`,
                                    color: "#fff",
                                    fontWeight: 600,
                                    borderRadius: "1rem 1rem 0.25rem 1rem",
                                }
                                : {
                                    background: "rgba(255,255,255,0.08)",
                                    color: "rgba(255,255,255,0.75)",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderRadius: "0.25rem 1rem 1rem 1rem",
                                }
                            }
                        >
                            {m.role === "ai" && <span className="font-bold" style={{ color: BRAND_L }}>Stocks IA. </span>}
                            {m.msg}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="flex items-center gap-2 rounded-xl px-3 py-2 mt-1"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="flex-1 text-[11px]" style={{ color: "rgba(176,142,224,0.4)" }}>Posez votre question...</span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg,${BRAND},${BRAND_L})` }}>
                    <ChevronRight size={11} className="text-white" />
                </div>
            </div>
        </div>
    );
}

// ─── Panel 6: Alerts ──────────────────────────────────────────────────────────
function PanelAlerts({ active }: { active: boolean }) {
    const alerts = [
        { icon: <AlertTriangle size={13} />, type: "Rupture imminente",   msg: "Référence B — stock sous le seuil configuré",   color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
        { icon: <AlertTriangle size={13} />, type: "Rupture imminente",   msg: "Référence C — stock épuisé",                   color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
        { icon: <RefreshCw size={13} />,     type: "Réassort suggéré",    msg: "Référence B — commande automatique disponible", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
        { icon: <Check size={13} />,         type: "Livraison confirmée", msg: "CMD-0012 Fournisseur A — livraison reçue",      color: "#10b981", bg: "rgba(16,185,129,0.1)" },
        { icon: <Bell size={13} />,          type: "Alerte prix",         msg: "Référence A — variation de prix détectée",     color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    ];

    const critiques = alerts.filter(a => a.color === "#ef4444").length;

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(176,142,224,0.45)" }}>Alertes actives</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-rose-400"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {critiques} critiques
                </span>
            </div>

            {alerts.map((a, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14 }}
                    transition={{ duration: 0.38, delay: active ? i * 0.07 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[1rem] px-3.5 py-2.5 flex items-start gap-3"
                    style={{ background: a.bg, border: `1px solid ${a.color}25` }}
                >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${a.color}22`, color: a.color }}>
                        {a.icon}
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: a.color }}>{a.type}</p>
                        <p className="text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>{a.msg}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// ─── Acts ─────────────────────────────────────────────────────────────────────
const ACTS = [
    {
        step: "01", badge: "Tableau de bord",
        icon: <BarChart2 size={18} />,
        title: "Vue d'ensemble centralisée",
        body: "Dès la connexion, le tableau de bord regroupe vos indicateurs clés : chiffre d'affaires, commandes, stocks et alertes — en un seul endroit.",
        highlight: "Vue centralisée — stocks, commandes, alertes",
        color: BRAND_L, panelKey: "dashboard",
    },
    {
        step: "02", badge: "Inventaire",
        icon: <Package size={18} />,
        title: "Stock en temps réel, par référence",
        body: "Filtrez par catégorie, statut ou fournisseur. Les niveaux critiques sont identifiés automatiquement. Chaque référence dispose de son historique.",
        highlight: "Filtrez par catégorie, statut ou fournisseur",
        color: "#10b981", panelKey: "inventory",
    },
    {
        step: "03", badge: "Commandes",
        icon: <ShoppingCart size={18} />,
        title: "Suivi des commandes de A à Z",
        body: "De la prise de commande à la livraison — statut, fournisseur, montant. Filtrez par statut, exportez en CSV ou PDF.",
        highlight: "De la prise de commande à la livraison",
        color: "#3b82f6", panelKey: "sales",
    },
    {
        step: "04", badge: "Ventes",
        icon: <Award size={18} />,
        title: "Tableau de Bord Ventes",
        body: "Analysez la performance de vos produits, suivez le chiffre d'affaires et identifiez vos meilleures ventes instantanément.",
        highlight: "Performance produit · Suivi du C.A. · Indicateurs clés",
        color: "#f59e0b", panelKey: "ventes",
    },
    {
        step: "05", badge: "Assistant IA",
        icon: <Sparkles size={18} />,
        title: "Posez vos questions en français",
        body: "L'assistant IA analyse vos données et répond à vos questions métier. Interrogez vos stocks, commandes et alertes en langage naturel.",
        highlight: "Posez vos questions en français — réponse sur vos données",
        color: BRAND_L, panelKey: "ai",
    },
    {
        step: "06", badge: "Alertes",
        icon: <Bell size={18} />,
        title: "Configurez vos seuils d'alerte",
        body: "Définissez des seuils par référence ou par fournisseur. L'application déclenche des alertes automatiques dès qu'un seuil est franchi.",
        highlight: "Configurez vos seuils, recevez les alertes qui comptent",
        color: "#ef4444", panelKey: "alerts",
    },
];

const PANELS: Record<string, (props: { active: boolean }) => JSX.Element> = {
    dashboard: PanelDashboard,
    inventory: PanelInventory,
    sales: PanelSales,
    ventes: PanelVentes,
    ai: PanelAI,
    alerts: PanelAlerts,
};

// ─── Act Section ──────────────────────────────────────────────────────────────
function ActSection({ act, index }: { act: typeof ACTS[0]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setActive(true);
        }, { threshold: 0.2 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const Panel = PANELS[act.panelKey];
    const isEven = index % 2 === 0;

    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="py-16 md:py-24 px-6 md:px-14"
        >
            <div className={`max-w-6xl mx-auto flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-start gap-10 lg:gap-16`}>

                {/* Annotation card */}
                <div className="w-full lg:w-[300px] shrink-0">
                    <div className="rounded-[1.8rem] p-7"
                        style={{
                            background: "rgba(12,7,30,0.6)",
                            backdropFilter: "blur(24px) saturate(180%)",
                            WebkitBackdropFilter: "blur(24px) saturate(180%)",
                            border: "1px solid rgba(123,95,162,0.2)",
                            boxShadow: `0 12px 48px ${act.color}18`,
                        }}>
                        <div className="flex items-center gap-2.5 mb-5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                                style={{
                                    background: `linear-gradient(135deg, ${act.color}, ${act.color}bb)`,
                                    boxShadow: `0 4px 14px ${act.color}30`,
                                }}>
                                {act.icon}
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: act.color }}>
                                    Étape {act.step}
                                </p>
                                <p className="text-[11px] font-bold" style={{ color: "rgba(176,142,224,0.5)" }}>{act.badge}</p>
                            </div>
                        </div>

                        <h2 className="text-[1.2rem] font-[900] leading-[1.15] tracking-tight mb-3 text-white">
                            {act.title}
                        </h2>

                        <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "rgba(176,142,224,0.65)" }}>
                            {act.body}
                        </p>

                        <div className="rounded-xl px-4 py-3 text-[11px] font-semibold leading-snug"
                            style={{
                                background: `${act.color}0e`,
                                border: `1px solid ${act.color}20`,
                                color: act.color,
                            }}>
                            {act.highlight}
                        </div>
                    </div>
                </div>

                {/* Panel card */}
                <div className="flex-1 w-full">
                    <div className="relative rounded-[2.2rem] p-6 overflow-hidden"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(123,95,162,0.18)",
                            boxShadow: `0 24px 64px -12px rgba(123,95,162,0.22), 0 0 0 1px rgba(123,95,162,0.08)`,
                        }}>
                        {/* Ambient glow */}
                        <div className="absolute -inset-10 pointer-events-none -z-10">
                            <div className="w-full h-full rounded-full"
                                style={{
                                    background: `radial-gradient(ellipse at 50% 60%, ${act.color}18 0%, transparent 65%)`,
                                    filter: "blur(40px)",
                                }} />
                        </div>

                        {/* Card header */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] mb-0.5"
                                    style={{ color: "rgba(176,142,224,0.45)" }}>Stocks</p>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-[1rem] font-[900] tracking-tight text-white">{act.badge}</h3>
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full text-emerald-400"
                                        style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Démo
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                {["bg-red-400/50", "bg-yellow-400/50", "bg-green-400/60"].map((c, i) => (
                                    <span key={i} className={`w-3 h-3 rounded-full ${c}`} />
                                ))}
                            </div>
                        </div>

                        {/* Panel */}
                        <div style={{ minHeight: 340 }}>
                            <Panel active={active} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}

// ─── Main DemoPage ────────────────────────────────────────────────────────────
export default function DemoPage() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        :root {
          --brand: #7b5fa2; --brand-light: #9d7bdd;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0c071e; }
        .demo-dot-grid {
          background-image: radial-gradient(rgba(123,95,162,0.14) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

            {/* Fixed dark background */}
            <div className="fixed inset-0 z-0"
                style={{ background: "linear-gradient(155deg, #0c071e 0%, #110a2a 45%, #0e0820 100%)" }} />
            <div className="fixed inset-0 z-0 demo-dot-grid" style={{ opacity: 0.55 }} aria-hidden />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 70% 60% at 20% 15%, rgba(123,95,162,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(176,142,224,0.07) 0%, transparent 55%)",
            }} aria-hidden />

            {/* Content */}
            <div className="relative z-10">

                {/* ── Navbar ─────────────────────────────────────────────────── */}
                <DemoNavbar />

                {/* ── Header ─────────────────────────────────────────────────── */}
                <motion.div
                    className="flex flex-col items-center text-center pt-14 pb-4 px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-[11px] font-bold uppercase tracking-[0.16em]"
                        style={{ background: "rgba(123,95,162,0.1)", border: "1px solid rgba(123,95,162,0.22)", color: BRAND_L }}>
                        <Sparkles size={11} /> Visite guidée
                    </div>

                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-[900] leading-[1.05] tracking-[-0.035em] mb-4 text-white">
                        Découvrez Stocks<br />
                        <span style={{ color: BRAND_L }}>en 6 étapes.</span>
                    </h1>
                    <p className="text-[1.05rem] font-light leading-relaxed max-w-lg" style={{ color: "rgba(176,142,224,0.6)" }}>
                        Faites défiler pour explorer chaque fonctionnalité — interface réelle, données de démonstration.
                    </p>
                </motion.div>

                {/* ── Vidéo de présentation ──────────────────────────────────── */}
                <VideoSlot />

                {/* ── Act sections ───────────────────────────────────────────── */}
                {ACTS.map((act, i) => (
                    <ActSection key={act.panelKey} act={act} index={i} />
                ))}

                {/* ── End CTA ────────────────────────────────────────────────── */}
                <motion.div
                    className="flex flex-col items-center text-center py-24 px-6"
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-bold uppercase tracking-[0.16em]"
                        style={{ background: "rgba(123,95,162,0.1)", border: "1px solid rgba(123,95,162,0.22)", color: BRAND_L }}>
                        <Check size={11} /> Visite terminée
                    </div>
                    <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-[900] leading-[1.05] tracking-[-0.035em] mb-4 text-white">
                        Prêt à gérer vos stocks<br />
                        <span style={{ color: BRAND_L }}>avec précision ?</span>
                    </h2>
                    <p className="text-[1.05rem] font-light leading-relaxed max-w-md mb-10"
                        style={{ color: "rgba(176,142,224,0.6)" }}>
                        Créez votre compte et commencez à piloter vos stocks depuis le tableau de bord.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Link to="/register"
                            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-[0.95rem] font-bold text-white transition-all duration-200"
                            style={{
                                background: `linear-gradient(135deg, ${BRAND}, ${BRAND_L})`,
                                boxShadow: `0 8px 32px rgba(123,95,162,0.40), inset 0 1px 0 rgba(255,255,255,0.18)`,
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                        >
                            Commencer gratuitement <ChevronRight size={16} />
                        </Link>
                        <Link to="/"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                            style={{ color: "rgba(176,142,224,0.5)" }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = BRAND_L; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(176,142,224,0.5)"; }}
                        >
                            <ArrowLeft size={13} /> Retour à l'accueil
                        </Link>
                    </div>
                </motion.div>

            </div>
        </>
    );
}
