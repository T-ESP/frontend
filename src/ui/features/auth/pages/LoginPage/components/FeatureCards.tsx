import { useEffect, useRef, useState } from "react";

// ─── Palette ──────────────────────────────────────────────────────────────────
const DARK   = "#0f0e17";
const GRAY   = "#6b7280";
const LGRAY  = "#9ca3af";
const PURPLE = "#8b5cf6";
const ACCENT = "#a855f7";
const LIGHT  = "#c4b5fd";

const SHADOW =
  "0 28px 72px rgba(0,0,0,.55), 0 8px 24px rgba(0,0,0,.35), 0 0 0 0.5px rgba(255,255,255,.08)";

// ─── Slot layout (7 cards) ────────────────────────────────────────────────────
const SLOT_Y: Record<0|1|2|3|4|5, number> = {
  0: 0,       // Centre
  1: 255,     // Carte juste en dessous (anciennement 250)
  2: 510,     // Carte tout en bas (anciennement 450 -> réglait le chevauchement)
  3: 800,     // Sortie basse (hors-champ)
  4: -800,    // Entrée haute (hors-champ)
  5: -255     // Carte juste au-dessus (anciennement -250)
};

const SLOT_OPACITY: Record<0|1|2|3|4|5, number> = { 0: 1.0, 1: 0.58, 2: 0.22, 3: 0, 4: 0, 5: 0.52 };
const SLOT_Z:       Record<0|1|2|3|4|5, number> = { 0: 4, 1: 3, 2: 2, 3: 1, 4: 1, 5: 3 };

function getSlot(cardIdx: number, s: number): 0|1|2|3|4|5 {
  return ((cardIdx - s + 600) % 6) as 0|1|2|3|4|5;
}

// ─── Robot icon ───────────────────────────────────────────────────────────────
function RobotSVG({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="1.5" x2="12" y2="5.5" stroke="white" strokeWidth="1.4" />
      <circle cx="12" cy="1" r="1.4" fill={LIGHT} />
      <rect x="4" y="5.5" width="16" height="13" rx="3" fill="white" fillOpacity=".96" />
      <circle cx="9"  cy="11" r="2" fill={PURPLE} />
      <circle cx="15" cy="11" r="2" fill={PURPLE} />
      <path d="M9.5 15.5 Q12 17.2 14.5 15.5"
        stroke={PURPLE} strokeWidth="1.1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Card 1 · Croissance ── 345px ─────────────────────────────────────────────
function GrowthCard() {
  return (
    <div style={{ padding: "1.5rem 1.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: LGRAY, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Revenue Growth
        </span>
        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#16a34a", background: "#dcfce7", padding: "0.14rem 0.4rem", borderRadius: 4 }}>
          ↑ Live
        </span>
      </div>
      <p style={{ fontSize: "2.8rem", fontWeight: 800, color: DARK, lineHeight: 1, letterSpacing: "-0.04em", margin: "0 0 0.14rem" }}>
        +32.12%
      </p>
      <p style={{ fontSize: "0.7rem", color: LGRAY, margin: "0 0 1rem" }}>vs last week</p>
      <svg width="100%" height="58" viewBox="0 0 280 58" preserveAspectRatio="none">
        <defs>
          <linearGradient id="g-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={PURPLE} />
            <stop offset="100%" stopColor={LIGHT}  />
          </linearGradient>
          <linearGradient id="g-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={PURPLE} stopOpacity="0.18" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0"    />
          </linearGradient>
        </defs>
        <path d="M0,54 C24,51 44,46 68,39 S108,26 140,18 S182,10 218,6 S260,2 280,1"
          fill="none" stroke="url(#g-line)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M0,54 C24,51 44,46 68,39 S108,26 140,18 S182,10 218,6 S260,2 280,1 L280,58 L0,58 Z"
          fill="url(#g-area)" />
      </svg>
    </div>
  );
}

// ─── Card 2 · Rocky ── 285px ──────────────────────────────────────────────────
function RockyCard() {
  return (
    <div style={{ padding: "1.35rem 1.45rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: `linear-gradient(135deg, ${PURPLE}, ${ACCENT})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <RobotSVG size={22} />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.92rem", color: DARK, margin: 0 }}>Rocky</p>
          <p style={{ fontSize: "0.61rem", color: "#22c55e", fontWeight: 500, margin: 0 }}>● Online</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.52rem" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ background: "#f3f4f6", borderRadius: "12px 12px 2px 12px", padding: "0.38rem 0.65rem", maxWidth: "82%" }}>
            <span style={{ fontSize: "0.72rem", color: DARK }}>How is my business going?</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.36rem" }}>
          <div style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
            background: `linear-gradient(135deg, ${PURPLE}, ${ACCENT})`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <RobotSVG size={12} />
          </div>
          <div style={{ background: "#f5f3ff", border: "1px solid #ede9fe", borderRadius: "12px 12px 12px 2px", padding: "0.38rem 0.65rem", maxWidth: "86%" }}>
            <span style={{ fontSize: "0.72rem", color: DARK, lineHeight: 1.55 }}>
              He is doing well! Don't forget to check your daily restocking basket.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card 3 · Total Sales ── 328px ────────────────────────────────────────────
function TotalSalesCard() {
  const R = 26;
  const C = 2 * Math.PI * R;
  let offset = 0;
  const segs = (
    [
      { label: "Boissons", pct: 0.45, color: PURPLE },
      { label: "Care",     pct: 0.35, color: ACCENT },
      { label: "Snack",    pct: 0.20, color: LIGHT  },
    ] as { label: string; pct: number; color: string }[]
  ).map(s => {
    const dash = s.pct * C;
    const r = { ...s, dash, offset };
    offset += dash;
    return r;
  });

  return (
    <div style={{ padding: "1.5rem 1.6rem" }}>
      <p style={{ fontSize: "0.65rem", fontWeight: 600, color: LGRAY, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.65rem" }}>
        Total Sales
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.55rem" }}>
        <span style={{ fontSize: "2.7rem", fontWeight: 800, color: DARK, lineHeight: 1, letterSpacing: "-0.04em" }}>
          38.7K
        </span>
        <span style={{ fontSize: "0.63rem", fontWeight: 700, color: "#16a34a", background: "white", border: "1.5px solid #dcfce7", padding: "0.18rem 0.44rem", borderRadius: 6, boxShadow: "0 1px 4px rgba(0,0,0,.06)", whiteSpace: "nowrap" }}>
          +12% yesterday
        </span>
      </div>
      <p style={{ fontSize: "0.72rem", color: GRAY, lineHeight: 1.55, margin: "0 0 0.95rem" }}>
        Total sales highlight the effectiveness of our recent strategies and approach.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <svg width="66" height="66" viewBox="0 0 66 66" style={{ flexShrink: 0 }}>
          <g transform="rotate(-90 33 33)">
            {segs.map((s, i) => (
              <circle key={i} cx="33" cy="33" r={R}
                fill="none" stroke={s.color} strokeWidth="10"
                strokeDasharray={`${s.dash - 1.5} ${C - s.dash + 1.5}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </g>
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.34rem", flex: 1 }}>
          {segs.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: "0.66rem", color: GRAY, flex: 1 }}>{s.label}</span>
              <span style={{ fontSize: "0.66rem", fontWeight: 600, color: DARK }}>{Math.round(s.pct * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Card 5 · Inventory Alerts ── 345px ──────────────────────────────────────
function InventoryCard() {
  const items = [
    { name: "Café en grains 1kg",   stock: 2,  status: "critical" },
    { name: "Pringles Original",    stock: 1,  status: "critical" },
    { name: "Red Bull 25cl × 24",   stock: 8,  status: "warning"  },
    { name: "Coca-Cola 33cl × 24",  stock: 47, status: "ok"       },
  ] as const;

  const style = {
    critical: { bg: "#fef2f2", border: "#fecaca", dot: "#ef4444", text: "#dc2626", label: "left" },
    warning:  { bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b", text: "#d97706", label: "left" },
    ok:       { bg: "#f0fdf4", border: "#bbf7d0", dot: "#22c55e", text: "#16a34a", label: "left" },
  };

  return (
    <div style={{ padding: "1.5rem 1.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: LGRAY, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Inventory Alerts
        </span>
        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#dc2626", background: "#fee2e2", padding: "0.14rem 0.4rem", borderRadius: 4 }}>
          3 Critical
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {items.map((item, i) => {
          const s = style[item.status];
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.55rem 0.65rem", background: s.bg, borderRadius: 12, border: `1px solid ${s.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
              <span style={{ fontSize: "0.72rem", color: DARK, flex: 1 }}>{item.name}</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: s.text }}>{item.stock} {item.status === "ok" ? "left" : "left"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card 6 · Weekly Visitors ── 345px ───────────────────────────────────────
function VisitorsCard() {
  const days = [
    { label: "Mon", h: 24 }, { label: "Tue", h: 34 }, { label: "Wed", h: 42 },
    { label: "Thu", h: 36 }, { label: "Fri", h: 52 }, { label: "Sat", h: 46 },
    { label: "Sun", h: 28 },
  ];
  const maxH = 56;

  return (
    <div style={{ padding: "1.5rem 1.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: LGRAY, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Weekly Visitors
        </span>
        <span style={{ fontSize: "0.6rem", fontWeight: 700, color: PURPLE, background: "#ede9fe", padding: "0.14rem 0.4rem", borderRadius: 4 }}>
          ↑ +8.4%
        </span>
      </div>
      <p style={{ fontSize: "2.4rem", fontWeight: 800, color: DARK, lineHeight: 1, letterSpacing: "-0.04em", margin: "0 0 1rem" }}>
        1,284
      </p>
      <svg width="100%" height="56" viewBox="0 0 280 56" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bar-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PURPLE} />
            <stop offset="100%" stopColor={LIGHT} />
          </linearGradient>
        </defs>
        {days.map((d, i) => {
          const isFri = d.label === "Fri";
          const y = maxH - d.h;
          return (
            <rect key={i} x={i * 40} y={y} width={30} height={d.h} rx={5}
              fill={isFri ? "url(#bar-grad)" : "#ede9fe"} />
          );
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.4rem" }}>
        {days.map((d, i) => (
          <span key={i} style={{ fontSize: "0.58rem", fontWeight: d.label === "Fri" ? 700 : 400, color: d.label === "Fri" ? PURPLE : LGRAY }}>
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Card 7 · Top Products ── 345px ──────────────────────────────────────────
function TopProductsCard() {
  const products = [
    { name: "Evian 50cl",      revenue: "€ 1,240", pct: 0.88, fade: false },
    { name: "Café Latte 25cl", revenue: "€ 980",   pct: 0.70, fade: false },
    { name: "Red Bull 25cl",   revenue: "€ 761",   pct: 0.55, fade: false },
    { name: "Lay's Nature 45g",revenue: "€ 430",   pct: 0.31, fade: true  },
  ];

  return (
    <div style={{ padding: "1.5rem 1.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontSize: "0.65rem", fontWeight: 600, color: LGRAY, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Top Products
        </span>
        <span style={{ fontSize: "0.6rem", color: GRAY }}>This week</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {products.map((p, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.28rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: p.fade ? LGRAY : DARK, minWidth: 14 }}>{i + 1}</span>
                <span style={{ fontSize: "0.72rem", color: p.fade ? GRAY : DARK }}>{p.name}</span>
              </div>
              <span style={{ fontSize: "0.7rem", fontWeight: p.fade ? 600 : 700, color: p.fade ? GRAY : DARK }}>{p.revenue}</span>
            </div>
            <div style={{ height: 5, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${p.pct * 100}%`, borderRadius: 99,
                background: p.fade
                  ? "#e5e7eb"
                  : `linear-gradient(90deg, ${PURPLE} ${(1 - p.pct) * 100}%, ${LIGHT})`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card registry ─────────────────────────────────────────────────────────────
const CARDS = [
  { width: 345, height: 240, bg: "white", shadow: SHADOW, Comp: GrowthCard      },
  { width: 345, height: 240, bg: "white", shadow: SHADOW, Comp: RockyCard       },
  { width: 345, height: 240, bg: "white", shadow: SHADOW, Comp: TotalSalesCard  },
  { width: 345, height: 240, bg: "white", shadow: SHADOW, Comp: InventoryCard   },
  { width: 345, height: 240, bg: "white", shadow: SHADOW, Comp: VisitorsCard    },
  { width: 345, height: 240, bg: "white", shadow: SHADOW, Comp: TopProductsCard },
] as const;

// ─── Slot-machine carousel ────────────────────────────────────────────────────
// Slots cycle: center → above → [instant wrap to off-screen below] → below-1 → center
//
// Step increments every 2s (0.5s transition + 1.5s pause at center).
// When a card moves from slot "above" (3) to slot "invisible" (2) we disable the
// CSS transition and snap it to y=700 (off-screen below). On the NEXT step it
// smoothly slides from y=700 into the "below-1" position — a clean entry from below.

export function FeatureCards() {
  const [step, setStep]       = useState(0);
  const prevStepRef           = useRef(0);

  // Advance step every 2 s
  useEffect(() => {
    const id = setInterval(() => setStep(s => s + 1), 2000);
    return () => clearInterval(id);
  }, []);

  // Keep prevStep always one render behind current step
  useEffect(() => {
    prevStepRef.current = step;
  });

  return (
    <div style={{ flex: 1, position: "relative", minHeight: 0, overflow: "hidden" }}>



      {CARDS.map(({ width, height, bg, shadow, Comp }, i) => {
        const slot    = getSlot(i, step);
        const oldSlot = getSlot(i, prevStepRef.current);

        // Wrap: card leaves "above" and must teleport to off-screen below
        const isWrap = oldSlot === 5 && slot === 4;

        const y    = isWrap ? 700 : SLOT_Y[slot];
        const opac = isWrap ? 0   : SLOT_OPACITY[slot];
        const z    = isWrap ? 1   : SLOT_Z[slot];

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginLeft: -(width / 2),
              width,
              height,  
              transform: `translateY(calc(-50% + ${y}px))`,
              opacity: opac,
              zIndex: z,
              background: bg,
              borderRadius: 28,
              boxShadow: shadow,
              overflow: "hidden",
              transition: isWrap
                ? "none"
                : "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease",
            }}
          >
            <Comp />
          </div>
        );
      })}
    </div>
  );
}
