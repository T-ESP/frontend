import { motion } from "framer-motion";
import { BarChart2, Bell, RefreshCw, ShoppingBag, PieChart, Truck, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Prévisions IA",
    desc: "Anticipez les niveaux de stock, le CA et les tendances avec une précision chirurgicale.",
    icon: <BarChart2 size={22} />,
    accent: "from-[#7b5fa2] to-[#9d7bdd]",
  },
  {
    title: "Alertes temps réel",
    desc: "Ruptures, variations de prix, problèmes fournisseurs — notifié instantanément.",
    icon: <Bell size={22} />,
    accent: "from-orange-400 to-amber-500",
  },
  {
    title: "Réassort intelligent",
    desc: "Suggestions automatiques basées sur la vélocité de la demande et le stock courant.",
    icon: <RefreshCw size={22} />,
    accent: "from-emerald-500 to-teal-400",
  },
  {
    title: "Ventes & commandes",
    desc: "Suivez commandes, clients et CA — tout centralisé, tout connecté.",
    icon: <ShoppingBag size={22} />,
    accent: "from-rose-500 to-pink-400",
  },
  {
    title: "Tableaux de bord",
    desc: "KPIs visuels et graphiques interactifs pour piloter chaque aspect de votre activité.",
    icon: <PieChart size={22} />,
    accent: "from-blue-500 to-sky-400",
  },
  {
    title: "Gestion fournisseurs",
    desc: "Centralisez fournisseurs, livraisons et approvisionnements en un seul espace.",
    icon: <Truck size={22} />,
    accent: "from-[#7b5fa2] to-violet-400",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Features() {
  return (
    <section
      id="features"
      className="relative py-32 md:py-44 px-6 md:px-16"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Background handled globaly by index.tsx */}

      {/* Top gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-[#7b5fa2]/20 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-20 md:mb-28 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7b5fa2]/20 bg-[#7b5fa2]/5 text-[#7b5fa2] text-[11px] font-bold uppercase tracking-[0.18em] mb-7">
            Capacités
          </div>
          <h2 className="text-[clamp(2.2rem,4.5vw,4rem)] font-[900] text-gray-900 tracking-[-0.035em] leading-[1.05] mb-6">
            Conçu pour la vitesse<br className="hidden md:block" /> du commerce moderne.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Un ensemble d'outils spécialisés pour les professionnels de la logistique qui exigent précision, performance et transparence totale.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ staggerChildren: 0.09 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative bg-white rounded-[1.6rem] p-7 border border-gray-100 hover:border-[#7b5fa2]/20 transition-all duration-300 cursor-default overflow-hidden"
              style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}
              whileHover={{ y: -4, boxShadow: "0 20px 44px rgba(123,95,162,0.12)" }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.6rem]"
                style={{ background: "radial-gradient(ellipse 80% 60% at 30% 20%, rgba(123,95,162,0.05) 0%, transparent 70%)" }} />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.accent} flex items-center justify-center mb-5 text-white shadow-sm`}>
                {f.icon}
              </div>

              <h3 className="text-[1.05rem] font-[800] text-gray-900 tracking-tight mb-2.5">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-light">{f.desc}</p>

              <div className="mt-5 flex items-center gap-1.5 text-[11px] font-bold text-[#7b5fa2] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                En savoir plus <ArrowRight size={12} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
