/* ============================================================
 * Décor « horizon » réutilisable (derrière un titre de section).
 * Reprend EXACTEMENT le système de la section « Plus rapide. Plus
 * malin. » (HorizonSection) : deux plans quadrillés en perspective
 * (plafond + sol) qui convergent vers une ligne d'horizon, surmontés
 * d'un halo violet + cœur ardent + trait de lentille.
 *
 * La ligne d'horizon est placée à `top` px du haut de la section
 * (≈ derrière le titre). Les cartes opaques en dessous masquent
 * naturellement le bas de la grille ; elle ne reste visible que dans
 * l'en-tête et les gouttières.
 *
 * ⚙️ Réglages : `top` (hauteur de l'horizon), GRID_TILT (évasement),
 *    alpha de GRID_LINE (intensité des lignes), alphas du halo.
 * ============================================================ */
const GLOW = "var(--lp-glow)"; // = HERO_GLOW (#8b5cf6)
const GRID_LINE = "rgba(var(--lp-grid),0.10)"; // lignes de grille (subtil)
const GRID_TILT = "64deg"; // inclinaison des plans (↑ = plus rasant)
const gridImage = `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`;

export function HorizonHeaderDecor({ top = 150 }: { top?: number }) {
  return (
    <>
      {/* PLAFOND — au-dessus de l'horizon, fuit vers le haut (miroir du sol). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
        style={{
          height: top,
          maskImage: "linear-gradient(to top, black 0%, transparent 85%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 85%)",
        }}
      >
        <div
          className="absolute bottom-0 left-1/2 h-[320px] w-[320%] -translate-x-1/2"
          style={{
            transform: `perspective(440px) rotateX(-${GRID_TILT})`,
            transformOrigin: "50% 100%",
            backgroundImage: gridImage,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* SOL — sous l'horizon, fuit vers le bas. Estompé avant les cartes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 overflow-hidden"
        style={{
          top,
          height: 240,
          maskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 80%)",
        }}
      >
        <div
          className="absolute left-1/2 top-0 h-[320px] w-[320%] -translate-x-1/2"
          style={{
            transform: `perspective(440px) rotateX(${GRID_TILT})`,
            transformOrigin: "50% 0%",
            backgroundImage: gridImage,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Halo + cœur ardent + trait de lentille, centrés sur l'horizon. */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2" style={{ top }}>
        {/* Grand halo violet diffus. */}
        <div
          className="absolute left-0 top-0 h-[240px] w-[1200px] max-w-[150vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
          style={{
            background: `radial-gradient(closest-side, rgba(${GLOW},0.7) 0%, rgba(${GLOW},0.32) 40%, rgba(${GLOW},0.12) 65%, transparent 84%)`,
          }}
        />
        {/* Cœur ardent quasi-blanc. */}
        <div
          className="absolute left-0 top-0 h-[130px] w-[480px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
          style={{ background: "radial-gradient(circle, rgba(216,180,254,0.8) 0%, rgba(168,85,247,0.45) 42%, transparent 72%)" }}
        />
        {/* Trait de lentille (fine ligne horizontale lumineuse). */}
        <div
          className="absolute left-0 top-0 h-px w-[900px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 blur-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6) 50%, transparent)" }}
        />
      </div>
    </>
  );
}
