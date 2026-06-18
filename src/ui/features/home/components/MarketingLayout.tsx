import type { ReactNode } from "react";
import { MarketingNavbar } from "./MarketingNavbar";
import { MarketingFooter } from "./MarketingFooter";

/** Coquille commune aux pages publiques : navbar + contenu + footer (tokens de thème). */
export function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </main>
  );
}
