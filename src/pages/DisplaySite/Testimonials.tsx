import { motion } from "framer-motion";

export default function Testimonials() {
  const testimonials = Array(4).fill({
    title: "Amazing tool! Saved me months",
    content:
      "This is a placeholder for your testimonials and what your client has to say, put them here and make sure it's 100% true and meaningful.",
    name: "John Master",
    role: "Director, UiFry.com",
  });

  return (
    <section
      id="testimonials"
      className="min-h-screen bg-black text-white px-6 md:px-20 py-24"
    >
      {/* Heading */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold max-w-xl leading-tight">
            Here's what our{" "}
            <span className="text-purple-400">customer</span> <br /> has to says
          </h2>
          <button className="mt-6 border border-purple-400 text-purple-400 px-6 py-2 rounded-full hover:bg-purple-400 hover:text-black transition">
            Read customer stories
          </button>
        </div>
        <div className="text-sm text-gray-400 mt-10 md:mt-0 max-w-sm">
          <p>
            * [short description goes in here] lorem ipsum is a placeholder text
            to demonstrate.
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {testimonials.map((t, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="bg-[#1a1a2e] text-white p-6 rounded-2xl shadow-md hover:shadow-purple-800 hover:scale-[1.02] transition-all duration-300"
          >
            <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
            <p className="text-sm text-gray-300 mb-6">{t.content}</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-500"></div>
              <div className="text-sm">
                <p className="font-semibold">{t.name}</p>
                <p className="text-gray-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
