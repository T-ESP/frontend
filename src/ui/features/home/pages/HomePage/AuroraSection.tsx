import auroraBg from "@/assets/images/aurora-purple.png";

/* ============================================================
 * SECTION 4 — fond « aurora » violet.
 * Pour l'instant : on intègre uniquement l'image de fond, incrustée
 * de façon invisible (on ne doit pas deviner que c'est une image).
 *
 * 🎯 Astuce "incrustation" :
 *   - SECTION_BG identique aux sections voisines (#0a0613)
 *   - l'image est en `cover` plein écran DERRIÈRE le contenu
 *   - un double fondu (maskImage haut + bas) dissout ses bords dans
 *     SECTION_BG → plus aucune arête visible, la transition est lisse.
 *
 * 🎨 Réglages rapides :
 *   - Hauteur de la zone           → min-h-[...] de la <section>
 *   - Où l'image commence/finit    → les stops du maskImage
 *   - Cadrage de l'image           → backgroundPosition (centre-bas ici)
 *   - Intensité globale            → opacity du calque image
 *
 * 👉 Le contenu (titre, texte, CTA…) viendra se poser dans le
 *    conteneur `relative z-10` plus bas.
 * ============================================================ */
// Section « image » : reste SOMBRE dans les 2 thèmes (l'image aurora est
// conçue pour le fond sombre) → couleur en dur, non theme-aware.
const SECTION_BG = "#0a0613";

export function AuroraSection() {
  return (
    <section
      className="relative isolate min-h-[420px] overflow-hidden"
      style={{ backgroundColor: SECTION_BG }}
    >
      {/* Calque image de fond — l'image ENTIÈRE est visible (contain, donc
          dézoomée) et ses 4 bords se fondent dans SECTION_BG → on ne perçoit
          pas le cadre de l'image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `url(${auroraBg})`,
          // Largeur de l'image en % de la section (↓ = plus petite).
          backgroundSize: "52%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // Fondu RADIAL : opaque au centre, transparent vers TOUS les bords
          // et les coins → l'image se dissout uniformément de tous les côtés.
          // (Élargir/resserrer le halo : jouer sur les 2 stops 38% / 82%.)
          maskImage:
            "radial-gradient(ellipse 78% 80% at 50% 50%, #000 38%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 78% 80% at 50% 50%, #000 38%, transparent 82%)",
        }}
      />

      {/* Conteneur du futur contenu (vide pour l'instant). */}
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 py-16 sm:px-8 sm:py-20" />
    </section>
  );
}
