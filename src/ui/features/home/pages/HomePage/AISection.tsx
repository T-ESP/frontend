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
    <section className="bg-white py-24 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center gap-10 px-10 py-14"
        >
          {/* Left */}
          <div className="flex-1 text-white">
            <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-4">Intelligence Artificielle</p>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6">
              Votre copilote IA pour<br />une gestion sans effort
            </h2>
            <ul className="space-y-4 mb-8">
              {points.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                    {p.icon}
                  </div>
                  <span className="text-purple-100 text-sm leading-relaxed">{p.text}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-6 py-3 rounded-xl text-sm hover:bg-purple-50 transition-colors"
            >
              Essayer l'IA gratuitement →
            </Link>
          </div>

          {/* Right — decorative chat UI */}
          <div className="hidden md:flex flex-1 justify-end">
            <div className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-5 w-72 space-y-3">
              {[
                { role: "user", msg: "Quel est mon produit le plus vendu ce mois ?" },
                { role: "ai", msg: "🏆 Le produit #A-2312 « Yaourt bio 500g » avec 3 814 unités vendues, en hausse de +22%." },
                { role: "user", msg: "Faut-il le réapprovisionner ?" },
                { role: "ai", msg: "✅ Oui — stock actuel : 420 unités (5 jours). Je recommande une commande de 2 500 unités dès aujourd'hui." },
              ].map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`text-xs px-3 py-2 rounded-xl max-w-[85%] leading-relaxed ${m.role === "user"
                      ? "bg-white text-gray-800"
                      : "bg-purple-500/60 text-white"
                    }`}>
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
