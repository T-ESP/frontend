import { useRef, useState, useEffect, type JSX } from "react";
import { Link } from "react-router-dom";
import {
    useScroll, useSpring, motion, AnimatePresence,
} from "framer-motion";
import {
    BarChart2, Package, ShoppingCart, Users, Sparkles, Bell,
    TrendingUp, ArrowUpRight, ChevronRight, ArrowLeft,
    AlertTriangle, Check, MessageSquare, RefreshCw,
} from "lucide-react";

// ─── Design tokens (mirror HomePage globals) ──────────────────────────────────
const BRAND = "#7b5fa2";
const BRAND_L = "#9d7bdd";

// ─── Bar chart mini ───────────────────────────────────────────────────────────
function MiniBar({ values, active }: { values: number[]; active: boolean }) {
    const max = Math.max(...values);
    return (
        <div className="flex items-end gap-[3px] h-full w-full">
            {values.map((v, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: active ? `${(v / max) * 100}%` : 0 }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        flex: 1, borderRadius: 3, minHeight: 2,
                        background: i === values.length - 1 ? BRAND : `${BRAND}38`,
                    }}
                />
            ))}
        </div>
    );
}

// ─── Sparkline SVG ────────────────────────────────────────────────────────────
function Sparkline({ values, active, color = BRAND, w = 88, h = 28 }: {
    values: number[]; active: boolean; color?: string; w?: number; h?: number;
}) {
    const min = Math.min(...values), max = Math.max(...values), rng = max - min || 1;
    const pts = values
        .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / rng) * (h - 6) - 3}`)
        .join(" ");
    return (
        <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ overflow: "visible" }}>
            <motion.polyline
                points={pts}
                fill="none"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
        </svg>
    );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
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

// ─── The 6 acts ───────────────────────────────────────────────────────────────
const ACTS = [
    {
        step: "01",
        badge: "Tableau de bord",
        icon: <BarChart2 size={18} />,
        title: "Vue d'ensemble en temps réel",
        body: "Dès la connexion, votre dashboard centralise le chiffre d'affaires, les stocks actifs, les commandes en cours et les alertes critiques — tout en un regard.",
        highlight: "Actualisé toutes les 30 secondes, sans rechargement.",
        color: BRAND,
        panelKey: "dashboard",
    },
    {
        step: "02",
        badge: "Inventaire",
        icon: <Package size={18} />,
        title: "Stock en temps réel, par référence",
        body: "Filtrez par catégorie, fournisseur ou entrepôt. Visualisez les niveaux critiques d'un coup d'œil. Déclenchement automatique du réassort dès le passage sous seuil.",
        highlight: "1 284 références gérées. 32 sous le seuil critique.",
        color: "#10b981",
        panelKey: "inventory",
    },
    {
        step: "03",
        badge: "Ventes & Commandes",
        icon: <ShoppingCart size={18} />,
        title: "Suivi des commandes de A à Z",
        body: "De la prise de commande à la livraison — statut, fournisseur, délai, montant. Filtrez par statut, exportez en un clic, synchronisez avec votre ERP.",
        highlight: "42 commandes actives ce mois. Délai moyen : 2,3 jours.",
        color: "#3b82f6",
        panelKey: "sales",
    },
    {
        step: "04",
        badge: "Clients",
        icon: <Users size={18} />,
        title: "Gestion client centralisée",
        body: "Historique d'achat, segmentation, CA par client, notes internes. Identifiez vos meilleurs comptes et anticipez le churn avant qu'il arrive.",
        highlight: "500+ clients actifs. Taux de rétention : 94%.",
        color: "#f59e0b",
        panelKey: "clients",
    },
    {
        step: "05",
        badge: "Assistant IA",
        icon: <Sparkles size={18} />,
        title: "Parlez à vos données",
        body: "Posez une question en français, obtenez une réponse en secondes. L'IA analyse vos tendances, anticipe vos ruptures et suggère des actions concrètes.",
        highlight: "\"Quel produit va manquer ce week-end ?\" — réponse en 2s.",
        color: BRAND,
        panelKey: "ai",
    },
    {
        step: "06",
        badge: "Alertes",
        icon: <Bell size={18} />,
        title: "Zéro rupture, zéro surprise",
        body: "Configurez des seuils par référence, par fournisseur ou par entrepôt. Recevez des alertes push, email ou Slack — au bon moment, sans bruit.",
        highlight: "3 alertes critiques actives. Toutes configurables.",
        color: "#ef4444",
        panelKey: "alerts",
    },
];

const BARS = [40, 55, 45, 68, 58, 80, 52, 75, 65, 88, 72, 100, 84];
const SPARK = [30, 45, 38, 58, 52, 70, 63, 78, 72, 88, 82, 93, 100];

// ─── Feature panels that overlay the dashboard ────────────────────────────────
function PanelDashboard({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full flex flex-col gap-3">
            {/* Revenue row */}
            <div className="rounded-[1.2rem] px-5 py-4"
                style={{ background: "linear-gradient(135deg,rgba(123,95,162,0.07),rgba(157,123,221,0.06))", border: "1px solid rgba(123,95,162,0.09)" }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: `linear-gradient(135deg,${BRAND},${BRAND_L})`, boxShadow: "0 6px 18px rgba(123,95,162,0.28)" }}>
                            <TrendingUp size={16} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">CA Mensuel</p>
                            <p className="text-[1.5rem] font-[900] text-gray-900 tabular-nums leading-none">
                                €<Counter value={248500} active={active} />
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-bold text-[10px] border border-emerald-100">
                            <ArrowUpRight size={10} /> +14.2%
                        </div>
                        <Sparkline values={SPARK} active={active} />
                    </div>
                </div>
            </div>
            {/* 3 KPIs */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { l: "Stocks", v: 1284, e: "📦", up: true, d: "+7%" },
                    { l: "Commandes", v: 42, e: "🛒", up: false, d: "−2" },
                    { l: "Efficacité", v: 98, e: "⚡", suffix: "%", up: true, d: "+2%" },
                ].map(({ l, v, e, up, d, suffix = "" }) => (
                    <div key={l} className="rounded-[1rem] px-3 py-3 border border-gray-100 bg-gray-50/60">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{l}</p>
                            <span className="text-[0.8rem]">{e}</span>
                        </div>
                        <p className="text-[1.1rem] font-[900] text-gray-900 tabular-nums leading-none mb-0.5">
                            <Counter value={v} active={active} suffix={suffix} />
                        </p>
                        <p className={`text-[9px] font-bold ${up ? "text-emerald-500" : "text-rose-400"}`}>{d}</p>
                    </div>
                ))}
            </div>
            {/* Bar chart */}
            <div className="rounded-[1rem] p-3.5 border border-gray-100 bg-gray-50/60 flex-1">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Activité — 13 semaines</p>
                    <span className="text-[9px] font-bold" style={{ color: BRAND }}>+31.4% ↑</span>
                </div>
                <div className="h-12"><MiniBar values={BARS} active={active} /></div>
            </div>
        </div>
    );
}

function PanelInventory({ active }: { active: boolean }) {
    const items = [
        { ref: "YAO-BIO-500", name: "Yaourt Bio 500g", stock: 12, seuil: 50, status: "critical", color: "#ef4444" },
        { ref: "LAI-UHT-1L", name: "Lait UHT 1L", stock: 340, seuil: 100, status: "ok", color: "#10b981" },
        { ref: "BRE-FRA-250", name: "Beurre 250g", stock: 68, seuil: 80, status: "warning", color: "#f59e0b" },
        { ref: "FRO-CHE-200", name: "Fromage 200g", stock: 156, seuil: 60, status: "ok", color: "#10b981" },
        { ref: "OEU-6PK", name: "Œufs ×6", stock: 24, seuil: 100, status: "critical", color: "#ef4444" },
    ];
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Références — Stock actuel</p>
                <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                    32 critiques
                </span>
            </div>
            {items.map((item, i) => {
                const pct = Math.min(item.stock / item.seuil, 1);
                return (
                    <motion.div
                        key={item.ref}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14 }}
                        transition={{ duration: 0.4, delay: active ? i * 0.07 : 0, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-[1rem] px-3.5 py-3 border border-gray-100 bg-gray-50/60"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <div>
                                <p className="text-[11px] font-bold text-gray-800">{item.name}</p>
                                <p className="text-[9px] text-gray-400 font-mono">{item.ref}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[12px] font-[900] text-gray-900">{item.stock}</p>
                                <p className="text-[8px] text-gray-400">/ {item.seuil} min</p>
                            </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: active ? `${pct * 100}%` : 0 }}
                                transition={{ duration: 0.55, delay: active ? i * 0.07 + 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
                                style={{ background: item.color }}
                            />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

function PanelSales({ active }: { active: boolean }) {
    const orders = [
        { id: "#CMD-4821", fournisseur: "Lactalis", montant: "€2 340", status: "Livré", statusColor: "#10b981", bg: "bg-emerald-50" },
        { id: "#CMD-4820", fournisseur: "Danone", montant: "€1 890", status: "En transit", statusColor: "#3b82f6", bg: "bg-blue-50" },
        { id: "#CMD-4819", fournisseur: "Bongrain", montant: "€940", status: "Confirmé", statusColor: "#f59e0b", bg: "bg-amber-50" },
        { id: "#CMD-4818", fournisseur: "Fleury M.", montant: "€3 120", status: "Livré", statusColor: "#10b981", bg: "bg-emerald-50" },
        { id: "#CMD-4817", fournisseur: "Sodiaal", montant: "€560", status: "En attente", statusColor: "#a09cb0", bg: "bg-gray-50" },
    ];
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Commandes récentes</p>
                <span className="text-[9px] font-bold" style={{ color: "#3b82f6" }}>42 actives</span>
            </div>
            {orders.map((o, i) => (
                <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
                    transition={{ duration: 0.38, delay: active ? i * 0.065 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[1rem] px-3.5 py-2.5 border border-gray-100 bg-gray-50/60 flex items-center justify-between"
                >
                    <div>
                        <p className="text-[10px] font-mono font-bold text-gray-500">{o.id}</p>
                        <p className="text-[12px] font-bold text-gray-800">{o.fournisseur}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-[12px] font-[900] text-gray-900">{o.montant}</p>
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${o.bg} border`}
                            style={{ color: o.statusColor, borderColor: `${o.statusColor}22` }}>
                            {o.status}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function PanelClients({ active }: { active: boolean }) {
    const clients = [
        { initials: "IN", name: "Intermarché Nord", ca: "€48 200", rétention: 97, color: "#ef4444" },
        { initials: "CR", name: "Carrefour Rennes", ca: "€31 500", rétention: 94, color: BRAND },
        { initials: "AU", name: "Auchan Lille", ca: "€27 900", rétention: 91, color: "#10b981" },
        { initials: "LD", name: "Lidl Distribution", ca: "€19 400", rétention: 88, color: "#3b82f6" },
    ];
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Top clients — CA mensuel</p>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    500+ actifs
                </span>
            </div>
            {clients.map((c, i) => (
                <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: active ? 1 : 0, x: active ? 0 : -12 }}
                    transition={{ duration: 0.4, delay: active ? i * 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[1rem] px-3.5 py-3 border border-gray-100 bg-gray-50/60"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-extrabold shrink-0"
                            style={{ background: `${c.color}14`, color: c.color }}>
                            {c.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-gray-800 truncate">{c.name}</p>
                            <p className="text-[9px] text-gray-400">Rétention : <span className="font-bold text-emerald-500">{c.rétention}%</span></p>
                        </div>
                        <p className="text-[12px] font-[900] text-gray-900 shrink-0">{c.ca}</p>
                    </div>
                    <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: active ? `${c.rétention}%` : 0 }}
                            transition={{ duration: 0.6, delay: active ? i * 0.08 + 0.2 : 0, ease: [0.16, 1, 0.3, 1] }}
                            style={{ background: c.color }}
                        />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

function PanelAI({ active }: { active: boolean }) {
    const messages = [
        { role: "user", msg: "Quels produits vont manquer ce week-end ?" },
        { role: "ai", msg: "Yaourt Bio et Œufs ×6 seront en rupture d'ici samedi. Je recommande une commande urgente : 200 unités Yaourt Bio chez Danone, 150 ×6 chez Lustucru." },
        { role: "user", msg: "Quel fournisseur est le plus fiable ?" },
        { role: "ai", msg: "Lactalis affiche 98% de livraisons à l'heure sur 90 jours. Danone : 94%. Je recommande Lactalis pour les commandes urgentes." },
    ];
    return (
        <div className="w-full h-full flex flex-col gap-2.5">
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg,${BRAND},${BRAND_L})` }}>
                    <Sparkles size={11} className="text-white" />
                </div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Assistant Stocks IA</p>
                <span className="ml-auto flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">En ligne</span>
                </span>
            </div>
            <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                {messages.map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
                        transition={{ duration: 0.4, delay: active ? i * 0.18 : 0 }}
                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className="text-[11px] px-3.5 py-2.5 leading-relaxed max-w-[90%]"
                            style={m.role === "user"
                                ? { background: "#1a1523", color: "#fff", fontWeight: 600, borderRadius: "1rem 1rem 0.25rem 1rem" }
                                : { background: "rgba(255,255,255,0.7)", color: "#6b6880", border: "1px solid rgba(255,255,255,0.9)", borderRadius: "0.25rem 1rem 1rem 1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
                            }
                        >
                            {m.role === "ai" && <span className="font-bold" style={{ color: BRAND }}>Analyse terminée. </span>}
                            {m.msg}
                        </div>
                    </motion.div>
                ))}
            </div>
            {/* Input bar */}
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 mt-1"
                style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.8)" }}>
                <span className="flex-1 text-[11px]" style={{ color: "#a09cb0" }}>Posez votre question...</span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg,${BRAND},${BRAND_L})` }}>
                    <ChevronRight size={11} className="text-white" />
                </div>
            </div>
        </div>
    );
}

function PanelAlerts({ active }: { active: boolean }) {
    const alerts = [
        { icon: <AlertTriangle size={13} />, type: "Rupture imminente", msg: "Yaourt Bio 500g — stock < seuil dans 18h", color: "#ef4444", bg: "#fff1f2" },
        { icon: <AlertTriangle size={13} />, type: "Rupture imminente", msg: "Œufs ×6 — stock critique : 24 unités", color: "#ef4444", bg: "#fff1f2" },
        { icon: <RefreshCw size={13} />, type: "Réassort suggéré", msg: "Beurre 250g — commande auto déclenchée", color: "#f59e0b", bg: "#fffbeb" },
        { icon: <Check size={13} />, type: "Livraison confirmée", msg: "CMD-4821 Lactalis — livrée à 09h42", color: "#10b981", bg: "#f0fdf4" },
        { icon: <MessageSquare size={13} />, type: "Alerte fournisseur", msg: "Danone : retard 2j sur prochaine livraison", color: "#3b82f6", bg: "#eff6ff" },
    ];
    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Alertes actives</p>
                <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                    3 critiques
                </span>
            </div>
            {alerts.map((a, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14 }}
                    transition={{ duration: 0.38, delay: active ? i * 0.07 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[1rem] px-3.5 py-2.5 border flex items-start gap-3"
                    style={{ background: a.bg, borderColor: `${a.color}22` }}
                >
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: `${a.color}18`, color: a.color }}>
                        {a.icon}
                    </div>
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: a.color }}>{a.type}</p>
                        <p className="text-[11px] text-gray-700 leading-snug">{a.msg}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

const PANELS: Record<string, (props: { active: boolean }) => JSX.Element> = {
    dashboard: PanelDashboard,
    inventory: PanelInventory,
    sales: PanelSales,
    clients: PanelClients,
    ai: PanelAI,
    alerts: PanelAlerts,
};

// ─── Main DemoPage ────────────────────────────────────────────────────────────
export default function DemoPage() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 48, damping: 20, restDelta: 0.0003 });

    // Current act index (0–5) derived from scroll
    const [actIndex, setActIndex] = useState(0);
    useEffect(() => {
        return smooth.on("change", v => {
            const idx = Math.min(Math.floor(v * ACTS.length), ACTS.length - 1);
            setActIndex(idx);
        });
    }, [smooth]);

    // Progress within current act (0→1), used for annotation card transitions
    /* const actProgress = useTransform(smooth, v => {
        const segSize = 1 / ACTS.length;
        const segStart = actIndex * segSize;
        return Math.min(Math.max((v - segStart) / segSize, 0), 1);
    }); */

    const act = ACTS[actIndex];
    const Panel = PANELS[act.panelKey];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        :root {
          --brand: #7b5fa2; --brand-light: #9d7bdd;
          --page-bg: #f5f4f9;
          --text-primary: #1a1523; --text-muted: #6b6880; --text-faint: #a09cb0;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: var(--page-bg); }

        .glass-demo {
          background: rgba(255,255,255,0.72);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.86);
        }
        .dot-grid-demo {
          background-image: radial-gradient(rgba(123,95,162,0.11) 1px, transparent 1px);
          background-size: 28px 28px;
        }
      `}</style>

            {/* Fixed background */}
            <div className="fixed inset-0 z-0 dot-grid-demo" style={{ opacity: 0.18 }} aria-hidden />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 70% 60% at 20% 15%, rgba(123,95,162,0.1) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(176,142,224,0.08) 0%, transparent 55%)",
            }} aria-hidden />

            {/* ── Entry header ── */}
            <motion.div
                className="relative z-10 flex flex-col items-center text-center pt-16 pb-8 px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <Link to="/"
                    className="inline-flex items-center gap-2 text-sm font-semibold mb-8 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--brand)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                    <ArrowLeft size={14} /> Retour à l'accueil
                </Link>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ background: "rgba(123,95,162,0.07)", border: "1px solid rgba(123,95,162,0.15)", color: "var(--brand)" }}>
                    <Sparkles size={11} /> Visite guidée
                </div>
                <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-[900] leading-[1.05] tracking-[-0.035em] mb-4"
                    style={{ color: "var(--text-primary)" }}>
                    Découvrez Stocks<br />
                    <span style={{ color: "var(--brand)" }}>en 6 étapes.</span>
                </h1>
                <p className="text-[1.05rem] font-light leading-relaxed max-w-lg" style={{ color: "var(--text-muted)" }}>
                    Faites défiler pour explorer chaque fonctionnalité — dashboard, stocks, ventes, clients, IA et alertes.
                </p>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-8 flex flex-col items-center gap-1.5"
                >
                    <div className="w-5 h-8 rounded-full border-2 border-gray-200 flex items-start justify-center pt-1.5">
                        <div className="w-1 h-1.5 rounded-full bg-gray-300" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-gray-300">Scroll</span>
                </motion.div>
            </motion.div>

            {/* ── Scrollytelling wrapper: 600vh = 6 acts × 100vh each ── */}
            <div ref={wrapperRef} style={{ height: "600vh", position: "relative" }}>

                {/* Sticky scene */}
                <div className="sticky top-0 h-screen flex items-center z-10 overflow-hidden px-6 md:px-14"
                    style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>

                    {/* ── Left: step progress spine + annotation ── */}
                    <div className="hidden lg:flex flex-col items-start gap-6 w-[320px] shrink-0 pr-8">

                        {/* Progress spine */}
                        <div className="flex flex-col gap-3 mb-2">
                            {ACTS.map((a, i) => {
                                const isActive = i === actIndex;
                                const isDone = i < actIndex;
                                return (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: isActive ? 1 : isDone ? 0.45 : 0.25 }}
                                        className="flex items-center gap-2.5"
                                    >
                                        <motion.div
                                            animate={{
                                                width: isActive ? 28 : 8,
                                                background: isActive ? act.color : isDone ? "#d1d5db" : "#e5e7eb",
                                            }}
                                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                            style={{ height: 4, borderRadius: 2 }}
                                        />
                                        <span className="text-[10px] font-bold uppercase tracking-widest"
                                            style={{ color: isActive ? act.color : "var(--text-faint)" }}>
                                            {a.badge}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Annotation card */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={actIndex}
                                initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="glass-demo rounded-[1.8rem] p-7 w-full"
                                style={{ boxShadow: `0 12px 48px ${act.color}18` }}
                            >
                                {/* Step badge */}
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${act.color}, ${act.color}bb)`, boxShadow: `0 4px 14px ${act.color}30` }}>
                                        {act.icon}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: act.color }}>
                                            Étape {act.step}
                                        </p>
                                        <p className="text-[11px] font-bold" style={{ color: "var(--text-faint)" }}>{act.badge}</p>
                                    </div>
                                </div>

                                <h2 className="text-[1.25rem] font-[900] leading-[1.15] tracking-tight mb-3"
                                    style={{ color: "var(--text-primary)" }}>
                                    {act.title}
                                </h2>

                                <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>
                                    {act.body}
                                </p>

                                <div className="rounded-xl px-4 py-3 text-[11px] font-semibold leading-snug"
                                    style={{ background: `${act.color}0e`, border: `1px solid ${act.color}20`, color: act.color }}>
                                    {act.highlight}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Right: sticky dashboard card ── */}
                    <div className="flex-1 flex items-center justify-center min-w-0">
                        <div className="relative w-full max-w-[520px]">

                            {/* Ambient glow behind card */}
                            <div className="absolute -inset-10 pointer-events-none -z-10">
                                <motion.div
                                    animate={{ background: `radial-gradient(ellipse at 50% 60%, ${act.color}22 0%, transparent 65%)` }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full h-full rounded-full"
                                    style={{ filter: "blur(40px)" }}
                                />
                            </div>

                            {/* Dashboard card shell */}
                            <div
                                className="relative bg-white rounded-[2.2rem] p-6 overflow-hidden"
                                style={{ boxShadow: "0 24px 64px -12px rgba(123,95,162,0.16), 0 0 0 1px rgba(123,95,162,0.06)" }}
                            >
                                {/* Card header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-0.5">Stocks</p>
                                        <div className="flex items-center gap-2">
                                            <AnimatePresence mode="wait">
                                                <motion.h3
                                                    key={act.badge}
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -4 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-[1rem] font-[900] text-gray-900 tracking-tight"
                                                >
                                                    {act.badge}
                                                </motion.h3>
                                            </AnimatePresence>
                                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> En direct
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {["bg-red-300/70", "bg-yellow-300/70", "bg-green-400/80"].map((c, i) => (
                                            <span key={i} className={`w-3 h-3 rounded-full ${c}`} />
                                        ))}
                                    </div>
                                </div>

                                {/* Feature panel area — fixed height, panels swap inside */}
                                <div className="relative" style={{ minHeight: 340 }}>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={act.panelKey}
                                            initial={{ opacity: 0, scale: 0.97, filter: "blur(6px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
                                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute inset-0"
                                        >
                                            <Panel active={true} />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Mobile annotation — shows below card on small screens */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`mobile-${actIndex}`}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="lg:hidden mt-5 glass-demo rounded-2xl p-5"
                                >
                                    <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: act.color }}>
                                        Étape {act.step} — {act.badge}
                                    </p>
                                    <h3 className="text-base font-[900] mb-2" style={{ color: "var(--text-primary)" }}>{act.title}</h3>
                                    <p className="text-sm font-light leading-relaxed" style={{ color: "var(--text-muted)" }}>{act.body}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── End CTA ── */}
            <motion.div
                className="relative z-10 flex flex-col items-center text-center py-24 px-6"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-bold uppercase tracking-[0.16em]"
                    style={{ background: "rgba(123,95,162,0.07)", border: "1px solid rgba(123,95,162,0.15)", color: "var(--brand)" }}>
                    <Check size={11} /> Visite terminée
                </div>
                <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-[900] leading-[1.05] tracking-[-0.035em] mb-4"
                    style={{ color: "var(--text-primary)" }}>
                    Prêt à gérer vos stocks<br />
                    <span style={{ color: "var(--brand)" }}>avec précision ?</span>
                </h2>
                <p className="text-[1.05rem] font-light leading-relaxed max-w-md mb-10" style={{ color: "var(--text-muted)" }}>
                    Déployez en 48h, sans interruption. Accès gratuit 14 jours — aucune carte bancaire requise.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link to="/register"
                        className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl text-[0.95rem] font-bold text-white transition-all duration-200"
                        style={{
                            background: `linear-gradient(135deg, ${BRAND}, ${BRAND_L})`,
                            boxShadow: `0 8px 32px rgba(123,95,162,0.36), inset 0 1px 0 rgba(255,255,255,0.18)`,
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                    >
                        Commencer gratuitement <ChevronRight size={16} />
                    </Link>
                    <Link to="/"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--brand)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
                    >
                        <ArrowLeft size={13} /> Retour à l'accueil
                    </Link>
                </div>
            </motion.div>
        </>
    );
}