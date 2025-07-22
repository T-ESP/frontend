import { useNavigate } from "react-router-dom";
import Logo from "../icons/Logo";

export function HomeHeader() {

  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-primary-deep shadow-md h-20 flex items-center px-4 md:px-8 justify-between sticky top-0 z-30">
      {/* Branding & Logo */}
      <div className="flex items-center gap-3">
        <Logo className="w-10 h-10 animate-none cursor-pointer"
          onClick={handleLogoClick}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-white font-extrabold text-2xl tracking-tight">StockS</span>
          <span className="text-primary-plus text-xs font-medium hidden sm:block">L’intelligence au service de votre stock</span>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="hidden md:flex gap-6 ml-12">
        <a href="/dashboard" className="text-white/90 hover:text-primary-plus font-medium transition-colors">Dashboard</a>
        <a href="/utilisateurs" className="text-white/90 hover:text-primary-plus font-medium transition-colors">Utilisateurs</a>
        <a href="/produits" className="text-white/90 hover:text-primary-plus font-medium transition-colors">Produits</a>
        <a href="/rapports" className="text-white/90 hover:text-primary-plus font-medium transition-colors">Rapports</a>
      </nav>

      {/* Actions utilisateur */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Bouton Connexion/Profil */}
        <button className="bg-primary-plus hover:bg-primary text-white font-semibold px-4 py-2 rounded-md shadow-sm transition-colors text-sm md:text-base">
          Connexion
        </button>
        <button className="hidden md:inline bg-white text-primary-plus hover:bg-primary-soft font-semibold px-4 py-2 rounded-md shadow-sm border border-primary-plus transition-colors text-sm md:text-base">
          Inscription
        </button>
        {/* Placeholder pour avatar, notifications, settings, etc. */}
        <div className="ml-2 flex items-center gap-2">
          <button className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-plus/20 hover:bg-primary-plus/40 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>
          <button className="hidden md:inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary-plus/20 hover:bg-primary-plus/40 transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div className="md:hidden flex items-center">
        {/* À remplacer par un vrai menu burger si besoin */}
        <button className="text-white focus:outline-none">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
    </header>
  );
}