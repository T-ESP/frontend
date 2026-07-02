import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./landingMotion";

/* ============================================================
 * SECTION — « FAQ » (accordéon)
 * Titre + 5 items dépliables. Accessible au clavier (<button>
 * + aria-expanded + focus visible). Un seul item ouvert à la fois.
 *
 * 🔗 id="faq" : ancre ciblée par le lien "/#faq" de la navbar.
 * ⚙️ Pour éditer : tableau ITEMS.
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const CARD_BG = "var(--lp-card)";
const BORDER = "rgba(var(--lp-border))";
const ACCENT = "var(--lp-accent)";
const TEXT_2 = "var(--lp-text-2)";

const ITEMS = [
  {
    q: "Est-ce compatible avec ma caisse ?",
    a: "Oui. StockS se connecte aux principaux logiciels de caisse du marché. Si le tien n'est pas encore supporté, on t'aide à importer ton historique en quelques minutes.",
  },
  {
    q: "Mes données sont-elles en sécurité ?",
    a: "Tes données sont chiffrées et hébergées en Europe. Elles ne servent qu'à tes prévisions : on ne les revend jamais.",
  },
  {
    q: "Faut-il être bon en informatique ?",
    a: "Non. Si tu sais utiliser un téléphone, tu sais utiliser StockS. Tout est pensé pour des commerçants, pas pour des informaticiens.",
  },
  {
    q: "Combien de temps avant d'avoir des prévisions fiables ?",
    a: "Dès quelques semaines d'historique, tu as déjà des tendances. Plus l'IA observe tes ventes, plus les prévisions s'affinent.",
  },
  {
    q: "Puis-je arrêter quand je veux ?",
    a: "Bien sûr. Aucun engagement : tu peux résilier en un clic, et tu gardes l'accès jusqu'à la fin de ta période.",
  },
] as const;

export function FAQ() {
  // Index de l'item ouvert (null = tous fermés). Un seul ouvert à la fois.
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative isolate overflow-hidden py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      <div className="relative mx-auto max-w-[760px] px-6 sm:px-8">
        {/* En-tête */}
        <Reveal className="text-center">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl">
            Les questions qu'on nous pose
          </h2>
        </Reveal>

        {/* Accordéon */}
        <Reveal className="mt-14 space-y-3" delay={0.1}>
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;
            const btnId = `faq-btn-${i}`;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
              >
                <h3>
                  <button
                    id={btnId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left text-[15px] font-semibold text-[var(--lp-text)] transition-colors hover:bg-[rgba(var(--lp-glass))] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                    style={{ ["--tw-ring-color" as string]: ACCENT }}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
                      style={{ color: ACCENT }}
                      aria-hidden
                    />
                  </button>
                </h3>
                {/* Panneau : transition de hauteur via grid-rows (0fr → 1fr). */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-7 pb-6 text-[14px] leading-[1.65]" style={{ color: TEXT_2 }}>
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
