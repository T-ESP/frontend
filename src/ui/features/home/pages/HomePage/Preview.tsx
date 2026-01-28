import { motion } from "framer-motion";
import screen from "@/assets/images/preview.svg";

export default function Preview() {
  return (
    <section className="flex items-center min-h-screen relative bg-black text-white py-28 md:px-20 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-700 opacity-30 rounded-full blur-[200px] z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-500 opacity-20 rounded-full blur-[100px] z-0" />
      
      {/* Purple background blob */}
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-purple-700 opacity-20 rounded-full blur-[200px] z-0" />

      <div className=" relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left side */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <p className="uppercase text-sm text-purple-300 tracking-widest mb-4">Caption</p>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            The best in the <br />
            class product for <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">you today!</span>
          </h2>
          <p className="text-gray-300 mb-8">
            This is a placeholder for your testimonials and what your client has to say. Put them here and make sure it’s 100% true and meaningful.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button className="bg-[#7B5FA2] text-white font-semibold px-6 py-3 rounded-full hover:bg-purple-700 transition">
              Get a Free Demo
            </button>
            <a href="#demo" className="text-purple-300 text-sm hover:underline">
              Start work efficiently with StockS SaaS product
            </a>
          </div>
        </div>

        {/* Right side with screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex justify-center"
        >
          <img
            src={screen}
            alt="Dashboard preview"
            className="rounded-xl shadow-lg w-full max-w-xl object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
