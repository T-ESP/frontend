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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
