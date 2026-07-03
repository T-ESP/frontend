import { Reveal } from "./landingMotion";

/* ============================================================
 * SECTION 3 — « Horizon » : bandeau sombre avec une grille en
 * perspective qui converge vers une ligne d'horizon centrale,
 * un halo radial puissant posé sur cet horizon, et le texte
 * centré par-dessus. (Référence visuelle : LP « infinity grid ».)
 *
 * 🧠 PRINCIPE DE LA GRILLE « EN BIAIS »
 *   On empile DEUX plans quadrillés inclinés en miroir :
 *     · le SOL    → rotateX(+deg), part du centre et fuit vers le bas
 *     · le PLAFOND→ rotateX(-deg), part du centre et fuit vers le haut
 *   Les deux se rejoignent au centre = ligne d'horizon. Les lignes
 *   s'évasent en s'éloignant → effet "angle Z / biais".
 *
 * 🎨 TOKENS (alignés sur le HERO pour la continuité) :
 *   - SECTION_BG : fond (= HERO_BG)
 *   - GLOW       : violet du halo (RGB, alpha appliqué plus bas)
 *   - GRID_LINE  : couleur/alpha des lignes de grille
 *
 * ⚙️ RÉGLAGES RAPIDES
 *   · évasement de la grille → perspective() + rotateX(GRID_TILT)
 *   · densité des cases       → backgroundSize
 *   · intensité des lignes    → alpha de GRID_LINE
 *   · puissance du halo       → 1ʳᵉ valeur d'alpha du radial
 *   · hauteur du bandeau      → py-* de la <section>
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)"; // = HERO_BG → enchaînement sans couture
const GLOW = "var(--lp-glow)"; // = HERO_GLOW (#8b5cf6)
const GRID_LINE = "rgba(var(--lp-grid),0.10)"; // lignes de grille (subtil)
const GRID_TILT = "64deg"; // inclinaison des plans (↑ = plus rasant)

/* Image de fond commune aux deux plans (lignes verticales + horizontales). */
const gridImage = `linear-gradient(${GRID_LINE} 1px, transparent 1px), linear-gradient(90deg, ${GRID_LINE} 1px, transparent 1px)`;

export function HorizonSection() {
  return (
    <section
      className="relative isolate flex items-center justify-center overflow-hidden py-20 sm:py-28"
      style={{ backgroundColor: SECTION_BG }}
    >
      {/* ===== DÉCOR (derrière le texte) ===== */}

      {/* SOL — moitié basse. Le plan fuit vers le bas depuis l'horizon
          (transformOrigin en haut). Le masque l'estompe vers le bas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 bottom-0 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
        }}
      >
        <div
          className="absolute left-1/2 top-0 h-[160%] w-[320%] -translate-x-1/2"
          style={{
            transform: `perspective(440px) rotateX(${GRID_TILT})`,
            transformOrigin: "50% 0%",
            backgroundImage: gridImage,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* PLAFOND — moitié haute, miroir du sol (fuit vers le haut). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-1/2 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to top, black 0%, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 75%)",
        }}
      >
        <div
          className="absolute bottom-0 left-1/2 h-[160%] w-[320%] -translate-x-1/2"
          style={{
            transform: `perspective(440px) rotateX(-${GRID_TILT})`,
            transformOrigin: "50% 100%",
            backgroundImage: gridImage,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* HALO PRINCIPAL — large ellipse violette posée sur l'horizon.
          Elle déborde sur les côtés et recouvre la grille au centre. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[1500px] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background: `radial-gradient(closest-side, rgba(${GLOW}, 0.85) 0%, rgba(${GLOW}, 0.40) 38%, rgba(${GLOW}, 0.14) 64%, transparent 84%)`,
        }}
      />

      {/* CŒUR ARDENT — spot quasi blanc au centre de l'horizon.
          ⚠️ Atténué : trop clair, il lessivait le texte blanc par-dessus.
          Baisser/monter la 1ʳᵉ valeur d'alpha si besoin. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[150px] w-[560px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(216,180,254,0.55) 0%, rgba(168,85,247,0.4) 42%, transparent 72%)",
        }}
      />

      {/* TRAIT DE LENTILLE — fine ligne horizontale lumineuse (lens flare). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-px w-[1100px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 blur-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.7) 50%, transparent)",
        }}
      />

      {/* ===== CONTENU ===== */}
      <Reveal className="relative z-10 mx-auto max-w-[760px] px-6 text-center sm:px-8">
        <h2
          className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl"
        >
          {/* [TITRE À REMPLIR] */}
          Plus rapide. Plus malin.
          <br />
          Opérationnel en quelques secondes.
        </h2>
        <p
          className="mx-auto mt-5 max-w-[520px] text-pretty text-base leading-[1.6] text-[var(--lp-text)]"
          style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
        >
          {/* [SOUS-TITRE À REMPLIR] */}
          Importez vos données, laissez l'IA analyser la demande, et obtenez des
          décisions de stock claires sans configuration complexe.
        </p>
      </Reveal>
    </section>
  );
}
