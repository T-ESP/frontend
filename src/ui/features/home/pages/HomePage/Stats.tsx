import { Reveal, RevealGroup, RevealItem } from "./landingMotion";

/* ============================================================
 * SECTION — « Chiffres clés » (3 gros chiffres)
 * Bande épurée : 3 stats fictives, gros chiffres blancs avec accent
 * violet, label gris dessous. Séparateurs fins entre colonnes (desktop).
 *
 * ⚠️ Chiffres FICTIFS (projet d'école).
 * ⚙️ Pour éditer : tableau STATS.
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const BORDER = "rgba(var(--lp-border))";
const GLOW = "var(--lp-glow)";
const TEXT_2 = "var(--lp-text-2)";

const STATS = [
  { value: "−30%", label: "de ruptures de stock" },
  { value: "−20%", label: "de surstock immobilisé" },
  { value: "2h", label: "économisées par semaine" },
] as const;

export function Stats() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      {/* Halo violet diffus, très subtil, derrière la bande. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[900px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
        style={{ background: `radial-gradient(closest-side, rgba(${GLOW},0.16) 0%, transparent 75%)` }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        <RevealGroup className="grid gap-10 sm:grid-cols-3 sm:gap-0">
          {STATS.map((s, i) => (
            <RevealItem key={s.label} className="text-center">
              <div
                className={`sm:px-6 ${i > 0 ? "sm:border-l" : ""}`}
                style={i > 0 ? { borderColor: BORDER } : undefined}
              >
                <div
                  className="text-5xl font-bold tracking-tight text-[var(--lp-text)] sm:text-6xl"
                  style={{ textShadow: `0 0 40px rgba(${GLOW}, 0.45)` }}
                >
                  {s.value}
                </div>
                <p className="mt-3 text-[14px] leading-[1.5]" style={{ color: TEXT_2 }}>
                  {s.label}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Mention "chiffres indicatifs" (honnêteté projet d'école). */}
        <Reveal className="mt-10 text-center">
          <p className="text-[11px]" style={{ color: "rgba(156,163,175,0.5)" }}>
            Chiffres indicatifs moyens constatés.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
