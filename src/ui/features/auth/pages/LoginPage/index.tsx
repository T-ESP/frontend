import { LoginForm } from "./components/LoginForm";
import { Link } from "react-router-dom";
import { Package, TrendingUp, Users, ShieldCheck } from "lucide-react";

/* ============================================================
 * Palette alignée sur la LANDING PAGE (hero) pour la cohérence :
 *   - LP_BG     : fond sombre du hero (#0a0613)
 *   - LP_CARD   : surface légèrement + claire (#0f0a1d)
 *   - LP_GLOW   : violet du halo (#8b5cf6)
 *   - LP_ACCENT : violet d'accent (#a855f7) — bouton, liens, focus
 *   - LP_VIOLET : violet clair pour les accents texte sur fond sombre
 * ============================================================ */
const LP_GLOW = "#8b5cf6";
const LP_ACCENT = "#a855f7";
const LP_VIOLET = "#c4b5fd";

const features = [
  { icon: Package, label: "Gestion des stocks en temps réel" },
  { icon: TrendingUp, label: "Tableaux de bord & analyses" },
  { icon: Users, label: "Gestion clients & fournisseurs" },
  { icon: ShieldCheck, label: "Accès sécurisé & sauvegardé" },
];

export default function LoginPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>

      {/* ── Panneau gauche — dark hero (= landing page) ────── */}
      <div
        style={{
          width: "50%",
          background: "linear-gradient(150deg, #0a0613 0%, #0f0a1d 50%, #160c28 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem 3.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glows violets (mêmes teintes que le hero) */}
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

        {/* Contenu central */}
        <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "3rem 0" }}>
          <p style={{ color: LP_VIOLET, fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            Plateforme de gestion
          </p>
          <h1 style={{ color: "white", fontWeight: 800, fontSize: "2.4rem", lineHeight: 1.2, marginBottom: "1.25rem" }}>
            Pilotez votre commerce<br />
            <span style={{ color: LP_VIOLET }}>sans effort.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "340px", marginBottom: "2.5rem" }}>
            Stocks, ventes, clients — tout centralisé dans un seul tableau de bord conçu pour les commerçants.
          </p>

          {/* Features */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
            {features.map(({ icon: Icon, label }) => (
              <li key={label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: "2rem", height: "2rem", borderRadius: "0.5rem", flexShrink: 0,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={14} color={LP_VIOLET} />
                </div>
                <span style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.875rem", fontWeight: 500 }}>
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer gauche */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.7rem" }}>
            © 2025 StockS. Tous droits réservés.
          </p>
        </div>
      </div>

      {/* ── Panneau droit — clair, teinté violet LP ────────── */}
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
        {/* Glow haut-droite (violet LP) */}
        <div style={{
          position: "absolute", top: "-6rem", right: "-6rem",
          width: "320px", height: "320px", borderRadius: "50%",
          background: LP_GLOW, filter: "blur(110px)", opacity: 0.35,
          pointerEvents: "none",
        }} />
        {/* Glow bas-gauche (violet LP) */}
        <div style={{
          position: "absolute", bottom: "-4rem", left: "-4rem",
          width: "240px", height: "240px", borderRadius: "50%",
          background: LP_ACCENT, filter: "blur(90px)", opacity: 0.25,
          pointerEvents: "none",
        }} />

        <div style={{ width: "100%", maxWidth: "400px", position: "relative", zIndex: 10 }}>
          {/* En-tête */}
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#1f2937", marginBottom: "0.4rem" }}>
              Bon retour 👋
            </h2>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Connectez-vous pour accéder à votre espace
            </p>
          </div>

          {/* Card formulaire */}
          <div style={{
            background: "white",
            borderRadius: "1.25rem",
            border: "1px solid #ede9fe",
            boxShadow: "0 8px 30px rgba(168,85,247,0.12)",
            padding: "2rem 1.75rem",
          }}>
            <LoginForm />
          </div>

          {/* Lien retour */}
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
