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
        <div className="min-h-screen bg-[#f4f3f8] font-sans flex items-center justify-center p-6 relative overflow-hidden">

            {/* Main card */}
            <div className="relative w-full max-w-4xl min-h-[580px] bg-white rounded-3xl shadow-2xl overflow-hidden flex">

                {/* ─── Login form panel (always rendered on the left slot) ─── */}
                <div
                    className={`absolute inset-y-0 left-0 w-1/2 flex flex-col justify-center px-12 transition-all duration-700 ${isLogin ? "opacity-100 z-10 translate-x-0" : "opacity-0 z-0 -translate-x-8 pointer-events-none"
                        }`}
                >

                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Bon retour 👋</h2>
                    <p className="text-sm text-gray-400 mb-8">Connectez-vous pour accéder à votre espace</p>
                    <LoginForm />
                    <Link to="/" className="mt-6 text-xs text-gray-300 hover:text-gray-400 transition-colors">← Retour à l'accueil</Link>
                </div>

                {/* ─── Register form panel (always rendered on the right slot) ─── */}
                <div
                    className={`absolute inset-y-0 right-0 w-1/2 flex flex-col justify-center px-12 transition-all duration-700 ${!isLogin ? "opacity-100 z-10 translate-x-0" : "opacity-0 z-0 translate-x-8 pointer-events-none"
                        }`}
                >

                    <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Créer un compte</h2>
                    <p className="text-sm text-gray-400 mb-8">Remplissez les informations pour commencer</p>
                    <RegisterForm />
                    <Link to="/" className="mt-6 text-xs text-gray-300 hover:text-gray-400 transition-colors">← Retour à l'accueil</Link>
                </div>

                {/* ─── Sliding brand panel ─── */}
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
                            <Logo className="w-8 h-8 brightness-0 invert" />
                            <span className="text-white font-bold text-lg tracking-tight">Stocks</span>
                        </div>

                        <h3 className="text-3xl font-extrabold text-white mb-3 relative z-10">
                            {isLogin ? "Pas encore inscrit ?" : "Déjà un compte ?"}
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-xs relative z-10">
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
    );
}
                        </div >
    <div>
        <h1 className="text-xl font-black text-white leading-none mb-0.5">
            {initialMode === "login" ? "Bon retour" : "Créer un compte"}
        </h1>
        <p className="text-[12px]" style={{ color: "rgba(176,142,224,0.55)" }}>
            {initialMode === "login"
                ? "Connectez-vous à votre espace"
                : "Renseignez vos informations pour commencer"}
        </p>
    </div>
                    </div >

    {/* Form */ }
    < div className = "auth-input-override" >
        { initialMode === "login" ? <LoginForm /> : <RegisterForm />}
                    </div >
                </motion.div >

    {/* Back link */ }
    < motion.div
initial = {{ opacity: 0 }}
animate = {{ opacity: 1 }}
transition = {{ duration: 0.6, delay: 0.4 }}
className = "mt-6"
    >
    { initialMode === "login" ? (
    <Link
        to="/register"
        className="text-xs font-medium transition-colors"
        style={{ color: "rgba(176,142,224,0.4)" }}
        onMouseEnter={e => (e.currentTarget.style.color = BRAND_L)}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(176,142,224,0.4)")}
    >
        Pas encore de compte ? Créer un compte
    </Link>
) : (
    <Link
        to="/login"
        className="text-xs font-medium transition-colors"
        style={{ color: "rgba(176,142,224,0.4)" }}
        onMouseEnter={e => (e.currentTarget.style.color = BRAND_L)}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(176,142,224,0.4)")}
    >
        Déjà un compte ? Se connecter
    </Link>
)}
                </motion.div >
            </div >
        </>
    );
}
