import { Link } from "react-router-dom";
import { Reveal } from "../HomePage/landingMotion";
import { MarketingLayout } from "../../components/MarketingLayout";
import { Eyebrow } from "../../components/marketingUI";

const SECTIONS = [
  {
    title: "1. Responsable du traitement",
    content: `La présente politique de confidentialité décrit la manière dont StockS SAS (« StockS », « nous ») collecte, utilise et protège les données personnelles des utilisateurs de la plateforme StockS (« le Service »).

Pour toute question relative à vos données, vous pouvez contacter notre délégué à la protection des données : privacy@stocks-app.fr`,
  },
  {
    title: "2. Données collectées",
    content: `Nous collectons uniquement les données nécessaires au fonctionnement du Service :
• Données d'identité et de contact : prénom, nom, adresse e-mail.
• Données de connexion : identifiants, journaux de connexion, adresse IP.
• Données d'usage : pages consultées, actions réalisées dans l'application.
• Données métier que vous saisissez : catalogue produits, stocks, ventes, fournisseurs, clients.`,
  },
  {
    title: "3. Finalités et bases légales",
    content: `Vos données sont traitées pour les finalités suivantes :
• Fournir et sécuriser le Service (exécution du contrat).
• Générer les analyses et prévisions IA que vous demandez (exécution du contrat).
• Améliorer le Service et prévenir les abus (intérêt légitime).
• Vous adresser des informations produit, avec votre consentement lorsque requis.`,
  },
  {
    title: "4. Durée de conservation",
    content: `Les données de compte sont conservées tant que votre compte est actif. À la suppression du compte, vos données personnelles sont effacées dans un délai de 30 jours, sous réserve des obligations légales de conservation (facturation, comptabilité).`,
  },
  {
    title: "5. Vos droits (RGPD)",
    content: `Conformément au Règlement (UE) 2016/679, vous disposez des droits suivants :
• Droit d'accès, de rectification et d'effacement.
• Droit à la limitation et à l'opposition au traitement.
• Droit à la portabilité de vos données.
• Droit de retirer votre consentement à tout moment.

Pour exercer ces droits : privacy@stocks-app.fr. Vous pouvez également introduire une réclamation auprès de la CNIL.`,
  },
  {
    title: "6. Partage et sous-traitants",
    content: `Vos données ne sont jamais vendues. Elles peuvent être traitées par des sous-traitants techniques (hébergement, infrastructure cloud, e-mailing) strictement encadrés par des accords conformes au RGPD et situés dans l'Union européenne ou disposant de garanties équivalentes.`,
  },
  {
    title: "7. Cookies",
    content: `Le Service utilise des cookies strictement nécessaires (authentification, préférences comme le thème clair/sombre) et, le cas échéant, des cookies de mesure d'audience anonymisés. Vous pouvez configurer votre navigateur pour les refuser ; certaines fonctionnalités pourraient alors être dégradées.`,
  },
  {
    title: "8. Sécurité",
    content: `Nous mettons en œuvre des mesures techniques et organisationnelles appropriées (chiffrement en transit, contrôle d'accès, journalisation) pour protéger vos données contre tout accès non autorisé, perte ou altération.`,
  },
  {
    title: "9. Modifications",
    content: `Cette politique peut évoluer. En cas de changement substantiel, vous serez informé par e-mail ou via le Service. La date de dernière mise à jour figure en haut de cette page.`,
  },
];

export default function PrivacyPage() {
  return (
    <MarketingLayout>
      <div className="mx-auto max-w-3xl px-6 pt-16 pb-10 sm:px-8">
        <Reveal>
          <Eyebrow>Légal</Eyebrow>
          <h1 className="text-balance text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-[40px]">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-sm text-muted-foreground/70">
            Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </Reveal>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24 sm:px-8">
        <div className="flex flex-col gap-10">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              <h2 className="mb-3 text-lg font-bold text-foreground">{section.title}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground/70">© {new Date().getFullYear()} StockS SAS. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link to="/mentions-legales" className="text-sm font-semibold text-primary transition-colors hover:underline">
              Voir les CGU →
            </Link>
            <Link to="/" className="text-sm text-muted-foreground/70 transition-colors hover:text-muted-foreground">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
