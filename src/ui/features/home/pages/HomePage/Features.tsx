import { motion } from "framer-motion";
import { AlertCircle, Bell, Workflow, Sparkles, PieChart } from "lucide-react";

// ─── Bento Sub-Visuals ────────────────────────────────────────────────────────
function AIChartVisual() {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-[35%] md:left-[45%] overflow-hidden pointer-events-none fade-l-glass">
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full object-cover opacity-90" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ai-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7b5fa2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7b5fa2" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 250 C 50 200, 100 220, 150 150 C 200 80, 250 120, 300 50 C 350 -10, 400 30, 450 60 L 450 300 L 0 300 Z"
          fill="url(#ai-grad)"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        />
        <motion.path
          d="M0 250 C 50 200, 100 220, 150 150 C 200 80, 250 120, 300 50 C 350 -10, 400 30, 450 60"
          fill="none"
          stroke="#7b5fa2"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true, margin: "-100px" }}
        />
        {[
          { cx: 150, cy: 150, delay: 0.6 },
          { cx: 300, cy: 50, delay: 0.9 },
        ].map((pt, i) => (
          <motion.circle
            key={i} cx={pt.cx} cy={pt.cy} r={6}
            fill="#fff" stroke="#7b5fa2" strokeWidth="3"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: pt.delay, type: "spring", stiffness: 300 }}
            viewport={{ once: true }}
          />
        ))}
      </svg>
    </div>
  );
}

function AlertsVisual() {
  return (
    <div className="absolute inset-0 pt-10 flex flex-col items-center gap-3 overflow-hidden pointer-events-none fade-b-glass">
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="glass-card flex items-center gap-3 p-3.5 rounded-2xl border border-rose-100 shadow-md w-[80%] bg-white/95"
      >
        <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 border border-rose-100">
          <AlertCircle size={14} />
        </div>
        <div>
          <p className="text-[10px] font-[900] text-rose-600 uppercase tracking-wider mb-0.5">Stock critique</p>
          <p className="text-[10px] text-gray-500 font-bold">Lait d'avoine (Reste 2 vitrines)</p>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="glass-card flex items-center gap-3 p-3.5 rounded-2xl border border-gray-100 shadow-md w-[80%] bg-white/95 translate-x-4 opacity-80"
      >
        <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 border border-orange-100">
          <Bell size={14} />
        </div>
        <div>
          <p className="text-[10px] font-[900] text-gray-800 uppercase tracking-wider mb-0.5">Camion retardé</p>
          <p className="text-[10px] text-gray-500 font-bold">Fournisseur BioX (+2 jours)</p>
        </div>
      </motion.div>
    </div>
  );
}

function AutomationVisual() {
  return (
    <div className="absolute inset-0 pt-10 flex items-start justify-center pointer-events-none fade-b-glass">
      <div className="relative w-[180px] h-[180px]">
        {/* Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-[0_12px_24px_rgba(0,0,0,0.06)] flex items-center justify-center z-10">
          <Workflow size={20} className="text-[#7b5fa2]" />
        </div>
        {/* Orbital rings */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, ease: "linear", repeat: Infinity }} className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-[#7b5fa2]/30" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, ease: "linear", repeat: Infinity }} className="absolute inset-4 rounded-full border border-gray-200" />
        {/* Moving dots */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, ease: "linear", repeat: Infinity }} className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
        </motion.div>
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, ease: "linear", repeat: Infinity }} className="absolute inset-4">
          <div className="absolute bottom-0 left-1/2 w-2 h-2 -ml-[4px] -mb-[4px] rounded-full bg-[#7b5fa2] shadow-[0_0_10px_rgba(123,95,162,0.8)]" />
        </motion.div>
      </div>
    </div>
  );
}

function DashboardsVisual() {
  return (
    <div className="absolute top-8 right-0 left-[20%] md:left-[40%] bottom-[-10%] pointer-events-none drop-shadow-2xl fade-l-glass">
      <motion.div
        initial={{ opacity: 0, x: 60, y: 30 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-50px" }}
        className="w-[110%] h-[120%] bg-white/95 rounded-tl-[2rem] border-t border-l border-white p-6 md:p-8 flex flex-col gap-6 overflow-hidden shadow-[-20px_0_60px_rgba(0,0,0,0.06)]"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="w-28 h-4 rounded-full bg-gray-100" />
          <div className="w-16 h-4 rounded-full bg-emerald-50" />
        </div>
        <div className="flex gap-6 items-center">
          <div className="w-28 h-28 shrink-0 rounded-full border-[7px] border-gray-50 border-t-[#7b5fa2] border-r-[#7b5fa2] transform rotate-45" />
          <div className="flex flex-col gap-3 flex-1">
            <div className="w-full h-2.5 rounded-full bg-gray-50 overflow-hidden"><div className="w-[85%] h-full bg-[#7b5fa2]" /></div>
            <div className="w-full h-2.5 rounded-full bg-gray-50 overflow-hidden"><div className="w-[45%] h-full bg-emerald-400" /></div>
            <div className="w-full h-2.5 rounded-full bg-gray-50 overflow-hidden"><div className="w-[60%] h-full bg-orange-400" /></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="h-24 rounded-2xl bg-gray-50/80 border border-gray-100 p-4 flex flex-col justify-end">
            <div className="w-12 h-2 rounded-full bg-gray-200 mb-1.5" />
            <div className="w-20 h-4 rounded-full bg-gray-300" />
          </div>
          <div className="h-24 rounded-2xl bg-gray-50/80 border border-gray-100 p-4 flex flex-col justify-end">
            <div className="w-14 h-2 rounded-full bg-gray-200 mb-1.5" />
            <div className="w-16 h-4 rounded-full bg-gray-300" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function Features() {
  return (
    <section id="features" className="relative py-32 md:py-40 px-6 md:px-16" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        .fade-l-glass {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 25%);
          mask-image: linear-gradient(to right, transparent 0%, black 25%);
        }
        .fade-b-glass {
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 20%);
        }
        .bento-card {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.02);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .bento-card:hover {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 20px 60px rgba(123, 95, 162, 0.12);
          transform: translateY(-4px);
        }
      `}</style>

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7b5fa2]/20 bg-[#7b5fa2]/5 text-[#7b5fa2] text-[11px] font-bold uppercase tracking-[0.18em] mb-7">
            L'Intelligence Logistique
          </div>
          <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-[900] text-gray-900 tracking-[-0.035em] leading-[1.05] mb-6">
            Conçu pour la vitesse.<br className="hidden md:block" /> Propulsé par l'IA.
          </h2>
          <p className="text-gray-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Dites adieu aux tableaux Excel cassés. Une plateforme ultra-moderne conçue pour les équipes qui exigent précision et fluidité.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[360px]">

          {/* Card 1 - AI (2 cols) */}
          <div className="bento-card rounded-[2.2rem] md:col-span-2 relative overflow-hidden group">
            <AIChartVisual />
            <div className="absolute top-0 left-0 p-8 md:p-10 w-[85%] md:w-[60%] flex flex-col justify-end h-full z-10">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7b5fa2] to-[#7b5fa2] flex items-center justify-center text-white mb-6 shadow-[0_8px_20px_rgba(123,95,162,0.3)] mt-auto">
                <Sparkles size={22} />
              </div>
              <h3 className="text-[1.6rem] font-[800] text-gray-900 tracking-tight mb-2.5">Prévisions Intelligentes</h3>
              <p className="text-gray-500 leading-relaxed font-light text-[0.95rem]">
                L'IA analyse vos historiques de vente pour anticiper la demande. Ne tombez plus en rupture, ne sur-stockez plus inutilement.
              </p>
            </div>
          </div>

          {/* Card 2 - Alerts (1 col) */}
          <div className="bento-card rounded-[2.2rem] md:col-span-1 relative overflow-hidden group">
            <AlertsVisual />
            <div className="absolute bottom-0 left-0 p-8 md:p-9 w-full z-10 bg-gradient-to-t from-white/90 via-white/40 to-transparent pt-20">
              <h3 className="text-[1.3rem] font-[800] text-gray-900 tracking-tight mb-2">Vigilance Continue</h3>
              <p className="text-gray-500 leading-relaxed font-light text-[0.9rem]">
                Détection des anomalies et alertes en temps réel avant qu'elles n'impactent votre CA.
              </p>
            </div>
          </div>

          {/* Card 3 - Automation (1 col) */}
          <div className="bento-card rounded-[2.2rem] md:col-span-1 relative overflow-hidden group">
            <AutomationVisual />
            <div className="absolute bottom-0 left-0 p-8 md:p-9 w-full z-10 bg-gradient-to-t from-white/90 via-white/40 to-transparent pt-20">
              <h3 className="text-[1.3rem] font-[800] text-gray-900 tracking-tight mb-2">Flux Automatisé</h3>
              <p className="text-gray-500 leading-relaxed font-light text-[0.9rem]">
                Réassort 1-click et synchronisation des fournisseurs pour réduire la charge mentale.
              </p>
            </div>
          </div>

          {/* Card 4 - Dashboards (2 cols) */}
          <div className="bento-card rounded-[2.2rem] md:col-span-2 relative overflow-hidden group">
            <DashboardsVisual />
            <div className="absolute top-0 left-0 p-8 md:p-10 w-[85%] md:w-[50%] flex flex-col justify-end h-full z-10">
              <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white mb-6 shadow-lg mt-auto">
                <PieChart size={22} />
              </div>
              <h3 className="text-[1.6rem] font-[800] text-gray-900 tracking-tight mb-2.5">KPIs & Métriques</h3>
              <p className="text-gray-500 leading-relaxed font-light text-[0.95rem]">
                Visualisez la santé complète de votre logistique : vitesse d'écoulement, marges générées, et coûts cachés.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
