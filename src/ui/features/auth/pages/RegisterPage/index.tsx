import { RegisterHeader } from "./components/RegisterHeader";
import { RegisterForm } from "./components/RegisterForm";
import { RegisterFooter } from "./components/RegisterFooter";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Subtle ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-30 pointer-events-none"
        style={{ backgroundColor: "#7b5fa2" }}
      />



      {/* Card */}
      <div className="z-10 w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-10">
        <RegisterHeader />
        <div className="mt-6">
          <RegisterForm />
        </div>
        <RegisterFooter />
      </div>

      {/* Back link */}
      <Link to="/" className="mt-6 text-xs text-gray-400 hover:text-gray-500 transition-colors z-10">
        ← Retour à l'accueil
      </Link>
    </div>
  );
}
