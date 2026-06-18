import { useState } from "react";
import { Link } from "react-router-dom";
import { Boxes, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/ui/theme/theme";

/** Liens de navigation publique. Les ancres ("/#…") renvoient vers les sections de la landing. */
const NAV_LINKS = [
  { label: "Fonctionnalités", href: "/fonctionnalites" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "À propos", href: "/a-propos" },
  { label: "FAQ", href: "/#faq" },
] as const;

function NavItem({ href, label, onClick, className }: { href: string; label: string; onClick?: () => void; className: string }) {
  if (href.startsWith("/#") || href.startsWith("#")) {
    return <a href={href} onClick={onClick} className={className}>{label}</a>;
  }
  return <Link to={href} onClick={onClick} className={className}>{label}</Link>;
}

export function MarketingNavbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
            <Boxes className="w-4 h-4" />
          </span>
          Stock<span className="text-primary">S</span>
        </Link>

        <nav className="items-center hidden gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <NavItem
              key={l.href}
              href={l.href}
              label={l.label}
              className="text-sm font-medium transition-colors text-muted-foreground hover:text-foreground"
            />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={theme === "dark" ? "Mode clair" : "Mode sombre"}
            className="inline-flex items-center justify-center w-9 h-9 transition-colors rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]"
          >
            {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>
          <Link to="/login" className="hidden px-4 py-2 text-sm font-medium transition-colors rounded-lg sm:inline-flex text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04]">
            Se connecter
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Essai gratuit
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.04] md:hidden"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavItem
                key={l.href}
                href={l.href}
                label={l.label}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
              />
            ))}
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04] hover:text-foreground sm:hidden"
            >
              Se connecter
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
