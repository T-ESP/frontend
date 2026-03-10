import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";
import type { JSX } from "react";
import { clearAuthToken, useAuth } from "@/ui/features/auth/hooks/useAuth";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";


export function HomeHeader(): JSX.Element {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { t, i18n } = useTranslation();
    const { firstname, lastname, email } = useAuth();
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
        addToast(
            t('profile.toasts.logout_title', 'Logout'),
            t('profile.toasts.logout_msg', 'You have been logged out successfully.'),
            "info"
        );
        navigate("/login", { replace: true });
        setIsProfileMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 bg-white border-b border-gray-200 md:px-5">
            {/* Menu + Recherche */}
            <div className="flex items-center min-w-0 gap-3 md:gap-4">
                {/* Burger menu moved to Sidebar */}
            </div>

            {/* Actions droites */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Langue */}
                <div className="relative hidden sm:flex">
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
                        <div className="absolute right-0 z-20 w-40 py-1 mt-2 overflow-hidden duration-200 bg-white border border-gray-100 shadow-lg top-full rounded-xl animate-in fade-in slide-in-from-top-2">
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
                        className="flex gap-2 items-center px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                            {email ? email.charAt(0).toUpperCase() : (firstname ? firstname.charAt(0).toUpperCase() : "U")}
                        </div>
                        <div className="flex-col items-start hidden leading-tight md:flex">
                            <span className="text-sm font-medium text-gray-900">{firstname} {lastname}</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Menu déroulant */}
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 z-50 w-48 py-1 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <button
                                onClick={handleProfileClick}
                                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                            >
                                <User className="w-4 h-4" />
                                <span>{t('sidebar.profile', 'Profil')}</span>
                            </button>
                            <div className="my-1 border-t border-gray-200" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>{t('sidebar.logout', 'Se déconnecter')}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}