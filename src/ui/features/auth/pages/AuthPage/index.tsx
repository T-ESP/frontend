import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "@/ui/components/common/Logo";
import { LoginForm } from "../LoginPage/components/LoginForm";
import { RegisterForm } from "../RegisterPage/components/RegisterForm";
import { Lock } from "lucide-react";

const BRAND = "#7b5fa2";
const BRAND_L = "#9d7bdd";

type AuthPageProps = {
    initialMode?: "login" | "register";
};

export default function AuthPage({ initialMode = "login" }: AuthPageProps) {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0c071e; }
        .auth-dot-grid {
          background-image: radial-gradient(rgba(123,95,162,0.14) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .auth-input-override input,
        .auth-input-override input[type="email"],
        .auth-input-override input[type="password"],
        .auth-input-override input[type="text"] {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(123,95,162,0.25) !important;
          color: #fff !important;
          border-radius: 0.875rem !important;
        }
        .auth-input-override input::placeholder {
          color: rgba(176,142,224,0.35) !important;
        }
        .auth-input-override input:focus {
          border-color: rgba(157,123,221,0.55) !important;
          box-shadow: 0 0 0 3px rgba(123,95,162,0.18) !important;
          outline: none !important;
        }
        .auth-input-override label {
          color: rgba(176,142,224,0.75) !important;
          font-size: 0.8rem !important;
          font-weight: 600 !important;
        }
        .auth-input-override button[type="submit"] {
          background: linear-gradient(135deg, ${BRAND}, ${BRAND_L}) !important;
          box-shadow: 0 6px 24px rgba(123,95,162,0.40) !important;
          border-radius: 0.875rem !important;
          color: #fff !important;
          font-weight: 700 !important;
          border: none !important;
          transition: transform 0.2s, box-shadow 0.2s !important;
        }
        .auth-input-override button[type="submit"]:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 32px rgba(123,95,162,0.52) !important;
        }
        .auth-input-override [type="checkbox"] {
          accent-color: ${BRAND_L};
        }
        .auth-input-override span,
        .auth-input-override p {
          color: rgba(176,142,224,0.55);
        }
        .auth-input-override .text-red-600 { color: #f87171 !important; }
        .auth-input-override .text-emerald-600 { color: #34d399 !important; }
      `}</style>

            {/* Fixed dark background */}
            <div className="fixed inset-0 z-0"
                style={{ background: "linear-gradient(155deg, #0c071e 0%, #110a2a 45%, #0e0820 100%)" }} />
            <div className="fixed inset-0 z-0 auth-dot-grid" style={{ opacity: 0.55 }} aria-hidden />
            <div className="fixed inset-0 z-0 pointer-events-none" style={{
                background: "radial-gradient(ellipse 70% 60% at 30% 20%, rgba(123,95,162,0.14) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 75% 80%, rgba(176,142,224,0.07) 0%, transparent 55%)",
            }} aria-hidden />

            {/* Page */}
            <div className="flex relative z-10 flex-col justify-center items-center px-4 py-12 min-h-screen"
                style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-2.5 mb-10"
                >
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-xl"
                            style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 4px 14px rgba(123,95,162,0.42)" }}>
                            <Logo className="w-5 h-5 brightness-0 invert" />
                        </div>
                        <span className="text-[1.2rem] font-extrabold text-white tracking-tight">Stocks</span>
                    </Link>
                </motion.div>

                {/* Card */}
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="p-8 w-full max-w-sm rounded-4xl"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(123,95,162,0.22)",
                        backdropFilter: "blur(24px) saturate(180%)",
                        WebkitBackdropFilter: "blur(24px) saturate(180%)",
                        boxShadow: "0 32px 80px -12px rgba(123,95,162,0.24), 0 0 0 1px rgba(123,95,162,0.1)",
                    }}
                >
                    {/* Header */}
                    <div className="flex gap-3 items-center mb-7">
                        <div className="flex justify-center items-center w-10 h-10 rounded-xl shrink-0"
                            style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)", boxShadow: "0 4px 14px rgba(123,95,162,0.38)" }}>
                            <Lock size={16} className="text-white" />
                        </div>
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
                    </div>

                    {/* Form */}
                    <div className="auth-input-override">
                        {initialMode === "login" ? <LoginForm /> : <RegisterForm />}
                    </div>
                </motion.div>

                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-6"
                >
                    {initialMode === "login" ? (
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
                </motion.div>
            </div>
        </>
    );
}
