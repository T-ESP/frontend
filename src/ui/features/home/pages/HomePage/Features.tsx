import { motion } from "framer-motion";
import { BarChart2, Bell, RefreshCw, ShoppingBag, PieChart, FlaskConical } from "lucide-react";

const features = [
  {
    title: "Prévisions IA",
    desc: "Anticipez les niveaux de stock, le chiffre d'affaires et les tendances avec une haute précision.",
    icon: <BarChart2 size={20} className="text-purple-600" />,
  },
  {
    title: "Alertes en temps réel",
    desc: "Soyez notifié des ruptures de stock, anomalies et problèmes fournisseurs instantanément.",
    icon: <Bell size={20} className="text-purple-600" />,
  },
  {
    title: "Réapprovisionnement intelligent",
    desc: "Suggestions de réassort automatiques basées sur la vélocité de la demande.",
    icon: <RefreshCw size={20} className="text-purple-600" />,
  },
  {
    title: "Insights ventes",
    desc: "Meilleurs produits, panier moyen et segmentation client en un coup d'œil.",
    icon: <ShoppingBag size={20} className="text-purple-600" />,
  },
  {
    title: "Tableaux de bord visuels",
    desc: "Graphiques interactifs, heatmaps et panneaux KPI configurables.",
    icon: <PieChart size={20} className="text-purple-600" />,
  },
  {
    title: "Scénarios personnalisés",
    desc: "Simulez vos décisions de pricing, promotions et logistique avant de les prendre.",
    icon: <FlaskConical size={20} className="text-purple-600" />,
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
              className="bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-2xl p-6 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
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
