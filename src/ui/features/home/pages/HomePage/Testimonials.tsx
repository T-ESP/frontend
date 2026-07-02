import { Reveal, RevealGroup, RevealItem } from "./landingMotion";
import { HorizonHeaderDecor } from "./HorizonHeaderDecor";

/* ============================================================
 * SECTION — « Témoignages » (3 cartes)
 * Titre, puis 3 cartes glass : citation + nom/commerce + avatar
 * initiales. Glow violet sur une carte pour rythmer.
 *
 * ⚠️ Témoignages FICTIFS (projet d'école).
 * ⚙️ Pour éditer : tableau TESTIMONIALS.
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const CARD_BG = "var(--lp-card)";
const BORDER = "rgba(var(--lp-border))";
const GLOW = "var(--lp-glow)";
const ACCENT_2 = "#c4b5fd";
const TEXT_2 = "var(--lp-text-2)";

const CARD_GLOW = `radial-gradient(circle, rgba(${GLOW}, 0.28) 0%, rgba(${GLOW}, 0.09) 45%, transparent 75%)`;

const TESTIMONIALS = [
  {
    quote: "Je ne commande plus au feeling. Mes ruptures du week-end, c'est fini.",
    name: "Sarah M.",
    role: "Épicerie fine à Lyon",
    glow: true,
  },
  {
    quote: "J'ai récupéré de la place en réserve : je voyais enfin les produits qui dormaient.",
    name: "Karim B.",
    role: "Supérette de quartier à Lille",
  },
  {
    quote: "En fin de mois, je sais exactement quoi recommander. Je gagne un temps fou.",
    name: "Julie R.",
    role: "Cave & produits locaux à Nantes",
  },
] as const;

/** Avatar pastille : initiales du nom (ex. "Sarah M." → "SM"). */
function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      {/* Décor "horizon" (grille en perspective + halo), comme la section
          « Plus rapide. Plus malin. », centré derrière le titre. */}
      <HorizonHeaderDecor top={140} />

      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl">
            Ils ne reviennent plus en arrière
          </h2>
        </Reveal>

        {/* 3 cartes */}
        <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name} className="h-full">
              <figure
                className="relative flex h-full flex-col overflow-hidden rounded-2xl p-7"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
              >
                {"glow" in t && t.glow && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-20 -right-16 h-72 w-72 rounded-full blur-[90px]"
                    style={{ background: CARD_GLOW, transform: "rotate(-18deg) scaleX(1.4)" }}
                  />
                )}

                <blockquote className="relative flex-1 text-[15px] leading-[1.65] text-[var(--lp-text)]">
                  « {t.quote} »
                </blockquote>

                <figcaption className="relative mt-6 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-[var(--lp-text)]"
                    style={{ background: "rgba(var(--lp-glass))", border: `1px solid ${BORDER}`, color: ACCENT_2 }}
                  >
                    {initials(t.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold text-[var(--lp-text)]">{t.name}</span>
                    <span className="block text-[12px]" style={{ color: TEXT_2 }}>
                      {t.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
