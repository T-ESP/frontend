import { Reveal } from "./landingMotion";

/* ============================================================
 * SECTION — « Appel à l'action final »
 * Gros bloc centré posé sur un glow violet prononcé (même technique
 * CSS que le hero). Titre + sous-titre + input email + bouton +
 * ligne de réassurance.
 *
 * ⚙️ Pour éditer : textes ci-dessous. Le formulaire est visuel
 *    uniquement (aucun appel réseau).
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const BORDER = "rgba(var(--lp-border))";
const GLOW = "var(--lp-glow)";
const ACCENT = "var(--lp-accent)";
const TEXT_2 = "var(--lp-text-2)";

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      {/* Glow violet prononcé, centré derrière le bloc. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[1100px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{
          background: `radial-gradient(closest-side, rgba(${GLOW},0.45) 0%, rgba(${GLOW},0.16) 45%, transparent 78%)`,
        }}
      />
      {/* Cœur ardent quasi blanc surimposé (comme le hero). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[220px] w-[520px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: "radial-gradient(circle, rgba(216,180,254,0.5) 0%, rgba(168,85,247,0.3) 45%, transparent 72%)" }}
      />

      <Reveal className="relative z-10 mx-auto max-w-[760px] px-6 text-center sm:px-8">
        <h2
          className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl"
          style={{ textShadow: `0 0 40px rgba(${GLOW}, 0.4)` }}
        >
          Reprends le contrôle de ton stock
        </h2>
        <p className="mx-auto mt-5 max-w-[480px] text-pretty text-base leading-[1.6]" style={{ color: TEXT_2 }}>
          Laisse l'IA anticiper la demande pendant que tu t'occupes de ton commerce.
        </p>

        {/* Bloc CTA — input + bouton (même style glass que le hero). */}
        <form
          className="mx-auto mt-9 flex w-full max-w-[440px] items-center gap-2 rounded-full p-1.5 backdrop-blur-md"
          style={{ background: "rgba(var(--lp-glass))", border: `1px solid ${BORDER}` }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            required
            placeholder="Votre email"
            aria-label="Votre adresse email"
            className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-[var(--lp-text)] placeholder:text-[var(--lp-text-2)] focus:outline-none focus-visible:outline-none focus-visible:ring-2"
            style={{ ["--tw-ring-color" as string]: ACCENT }}
          />
          <button
            type="submit"
            className="shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: ACCENT,
              ["--tw-ring-color" as string]: ACCENT,
              ["--tw-ring-offset-color" as string]: SECTION_BG,
            }}
          >
            Commencer gratuitement
          </button>
        </form>

        <p className="mt-4 text-xs" style={{ color: TEXT_2 }}>
          Sans carte bancaire · Essai 14 jours
        </p>
      </Reveal>
    </section>
  );
}
