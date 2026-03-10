import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, LineChart, ChevronRight } from "lucide-react";

const points = [
  { icon: <Sparkles size={16} />, text: "Analyses prédictives basées sur vos données historiques." },
  { icon: <MessageSquare size={16} />, text: "Posez des questions en langage naturel — l'IA répond en secondes." },
  { icon: <LineChart size={16} />, text: "Détection automatique des anomalies et opportunités de marge." },
];

const messages = [
  { role: "user", msg: "Besoin de stock pour ce week-end ?" },
  {
    role: "ai",
    msg: "Analyse terminée. Le produit 'Yaourt bio' est en rupture probable d'ici dimanche. Je recommande une commande de 150 unités chez votre fournisseur habituel.",
  },
];

export default function AISection() {
  return (
    <section
      className="relative py-32 md:py-44 px-6 md:px-16"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Background handled globaly by index.tsx */}

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -28, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7b5fa2]/20 bg-[#7b5fa2]/5 text-[#7b5fa2] text-[11px] font-bold uppercase tracking-[0.18em] mb-7">
              Intelligence Artificielle
            </div>

            <h2 className="text-[clamp(2.2rem,4vw,3.8rem)] font-[900] text-gray-900 tracking-[-0.035em] leading-[1.05] mb-6">
              Parlez à vos données<br />
              <span className="text-[#7b5fa2]">comme à un ami.</span>
            </h2>

            <p className="text-gray-400 text-lg font-light leading-relaxed mb-10 max-w-md">
              Notre assistant IA analyse votre historique, anticipe vos besoins et vous guide vers les meilleures décisions — en langage naturel.
            </p>

            <ul className="space-y-5 mb-10">
              {points.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7b5fa2] to-[#7b5fa2] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    {p.icon}
                  </div>
                  <span className="text-gray-500 text-sm font-light leading-relaxed">{p.text}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-2xl text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #7b5fa2 0%, #7b5fa2 100%)",
                boxShadow: "0 6px 28px rgba(123,95,162,0.36), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              Lancer l'assistant <ChevronRight size={16} />
            </Link>
          </motion.div>

          {/* Right — glass chat mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32, scale: 0.96, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div
              className="rounded-[2.4rem] p-8 border border-gray-100 space-y-5"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                boxShadow: "0 32px 80px rgba(123,95,162,0.12), 0 0 0 1px rgba(123,95,162,0.06)",
              }}
            >
              {/* Chat header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm"
                    style={{ background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)" }}>
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Assistant Stocks IA</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">En ligne</span>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">IA Gen-2</div>
              </div>

              {/* Messages */}
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.4, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`text-[13px] px-5 py-3.5 rounded-2xl leading-relaxed max-w-[85%] ${m.role === "user"
                      ? "bg-gray-900 text-white font-medium rounded-tr-none"
                      : "text-gray-700 font-light rounded-tl-none border border-gray-100"
                      }`}
                    style={m.role === "ai" ? {
                      background: "rgba(255,255,255,0.95)",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                    } : {}}
                  >
                    {m.role === "ai" && (
                      <span className="text-[#7b5fa2] font-bold">Analyse terminée. </span>
                    )}
                    {m.role === "ai"
                      ? "Le produit 'Yaourt bio' est en rupture probable d'ici dimanche. Je recommande une commande de 150 unités."
                      : m.msg
                    }
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 px-4 py-3 rounded-full border border-gray-100 bg-gray-50">
                  {[0, 0.15, 0.3].map((delay, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.7, repeat: Infinity, delay, ease: "easeInOut" }}
                      className="w-2 h-2 rounded-full bg-[#7b5fa2]/40"
                    />
                  ))}
                </div>
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-3 mt-2 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                <input
                  readOnly
                  placeholder="Posez votre question..."
                  className="flex-1 bg-transparent text-sm text-gray-400 outline-none placeholder:text-gray-300 cursor-default font-light"
                />
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)" }}>
                  <ChevronRight size={14} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
