import { useEffect, useState } from "react";

/**
 * Gestion du thème clair / sombre.
 * Le mode sombre = thème "Terminal" (navy + emerald), appliqué via la classe
 * `.dark` sur <html>. Défaut : sombre. Préférence persistée en localStorage.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "stocks-theme";

export function getStoredTheme(): Theme {
  try {
    const t = localStorage.getItem(STORAGE_KEY);
    if (t === "light" || t === "dark") return t;
  } catch {
    // ignore
  }
  return "dark"; // défaut : Terminal sombre
}

function persist(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

function applyToDom(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

/** À appeler une fois au démarrage (avant le rendu React) pour éviter le flash. */
export function initTheme() {
  applyToDom(getStoredTheme());
}

// ── Petit store partagé pour synchroniser tous les composants ──
let current: Theme = getStoredTheme();
const listeners = new Set<(t: Theme) => void>();

export function setTheme(theme: Theme) {
  current = theme;
  applyToDom(theme);
  persist(theme);
  listeners.forEach((l) => l(theme));
}

export function toggleTheme() {
  setTheme(current === "dark" ? "light" : "dark");
}

export function useTheme() {
  const [theme, setLocal] = useState<Theme>(current);
  useEffect(() => {
    const l = (t: Theme) => setLocal(t);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return { theme, toggle: toggleTheme, setTheme };
}
