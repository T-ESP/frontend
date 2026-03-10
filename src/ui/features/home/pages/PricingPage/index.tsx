import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/ui/components/common/Logo";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/ui/features/auth/hooks/useAuth";

const BRAND = "#7b5fa2";

export default function PricingPage() {
    const { t } = useTranslation();
    const { isAuthenticated, firstname } = useAuth();
    const [isYearly, setIsYearly] = useState(false);
    const location = useLocation();
    const isAppMode = location.pathname === '/abonnement';

    const TIERS = [
        {
            name: t("pricing.tiers.starter"),
            description: t("pricing.tiers.starter_desc"),
            priceMonthly: isAuthenticated ? 19 : 29,
            priceYearly: isAuthenticated ? 190 : 290,
            features: [
                t("pricing.features.products_1k"),
                t("pricing.features.dashboard_basic"),
                t("pricing.features.users_1"),
                t("pricing.features.support_email"),
                t("pricing.features.backups_manual"),
            ],
            notIncluded: [
                t("pricing.features.predictions_ai"),
                t("pricing.features.integration_supplier"),
                t("pricing.features.multi_store"),
                t("pricing.features.support_priority"),
            ],
            popular: false,
            cta: isAuthenticated ? "Plan Actuel" : t("pricing.cta.start_trial"),
            isCurrent: isAuthenticated,
        },
        {
            name: t("pricing.tiers.professional"),
            description: t("pricing.tiers.professional_desc"),
            priceMonthly: isAuthenticated ? 79 : 99,
            priceYearly: isAuthenticated ? 790 : 990,
            popular: true,
            features: [
                t("pricing.features.products_50k"),
                t("pricing.features.analytics_advanced"),
                t("pricing.features.users_5"),
                t("pricing.features.predictions_stock"),
                t("pricing.features.integration_supplier"),
                t("pricing.features.backups_daily"),
            ],
            notIncluded: [
                t("pricing.features.erp_custom"),
                t("pricing.features.account_manager"),
            ],
            cta: isAuthenticated ? "Passer à Pro" : t("pricing.cta.get_started"),
            isCurrent: false,
        },
        {
            name: t("pricing.tiers.enterprise"),
            description: t("pricing.tiers.enterprise_desc"),
            priceMonthly: isAuthenticated ? 249 : 299,
            priceYearly: isAuthenticated ? 2490 : 2990,
            popular: false,
            features: [
                t("pricing.features.products_unlimited"),
                t("pricing.features.models_custom"),
                t("pricing.features.users_unlimited"),
                t("pricing.features.multi_store_sync"),
                t("pricing.features.account_manager"),
                t("pricing.features.support_phone"),
                t("pricing.features.on_premise"),
            ],
            notIncluded: [],
            cta: isAuthenticated ? "Contacter les ventes" : t("pricing.cta.contact_sales"),
            isCurrent: false,
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* Navbar */}
            {!isAppMode && (
                <nav className="flex items-center justify-between px-8 md:px-16 py-5 border-b border-gray-100 bg-white sticky top-0 z-50">
                    <Link to="/" className="flex items-center gap-2">
                        <Logo className="w-8 h-8" />
                        <span className="text-lg font-bold text-gray-900 tracking-tight">Stocks</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-gray-700 font-medium">
                                    Bonjour, {firstname || "Utilisateur"}
                                </span>
                                <Link
                                    to="/dashboard"
                                    className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: BRAND }}
                                >
                                    Mon Espace
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm text-gray-700 font-medium transition-colors hover:opacity-70">
                                    Se connecter
                                </Link>
                                <Link
                                    to="/register"
                                    className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
                                    style={{ backgroundColor: BRAND }}
                                >
                                    Commencer gratuitement
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            )}

            {/* Hero */}
            <div className="text-center pt-20 pb-12 px-8">
                {isAuthenticated && (
                    <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold shadow-sm">
                        🎉 Tarifs préférentiels appliqués pour votre compte
                    </div>
                )}
                <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: BRAND }}>
                    Tarifs
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                    {t("pricing.title")}
                </h1>
                <p className="text-gray-500 text-lg max-w-xl mx-auto">{t("pricing.subtitle")}</p>

                {/* Billing toggle */}
                <div className="flex justify-center mt-10">
                    <div className="bg-gray-100 p-1 rounded-xl flex items-center">
                        <button
                            onClick={() => setIsYearly(false)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${!isYearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            {t("pricing.billing.monthly")}
                        </button>
                        <button
                            onClick={() => setIsYearly(true)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isYearly ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            {t("pricing.billing.yearly")}{" "}
                            <span className="text-emerald-600 text-xs ml-1 font-bold">-20%</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-8 pb-24 items-start">
                {TIERS.map((tier) => (
                    <div
                        key={tier.name}
                        className={`relative bg-white rounded-2xl p-8 border transition-all duration-300 ${tier.popular
                            ? "shadow-xl ring-2 scale-105 z-10"
                            : "border-gray-200 shadow-sm hover:shadow-md"
                            }`}
                        style={tier.popular ? { borderColor: BRAND } : {}}
                    >
                        {tier.popular && (
                            <div
                                className="absolute -top-4 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                                style={{ backgroundColor: BRAND }}
                            >
                                {t("pricing.most_popular")}
                            </div>
                        )}

                        <div className="text-center mb-8">
                            <h3 className="text-lg font-bold mb-2" style={{ color: tier.popular ? BRAND : "#374151" }}>
                                {tier.name}
                            </h3>
                            <p className="text-gray-500 text-sm h-10">{tier.description}</p>
                            <div className="mt-4 flex flex-col items-center justify-center gap-1">
                                <div className="flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-extrabold text-gray-900">
                                        €{isYearly ? tier.priceYearly : tier.priceMonthly}
                                    </span>
                                    <span className="text-gray-500">
                                        /{isYearly ? t("pricing.billing.yearly").toLowerCase() : t("pricing.billing.monthly").toLowerCase()}
                                    </span>
                                </div>
                                {isAuthenticated && !tier.isCurrent && (
                                    <span className="text-xs text-emerald-600 font-semibold mt-1">
                                        Prix membre appliqué
                                    </span>
                                )}
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8">
                            {tier.features.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm">
                                    <div className="mt-0.5 p-1 rounded-full shrink-0" style={{ backgroundColor: "#d4f0e0" }}>
                                        <Check size={11} style={{ color: "#27ae60" }} strokeWidth={3} />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </li>
                            ))}
                            {tier.notIncluded.map((feature) => (
                                <li key={feature} className="flex items-start gap-3 text-sm opacity-40">
                                    <div className="mt-0.5 p-1 rounded-full bg-gray-100 shrink-0">
                                        <X size={11} className="text-gray-400" strokeWidth={3} />
                                    </div>
                                    <span className="text-gray-500">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            to={isAuthenticated ? "/dashboard" : "/register"}
                            className="block w-full py-3 rounded-xl font-semibold text-center text-sm transition-all"
                            style={
                                tier.isCurrent
                                    ? { backgroundColor: "#d4f0e0", color: "#27ae60", cursor: "default", pointerEvents: "none" }
                                    : tier.popular
                                        ? { backgroundColor: BRAND, color: "white" }
                                        : { backgroundColor: "#f3f4f6", color: "#111827" }
                            }
                        >
                            {tier.isCurrent && <Check size={16} className="inline mr-2" />}
                            {tier.cta}
                        </Link>
                    </div>
                ))}
            </div>

            {/* FAQ */}
            <div className="bg-gray-50 py-20 px-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{t("pricing.faq.title")}</h2>
                    <div className="space-y-4">
                        {[
                            { q: t("pricing.faq.upgrade.q"), a: t("pricing.faq.upgrade.a") },
                            { q: t("pricing.faq.setup_fee.q"), a: t("pricing.faq.setup_fee.a") },
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
                                <p className="text-gray-500 text-sm">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            {!isAppMode && (
                <div className="text-center py-16 px-8 bg-white border-t border-gray-100">
                    <p className="text-gray-500 text-sm mb-4">Des questions ? <a href="mailto:contact@stocks.app" className="font-semibold" style={{ color: BRAND }}>Contactez-nous</a></p>
                    <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">← Retour à l'accueil</Link>
                </div>
            )}
        </div>
    );
}
