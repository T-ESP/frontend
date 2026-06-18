import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import "./onboardingTour.css";

// Clé de persistance : le tour ne se lance automatiquement qu'une seule fois.
const STORAGE_KEY = "stocks_onboarding_done_v1";
// Drapeau temporaire posé quand on demande à rejouer le tour depuis une autre page.
const REPLAY_KEY = "stocks_tour_replay";
// Évènement permettant de déclencher le tour à la volée (depuis le header).
export const TOUR_START_EVENT = "stocks:start-tour";

export function hasSeenTour(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markTourSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* localStorage indisponible : on ignore */
  }
}

export function requestReplay(): void {
  try {
    sessionStorage.setItem(REPLAY_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Consomme (et efface) le drapeau de relecture posé depuis une autre page. */
export function consumeReplayFlag(): boolean {
  try {
    const value = sessionStorage.getItem(REPLAY_KEY);
    if (value) sessionStorage.removeItem(REPLAY_KEY);
    return value === "1";
  } catch {
    return false;
  }
}

type TourStep = {
  /** Sélecteur CSS de la zone à mettre en avant. Absent = bulle centrée (intro). */
  element?: string;
  title: string;
  description: string;
  side?: "top" | "right" | "bottom" | "left" | "over";
  align?: "start" | "center" | "end";
};

// Tour volontairement court (~1-2 min). Les zones ciblées portent un attribut `data-tour`.
const STEPS: TourStep[] = [
  {
    title: "Bienvenue sur StockS 👋",
    description:
      "Voici une visite rapide des fonctionnalités clés (moins d'une minute). Vous pouvez la passer à tout moment avec la croix, ou en appuyant sur Échap.",
  },
  {
    element: '[data-tour="nav"]',
    title: "Navigation",
    description:
      "Accédez à tous vos espaces depuis ce menu : tableau de bord, inventaire, commandes, ventes, fidélité et alertes.",
    side: "right",
    align: "center",
  },
  {
    element: '[data-tour="kpis"]',
    title: "Vos indicateurs clés",
    description:
      "Les chiffres importants de votre activité en un coup d'œil : chiffre d'affaires, commandes, clients…",
    side: "bottom",
    align: "center",
  },
  {
    element: '[data-tour="customize"]',
    title: "Personnalisez vos KPIs",
    description:
      "Cliquez sur « Éditer » pour choisir les indicateurs affichés et composer un tableau de bord à votre image.",
    side: "bottom",
    align: "end",
  },
  {
    element: '[data-tour="period"]',
    title: "Filtrez par période",
    description:
      "Changez la plage de dates ici : 7 jours, 30 jours, un an… toutes les données du tableau de bord s'actualisent.",
    side: "bottom",
    align: "end",
  },
  {
    element: '[data-tour="alerts"]',
    title: "Alertes intelligentes",
    description:
      "L'IA surveille votre stock et vos prix : ruptures imminentes, anomalies de prix ou de ventes remontent ici automatiquement.",
    side: "top",
    align: "center",
  },
  {
    element: '[data-tour="assistant"]',
    title: "Votre assistant IA",
    description:
      "Une question sur vos données ? Cliquez ici pour discuter avec l'assistant. Bonne visite sur StockS !",
    side: "left",
    align: "end",
  },
];

/**
 * Lance le tour d'onboarding. Seules les étapes dont la zone est présente
 * à l'écran sont conservées, ce qui rend l'appel sûr depuis n'importe quelle page.
 */
export function startOnboardingTour(): void {
  const steps = STEPS.filter(
    (step) => !step.element || document.querySelector(step.element),
  ).map((step) => ({
    element: step.element,
    popover: {
      title: step.title,
      description: step.description,
      side: step.side,
      align: step.align,
    },
  }));

  if (steps.length === 0) return;

  const tour = driver({
    showProgress: true,
    progressText: "{{current}} / {{total}}",
    nextBtnText: "Suivant",
    prevBtnText: "Précédent",
    doneBtnText: "Terminer",
    popoverClass: "stocks-tour",
    overlayColor: "#0f172a",
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 10,
    allowClose: true,
    steps,
    // Fin du tour (terminé OU passé via la croix/Échap) : on ne le rejoue plus tout seul.
    onDestroyed: () => markTourSeen(),
  });

  tour.drive();
}
