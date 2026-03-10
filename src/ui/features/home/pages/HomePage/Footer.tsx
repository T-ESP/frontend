import { Link } from "react-router-dom";
import { Logo } from "@/ui/components/common/Logo";
import { motion } from "framer-motion";

const links = {
    Produit: [["#features", "Fonctionnalités"], ["#advantages", "Avantages"], ["#", "Assistant IA"]],
    Application: [["/dashboard", "Tableau de bord"], ["/inventory", "Inventaire"], ["/orders", "Commandes"]],
    Compte: [["/login", "Se connecter"], ["/register", "S'inscrire"]],
};

export default function Footer() {
    return (
        <footer
            className="relative px-6 md:px-16 pt-16 pb-10"
            style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
        >
            {/* Background handled globaly by index.tsx */}

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="p-1.5 rounded-xl" style={{ background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)", boxShadow: "0 4px 14px rgba(123,95,162,0.3)" }}>
                                <Logo className="w-5 h-5 brightness-0 invert" />
                            </div>
                            <span className="text-[1.05rem] font-extrabold text-gray-900 tracking-tight">Stocks</span>
                        </div>
                        <p className="text-sm text-gray-400 font-light leading-relaxed max-w-[220px]">
                            La plateforme tout-en-un pour gérer vos stocks, ventes et équipes — propulsée par l'IA.
                        </p>

                        {/* CTA in footer */}
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 mt-6 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all"
                            style={{
                                background: "linear-gradient(135deg,#7b5fa2,#7b5fa2)",
                                boxShadow: "0 4px 18px rgba(123,95,162,0.3)",
                            }}
                        >
                            Commencer gratuitement
                        </Link>
                    </div>

                    {/* Nav links */}
                    {Object.entries(links).map(([group, items]) => (
                        <div key={group}>
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-4">{group}</p>
                            <ul className="space-y-2.5">
                                {items.map(([href, label]) => (
                                    <li key={label}>
                                        <Link
                                            to={href}
                                            className="text-sm text-gray-500 font-light hover:text-[#7b5fa2] transition-colors"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400"
                >
                    <p className="font-light">© {new Date().getFullYear()} Stocks. Tous droits réservés. · Données hébergées en France 🇫🇷</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-[#7b5fa2] transition-colors">Confidentialité</a>
                        <a href="#" className="hover:text-[#7b5fa2] transition-colors">CGU</a>
                        <a href="#" className="hover:text-[#7b5fa2] transition-colors">RGPD</a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
