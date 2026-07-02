import { PlugZap, Sparkles, LineChart, PackageCheck } from "lucide-react";
import { Reveal } from "./landingMotion";
import { HorizonHeaderDecor } from "./HorizonHeaderDecor";

/* ============================================================
 * SECTION — « Comment ça marche » (3 étapes numérotées)
 * Eyebrow + titre, puis 3 cartes 01/02/03 empilées verticalement.
 * Effet « stacking » : chaque carte est sticky avec un `top` décalé,
 * donc au scroll les cartes viennent se poser les unes sur les autres
 * (le haut de la précédente reste visible derrière la suivante).
 * Charte LP : fond #0a0613, cartes glass bordure rgba(var(--lp-grid),0.08),
 * glow violet subtil. (Mêmes tokens que les autres sections.)
 *
 * ⚙️ Pour éditer : tableau STEPS (numéro, icône, titre, texte).
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const CARD_BG = "var(--lp-card)";
const BORDER = "rgba(var(--lp-border))";
const GLOW = "var(--lp-glow)";
const ACCENT_2 = "#c4b5fd";
const TEXT_2 = "var(--lp-text-2)";

const CARD_GLOW = `radial-gradient(circle, rgba(${GLOW}, 0.28) 0%, rgba(${GLOW}, 0.09) 45%, transparent 75%)`;

const STEPS = [
  {
    n: "01",
    Icon: PlugZap,
    title: "Connecte ta caisse",
    desc: "Branche ton logiciel de caisse en quelques clics, sans manipulation technique ni export à gérer. Tes ventes remontent automatiquement, en continu.",
  },
  {
    n: "02",
    Icon: Sparkles,
    title: "L'IA analyse tes ventes",
    desc: "Elle lit tout ton historique, repère tes tendances, ta saisonnalité et tes pics de demande — puis apprend un peu plus à chaque journée qui passe.",
    glow: true, // ← un peu de relief sur l'étape centrale
  },
  {
    n: "03",
    Icon: LineChart,
    title: "Reçois tes prévisions",
    desc: "Tu sais quoi commander, quand, et en quelle quantité. Chaque produit reçoit une prévision claire, ajustée à ton activité réelle.",
  },
  {
    n: "04",
    Icon: PackageCheck,
    title: "Commande sereinement",
    desc: "Fini les ruptures et le sur-stock : tu valides tes commandes en confiance, tu gagnes du temps et tu immobilises moins de trésorerie.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="relative isolate py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      {/* Décor "horizon" (grille en perspective + halo), comme la section
          « Plus rapide. Plus malin. », centré derrière le titre.
          NB : pas d'`overflow-hidden` sur la <section> (ça casserait le
          `position: sticky` des cartes) — on clippe le décor ici. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <HorizonHeaderDecor />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-[760px] text-center">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: ACCENT_2 }}>
            En 4 étapes
          </p>
          <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl">
            Simple comme bonjour
          </h2>
        </Reveal>

        {/* 3 étapes — pile verticale « stacking » au scroll.
            Chaque carte est sticky : son `top` augmente d'une étape à
            l'autre, ce qui laisse dépasser le haut de la précédente. */}
        <div className="mx-auto mt-14 max-w-[480px]">
          {STEPS.map((step, i) => (
            <div
              key={step.n}
              className="sticky"
              style={{
                // Décalage croissant : les cartes se posent en escalier.
                top: `calc(96px + ${i * 22}px)`,
                // Espace de scroll entre deux cartes (sauf la dernière).
                marginBottom: i === STEPS.length - 1 ? 0 : "clamp(2rem, 6vw, 4.5rem)",
                zIndex: i + 1,
              }}
            >
              <article
                className="relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl p-8 sm:p-10"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  boxShadow: "0 24px 60px -20px rgba(0,0,0,0.55)",
                }}
              >
                {/* Glow violet diffus (coin bas-droit) — seulement si `glow`. */}
                {"glow" in step && step.glow && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full blur-[90px]"
                    style={{ background: CARD_GLOW, transform: "rotate(-18deg) scaleX(1.4)" }}
                  />
                )}

                {/* Gros numéro filigrane en haut à droite. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-6 top-4 text-8xl font-bold leading-none"
                  style={{ color: `rgba(${GLOW}, 0.16)` }}
                >
                  {step.n}
                </span>

                {/* Icône dans un encadré glass. */}
                <span
                  className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: "rgba(var(--lp-glass))", border: `1px solid ${BORDER}`, color: ACCENT_2 }}
                >
                  <step.Icon className="h-5 w-5" />
                </span>

                <div className="relative mt-auto pt-10">
                  <h3 className="text-2xl font-bold text-[var(--lp-text)]">{step.title}</h3>
                  <p className="mt-3 text-pretty text-[15px] leading-[1.65]" style={{ color: TEXT_2 }}>
                    {step.desc}
                  </p>
                </div>
              </article>
            </div>
          ))}

          {/* Tampon de scroll : laisse la dernière carte « se poser »
              avant de quitter la section. */}
          <div aria-hidden className="h-[40vh]" />
        </div>
      </div>
    </section>
  );
}
