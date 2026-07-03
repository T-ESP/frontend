import { Link } from "react-router-dom";
import { Globe, MessageCircle, AtSign } from "lucide-react";
import logoMark from "@/assets/images/logo/logo-purple.svg";

/* ============================================================
 * SECTION — « Pied de page » (style landing, dark #0a0613)
 * Logo + phrase à gauche, 3–4 colonnes de liens, barre du bas
 * (copyright + icônes réseaux).
 *
 * ℹ️ Spécifique à la landing (toujours en dark). Le layout public
 *    masque son footer par défaut pour la HomePage (cf. HomePage).
 * ⚙️ Pour éditer : tableaux COLUMNS et SOCIALS.
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const BORDER = "rgba(var(--lp-border))";
const ACCENT = "var(--lp-accent)";
const TEXT_2 = "var(--lp-text-2)";

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { label: "Fonctionnalités", href: "/fonctionnalites" },
      { label: "Tarifs", href: "/tarifs" },
      { label: "Démo", href: "/demo" },
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
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "CGU", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

const SOCIALS = [
  { label: "Site web", Icon: Globe, href: "#" },
  { label: "Communauté", Icon: MessageCircle, href: "#" },
  { label: "Nous écrire", Icon: AtSign, href: "#" },
];

/** Lien interne (Link) ou ancre (a) selon le href. */
function FooterLink({ href, label, className }: { href: string; label: string; className: string }) {
  const style = { color: TEXT_2 };
  if (href.startsWith("/#") || href.startsWith("#")) {
    return <a href={href} className={className} style={style}>{label}</a>;
  }
  return <Link to={href} className={className} style={style}>{label}</Link>;
}

export function Footer() {
  const year = new Date().getFullYear();
  const linkCls = "text-[14px] transition-colors hover:text-[var(--lp-text)]";

  return (
    <footer style={{ backgroundColor: SECTION_BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="mx-auto max-w-[1180px] px-6 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Marque + réseaux */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--lp-text)]">
              <img src={logoMark} alt="" className="h-8 w-auto" />
              <span>Stock<span style={{ color: ACCENT }}>S</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.6]" style={{ color: TEXT_2 }}>
              L'intelligence des stocks par l'IA : prévisions, alertes et réappro pour ton commerce.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-[var(--lp-text)]"
                  style={{ background: "rgba(var(--lp-glass))", border: `1px solid ${BORDER}`, color: TEXT_2 }}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: TEXT_2 }}>
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href} label={link.label} className={linkCls} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Barre du bas */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <p className="text-xs" style={{ color: "rgba(156,163,175,0.6)" }}>
            © {year} StockS — L'intelligence des stocks. Tous droits réservés.
          </p>
          <p className="text-xs" style={{ color: "rgba(156,163,175,0.6)" }}>
            Fait avec ♥ en France
          </p>
        </div>
      </div>
    </footer>
  );
}
