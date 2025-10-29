import { motion } from "framer-motion";
import BOT from "../../assets/images/AI.svg";

export default function AISection() {
  return (
    <section className="min-h-screen relative bg-black text-white py-24 px-6 md:px-12 flex justify-center items-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-700 opacity-30 rounded-full blur-[200px] z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[100px] z-0" />
      {/* Content Wrapper */}
      <div className="relative h-full z-10 flex flex-col lg:flex-row items-center justify-between gap-50 mx-auto">
        {/* Text Side */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <p className="uppercase text-sm text-purple-300 tracking-widest mb-4">
            Caption
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            AI Assistant <br /> Integration
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 bg-white text-black rounded-full font-semibold shadow hover:bg-purple-200 transition"
          >
            Try Now
          </motion.button>
        </div>

        {/* Bot Side */}
        <div className="w-full lg:w-1/2 flex justify-center relative">
          <img
            src={BOT}
            alt="AI Assistant Bot"
            className="w-[260px] h-auto object-contain z-10"
          />

          {/* Speech Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -top-10 lg:-top-12 bg-white text-black text-sm px-4 py-2 rounded-xl shadow max-w-[250px] z-20"
          >
            Hey there! I'm your AI bot. I’ll help you boost profits and monitor
            your stock!
          </motion.div>
        </div>
      </div>
    </section>
  );
}
