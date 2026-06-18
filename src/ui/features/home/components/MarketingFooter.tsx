import { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, Globe, MessageCircle, AtSign, ArrowRight, Check } from "lucide-react";

type FooterLink = { label: string; href: string };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/fonctionnalites" },
      { label: "Tarifs", href: "/tarifs" },
      { label: "Démo", href: "/demo" },
      { label: "Connexion", href: "/login" },
    ],
  },
  {
    title: "Ressources",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Conditions d'utilisation", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

const SOCIALS = [
  { label: "Site web", Icon: Globe, href: "#" },
  { label: "Communauté", Icon: MessageCircle, href: "#" },
  { label: "Nous écrire", Icon: AtSign, href: "#" },
];

/** Rend un lien interne (Link) ou une ancre (a) selon le href. */
function FooterAnchor({ link, className }: { link: FooterLink; className?: string }) {
  if (link.href.startsWith("/#") || link.href.startsWith("#")) {
    return <a href={link.href} className={className}>{link.label}</a>;
  }
  return <Link to={link.href} className={className}>{link.label}</Link>;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // Visuel uniquement — aucun appel réseau.
    setSubmitted(true);
    setEmail("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-foreground">Restez informé</p>
      <p className="mt-1.5 text-[13px] leading-[1.5] text-muted-foreground">
        Conseils stock & nouveautés produit, une fois par mois. Pas de spam.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre e-mail"
          aria-label="Adresse e-mail"
          className="min-w-0 flex-1 rounded-lg border border-border bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={!isValid}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitted ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </form>
      {submitted && (
        <p className="mt-2 flex items-center gap-1.5 text-[12px] text-primary">
          <Check className="w-3.5 h-3.5" /> Inscription enregistrée. Merci !
        </p>
      )}
    </div>
  );
}

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Marque + réseaux */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
              <span className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
                <Boxes className="w-4 h-4" />
              </span>
              Stock<span className="text-primary">S</span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.6] text-muted-foreground">
              L'intelligence des stocks par l'IA : prévisions, alertes et KPIs produits en temps réel.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-foreground/[0.02] text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-5">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground/70">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label + link.href}>
                      <FooterAnchor
                        link={link}
                        className="text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <Newsletter />
          </div>
        </div>

        {/* Barre du bas */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground/60">
            © {year} StockS — L'intelligence des stocks. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground/70">
            <Link to="/mentions-legales" className="transition-colors hover:text-foreground">CGU</Link>
            <Link to="/confidentialite" className="transition-colors hover:text-foreground">Confidentialité</Link>
            <span className="text-muted-foreground/60">Fait avec ♥ en France</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
