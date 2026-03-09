import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, LineChart } from "lucide-react";

const points = [
  { icon: <Sparkles size={16} className="text-purple-600" />, text: "Analyses prédictives basées sur vos données historiques" },
  { icon: <MessageSquare size={16} className="text-purple-600" />, text: "Assistant IA en langage naturel pour vos questions métier" },
  { icon: <LineChart size={16} className="text-purple-600" />, text: "Détection automatique des anomalies et opportunités" },
];

export default function AISection() {
  return (
    <section className="bg-[#fafafc] py-32 px-8 md:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-gray-900 to-black rounded-[3rem] overflow-hidden flex flex-col md:flex-row items-center gap-16 px-12 py-20 border border-gray-800"
        >
          {/* Decorative background aura for AI section */}
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full -z-0" />

          {/* Left Content */}
          <div className="flex-1 text-white relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest mb-6"
            >
              Intelligence Artificielle Gen-2
            </motion.div>

            <h2 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-8">
              Parlez à vos données <br />
              <span className="text-purple-400">comme à un ami.</span>
            </h2>

            <ul className="space-y-6 mb-12">
              {points.map((p, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {p.icon}
                  </div>
                  <span className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm">{p.text}</span>
                </motion.li>
              ))}
            </ul>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-gray-950 font-black px-8 py-4 rounded-2xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
            >
              Lancer l'assistant →
            </Link>
          </div>

          {/* Right — Immersive Glass Chat UI */}
          <div className="flex-1 justify-end perspective-1000 hidden md:flex">
            <motion.div
              initial={{ scale: 0.9, rotateY: 20, opacity: 0 }}
              whileInView={{ scale: 1, rotateY: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 w-[380px] shadow-2xl space-y-6 relative"
            >
              {/* Live indicator on mockup */}
              <div className="absolute top-4 right-6 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">AI Online</span>
              </div>

              {[
                { role: "user", msg: "Besoin de stock pour ce week-end ?" },
                { role: "ai", msg: "Analyse terminée. 🚀 Le produit 'Yaourt bio' est en rupture probable d'ici dimanche. Je suggère une commande de 150 unités." },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.4 + i * 1.5, duration: 0.6 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`text-xs px-5 py-4 rounded-2xl max-w-[85%] leading-relaxed shadow-lg ${m.role === "user"
                    ? "bg-white text-gray-900 font-bold rounded-tr-none"
                    : "bg-[#7b5fa2] text-white font-medium rounded-tl-none border border-white/10"
                    }`}>
                    {m.msg}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator at the end */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 3, duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="flex justify-start"
              >
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-full flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce delay-200" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
