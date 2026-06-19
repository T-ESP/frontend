import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal, RevealGroup, RevealItem } from "./landingMotion";

/* ============================================================
 * SECTION — « Tarifs » (3 paliers)
 * Titre, puis 3 cartes : Gratuit / Pro (mise en avant, badge
 * "Populaire" + bordure violette + glow) / Sur-mesure.
 * Liste de features avec checkmarks sous chaque palier.
 *
 * ⚠️ Prix FICTIFS (projet d'école).
 * ⚙️ Pour éditer : tableau PLANS.
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const CARD_BG = "var(--lp-card)";
const BORDER = "rgba(var(--lp-border))";
const GLOW = "var(--lp-glow)";
const ACCENT = "var(--lp-accent)";
const ACCENT_2 = "#c4b5fd";
const TEXT_2 = "var(--lp-text-2)";

const PLANS = [
  {
    name: "Gratuit",
    price: "0€",
    period: "",
    tagline: "Pour tester",
    features: ["Jusqu'à 50 produits suivis", "Tableau de bord stock", "1 point de vente"],
    cta: "Commencer",
    featured: false,
  },
  {
    name: "Pro",
    price: "49€",
    period: "/mois",
    tagline: "Le plus complet",
    features: [
      "Produits illimités",
      "Prévisions IA & saisonnalité",
      "Alertes de rupture & surstock",
      "Réappro suggéré automatique",
    ],
    cta: "Essai gratuit",
    featured: true, // ← carte mise en avant
  },
  {
    name: "Sur-mesure",
    price: "Sur devis",
    period: "",
    tagline: "Pour les réseaux",
    features: ["Multi-boutiques", "Support dédié", "Intégrations personnalisées"],
    cta: "Nous contacter",
    featured: false,
  },
] as const;

export function Pricing() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl">
            Un prix simple, sans surprise
          </h2>
        </Reveal>

        {/* 3 paliers — la carte "Pro" est légèrement surélevée (lg). */}
        <RevealGroup className="mt-14 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => (
            <RevealItem key={p.name} className="h-full">
              <article
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-7 ${p.featured ? "lg:-translate-y-3" : ""}`}
                style={{
                  background: CARD_BG,
                  // Carte "Pro" : bordure violette ; autres : bordure glass.
                  border: `1px solid ${p.featured ? "rgba(168,85,247,0.55)" : BORDER}`,
                }}
              >
                {/* Glow violet + badge "Populaire" sur la carte mise en avant. */}
                {p.featured && (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-24 left-1/2 h-64 w-72 -translate-x-1/2 rounded-full blur-[90px]"
                      style={{ background: `radial-gradient(circle, rgba(${GLOW},0.35) 0%, transparent 70%)` }}
                    />
                    <span
                      className="absolute right-5 top-5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                      style={{ background: ACCENT }}
                    >
                      Populaire
                    </span>
                  </>
                )}

                <div className="relative">
                  <p className="text-[13px] font-semibold uppercase tracking-wider" style={{ color: ACCENT_2 }}>
                    {p.name}
                  </p>
                  <p className="mt-1 text-[13px]" style={{ color: TEXT_2 }}>
                    {p.tagline}
                  </p>

                  <div className="mt-5 flex items-end gap-1">
                    <span className="text-4xl font-bold tracking-tight text-[var(--lp-text)]">{p.price}</span>
                    {p.period && <span className="pb-1 text-sm" style={{ color: TEXT_2 }}>{p.period}</span>}
                  </div>
                </div>

                {/* Features */}
                <ul className="relative mt-6 flex-1 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[14px] text-[var(--lp-text)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ACCENT_2 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/login"
                  className="relative mt-7 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={
                    p.featured
                      ? {
                          background: ACCENT,
                          color: "#fff",
                          ["--tw-ring-color" as string]: ACCENT,
                          ["--tw-ring-offset-color" as string]: SECTION_BG,
                        }
                      : {
                          background: "rgba(var(--lp-glass))",
                          color: "var(--lp-text)",
                          border: `1px solid ${BORDER}`,
                          ["--tw-ring-color" as string]: ACCENT,
                          ["--tw-ring-offset-color" as string]: SECTION_BG,
                        }
                  }
                >
                  {p.cta}
                </Link>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
