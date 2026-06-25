import carrefour from "@/assets/images/clients/carrefour.svg";
import monoprix from "@/assets/images/clients/monoprix.svg";
import auchan from "@/assets/images/clients/auchan.svg";
import intermarche from "@/assets/images/clients/intermarche.svg";
import leclerc from "@/assets/images/clients/leclerc.svg";

/* ============================================================
 * SECTION 2 — « Ils nous font confiance »
 * Bande de logos clients en défilement infini (marquee).
 *
 * 🎨 Réglages rapides :
 *   - SECTION_BG    : fond (aligné sur le bas du hero pour la continuité)
 *   - LABEL_COLOR   : couleur du petit titre en capitales
 *   - Vitesse défilement → --marquee-duration ci-dessous (↑ = plus lent)
 *   - Espacement logos   → gap-* / px-* de chaque <li>
 *
 * ⚙️ Les SVG sources sont multicolores : on les force en BLANC via
 *    le filtre `brightness(0) invert(1)`, puis on baisse l'opacité au
 *    repos et on la remonte au survol (effet « réassurance » discret).
 *    Au survol de la bande, le défilement se met en pause (CSS).
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)"; // = HERO_BG → enchaînement sans couture

/** Hauteurs par logo : compense les viewBox très différents pour un
 *  rendu visuel homogène (un logo "carré" doit être plus petit). */
const LOGOS = [
  { src: carrefour, alt: "Carrefour", className: "h-9 sm:h-10" },
  { src: monoprix, alt: "Monoprix", className: "h-5 sm:h-6" },
  { src: auchan, alt: "Auchan", className: "h-10 sm:h-11" },
  { src: intermarche, alt: "Intermarché", className: "h-5 sm:h-6" },
  { src: leclerc, alt: "E.Leclerc", className: "h-8 sm:h-9" },
] as const;

/** Une "moitié" de la piste. L'animation translate l'ensemble de -50%,
 *  donc on rend DEUX moitiés identiques côte à côte (aria-hidden sur la
 *  copie) → la 2ᵉ prend la place de la 1ʳᵉ et la boucle est invisible.
 *  Chaque moitié répète la liste 2× pour rester plus large que l'écran
 *  (sinon un trou apparaîtrait au point de reset sur grand écran). */
function LogoTrack({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-x-14 px-7 sm:gap-x-20 sm:px-10"
    >
      {[...LOGOS, ...LOGOS].map((logo, i) => (
        <li key={`${logo.alt}-${i}`} className="shrink-0">
          <img
            src={logo.src}
            alt={ariaHidden ? "" : logo.alt}
            loading="lazy"
            draggable={false}
            className={`${logo.className} w-auto select-none opacity-75`}
            style={{
              // Force le SVG (quelle que soit sa couleur) en blanc pur.
              filter: "brightness(0) invert(1)",
            }}
          />
        </li>
      ))}
    </ul>
  );
}

export function ClientLogos() {
  return (
    <section
      className="relative isolate overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-12"
      style={{ backgroundColor: SECTION_BG }}
      aria-label="Nos clients"
    >
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        {/* Conteneur marquee :
            - maskImage → fondu progressif sur les bords gauche/droite
            (le défilement ne s'arrête jamais, y compris au survol) */}
        <div
          className="relative flex overflow-hidden"
          style={{
            ["--marquee-duration" as string]: "34s",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <div className="animate-marquee flex w-max items-center">
            <LogoTrack />
            <LogoTrack ariaHidden />
          </div>
        </div>
      </div>
    </section>
  );
}
