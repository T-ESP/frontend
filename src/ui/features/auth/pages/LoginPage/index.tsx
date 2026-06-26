import { LoginForm } from "./components/LoginForm";
import { FeatureCards } from "./components/FeatureCards";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const LP_GLOW = "#8b5cf6";
const LP_ACCENT = "#a855f7";
const LP_VIOLET = "#c4b5fd";

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* ── Panneau gauche — dark hero ────── */}
      <div
        style={{
          width: "50%",
          background: "linear-gradient(150deg, #0a0613 0%, #0f0a1d 50%, #160c28 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "2.25rem 3rem",
          position: "relative",
          overflow: "hidden",
          borderRadius: "1.5rem",
          margin: "1rem 0 1rem 1rem",
        }}
      >
        {/* Glows violets */}
        <div style={{
          position: "absolute", top: "-8rem", left: "-8rem",
          width: "400px", height: "400px", borderRadius: "50%",
          background: LP_GLOW, filter: "blur(130px)", opacity: 0.3,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: "280px", height: "280px", borderRadius: "50%",
          background: LP_ACCENT, filter: "blur(100px)", opacity: 0.2,
          pointerEvents: "none",
        }} />

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "2.25rem", height: "2.25rem", borderRadius: "0.75rem",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Package size={18} color={LP_VIOLET} />
            </div>
            <span style={{ color: "white", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
              Stock<span style={{ color: LP_ACCENT }}>S</span>
            </span>
          </div>
        </div>

        {/* Cartes animées */}
        <FeatureCards />

        {/* Footer gauche */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}>
            © 2025 StockS. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* ── Panneau droit — clair, teinté violet ────────── */}
      <div
        style={{
          width: "50%",
          background: "linear-gradient(160deg, #f6f2fe 0%, #efe7fb 50%, #e6dbf7 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: "-6rem", right: "-6rem",
          width: "320px", height: "320px", borderRadius: "50%",
          background: LP_GLOW, filter: "blur(110px)", opacity: 0.35,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-4rem", left: "-4rem",
          width: "240px", height: "240px", borderRadius: "50%",
          background: LP_ACCENT, filter: "blur(90px)", opacity: 0.25,
          pointerEvents: "none",
        }} />

        <div style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 10 }}>
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1f2937", marginBottom: "0.4rem" }}>
              Bon retour 👋
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          <div style={{
            background: "white",
            borderRadius: "1.25rem",
            border: "1px solid #ede9fe",
            boxShadow: "0 8px 30px rgba(168,85,247,0.12)",
            padding: "2rem 1.75rem",
          }}>
            <LoginForm />
          </div>

          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <Link
              to="/"
              style={{ fontSize: "0.75rem", color: "#9ca3af", textDecoration: "none" }}
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
