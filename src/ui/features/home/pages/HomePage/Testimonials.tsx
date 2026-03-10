import { motion } from "framer-motion";
import { Check, Zap, Shield, Users, Clock } from "lucide-react";

const advantages = [
  { icon: <Zap size={18} />, title: "Gain de temps", desc: "Automatisez les tâches répétitives, focus sur la croissance." },
  { icon: <Shield size={18} />, title: "Sécurité maximale", desc: "Données chiffrées, sauvegardées en temps réel. RGPD." },
  { icon: <Users size={18} />, title: "Collaboration", desc: "Travaillez en équipe avec des droits d'accès granulaires." },
  { icon: <Clock size={18} />, title: "Support 24/7", desc: "Notre équipe expert disponible à tout moment." },
];

const partners = [
  { initials: "INT", name: "Intermarché", stores: "250 magasins connectés", color: "rgba(239,68,68,0.08)", text: "#ef4444" },
  { initials: "CAR", name: "Carrefour", stores: "180 magasins connectés", color: "rgba(123,95,162,0.08)", text: "#7b5fa2" },
  { initials: "AUC", name: "Auchan", stores: "120 magasins connectés", color: "rgba(16,185,129,0.08)", text: "#10b981" },
];

const fadeUp: any = {
  hidden: { opacity: 0, y: 24, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

export default function Testimonials() {
  return (
    <section
      id="advantages"
      className="relative py-32 md:py-44 px-6 md:px-16"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Background handled globaly by index.tsx */}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-20 md:mb-28"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7b5fa2]/20 bg-[#7b5fa2]/5 text-[#7b5fa2] text-[11px] font-bold uppercase tracking-[0.18em] mb-7">
            Avantages
          </div>
          <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] font-[900] text-gray-900 tracking-[-0.035em] leading-[1.05] mb-5">
            Pourquoi choisir Stocks&nbsp;?
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-xl leading-relaxed">
            Rejoignez les grandes enseignes qui nous font confiance pour optimiser chaque aspect de leur gestion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Left — checklist + 2×2 grid */}
          <div className="flex flex-col gap-8">
            {/* Checklist */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ staggerChildren: 0.1 }}
              className="flex flex-col gap-4"
            >
              {[
                { title: "Déploiement en 48h", desc: "Mise en place sans interruption de votre activité." },
                { title: "Formation incluse", desc: "Accompagnement complet de vos équipes dès le jour 1." },
                { title: "Intégration facile", desc: "Compatible ERP, caisse, et tous vos outils existants." },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-500" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-400 font-light mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* 2×2 advantage cards */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true }}
              transition={{ staggerChildren: 0.08 }}
              className="grid grid-cols-2 gap-3"
            >
              {advantages.map((adv, i) => (
                <motion.div
                  key={i} variants={fadeUp}
                  className="group bg-[#fafafc] rounded-2xl p-5 border border-gray-100 hover:border-[#7b5fa2]/20 transition-all duration-300"
                  whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(123,95,162,0.09)" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b5fa2] to-[#7b5fa2] flex items-center justify-center text-white mb-3 shadow-sm">
                    {adv.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-1">{adv.title}</p>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">{adv.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — partner card */}
          <motion.div
            initial={{ opacity: 0, x: 32, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="bg-[#fafafc] rounded-[2rem] border border-gray-100 p-8"
            style={{ boxShadow: "0 4px 40px rgba(123,95,162,0.07)" }}
          >
            <div className="flex items-center justify-between mb-7">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em]">Enseignes partenaires</p>
              <span className="text-sm font-extrabold text-[#7b5fa2]">500+ clients</span>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              {partners.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.25 + i * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-gray-100 hover:border-[#7b5fa2]/20 transition-all duration-300"
                  style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[11px] font-extrabold shrink-0"
                      style={{ background: p.color, color: p.text }}>
                      {p.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-400 font-light mt-0.5">{p.stores}</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Check size={12} className="text-emerald-500" strokeWidth={3} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-5 border-t border-gray-100">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <span key={i} className="text-[#7b5fa2] text-base">★</span>)}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-gray-900">4.9/5</span>
                <span className="text-xs text-gray-400 font-light">satisfaction moyenne</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
