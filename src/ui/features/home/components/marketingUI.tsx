import type { ReactNode } from "react";

/* ============================================================
 * Petits éléments UI partagés par les pages marketing
 * (landing, à propos, contact, etc.) — tokens de thème, clair/sombre.
 * ============================================================ */

/** Surtitre éditorial : court trait + label en majuscules espacées. */
export function Eyebrow({
  children,
  accent = "primary",
}: {
  children: ReactNode;
  accent?: "primary" | "rose";
}) {
  const c = accent === "rose" ? "text-rose-400" : "text-[var(--lp-accent)]";
  const line = accent === "rose" ? "bg-rose-400/50" : "bg-[var(--lp-accent)] opacity-50";
  return (
    <div className={`mb-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[1.4px] ${c}`}>
      <span className={`h-px w-[22px] ${line}`} />
      {children}
    </div>
  );
}
