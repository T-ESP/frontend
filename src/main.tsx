import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./ui/components/common/ErrorBoundary";
import "./ui/styles/index.css";
import "./i18n";
import { initTheme } from "./ui/theme/theme";

// Applique le thème (clair/sombre) avant le rendu pour éviter tout flash.
initTheme();

// Après un déploiement, l'onglet ouvert référence des chunks qui n'existent plus.
// Vite émet alors `vite:preloadError` : on recharge une fois pour récupérer le
// nouvel index.html. Le drapeau de session évite la boucle si le chunk manque
// vraiment.
const RELOAD_FLAG = "stocks:chunk-reload";
window.addEventListener("vite:preloadError", (event) => {
  // Déjà rechargé récemment : le chunk manque pour de bon, on laisse l'erreur
  // remonter à l'ErrorBoundary plutôt que de boucler.
  if (sessionStorage.getItem(RELOAD_FLAG)) return;
  event.preventDefault();
  sessionStorage.setItem(RELOAD_FLAG, "1");
  window.location.reload();
});

// Le rechargement a abouti : on réarme le garde-fou pour le prochain déploiement.
window.setTimeout(() => sessionStorage.removeItem(RELOAD_FLAG), 10_000);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
