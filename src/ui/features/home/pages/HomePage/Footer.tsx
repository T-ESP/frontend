import { Link } from "react-router-dom";
import { Logo } from "@/ui/components/common/Logo";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 px-8 md:px-16 py-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
                    {/* Brand */}
                    <div className="max-w-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <Logo className="w-7 h-7" />
                            <span className="text-lg font-bold text-gray-900">Stocks</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            La plateforme tout-en-un pour gérer vos stocks, vos ventes et vos équipes — propulsée par l'IA.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
                        <div>
                            <p className="font-semibold text-gray-700 mb-3">Produit</p>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-purple-600 transition-colors">Fonctionnalités</a></li>
                                <li><a href="#tarifs" className="hover:text-purple-600 transition-colors">Tarifs</a></li>
                                <li><a href="#advantages" className="hover:text-purple-600 transition-colors">Avantages</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-3">Entreprise</p>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-purple-600 transition-colors">À propos</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-purple-600 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700 mb-3">Compte</p>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/login" className="hover:text-purple-600 transition-colors">Se connecter</Link></li>
                                <li><Link to="/register" className="hover:text-purple-600 transition-colors">S'inscrire</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-400">
                    <p>© {new Date().getFullYear()} StockS. Tous droits réservés.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-purple-600 transition-colors">Politique de confidentialité</a>
                        <a href="#" className="hover:text-purple-600 transition-colors">Conditions d'utilisation</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
