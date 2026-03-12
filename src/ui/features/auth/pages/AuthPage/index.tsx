import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/ui/components/common/Logo";
import { Link } from "react-router-dom";
import { LoginForm } from "../LoginPage/components/LoginForm";
import { RegisterForm } from "../RegisterPage/components/RegisterForm";

const BRAND = "#7b5fa2";

type Mode = "login" | "register";

interface AuthPageProps {
    initialMode?: Mode;
}

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
    const [mode, setMode] = useState<Mode>(initialMode);

    const isLogin = mode === "login";

    return (
        <div className="min-h-screen bg-[#f4f3f8] font-sans flex items-center justify-center p-4 md:p-6 relative overflow-hidden">

            {/* Main card */}
            <div className="relative w-full max-w-4xl min-h-[620px] bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:block">

                {/* ─── Mobile Logo Header ─── */}
                <div className="md:hidden flex items-center justify-center gap-2 pt-8 pb-4" style={{ color: BRAND }}>
                    <Logo className="w-8 h-8" />
                    <span className="font-bold text-xl tracking-tight">Stocks</span>
                </div>

                {/* ─── Login form panel (always rendered on the left slot on desktop) ─── */}
                <div
                    className={`
                        w-full md:absolute md:inset-y-0 md:left-0 md:w-1/2 flex flex-col justify-center px-6 py-6 md:p-12 transition-all duration-700 overflow-y-auto
                        ${isLogin ? "relative md:opacity-100 md:z-10 md:translate-x-0 flex-1" : "hidden md:flex md:opacity-0 md:z-0 md:-translate-x-8 md:pointer-events-none"}
                    `}
                >
                    <div className="my-auto md:my-0">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Bon retour 👋</h2>
                        <p className="text-sm text-gray-500 mb-8">Connectez-vous pour accéder à votre espace</p>
                        <LoginForm />
                        <Link to="/" className="inline-block mt-8 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">← Retour à l'accueil</Link>
                    </div>
                </div>

                {/* ─── Register form panel (always rendered on the right slot on desktop) ─── */}
                <div
                    className={`
                        w-full md:absolute md:inset-y-0 md:right-0 md:w-1/2 flex flex-col justify-center px-6 py-6 md:p-12 transition-all duration-700 overflow-y-auto
                        ${!isLogin ? "relative md:opacity-100 md:z-10 md:translate-x-0 flex-1" : "hidden md:flex md:opacity-0 md:z-0 md:translate-x-8 md:pointer-events-none"}
                    `}
                >
                    <div className="my-auto md:my-0">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Créer un compte</h2>
                        <p className="text-sm text-gray-500 mb-8">Remplissez les informations pour commencer</p>
                        <RegisterForm />
                        <Link to="/" className="inline-block mt-8 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">← Retour à l'accueil</Link>
                    </div>
                </div>

                {/* ─── Mobile toggle panel (visible only on small screens) ─── */}
                <div className="md:hidden mt-auto bg-[#f9f8fa] border-t border-gray-100 p-6 text-center">
                    <p className="text-sm text-gray-600 mb-3">
                        {isLogin ? "Pas encore inscrit ?" : "Déjà un compte ?"}
                    </p>
                    <button
                        onClick={() => setMode(isLogin ? "register" : "login")}
                        className="w-full border-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-300"
                        style={{ borderColor: BRAND, color: BRAND }}
                    >
                        {isLogin ? "Créer un compte" : "Se connecter"}
                    </button>
                </div>

                {/* ─── Sliding brand panel (Desktop only) ─── */}
                <div className="hidden md:block">
                    <AnimatePresence initial={false}>
                        <motion.div
                            key={mode}
                            initial={{ x: isLogin ? "-100%" : "100%" }}
                            animate={{ x: "0%" }}
                            exit={{ x: isLogin ? "100%" : "-100%" }}
                            transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                            className={`absolute inset-y-0 w-1/2 z-20 flex flex-col items-center justify-center text-center px-10 ${isLogin ? "right-0" : "left-0"
                                }`}
                            style={{ backgroundColor: BRAND }}
                        >
                            {/* Logo */}
                            <div className="flex items-center gap-2 mb-10">
                                <Logo className="w-9 h-9 brightness-0 invert" />
                                <span className="text-white font-bold text-xl tracking-tight">Stocks</span>
                            </div>

                            <h3 className="text-3xl font-extrabold text-white mb-4 relative z-10">
                                {isLogin ? "Pas encore inscrit ?" : "Déjà un compte ?"}
                            </h3>
                            <p className="text-white/80 text-base leading-relaxed mb-10 max-w-xs relative z-10">
                                {isLogin
                                    ? "Créez votre compte et commencez à gérer vos stocks avec l'IA."
                                    : "Connectez-vous pour retrouver votre tableau de bord."}
                            </p>
                            <button
                                onClick={() => setMode(isLogin ? "register" : "login")}
                                className="relative z-10 border-2 border-white text-white font-semibold px-10 py-3 rounded-full text-sm hover:bg-white transition-all duration-300 hover:text-[#7b5fa2] tracking-wide"
                            >
                                {isLogin ? "S'inscrire" : "Se connecter"}
                            </button>
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}

