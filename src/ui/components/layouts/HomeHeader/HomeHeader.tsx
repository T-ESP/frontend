import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Menu, Search, User, LogOut } from "lucide-react";
import avatarImg from "@/assets/images/BOT.png";
import type { JSX } from "react";
import type { HomeHeaderProps } from "./HomeHeader.types";
import { clearAuthToken } from "@/ui/features/auth/hooks/useAuth";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";


export function HomeHeader({ onMenuClick, isSidebarOpen }: HomeHeaderProps): JSX.Element {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { i18n } = useTranslation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleProfileClick = () => {
    navigate("/profile");
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    clearAuthToken();
    addToast("Logged out", "You have been logged out successfully.", "info");
    navigate("/login", { replace: true });
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="flex sticky top-0 z-30 justify-between items-center px-3 h-16 bg-white border-b border-gray-200 md:px-5">
      {/* Menu + Recherche */}
      <div className="flex gap-3 items-center min-w-0 md:gap-4">
        <div className="absolute left-[-7px] w-4 h-full bg-white " />
        <button
          type="button"
          className="inline-flex justify-center items-center w-9 h-9 text-gray-700 rounded-md hover:bg-gray-100"
          onClick={onMenuClick}
          aria-label={(isSidebarOpen ?? false) ? "Collapse sidebar" : "Expand sidebar"}
          aria-pressed={isSidebarOpen ?? false}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 w-[260px] md:w-[360px]">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Actions droites */}
      <div className="flex gap-2 items-center md:gap-4">
        {/* Notifications */}
        <button className="inline-flex relative justify-center items-center w-9 h-9 text-gray-700 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full">6</span>
        </button>

        {/* Langue */}
        <div className="hidden relative sm:flex">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex gap-2 items-center px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl" aria-hidden>{i18n.language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
            <span className="text-sm font-medium text-gray-700">
              {i18n.language === 'fr' ? 'Français' : 'English'}
            </span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${i18n.language !== 'fr' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className="text-lg">🇬🇧</span> English
              </button>
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${i18n.language === 'fr' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <span className="text-lg">🇫🇷</span> Français
              </button>
            </div>
          )}
        </div>

        {/* Profil utilisateur */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex gap-2 items-center py-1 pr-2 pl-1 rounded-full hover:bg-gray-100"
          >
            <img src={avatarImg} alt="Avatar" className="object-cover w-8 h-8 rounded-full" />
            <div className="hidden flex-col items-start leading-tight md:flex">
              <span className="text-sm font-medium text-gray-900">Moni Roy</span>
              <span className="text-[11px] text-gray-500">Admin</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Menu déroulant */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={handleProfileClick}
                className="flex gap-3 items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Profil</span>
              </button>
              <div className="my-1 border-t border-gray-200" />
              <button
                onClick={handleLogout}
                className="flex gap-3 items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}