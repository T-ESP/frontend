import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, ArrowUpRight } from "lucide-react";

const stats = [
  { value: "10+", label: "Modules disponibles", bg: "rgba(123,95,162,0.06)", border: "rgba(123,95,162,0.12)" },
  { value: "−30%", label: "Réduction du surstockage", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.14)" },
  { value: "Temps réel", label: "Alertes prix & stocks", bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.12)" },
  { value: "Inclus", label: "Assistant IA intégré", bg: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.12)" },
];

export default function Preview() {
  return (
    <section
      className="relative py-32 md:py-44 px-6 md:px-16"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Background handled globaly by index.tsx */}

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -28, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7b5fa2]/20 bg-[#7b5fa2]/5 text-[#7b5fa2] text-[11px] font-bold uppercase tracking-[0.18em] mb-7">
              Aperçu plateforme
            </div>

            <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] font-[900] text-gray-900 tracking-[-0.035em] leading-[1.05] mb-6">
              Tout ce dont vous avez besoin,<br />
              <span className="text-[#7b5fa2]">en un seul endroit.</span>
            </h2>

            <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-md">
              Stocks centralise vos données, vos équipes et vos décisions. Du suivi des stocks à la facturation — tout connecté, tout accessible.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-white font-bold text-sm px-8 py-4 rounded-2xl transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #7b5fa2 0%, #7b5fa2 100%)",
                  boxShadow: "0 6px 28px rgba(123,95,162,0.36), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                Obtenir une démo <ChevronRight size={16} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#7b5fa2] transition-colors self-center"
              >
                Toutes les fonctionnalités <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>

          {/* Right — stats 2×2 */}
          <motion.div
            initial={{ opacity: 0, x: 32, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileHover={{ y: -3, boxShadow: "0 16px 36px rgba(123,95,162,0.1)" }}
                className="rounded-[1.4rem] p-6 border transition-all duration-300 cursor-default"
                style={{ background: s.bg, borderColor: s.border }}
              >
                <p className="text-[1.8rem] font-[900] text-gray-900 tracking-tight leading-none mb-2">{s.value}</p>
                <p className="text-xs text-gray-400 font-light leading-snug">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
