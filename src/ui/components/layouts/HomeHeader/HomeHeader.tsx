import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";
import type { JSX } from "react";
import { clearAuthToken, useAuth } from "@/ui/features/auth/hooks/useAuth";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export function HomeHeader(): JSX.Element {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { t, i18n } = useTranslation();
    const { firstname, lastname, email } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const langRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        setIsLangMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        navigate("/profile");
        setIsProfileMenuOpen(false);
    };

    const handleLogout = () => {
        clearAuthToken();
        addToast(
            t("profile.toasts.logout_title", "Logout"),
            t("profile.toasts.logout_msg", "You have been logged out successfully."),
            "info",
        );
        navigate("/login", { replace: true });
        setIsProfileMenuOpen(false);
    };

    const initial = email
        ? email.charAt(0).toUpperCase()
        : firstname
        ? firstname.charAt(0).toUpperCase()
        : "U";

    return (
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mx-1 h-4" />
            </div>

            <div className="ml-auto flex items-center gap-1">
                {/* Language */}
                <div className="relative hidden sm:flex" ref={langRef}>
                    <button
                        onClick={() => setIsLangMenuOpen((v) => !v)}
                        aria-expanded={isLangMenuOpen}
                        className="inline-flex items-center gap-2 h-8 px-2.5 text-sm font-medium transition-colors rounded-md text-foreground hover:bg-muted"
                    >
                        <span className="text-base leading-none" aria-hidden>
                            {i18n.language === "fr" ? "🇫🇷" : "🇬🇧"}
                        </span>
                        <span>{i18n.language === "fr" ? "Français" : "English"}</span>
                        <ChevronDown
                            className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                                isLangMenuOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {isLangMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-md border border-border bg-popover py-1 shadow-md animate-in fade-in slide-in-from-top-1">
                            <button
                                onClick={() => handleLanguageChange("en")}
                                className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                                    i18n.language !== "fr"
                                        ? "bg-accent text-primary"
                                        : "text-foreground hover:bg-muted"
                                }`}
                            >
                                <span className="text-base">🇬🇧</span> English
                            </button>
                            <button
                                onClick={() => handleLanguageChange("fr")}
                                className={`flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                                    i18n.language === "fr"
                                        ? "bg-accent text-primary"
                                        : "text-foreground hover:bg-muted"
                                }`}
                            >
                                <span className="text-base">🇫🇷</span> Français
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen((v) => !v)}
                        aria-expanded={isProfileMenuOpen}
                        className="inline-flex items-center gap-2 h-8 px-1.5 text-sm font-medium transition-colors rounded-md text-foreground hover:bg-muted"
                    >
                        <span className="flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-accent text-primary">
                            {initial}
                        </span>
                        <span className="hidden md:inline">
                            {firstname} {lastname}
                        </span>
                        <ChevronDown
                            className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
                                isProfileMenuOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {isProfileMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-md border border-border bg-popover py-1 shadow-md animate-in fade-in slide-in-from-top-1">
                            <button
                                onClick={handleProfileClick}
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors text-foreground hover:bg-muted"
                            >
                                <User className="w-4 h-4" />
                                <span>{t("sidebar.profile", "Profil")}</span>
                            </button>
                            <Separator className="my-1" />
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors text-destructive hover:bg-destructive/10"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>{t("sidebar.logout", "Se déconnecter")}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
