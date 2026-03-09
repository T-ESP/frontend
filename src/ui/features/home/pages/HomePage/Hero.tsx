import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/ui/components/common/Logo";
import { TrendingUp, BarChart2, Zap, Package, Menu, X, ChevronRight, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Hero() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex flex-col bg-[#fafafc] font-sans overflow-hidden">

      {/* ── Background Decors ─────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Mesh Gradient / Aura */}
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#f3eefe] blur-[120px] opacity-60"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#eeeefb] blur-[120px] opacity-60"
        />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#7b5fa2 1px, transparent 1px), linear-gradient(90deg, #7b5fa2 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* ── Navbar ────────────────────────────────────────────────── */}
      <nav className="relative flex items-center justify-between px-6 md:px-16 py-5 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100/50">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 rounded-lg bg-[#7b5fa2] transition-transform group-hover:scale-105">
            <Logo className="w-6 h-6 brightness-0 invert" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">Stocks</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <a href="#features" className="text-gray-600 hover:text-[#7b5fa2] transition-colors">Fonctionnalités</a>
          <a href="#advantages" className="text-gray-600 hover:text-[#7b5fa2] transition-colors">Avantages</a>
          <Link to="/tarifs" className="text-gray-600 hover:text-[#7b5fa2] transition-colors">Tarifs</Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block text-sm text-gray-700 font-semibold px-4 py-2 hover:text-[#7b5fa2] transition-colors">
            Se connecter
          </Link>
          <Link
            to="/register"
            className="bg-gray-900 text-white text-sm font-bold px-6 py-2.5 rounded-full hover:bg-[#7b5fa2] hover:shadow-lg hover:shadow-[#7b5fa2]/20 transition-all active:scale-95"
          >
            S'inscrire
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-6 md:hidden shadow-xl"
            >
              <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-gray-800">Fonctionnalités</a>
              <a href="#advantages" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-gray-800">Avantages</a>
              <Link to="/tarifs" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-semibold text-gray-800">Tarifs</Link>
              <div className="border-t pt-6 flex flex-col gap-4">
                <Link to="/login" className="text-center font-bold text-gray-700">Se connecter</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero body ─────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col lg:flex-row items-center justify-between gap-16 px-6 md:px-20 py-12 md:py-20 w-full max-w-7xl mx-auto">

        {/* ── Left column ─────────────────────────────────────────── */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7b5fa2]/10 border border-[#7b5fa2]/20 text-[#7b5fa2] text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Zap size={14} fill="currentColor" />
            L'intelligence artificielle au service de vos stocks
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-[900] text-gray-900 leading-[1.05] tracking-tight mb-8"
          >
            Gérez vos stocks <br />
            <span className="bg-gradient-to-r from-[#7b5fa2] to-[#9d7bdd] bg-clip-text text-transparent">
              en un clin d'œil
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            La plateforme tout-en-un pour les entreprises ambitieuses.
            Suivez vos stocks en temps réel, analysez vos ventes et profitez d'insights IA pour optimiser votre activité.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#7b5fa2] text-white font-bold px-10 py-4 rounded-2xl text-base shadow-xl shadow-[#7b5fa2]/30 hover:shadow-[#7b5fa2]/40 hover:-translate-y-1 transition-all"
            >
              Commencer gratuitement
              <ChevronRight size={20} />
            </Link>
            <button
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-bold px-10 py-4 rounded-2xl text-base hover:bg-gray-50 transition-all"
            >
              <Play size={16} className="fill-[#7b5fa2] text-[#7b5fa2]" />
              Voir la démo
            </button>
          </motion.div>
        </div>

        {/* ── Right column — Dashboard mockup ─────────────────────── */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[620px]">
            {/* Background blob behind mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute -inset-10 rounded-full blur-[80px] -z-10 opacity-30"
              style={{ backgroundColor: "#7b5fa2" }}
            />

            {/* ── Main dashboard card ─────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 border border-gray-100 relative"
            >

              {/* ── Performances mini card (floating) ──── */}
              <motion.div
                initial={{ opacity: 0, y: -20, x: -20, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8, type: "spring", stiffness: 100 }}
                className="absolute -top-12 -left-10 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 w-56 z-10"
              >
                <p className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-tight">
                  <BarChart2 size={16} className="text-[#7b5fa2]" />
                  Performances
                </p>
                <div className="flex items-end gap-1.5 h-16">
                  {[60, 75, 65, 85, 90, 80, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 0.5, delay: 1.2 + i * 0.05, ease: "easeOut" }}
                      className="flex-1 rounded-md"
                      style={{
                        background: i === 6 ? "#7b5fa2" : "#ede6f7",
                      }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* ── Insight IA card (floating) ─────────── */}
              <motion.div
                initial={{ opacity: 0, y: -30, x: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 100 }}
                className="absolute -top-16 -right-6 bg-white rounded-2xl shadow-xl px-5 py-5 border border-gray-100 w-72 z-10"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Zap size={18} className="text-amber-500" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-800">Assistant IA</p>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1">
                      Réapprovisionnez vos stocks de produits bio - la demande augmente de 45% ce week-end.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Dashboard Content ────────────────────────────── */}
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h3 className="text-lg font-[900] text-gray-900">Tableau de Bord</h3>
                  <div className="h-1 w-12 bg-[#7b5fa2] rounded-full" />
                </div>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400/20 border border-red-400/40" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/20 border border-yellow-400/40" />
                  <span className="w-3 h-3 rounded-full bg-green-400/20 border border-green-400/40" />
                </div>
              </div>

              {/* Revenue Pill */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center justify-between bg-gray-50/50 rounded-2xl px-6 py-5 border border-gray-100 mb-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#7b5fa2] flex items-center justify-center shadow-lg shadow-[#7b5fa2]/20">
                    <TrendingUp size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">CA Mensuel</p>
                    <p className="text-2xl font-[900] text-gray-900">€248.5K</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full font-bold text-sm">
                  <TrendingUp size={14} />
                  +14.2%
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gray-50/50 rounded-2xl px-5 py-5 border border-gray-100"
                >
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Stocks Actifs</p>
                  <p className="text-2xl font-[900] text-gray-900">1,284</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-gray-50/50 rounded-2xl px-5 py-5 border border-gray-100"
                >
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Commandes</p>
                  <p className="text-2xl font-[900] text-gray-900">42</p>
                </motion.div>
              </div>

              {/* Progress bars / Bars */}
              <div className="space-y-4">
                <div className="flex items-end gap-2 h-20 px-1">
                  {[40, 60, 45, 70, 55, 80, 50, 75, 65, 90, 70, 100, 85].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ duration: 0.6, delay: 0.7 + i * 0.05 }}
                      className="flex-1 rounded-md"
                      style={{
                        background: i === 11 ? "#7b5fa2" : "#f1ecf9",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Stock faible floating card (bottom-right) ─────────── */}
            <motion.div
              initial={{ opacity: 0, y: 30, x: 20, scale: 0.85 }}
              whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.3, type: "spring", stiffness: 90 }}
              className="absolute -bottom-10 -right-12 bg-white rounded-2xl shadow-2xl px-6 py-5 border border-gray-100 w-72 z-20 flex items-start gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <Package size={22} className="text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-[900] text-rose-500 mb-0.5 uppercase tracking-tight">Stock Faible</p>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  32 références nécessitent votre attention immédiate.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
