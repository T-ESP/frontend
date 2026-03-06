import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Preview() {
  return (
    <section className="bg-gray-50 py-24 px-8 md:px-16">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-14">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <p className="text-purple-600 text-sm font-semibold uppercase tracking-widest mb-4">Aperçu</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Tout ce dont vous avez besoin,<br />
            <span className="text-purple-600">en un seul endroit</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
            StockS centralise vos données, vos équipes et vos décisions. Du suivi des stocks à la facturation, tout est connecté et accessible en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold px-7 py-3.5 rounded-xl text-sm"
            >
              Obtenir une démo gratuite
            </Link>
            <a href="#features" className="text-sm text-purple-600 font-medium hover:underline mt-1 self-center">
              Découvrir toutes les fonctionnalités →
            </a>
          </div>
        </motion.div>

        {/* Right — Stats preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 grid grid-cols-2 gap-4"
        >
          {[
            { label: "Enseignes utilisatrices", value: "800+", color: "bg-purple-50 border-purple-100" },
            { label: "Réduction du surstockage", value: "-34%", color: "bg-green-50 border-green-100" },
            { label: "Alertes générées / mois", value: "12K+", color: "bg-blue-50 border-blue-100" },
            { label: "Satisfaction client", value: "98%", color: "bg-orange-50 border-orange-100" },
          ].map((s, i) => (
            <div key={i} className={`${s.color} border rounded-2xl p-6`}>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</p>
              <p className="text-sm text-gray-500 font-medium">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
