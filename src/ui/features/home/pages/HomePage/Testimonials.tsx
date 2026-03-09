import { motion } from "framer-motion";
import { Check, Zap, Shield, Users, Clock } from "lucide-react";

const BRAND = "#7b5fa2";

const advantages = [
  {
    icon: <Zap size={20} style={{ color: BRAND }} />,
    title: "Gain de temps",
    desc: "Automatisez les tâches répétitives et concentrez-vous sur votre croissance",
  },
  {
    icon: <Shield size={20} style={{ color: BRAND }} />,
    title: "Sécurité maximale",
    desc: "Vos données sont cryptées et sauvegardées en temps réel",
  },
  {
    icon: <Users size={20} style={{ color: BRAND }} />,
    title: "Collaboration facile",
    desc: "Travaillez en équipe avec des droits d'accès personnalisés",
  },
  {
    icon: <Clock size={20} style={{ color: BRAND }} />,
    title: "Support 24/7",
    desc: "Notre équipe est disponible pour vous accompagner à tout moment",
  },
];

const partners = [
  { initials: "INT", name: "Intermarché", stores: "250 magasins connectés", color: "#fdd9d7", textColor: "#c0392b" },
  { initials: "CAR", name: "Carrefour", stores: "180 magasins connectés", color: "#e8dff7", textColor: BRAND },
  { initials: "AUC", name: "Auchan", stores: "120 magasins connectés", color: "#d4f0e0", textColor: "#27ae60" },
];

export default function Testimonials() {
  return (
    <section id="advantages" className="bg-white py-24 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Pourquoi choisir Stocks&nbsp;?
          </h2>
          <p className="text-gray-500 text-lg max-w-xl">
            Rejoignez les plus grandes enseignes qui nous font confiance pour optimiser leur gestion.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left — checklist + features grid */}
          <div className="w-full lg:w-1/2">
            {/* Checklist */}
            <div className="flex flex-col gap-5 mb-10">
              {[
                { title: "Déploiement en 48h", desc: "Mise en place rapide sans interruption de votre activité" },
                { title: "Formation incluse", desc: "Formation complète de vos équipes à l'utilisation de la plateforme" },
                { title: "Intégration facile", desc: "Compatible avec vos outils existants (ERP, caisse, etc.)" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "#d4f0e0" }}
                  >
                    <Check size={11} style={{ color: "#27ae60" }} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Features 2×2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {advantages.map((adv, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#ede6f7" }}
                  >
                    {adv.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{adv.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{adv.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Partner card */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-full lg:w-1/2 bg-gray-50 rounded-3xl border border-gray-100 p-8 shadow-sm"
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-semibold text-gray-500">Enseignes partenaires</p>
              <span className="text-sm font-bold" style={{ color: BRAND }}>500+</span>
            </div>

            {/* Partner rows */}
            <div className="flex flex-col gap-4 mb-8">
              {partners.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0"
                      style={{ backgroundColor: p.color, color: p.textColor }}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.stores}</p>
                    </div>
                  </div>
                  <Check size={18} style={{ color: "#27ae60" }} strokeWidth={2.5} />
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 font-medium">Satisfaction moyenne</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-gray-800">4.9/5</span>
                <span className="text-yellow-400 text-base">★</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
