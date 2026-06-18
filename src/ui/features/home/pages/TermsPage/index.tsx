import { Link } from "react-router-dom";
import { Reveal } from "../HomePage/landingMotion";
import { MarketingLayout } from "../../components/MarketingLayout";
import { Eyebrow } from "../../components/marketingUI";

const SECTIONS = [
    {
        title: "1. Objet",
        content: `Les présentes conditions générales d'utilisation (ci-après « CGU ») régissent l'accès et l'utilisation de la plateforme StockS (ci-après « le Service »), éditée par StockS SAS, plateforme de gestion intelligente de stocks à destination des enseignes de distribution.

En s'inscrivant ou en utilisant le Service, l'Utilisateur accepte sans réserve les présentes CGU.`,
    },
    {
        title: "2. Description du Service",
        content: `StockS est une solution SaaS (Software as a Service) permettant aux enseignes de :
• Suivre et gérer leurs niveaux de stocks en temps réel
• Générer des prévisions de réapprovisionnement assistées par intelligence artificielle
• Visualiser des tableaux de bord analytiques (ventes, chiffre d'affaires, alertes)
• Gérer les commandes, fournisseurs, clients et équipes
• Consulter un assistant IA en langage naturel pour des insights métier

Le Service est accessible via navigateur web après création d'un compte.`,
    },
    {
        title: "3. Inscription et Compte Utilisateur",
        content: `3.1 Pour accéder au Service, l'Utilisateur doit créer un compte en fournissant des informations exactes et à jour (prénom, nom, adresse e-mail, mot de passe).

3.2 L'Utilisateur est seul responsable de la confidentialité de ses identifiants de connexion. Il s'engage à notifier immédiatement StockS de toute utilisation non autorisée de son compte.

3.3 StockS se réserve le droit de suspendre ou supprimer tout compte dont les informations sont inexactes ou en cas de violation des présentes CGU.`,
    },
    {
        title: "4. Collecte et Traitement des Données Personnelles",
        content: `4.1 StockS collecte les données personnelles strictement nécessaires au fonctionnement du Service : identité, coordonnées, données de connexion et données d'usage.

4.2 Conformément au Règlement Général sur la Protection des Données (RGPD – Règlement UE 2016/679), l'Utilisateur dispose des droits suivants :
• Droit d'accès à ses données personnelles
• Droit de rectification
• Droit à l'effacement (« droit à l'oubli »)
• Droit à la portabilité
• Droit d'opposition au traitement

Pour exercer ces droits, l'Utilisateur peut contacter : privacy@stocks-app.fr

4.3 Les données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec des sous-traitants techniques (hébergement, infrastructure) liés par des accords de confidentialité conformes au RGPD.`,
    },
    {
        title: "5. Intelligence Artificielle",
        content: `5.1 Le Service intègre des fonctionnalités d'intelligence artificielle (prévisions de stock, détection d'anomalies, assistant conversationnel). Ces fonctionnalités sont fournies à titre indicatif.

5.2 Les résultats produits par les algorithmes d'IA ne constituent pas des conseils professionnels. L'Utilisateur reste seul responsable de ses décisions métier basées sur ces analyses.

5.3 Les données utilisées pour entraîner ou affiner les modèles sont anonymisées et agrégées. Aucune donnée personnellement identifiable n'est utilisée à des fins d'entraînement IA sans consentement explicite.`,
    },
    {
        title: "6. Propriété Intellectuelle",
        content: `6.1 L'ensemble du Service — incluant le code source, les interfaces, les algorithmes, la documentation et les marques — est la propriété exclusive de StockS SAS et est protégé par les lois françaises et internationales sur la propriété intellectuelle.

6.2 L'Utilisateur bénéficie d'une licence d'utilisation personnelle, non exclusive, non transférable et révocable pour accéder au Service dans le cadre de son compte.

6.3 Il est formellement interdit de copier, reproduire, modifier, distribuer ou commercialiser tout ou partie du Service sans autorisation écrite préalable de StockS.`,
    },
    {
        title: "7. Responsabilités et Garanties",
        content: `7.1 StockS s'engage à mettre en œuvre les moyens raisonnables pour assurer la disponibilité du Service (objectif de disponibilité : 99,5 % par mois), sous réserve de maintenances planifiées notifiées en avance.

7.2 StockS ne saurait être tenu responsable des dommages indirects, pertes de données, pertes de revenus ou préjudices commerciaux résultant de l'utilisation ou de l'impossibilité d'utilisation du Service.

7.3 L'Utilisateur s'engage à utiliser le Service dans le respect des lois applicables et s'interdit tout usage frauduleux, abusif ou portant atteinte aux droits de tiers.`,
    },
    {
        title: "8. Durée et Résiliation",
        content: `8.1 Les présentes CGU sont applicables pour toute la durée d'utilisation du Service.

8.2 L'Utilisateur peut supprimer son compte à tout moment depuis les paramètres de son profil. La suppression entraîne l'effacement des données personnelles dans un délai de 30 jours, sous réserve des obligations légales de conservation.

8.3 StockS peut résilier l'accès au Service en cas de violation grave des présentes CGU, avec notification préalable par e-mail.`,
    },
    {
        title: "9. Modifications des CGU",
        content: `StockS se réserve le droit de modifier les présentes CGU à tout moment. Les modifications entrent en vigueur dès leur publication sur le Service. L'Utilisateur sera notifié par e-mail en cas de changements substantiels. La poursuite de l'utilisation du Service après notification vaut acceptation des nouvelles CGU.`,
    },
    {
        title: "10. Droit Applicable et Juridiction",
        content: `Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents de Paris seront seuls compétents.`,
    },
];

export default function TermsPage() {
    return (
        <MarketingLayout>
            {/* Header */}
            <div className="max-w-3xl mx-auto px-6 pt-16 pb-10 sm:px-8">
                <Reveal>
                    <Eyebrow>Légal</Eyebrow>
                    <h1 className="text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[40px]">
                        Conditions Générales d'Utilisation
                    </h1>
                    <p className="mt-3 text-sm text-muted-foreground/70">
                        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                </Reveal>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-6 pb-24 sm:px-8">
                <div className="flex flex-col gap-10">
                    {SECTIONS.map((section, i) => (
                        <div key={i}>
                            <h2 className="text-lg font-bold text-foreground mb-3">{section.title}</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{section.content}</p>
                        </div>
                    ))}
                </div>

                {/* Divider + back */}
                <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground/70">© {new Date().getFullYear()} StockS SAS. Tous droits réservés.</p>
                    <div className="flex gap-4">
                        <Link to="/confidentialite" className="text-sm font-semibold text-primary transition-colors hover:underline">
                            Voir la confidentialité →
                        </Link>
                        <Link to="/" className="text-sm text-muted-foreground/70 hover:text-muted-foreground transition-colors">
                            Retour à l'accueil
                        </Link>
                    </div>
                </div>
            </div>
        </MarketingLayout>
    );
}
