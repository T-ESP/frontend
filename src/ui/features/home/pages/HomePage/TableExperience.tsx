import { ArrowUp, ArrowDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Reveal } from "./landingMotion";

/* ============================================================
 * SECTION — « Expérience tableau »
 * Titre + sous-titre, puis un grand mockup de tableau reconstruit
 * en HTML/CSS (pas une image), dans un conteneur glass avec fausse
 * barre de navigateur. Glow violet diffus derrière le tableau.
 *
 * ✨ ANIMATION (comme le feed « Analyse de tes ventes en cours ») :
 *   une nouvelle ligne s'ajoute en haut toutes les STEP_MS, poussant
 *   les autres d'un cran vers le bas ; la plus ancienne sort par le
 *   bas dans le fondu. En-tête fixe, fenêtre masquée haut/bas.
 *
 * ⚙️ Pour éditer les données : tableau ROWS ci-dessous.
 *    - trend > 0 → flèche ↑ (hausse) ; < 0 → flèche ↓ (baisse)
 *    - status : "ok" | "order" | "soon" (couleur du badge gérée par STATUS)
 *    - cadence du feed → STEP_MS ; lignes visibles → VISIBLE
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

/* Données fictives crédibles (commerce alimentaire). Le feed boucle dessus. */
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

/* Colonnes partagées entre l'en-tête et les lignes (alignement garanti). */
const GRID_COLS = "minmax(0,1fr) 120px 120px 90px 140px";
const COLS = ["Produit", "Vendus/sem.", "Prévision", "Stock", "Statut"] as const;

/* Feed : une nouvelle ligne s'ajoute en haut toutes les STEP_MS. */
const ROW_H = 52; // hauteur d'une ligne en px
const VISIBLE = 6; // lignes visibles dans la fenêtre
const STEP_MS = 2000; // intervalle d'ajout (1 ligne / 2 s)

/* Fondu de la fenêtre (haut + bas) — comme le feed d'analyse. */
const WINDOW_FADE =
  "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)";

/* --- Une ligne de tableau (cellules) ------------------------------------- */
function RowCells({ r }: { r: (typeof ROWS)[number] }) {
  const up = r.trend >= 0;
  const s = STATUS[r.status];
  return (
    <div
      className="grid items-center gap-3 px-5 text-sm"
      style={{ gridTemplateColumns: GRID_COLS, height: ROW_H, borderBottom: `1px solid ${BORDER}` }}
    >
      <span className="truncate font-medium text-[var(--lp-text)]">{r.name}</span>
      <span className="text-right font-mono tabular-nums" style={{ color: TEXT_2 }}>
        {r.sold}
      </span>
      <span className="text-right">
        <span
          className={`inline-flex items-center gap-1 font-mono tabular-nums ${up ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}
        >
          {up ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
          {Math.abs(r.forecast)}%
        </span>
      </span>
      <span className="text-right font-mono tabular-nums text-[var(--lp-text)]">{r.stock}</span>
      <span className="flex justify-end">
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${s.cls}`}>
          {s.label}
        </span>
      </span>
    </div>
  );
}

/* --- Feed produits : une ligne s'ajoute en haut, les autres descendent ----
 * Même principe que <AnalysisFeed/> (Features2Col) : à chaque tick on préfixe
 * la ligne suivante du cycle ROWS ; framer anime la descente (layout) et
 * l'apparition (fade). Figé si l'utilisateur réduit les animations. */
function ProductsFeed() {
  const reduce = useReducedMotion();
  const [rows, setRows] = useState(() =>
    Array.from({ length: VISIBLE }, (_, i) => ({ id: i, ...ROWS[i % ROWS.length] })),
  );

  useEffect(() => {
    if (reduce) return; // animations réduites → liste figée
    let next = VISIBLE; // prochain index source ET id unique
    const timer = setInterval(() => {
      setRows((prev) => {
        const row = { id: next, ...ROWS[next % ROWS.length] };
        next += 1;
        return [row, ...prev].slice(0, VISIBLE + 1); // garde 1 ligne sortante
      });
    }, STEP_MS);
    return () => clearInterval(timer);
  }, [reduce]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: ROW_H * VISIBLE, maskImage: WINDOW_FADE, WebkitMaskImage: WINDOW_FADE }}
    >
      <AnimatePresence initial={false}>
        {rows.map((row) => (
          <motion.div
            key={row.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <RowCells r={row} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

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

            {/* Tableau animé (scroll horizontal sur très petit écran). */}
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                {/* En-tête FIXE (aligné sur les lignes via GRID_COLS). */}
                <div
                  className="grid gap-3 px-5 py-3.5"
                  style={{ gridTemplateColumns: GRID_COLS, borderBottom: `1px solid ${BORDER}` }}
                >
                  {COLS.map((h, i) => (
                    <span
                      key={h}
                      className={`text-[12px] font-semibold uppercase tracking-wider ${i > 0 ? "text-right" : ""}`}
                      style={{ color: TEXT_2 }}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Corps : feed animé (nouvelle ligne en haut, décalage vers le bas). */}
                <ProductsFeed />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
