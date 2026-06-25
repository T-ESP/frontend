import type { ReactNode } from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { Footer } from "../pages/HomePage/Footer";

/** Coquille commune aux pages publiques : navbar premium + contenu + footer
 *  premium, sur fond « landing » theme-aware (tokens --lp-*).
 *  `hideFooter` : la landing (HomePage) rend déjà son propre <Footer/> → on
 *  masque celui du layout pour éviter un double pied de page. */
export function MarketingLayout({ children, hideFooter = false }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--lp-bg)", color: "var(--lp-text)" }}
    >
      <MarketingNavbar />
      {children}
      {!hideFooter && <Footer />}
    </main>
  );
}
