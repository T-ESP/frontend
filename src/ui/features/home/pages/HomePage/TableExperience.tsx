import { ArrowUp, ArrowDown } from "lucide-react";
import { Reveal } from "./landingMotion";

/* ============================================================
 * SECTION — « Expérience tableau »
 * Titre + sous-titre, puis un grand mockup de tableau reconstruit
 * en HTML/CSS (pas une image), dans un conteneur glass avec fausse
 * barre de navigateur. Glow violet diffus derrière le tableau.
 *
 * ⚙️ Pour éditer les données : tableau ROWS ci-dessous.
 *    - trend > 0 → flèche ↑ (hausse) ; < 0 → flèche ↓ (baisse)
 *    - status : "ok" | "order" | "soon" (couleur du badge gérée par STATUS)
 * ============================================================ */
const SECTION_BG = "var(--lp-bg)";
const PANEL_BG = "var(--lp-card)"; // = fond du mockup hero
const BORDER = "rgba(var(--lp-border))";
const GLOW = "var(--lp-glow)";
const TEXT_2 = "var(--lp-text-2)";

type Status = "ok" | "order" | "soon";

const STATUS: Record<Status, { label: string; cls: string }> = {
  ok: { label: "OK", cls: "border-emerald-400/20 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300" },
  order: { label: "À commander", cls: "border-violet-400/20 bg-violet-400/10 text-violet-600 dark:text-violet-300" },
  soon: { label: "Rupture proche", cls: "border-amber-400/20 bg-amber-400/10 text-amber-600 dark:text-amber-300" },
};

/* Données fictives crédibles (commerce alimentaire). */
const ROWS: {
  name: string;
  sold: number;
  forecast: number; // % de variation prévue
  trend: number; // signe → flèche
  stock: number;
  status: Status;
}[] = [
  { name: "Café moulu 250g", sold: 84, forecast: 12, trend: 1, stock: 36, status: "order" },
  { name: "Pâtes penne 500g", sold: 142, forecast: 4, trend: 1, stock: 210, status: "ok" },
  { name: "Eau minérale 1L", sold: 318, forecast: 9, trend: 1, stock: 54, status: "soon" },
  { name: "Lait demi-écrémé 1L", sold: 96, forecast: -6, trend: -1, stock: 128, status: "ok" },
  { name: "Yaourt nature x4", sold: 73, forecast: 15, trend: 1, stock: 22, status: "soon" },
  { name: "Jus d'orange 1L", sold: 51, forecast: -3, trend: -1, stock: 88, status: "ok" },
  { name: "Beurre doux 250g", sold: 64, forecast: 7, trend: 1, stock: 19, status: "order" },
];

export function TableExperience() {
  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-28" style={{ backgroundColor: SECTION_BG }}>
      <div className="relative mx-auto max-w-[1180px] px-6 sm:px-8">
        {/* En-tête */}
        <Reveal className="mx-auto max-w-[760px] text-center">
          <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-[var(--lp-text)] sm:text-5xl">
            Tous tes produits, une seule vue
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-pretty text-base leading-[1.6]" style={{ color: TEXT_2 }}>
            Comme un tableur, mais qui réfléchit à ta place.
          </p>
        </Reveal>

        {/* Mockup tableau */}
        <Reveal className="relative mt-14" delay={0.1} y={28}>
          {/* Glow violet diffus derrière le tableau. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[1100px] max-w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
            style={{ background: `radial-gradient(closest-side, rgba(${GLOW},0.22) 0%, transparent 75%)` }}
          />

          <div
            className="relative mx-auto w-full max-w-[940px] overflow-hidden rounded-xl"
            style={{ background: PANEL_BG, border: `1px solid ${BORDER}`, boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)" }}
          >
            {/* Fausse barre de navigateur. */}
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
              <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
              <div
                className="ml-3 hidden h-7 flex-1 items-center rounded-md px-3 text-xs sm:flex"
                style={{ background: "rgba(var(--lp-glass))", color: TEXT_2 }}
              >
                app.stocks.io/produits
              </div>
            </div>

            {/* Tableau (scroll horizontal sur très petit écran). */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                    {["Produit", "Vendus/sem.", "Prévision", "Stock", "Statut"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-[12px] font-semibold uppercase tracking-wider ${i > 0 ? "text-right" : ""} ${i === 4 ? "text-right" : ""}`}
                        style={{ color: TEXT_2 }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => {
                    const up = r.trend >= 0;
                    const s = STATUS[r.status];
                    return (
                      <tr
                        key={r.name}
                        style={{
                          // Lignes alternées (zébrage très léger).
                          background: i % 2 ? "rgba(255,255,255,0.015)" : "transparent",
                          borderBottom: i < ROWS.length - 1 ? `1px solid ${BORDER}` : "none",
                        }}
                      >
                        <td className="px-5 py-3.5 font-medium text-[var(--lp-text)]">{r.name}</td>
                        <td className="px-5 py-3.5 text-right font-mono tabular-nums" style={{ color: TEXT_2 }}>
                          {r.sold}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center gap-1 font-mono tabular-nums ${up ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
                          >
                            {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                            {Math.abs(r.forecast)}%
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono tabular-nums text-[var(--lp-text)]">{r.stock}</td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.cls}`}
                          >
                            {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
