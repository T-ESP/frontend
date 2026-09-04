import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/ui/theme/theme";
import logoMark from "@/assets/images/logo/logo-purple.svg";

/* ============================================================
 * NAVBAR — alignée sur le HERO (HomePage) pour une continuité
 * parfaite : fond sombre quasi transparent, minimaliste "tech".
 *
 * 🎨 TOKENS (mêmes valeurs que le Hero) :
 *   - NAV_BG      : fond du hero (#0a0613) — utilisé au scroll
 *   - NAV_ACCENT  : violet d'accent (#a855f7)
 *   - NAV_BORDER  : bordures "glass"
 *   - NAV_TEXT    : texte secondaire (gris clair)
 *
 * Comportement : transparent en haut (se fond dans le hero),
 * fine barre "glass" qui apparaît au scroll.
 * ============================================================ */
// Tokens theme-aware (clair/sombre) — cf. index.css (:root / .dark).
const NAV_BG = "var(--lp-bg-rgb)"; // rgb du fond (alpha appliqué plus bas)
const NAV_ACCENT = "var(--lp-accent)";
const NAV_BORDER = "rgba(var(--lp-border))";

/** Liens de navigation publique. Les ancres ("/#…") renvoient vers les sections de la landing. */
const NAV_LINKS = [
  { label: "Fonctionnalités", href: "/fonctionnalites" },
  { label: "À propos", href: "/a-propos" },
  { label: "FAQ", href: "/#faq" },
] as const;

/** Icône « mark » GitHub (lucide-react ne fournit plus les logos de marque). */
function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.19 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.19.77.84 1.24 1.91 1.24 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z" />
    </svg>
  );
}

function NavItem({ href, label, onClick, className }: { href: string; label: string; onClick?: () => void; className: string }) {
  if (href.startsWith("/#") || href.startsWith("#")) {
    return <a href={href} onClick={onClick} className={className}>{label}</a>;
  }
  return <Link to={href} onClick={onClick} className={className}>{label}</Link>;
}

export function MarketingNavbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fond "glass" qui n'apparaît qu'une fois la page défilée (sinon transparent).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // En haut : totalement transparent (intégré au hero). Au scroll / menu ouvert :
  // fine couche sombre translucide + blur + bordure glass.
  const showBar = scrolled || open;

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: showBar ? `rgba(${NAV_BG}, 0.55)` : "transparent",
        borderBottom: `1px solid ${showBar ? NAV_BORDER : "transparent"}`,
        backdropFilter: showBar ? "blur(12px)" : "none",
        WebkitBackdropFilter: showBar ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-[var(--lp-text)]">
          <img src={logoMark} alt="" className="h-10 w-auto" />
          <span>Stock<span style={{ color: NAV_ACCENT }}>S</span></span>
        </Link>

        <nav className="items-center hidden gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <NavItem
              key={l.href}
              href={l.href}
              label={l.label}
              className="text-[13px] font-medium tracking-wide text-[var(--lp-text-2)] transition-colors hover:text-[var(--lp-text)]"
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/T-ESP"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Code source sur GitHub"
            className="inline-flex items-center justify-center transition-colors rounded-lg w-9 h-9 text-[var(--lp-text-2)] hover:text-[var(--lp-text)] hover:bg-[rgba(var(--lp-glass))]"
          >
            <GithubMark className="w-[18px] h-[18px]" />
          </a>
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
            className="inline-flex items-center justify-center transition-colors rounded-lg w-9 h-9 text-[var(--lp-text-2)] hover:text-[var(--lp-text)] hover:bg-[rgba(var(--lp-glass))]"
          >
            {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>
          <Link
            to="/login"
            className="hidden px-4 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-lg sm:inline-flex text-[var(--lp-text-2)] hover:text-[var(--lp-text)] hover:bg-[rgba(var(--lp-glass))]"
          >
            Se connecter
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: NAV_ACCENT }}
          >
            Essai gratuit
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex items-center justify-center rounded-lg w-9 h-9 text-[var(--lp-text-2)] transition-colors hover:bg-[rgba(var(--lp-glass))] md:hidden"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav
          className="px-6 py-4 md:hidden"
          style={{ borderTop: `1px solid ${NAV_BORDER}` }}
        >
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavItem
                key={l.href}
                href={l.href}
                label={l.label}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--lp-text-2)] transition-colors hover:bg-[rgba(var(--lp-glass))] hover:text-[var(--lp-text)]"
              />
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--lp-text-2)] transition-colors hover:bg-[rgba(var(--lp-glass))] hover:text-[var(--lp-text)] sm:hidden"
            >
              Se connecter
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
