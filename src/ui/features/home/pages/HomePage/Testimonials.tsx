import { motion } from "framer-motion";

const testimonials = [
  {
    title: "Un outil incroyable, m'a fait gagner des mois",
    content: "StockS a complètement transformé notre gestion des stocks. Les prévisions IA sont d'une précision bluffante et nous ont permis d'éviter plusieurs ruptures critiques.",
    name: "Marie Dupont",
    role: "Directrice Supply Chain, Enseigne Bio+",
    initials: "MD",
    color: "bg-purple-100 text-purple-700",
  },
  {
    title: "Enfin une solution qui comprend nos besoins",
    content: "Le tableau de bord est clair, les alertes en temps réel sont précieuses. Notre équipe a adopté StockS en quelques jours seulement.",
    name: "Thomas Renard",
    role: "Responsable Logistique, ModeMaison",
    initials: "TR",
    color: "bg-blue-100 text-blue-700",
  },
  {
    title: "ROI visible dès le premier mois",
    content: "Grâce aux insights IA, nous avons réduit notre surstockage de 34 % et optimisé nos commandes fournisseurs. L'investissement est largement rentabilisé.",
    name: "Sophie Laurent",
    role: "CEO, FreshGroupe",
    initials: "SL",
    color: "bg-green-100 text-green-700",
  },
  {
    title: "Support réactif et interface intuitive",
    content: "L'interface est moderne et agréable. On retrouve toutes les informations dont on a besoin sans se perdre. Le support est disponible et très efficace.",
    name: "Julien Moreau",
    role: "Manager Opérations, DistribPlus",
    initials: "JM",
    color: "bg-orange-100 text-orange-700",
  },
];

export default function Testimonials() {
  return (
    <section id="advantages" className="bg-gray-50 py-24 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            <p className="text-purple-600 text-sm font-semibold uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight max-w-lg">
              Ce que disent nos <span className="text-purple-600">clients</span>
            </h2>
          </div>
          <button className="text-sm font-semibold text-purple-600 border border-purple-300 hover:bg-purple-50 px-5 py-2.5 rounded-xl transition-colors whitespace-nowrap">
            Lire tous les témoignages
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <p className="text-purple-500 text-2xl font-serif mb-3">"</p>
              <h3 className="text-sm font-bold text-gray-800 mb-2">{t.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{t.content}</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
