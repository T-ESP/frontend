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
  return (
    <section id="features" className="bg-white py-24 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-purple-600 text-sm font-semibold uppercase tracking-widest mb-3">Fonctionnalités</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Des outils puissants pour<br className="hidden md:block" /> une gestion intelligente
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explorez les fonctionnalités qui vous aident à anticiper, optimiser et croître — depuis un seul tableau de bord.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              viewport={{ once: true }}
              className="bg-gray-50 hover:bg-[#f7f3fc] border border-gray-100 hover:border-[#c4b0dc] rounded-2xl p-6 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: BRAND_BG }}>
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
