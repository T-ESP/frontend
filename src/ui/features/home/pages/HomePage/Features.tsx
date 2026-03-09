import { motion } from "framer-motion";
import { BarChart2, Bell, RefreshCw, ShoppingBag, PieChart, Truck } from "lucide-react";

const BRAND = "#7b5fa2";
const BRAND_BG = "#ede6f7";

const features = [
  {
    title: "Prévisions IA",
    desc: "Anticipez les niveaux de stock, le chiffre d'affaires et les tendances avec une haute précision.",
    icon: <BarChart2 size={20} style={{ color: BRAND }} />,
  },
  {
    title: "Alertes en temps réel",
    desc: "Soyez notifié des ruptures de stock, variations de prix et problèmes fournisseurs instantanément.",
    icon: <Bell size={20} style={{ color: BRAND }} />,
  },
  {
    title: "Réapprovisionnement intelligent",
    desc: "Suggestions de réassort automatiques basées sur la vélocité de la demande et le stock actuel.",
    icon: <RefreshCw size={20} style={{ color: BRAND }} />,
  },
  {
    title: "Gestion des ventes & commandes",
    desc: "Suivez vos commandes, gérez vos clients et analysez votre chiffre d’affaires en un seul endroit.",
    icon: <ShoppingBag size={20} style={{ color: BRAND }} />,
  },
  {
    title: "Tableaux de bord visuels",
    desc: "Graphiques interactifs et panneaux KPI pour visualiser vos stocks, ventes et performances.",
    icon: <PieChart size={20} style={{ color: BRAND }} />,
  },
  {
    title: "Gestion fournisseurs",
    desc: "Centralisez vos fournisseurs, suivez les livraisons et optimisez vos relations d’approvisionnement.",
    icon: <Truck size={20} style={{ color: BRAND }} />,
  },
];

export default function Features() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section id="features" className="bg-[#ffffff] py-32 md:py-48 px-8 md:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Editorial Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-32 text-left md:text-center"
        >
          <p className="text-[#7b5fa2] text-[11px] font-[900] uppercase tracking-[0.3em] mb-8">Capabilities</p>
          <h2 className="text-5xl md:text-7xl font-[900] text-gray-900 tracking-[-0.03em] leading-[1] mb-12">
            Built for the speed <br className="hidden md:block" /> of commerce.
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl md:mx-auto">
            A specialized toolset for logistics professionals who demand precision, performance, and complete transparency.
          </p>
        </motion.div>

        {/* Feature Matrix */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12"
        >
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group flex flex-col items-start text-left"
            >
              <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-10 transition-all group-hover:bg-[#7b5fa2]/5 group-hover:border-[#7b5fa2]/20">
                <div className="text-gray-900 group-hover:text-[#7b5fa2] group-hover:scale-110 transition-all duration-500">
                  {f.icon}
                </div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
                {f.title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed font-medium transition-colors group-hover:text-gray-500">
                {f.desc}
              </p>

              <motion.div
                className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Documentation <span>→</span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
