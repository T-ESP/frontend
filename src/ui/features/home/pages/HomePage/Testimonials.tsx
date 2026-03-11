import { motion } from "framer-motion";
import { Check, Zap, Shield, Users, Clock } from "lucide-react";

const advantages = [
  { icon: <Zap size={18} />, title: "Gain de temps", desc: "Automatisez les tâches répétitives, focus sur la croissance." },
  { icon: <Shield size={18} />, title: "Sécurité maximale", desc: "Données chiffrées, sauvegardées en temps réel. RGPD." },
  { icon: <Users size={18} />, title: "Collaboration", desc: "Travaillez en équipe avec des droits d'accès granulaires." },
  { icon: <Clock size={18} />, title: "Support 24/7", desc: "Notre équipe expert disponible à tout moment." },
];

const fadeUp: any = {
  hidden: { opacity: 0, y: 24, filter: "blur(5px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};

const steps = [
  {
    num: "01",
    title: "Connectez",
    desc: "Ajoutez vos produits, fournisseurs et entrepôts en quelques minutes depuis l'interface ou via import CSV.",
  },
  {
    num: "02",
    title: "Configurez",
    desc: "Paramétrez vos seuils d'alerte, vos règles de réassort automatique et les accès de votre équipe.",
  },
  {
    num: "03",
    title: "Pilotez",
    desc: "Suivez vos stocks en temps réel, recevez des alertes intelligentes et laissez l'IA gérer le reste.",
  },
];

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
          <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] font-[900] text-white tracking-[-0.035em] leading-[1.05] mb-5">
            Pourquoi choisir Stocks&nbsp;?
          </h2>
          <p className="text-purple-300/50 text-lg font-light max-w-xl leading-relaxed">
            Conçu pour les gérants de commerce indépendant, les responsables logistique et les équipes e-commerce.
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
                { title: "Prise en main rapide", desc: "Interface pensée pour les non-techniciens — aucune formation longue requise." },
                { title: "Documentation intégrée", desc: "Guides et explications disponibles directement dans l'application." },
                { title: "Données centralisées", desc: "Stocks, commandes et alertes réunis dans une seule interface unifiée." },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-500" strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-100">{item.title}</p>
                    <p className="text-sm text-purple-300/50 font-light mt-0.5">{item.desc}</p>
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
                  className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#7b5fa2]/20 transition-all duration-300"
                  whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(123,95,162,0.09)" }}
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7b5fa2] to-[#7b5fa2] flex items-center justify-center text-white mb-3 shadow-sm">
                    {adv.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{adv.title}</p>
                  <p className="text-xs text-gray-500 font-light leading-relaxed">{adv.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right — Comment ça marche */}
          <motion.div
            initial={{ opacity: 0, x: 32, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] border border-gray-100 p-8"
            style={{ boxShadow: "0 4px 40px rgba(123,95,162,0.07)" }}
          >
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-8">Comment ça marche</p>

            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-5"
                >
                  <div
                    className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-[900] text-white"
                    style={{ background: "linear-gradient(135deg, #7b5fa2, #9d7bdd)" }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">{step.title}</p>
                    <p className="text-xs text-gray-500 font-light leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
