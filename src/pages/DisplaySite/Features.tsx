import { motion } from "framer-motion";

const features = [
  {
    title: "AI Forecasting",
    desc: "Predict stock levels, revenue, and trends with high precision.",
    icon: "📈",
  },
  {
    title: "Real-Time Alerts",
    desc: "Stay notified about stockouts, anomalies, and supplier issues.",
    icon: "🚨",
  },
  {
    title: "Smart Reordering",
    desc: "Auto-suggested replenishment based on demand velocity.",
    icon: "🔄",
  },
  {
    title: "Sales Insights",
    desc: "Top products, average basket size, and customer segmentation.",
    icon: "🛍️",
  },
  {
    title: "Visual Dashboards",
    desc: "Interactive charts, heatmaps, and KPI panels.",
    icon: "📊",
  },
  {
    title: "Custom Scenarios",
    desc: "Simulate pricing, promo, and logistics decisions.",
    icon: "🧪",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="bg-[#0f0f1b] min-h-screen text-white px-6 md:px-20 py-24"
    >
        
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Powerful Features, <br className="hidden md:block" />
          Built for Smart Inventory Management
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto mb-16">
          Explore the tools that help you anticipate, optimize, and grow — all
          from one beautiful dashboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-[#1a1a2e] rounded-xl p-6 shadow-lg hover:scale-[1.03] hover:shadow-purple-900 transition duration-300 ease-in-out"
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
