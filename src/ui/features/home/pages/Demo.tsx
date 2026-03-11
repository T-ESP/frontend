import { useRef, useState, useEffect, type JSX } from "react";
import { Link } from "react-router-dom";
import {
    useScroll, useSpring, motion, AnimatePresence,
} from "framer-motion";
import {
    BarChart2, Package, ShoppingCart, Users, Sparkles, Bell,
    TrendingUp, ChevronRight, ArrowLeft,
    AlertTriangle, Check, RefreshCw,
} from "lucide-react";
import { FiPackage as FiPkg, FiShoppingCart, FiUsers, FiEdit2 } from "react-icons/fi";

// ─── Design tokens — exact match to real app ──────────────────────────────────
const BRAND = "#7b5fa2";
const BRAND_L = "#9d7bdd";

// ─── Real app: sparkline SVG ──────────────────────────────────────────────────
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
                points={pts} fill="none" stroke={color}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
        </svg>
    );
}

// ─── Real app: animated counter ───────────────────────────────────────────────
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

// ─── Real app: mini bar chart (matches DashboardPage bar chart) ───────────────
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

const BARS = [40, 55, 45, 68, 58, 80, 52, 75, 65, 88, 72, 100, 84];
const SPARK = [30, 45, 38, 58, 52, 70, 63, 78, 72, 88, 82, 93, 100];

// ─── Panel 1: Dashboard — mirrors KPICard.tsx + KPICards.tsx layout ──────────
function PanelDashboard({ active }: { active: boolean }) {
    return (
        <div className="w-full h-full flex flex-col gap-3">
            {/* Primary KPI card — matches KPICard isPrimary=true */}
            <div className="rounded-[1.4rem] px-5 py-4 border"
                style={{
                    background: "linear-gradient(135deg,rgba(123,95,162,0.07),rgba(157,123,221,0.06))",
                    borderColor: "rgba(123,95,162,0.09)"
                }}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 6px 18px rgba(123,95,162,0.28)" }}>
                            <TrendingUp size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">CA Total</p>
                            <p className="text-[1.5rem] font-[900] text-gray-900 tabular-nums leading-none">
                                €<Counter value={12480} active={active} />
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 self-start">
                        <p className="text-xs font-medium text-[#7b5fa2]/70">30 derniers jours</p>
                        <Sparkline values={SPARK} active={active} />
                    </div>
                </div>
            </div>

            {/* 3 secondary KPI cards — matches KPICard isPrimary=false */}
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: "Commandes", value: 24, icon: FiShoppingCart, change: "ce mois" },
                    { label: "Stock faible", value: 3, icon: FiPkg, change: "références" },
                    { label: "Utilisateurs", value: 5, icon: FiUsers, change: "actifs" },
                ].map(({ label, value, icon: Icon, change }) => (
                    <div key={label} className="rounded-2xl px-3 py-3 border border-gray-100 bg-white shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                style={{ background: "rgba(123,95,162,0.08)" }}>
                                <Icon className="w-4 h-4 text-[#7b5fa2]" />
                            </div>
                        </div>
                        <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                        <p className="text-[1.1rem] font-[900] text-gray-900 tabular-nums leading-none mb-1">
                            <Counter value={value} active={active} />
                        </p>
                        <p className="text-[9px] text-gray-400 font-medium">{change}</p>
                    </div>
                ))}
            </div>

            {/* Bar chart — matches DashboardPage activity chart */}
            <div className="rounded-[1rem] p-3.5 border border-gray-100 bg-gray-50/60 flex-1">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Activité — 13 semaines</p>
                    <span className="text-[9px] font-bold" style={{ color: BRAND }}>données de démonstration</span>
                </div>
                <div className="h-12"><MiniBar values={BARS} active={active} /></div>
            </div>
        </div>
    );
}

// ─── Panel 2: Inventory — mirrors InventoryTableRow + InventoryStats layout ───
function PanelInventory({ active }: { active: boolean }) {
    // Status badges exactly matching statusStyles in InventoryTableRow.tsx
    const statusStyles: Record<string, string> = {
        "In Stock":    "bg-emerald-50 text-emerald-700 border border-emerald-200",
        "Low Stock":   "bg-amber-50 text-amber-700 border border-amber-200",
        "Out of Stock":"bg-rose-50 text-rose-700 border border-rose-200",
    };
    const statusDot: Record<string, string> = {
        "In Stock": "bg-emerald-500",
        "Low Stock": "bg-amber-500",
        "Out of Stock": "bg-rose-500",
    };

    const items = [
        { name: "Référence A", sku: "SKU-001", category: "Épicerie", piece: 42, status: "In Stock" },
        { name: "Référence B", sku: "SKU-002", category: "Boissons",  piece: 8,  status: "Low Stock" },
        { name: "Référence C", sku: "SKU-003", category: "Épicerie",  piece: 0,  status: "Out of Stock" },
        { name: "Référence D", sku: "SKU-004", category: "Frais",     piece: 120, status: "In Stock" },
    ];

    const inStock    = items.filter(i => i.status === "In Stock").length;
    const lowStock   = items.filter(i => i.status === "Low Stock").length;
    const outStock   = items.filter(i => i.status === "Out of Stock").length;

    return (
        <div className="w-full h-full flex flex-col gap-2">
            {/* InventoryStats — 4 KpiCards */}
            <div className="grid grid-cols-4 gap-1.5 mb-1">
                {[
                    { label: "En stock",  value: inStock,         color: "text-emerald-600 bg-emerald-50  border-emerald-200" },
                    { label: "Faible",    value: lowStock,        color: "text-amber-600   bg-amber-50    border-amber-200"   },
                    { label: "Rupture",   value: outStock,        color: "text-rose-600    bg-rose-50     border-rose-200"    },
                    { label: "Total",     value: items.length,    color: "text-[#7b5fa2]   bg-purple-50   border-purple-200"  },
                ].map(({ label, value, color }) => (
                    <div key={label} className={`rounded-xl px-2 py-2 border text-center ${color}`}>
                        <p className="text-[1rem] font-[900] leading-none">{value}</p>
                        <p className="text-[8px] font-bold mt-0.5 opacity-80 uppercase tracking-wide">{label}</p>
                    </div>
                ))}
            </div>

            {/* Table rows — matches InventoryTableRow layout */}
            <div className="flex flex-col gap-1.5">
                {items.map((item, i) => (
                    <motion.div
                        key={item.sku}
                        initial={{ opacity: 0, x: 14 }}
                        animate={{ opacity: active ? 1 : 0, x: active ? 0 : 14 }}
                        transition={{ duration: 0.4, delay: active ? i * 0.07 : 0, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-between rounded-[1rem] px-3.5 py-2.5 border border-gray-100 bg-white hover:bg-purple-50/30 transition-colors"
                    >
                        <div className="flex items-center gap-2.5">
                            {/* Placeholder thumbnail — same shape as real app */}
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0">
                                <FiPkg className="w-4 h-4 text-gray-300" />
                            </div>
                            <div>
                                <p className="text-[11px] font-medium text-gray-900">{item.name}</p>
                                <p className="text-[9px] text-gray-400 font-mono">SKU: {item.sku}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-[11px] font-bold text-gray-700 tabular-nums">{item.piece} units</p>
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

// ─── Panel 3: Orders — mirrors OrdersPage table + OrderStatCard ───────────────
function PanelSales({ active }: { active: boolean }) {
    // Status colors matching getStatusColor() in OrdersPage/index.tsx exactly
    const statusColor: Record<string, string> = {
        "Livré":      "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
        "En transit": "bg-purple-100  text-purple-800  ring-1 ring-purple-200",
        "Confirmé":   "bg-blue-100    text-blue-800    ring-1 ring-blue-200",
        "En attente": "bg-amber-100   text-amber-800   ring-1 ring-amber-200",
    };

    const orders = [
        { id: "CMD-0012", fournisseur: "Fournisseur A", montant: "€840",  status: "Livré"      },
        { id: "CMD-0011", fournisseur: "Fournisseur B", montant: "€320",  status: "En transit" },
        { id: "CMD-0010", fournisseur: "Fournisseur C", montant: "€1 200",status: "Confirmé"   },
        { id: "CMD-0009", fournisseur: "Fournisseur A", montant: "€560",  status: "Livré"      },
        { id: "CMD-0008", fournisseur: "Fournisseur D", montant: "€190",  status: "En attente" },
    ];

    // OrderStatCard grid — gradient backgrounds matching real component
    const stats = [
        { label: "Total",       value: orders.length, gradient: "from-purple-50 to-purple-100", border: "border-purple-200", text: "text-purple-700" },
        { label: "Livrées",     value: 2,             gradient: "from-emerald-50 to-emerald-100", border: "border-emerald-200", text: "text-emerald-700" },
        { label: "En cours",    value: 2,             gradient: "from-blue-50 to-blue-100",    border: "border-blue-200",    text: "text-blue-700" },
        { label: "En attente",  value: 1,             gradient: "from-amber-50 to-amber-100",  border: "border-amber-200",   text: "text-amber-700" },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="grid grid-cols-4 gap-1.5 mb-1">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-gradient-to-r ${s.gradient} p-2 rounded-xl border ${s.border} text-center`}>
                        <p className={`text-[1rem] font-bold ${s.text}`}>{s.value}</p>
                        <p className={`text-[8px] font-medium ${s.text} opacity-75 mt-0.5`}>{s.label}</p>
                    </div>
                ))}
            </div>

            <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Commandes récentes</p>

            {orders.map((o, i) => (
                <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: active ? 1 : 0, y: active ? 0 : 10 }}
                    transition={{ duration: 0.38, delay: active ? i * 0.065 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[1rem] px-3.5 py-2.5 border border-gray-100 bg-white flex items-center justify-between hover:bg-purple-50/30 transition-colors"
                >
                    <div>
                        <p className="text-[10px] font-mono font-bold text-gray-400">#{o.id}</p>
                        <p className="text-[12px] font-bold text-gray-800">{o.fournisseur}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <p className="text-[12px] font-[900] text-gray-900">{o.montant}</p>
                        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full ${statusColor[o.status]}`}>
                            {o.status}
                        </span>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

// ─── Panel 4: Clients — generic, no named retailers ───────────────────────────
function PanelClients({ active }: { active: boolean }) {
    const clients = [
        { initials: "CA", name: "Client A", segment: "Commerce indépendant", color: BRAND },
        { initials: "CB", name: "Client B", segment: "E-commerce",           color: "#10b981" },
        { initials: "CC", name: "Client C", segment: "Distribution",         color: "#3b82f6" },
        { initials: "CD", name: "Client D", segment: "Restauration",         color: "#f59e0b" },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Comptes clients</p>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[#7b5fa2]">
                    {clients.length} actifs
                </span>
            </div>

            {clients.map((c, i) => (
                <motion.div
                    key={c.name}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: active ? 1 : 0, x: active ? 0 : -12 }}
                    transition={{ duration: 0.4, delay: active ? i * 0.08 : 0, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-[1rem] px-3.5 py-3 border border-gray-100 bg-white hover:bg-purple-50/30 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-extrabold shrink-0"
                            style={{ background: `${c.color}14`, color: c.color }}>
                            {c.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-bold text-gray-800 truncate">{c.name}</p>
                            <p className="text-[9px] text-gray-400">{c.segment}</p>
                        </div>
                        {/* Actions — matches real app row actions */}
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-lg text-gray-300 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                                <FiEdit2 size={13} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            ))}

            <p className="text-[10px] text-gray-300 text-center mt-1 italic">
                Historique d'achat · Segmentation · Notes internes
            </p>
        </div>
    );
}

// ─── Panel 5: AI Assistant — mirrors AIAssistantPage layout exactly ───────────
function PanelAI({ active }: { active: boolean }) {
    // Messages describe real app features, not invented stock predictions
    const messages = [
        { role: "user", msg: "Comment configurer une alerte de stock ?" },
        { role: "ai",   msg: "Dans Paramètres > Alertes, définissez un seuil par référence. L'application enverra une notification dès que le stock passe sous ce seuil." },
        { role: "user", msg: "Est-ce que je peux exporter mes commandes ?" },
        { role: "ai",   msg: "Oui — depuis la page Commandes, cliquez sur Exporter en haut à droite. Les formats CSV et PDF sont disponibles." },
    ];

    return (
        <div className="w-full h-full flex flex-col gap-2.5">
            {/* ChatHeader.tsx layout */}
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

            {/* MessageList.tsx bubble layout */}
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
                                ? { background: "#1a1523", color: "#fff", fontWeight: 600, borderRadius: "1rem 1rem 0.25rem 1rem" }
                                : { background: "rgba(255,255,255,0.7)", color: "#6b6880", border: "1px solid rgba(255,255,255,0.9)", borderRadius: "0.25rem 1rem 1rem 1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }
                            }
                        >
                            {m.role === "ai" && <span className="font-bold" style={{ color: BRAND }}>Stocks IA. </span>}
                            {m.msg}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Composer.tsx input bar */}
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

// ─── Panel 6: Alerts — real alert types the app generates ─────────────────────
function PanelAlerts({ active }: { active: boolean }) {
    const alerts = [
        { icon: <AlertTriangle size={13} />, type: "Rupture imminente",   msg: "Référence B — stock sous le seuil configuré",   color: "#ef4444", bg: "#fff1f2" },
        { icon: <AlertTriangle size={13} />, type: "Rupture imminente",   msg: "Référence C — stock épuisé",                   color: "#ef4444", bg: "#fff1f2" },
        { icon: <RefreshCw size={13} />,     type: "Réassort suggéré",    msg: "Référence B — commande automatique disponible", color: "#f59e0b", bg: "#fffbeb" },
        { icon: <Check size={13} />,         type: "Livraison confirmée", msg: "CMD-0012 Fournisseur A — livraison reçue",      color: "#10b981", bg: "#f0fdf4" },
        { icon: <Bell size={13} />,          type: "Alerte prix",         msg: "Référence A — variation de prix détectée",     color: "#3b82f6", bg: "#eff6ff" },
    ];

    const critiques = alerts.filter(a => a.color === "#ef4444").length;

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Alertes actives</p>
                <span className="text-[9px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                    {critiques} critiques
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

// ─── The 6 acts ───────────────────────────────────────────────────────────────
const ACTS = [
    {
        step: "01", badge: "Tableau de bord",
        icon: <BarChart2 size={18} />,
        title: "Vue d'ensemble centralisée",
        body: "Dès la connexion, le tableau de bord regroupe vos indicateurs clés : chiffre d'affaires, commandes, stocks et alertes — en un seul endroit.",
        highlight: "Vue centralisée — stocks, commandes, alertes",
        color: BRAND, panelKey: "dashboard",
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
        step: "04", badge: "Clients",
        icon: <Users size={18} />,
        title: "Gestion client centralisée",
        body: "Consultez l'historique d'achat, segmentez vos comptes, ajoutez des notes internes. Identifiez vos meilleurs clients en un coup d'œil.",
        highlight: "Historique d'achat · Segmentation · Notes internes",
        color: "#f59e0b", panelKey: "clients",
    },
    {
        step: "05", badge: "Assistant IA",
        icon: <Sparkles size={18} />,
        title: "Posez vos questions en français",
        body: "L'assistant IA analyse vos données et répond à vos questions métier. Interrogez vos stocks, commandes et alertes en langage naturel.",
        highlight: "Posez vos questions en français — réponse sur vos données",
        color: BRAND, panelKey: "ai",
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
    clients: PanelClients,
    ai: PanelAI,
    alerts: PanelAlerts,
};

// ─── Main DemoPage ────────────────────────────────────────────────────────────
export default function DemoPage() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
    const smooth = useSpring(scrollYProgress, { stiffness: 48, damping: 20, restDelta: 0.0003 });

    const [actIndex, setActIndex] = useState(0);
    useEffect(() => {
        return smooth.on("change", v => {
            const idx = Math.min(Math.floor(v * ACTS.length), ACTS.length - 1);
            setActIndex(idx);
        });
    }, [smooth]);

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

            {/* Entry header */}
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
                    Faites défiler pour explorer chaque fonctionnalité — interface réelle, données de démonstration.
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

            {/* Scrollytelling wrapper: 600vh = 6 acts × 100vh */}
            <div ref={wrapperRef} style={{ height: "600vh", position: "relative" }}>
                <div className="sticky top-0 h-screen flex items-center z-10 overflow-hidden px-6 md:px-14"
                    style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>

                    {/* Left: progress spine + annotation card */}
                    <div className="hidden lg:flex flex-col items-start gap-6 w-[320px] shrink-0 pr-8">
                        {/* Progress spine */}
                        <div className="flex flex-col gap-3 mb-2">
                            {ACTS.map((a, i) => {
                                const isActive = i === actIndex;
                                const isDone = i < actIndex;
                                return (
                                    <motion.div key={i} animate={{ opacity: isActive ? 1 : isDone ? 0.45 : 0.25 }}
                                        className="flex items-center gap-2.5">
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

                    {/* Right: sticky dashboard card */}
                    <div className="flex-1 flex items-center justify-center min-w-0">
                        <div className="relative w-full max-w-[520px]">
                            {/* Ambient glow */}
                            <div className="absolute -inset-10 pointer-events-none -z-10">
                                <motion.div
                                    animate={{ background: `radial-gradient(ellipse at 50% 60%, ${act.color}22 0%, transparent 65%)` }}
                                    transition={{ duration: 0.6 }}
                                    className="w-full h-full rounded-full"
                                    style={{ filter: "blur(40px)" }}
                                />
                            </div>

                            {/* Dashboard card shell — matches real app white card */}
                            <div
                                className="relative bg-white rounded-[2.2rem] p-6 overflow-hidden"
                                style={{ boxShadow: "0 24px 64px -12px rgba(123,95,162,0.16), 0 0 0 1px rgba(123,95,162,0.06)" }}
                            >
                                {/* Card header — matches real app page header pattern */}
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
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Démo
                                            </span>
                                        </div>
                                    </div>
                                    {/* macOS-style traffic lights — visual only */}
                                    <div className="flex gap-1.5">
                                        {["bg-red-300/70", "bg-yellow-300/70", "bg-green-400/80"].map((c, i) => (
                                            <span key={i} className={`w-3 h-3 rounded-full ${c}`} />
                                        ))}
                                    </div>
                                </div>

                                {/* Panel area */}
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

                            {/* Mobile annotation */}
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

            {/* End CTA */}
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
                    Créez votre compte et commencez à piloter vos stocks depuis le tableau de bord.
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