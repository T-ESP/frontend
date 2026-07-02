import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, LogOut, KeyRound, Mail, LayoutDashboard } from "lucide-react";
import { useToast } from "@/ui/components/common/Toast";
import { useAuth, clearAuthToken, getAuthToken } from "@/ui/features/auth/hooks/useAuth";
import { useRecapFrequency, type RecapFrequency } from "@/ui/components/DailyRecap/recapPreference";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { useTranslation } from "react-i18next";

function PasswordField({
  id,
  name,
  placeholder,
  value,
  onChange,
  required,
}: {
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/70 hover:text-muted-foreground transition-colors"
        tabIndex={-1}
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAuthenticated, firstname, lastname, email } = useAuth();
  const [recapFrequency, setRecapFrequency] = useRecapFrequency(email);

  const handleRecapFrequency = (value: RecapFrequency) => {
    setRecapFrequency(value);
    addToast(
      t("profile.preferences.saved_title", "Préférence enregistrée"),
      t("profile.preferences.saved_msg", "Vos préférences ont été mises à jour."),
      "success",
    );
  };

  const [emailForm, setEmailForm] = useState({ email: "", confirmEmail: "" });
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailStatus("loading");
    if (emailForm.email !== emailForm.confirmEmail) {
      setEmailStatus("error");
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.email_mismatch", "Les adresses email ne correspondent pas."), "error");
      return;
    }
    await new Promise((r) => setTimeout(r, 1000));
    setEmailStatus("success");
    addToast(t("profile.toasts.email_success_title", "Email mis à jour"), t("profile.toasts.email_success_msg", "Votre adresse email a été modifiée avec succès."), "success");
    setEmailForm({ email: "", confirmEmail: "" });
    setEmailStatus("idle");
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordStatus("loading");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("error");
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.password_mismatch", "Les mots de passe ne correspondent pas."), "error");
      setPasswordStatus("idle");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus("error");
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.password_length", "Le mot de passe doit contenir au moins 8 caractères."), "error");
      setPasswordStatus("idle");
      return;
    }
    await new Promise((r) => setTimeout(r, 1000));
    setPasswordStatus("success");
    addToast(t("profile.toasts.password_success_title", "Mot de passe mis à jour"), t("profile.toasts.password_success_msg", "Votre mot de passe a été modifié avec succès."), "success");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordStatus("idle");
  };

  const handleLogout = () => {
    clearAuthToken();
    addToast(t("profile.toasts.logout_title", "Déconnexion"), t("profile.toasts.logout_msg", "Vous avez été déconnecté avec succès."), "info");
    navigate("/login", { replace: true });
  };

  if (!isAuthenticated) return null;

  const initials = `${firstname?.charAt(0) ?? ""}${lastname?.charAt(0) ?? ""}`.toUpperCase();

  return (
    <PageLayout
      title={t("profile.title", "Mon Profil")}
      subtitle={t("profile.subtitle", "Gérez vos informations personnelles et vos paramètres de compte.")}
    >
      {/* Avatar card */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold shrink-0">
          {initials || <User className="w-7 h-7" />}
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{firstname} {lastname}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{getAuthToken() ? t("profile.security.session_active", "Session active") : t("profile.security.no", "Non connecté")}</p>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <User className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="text-base font-semibold text-foreground">{t("profile.personal_info.title", "Informations personnelles")}</h2>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>{t("profile.personal_info.firstname", "Prénom")}</Label>
            <Input value={firstname ?? ""} disabled className="bg-muted text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            <Label>{t("profile.personal_info.lastname", "Nom")}</Label>
            <Input value={lastname ?? ""} disabled className="bg-muted text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <LayoutDashboard className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="text-base font-semibold text-foreground">{t("profile.preferences.title", "Préférences")}</h2>
        </div>
        <div className="p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-semibold text-foreground">{t("profile.preferences.daily_recap_label", "Récap quotidien")}</h4>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("profile.preferences.daily_recap_desc", "Fenêtre récapitulative de la veille à l'ouverture de l'application.")}
              </p>
            </div>
            <div className="inline-flex p-0.5 rounded-lg bg-muted shrink-0">
              {(["once_per_day", "every_open"] as RecapFrequency[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleRecapFrequency(opt)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    recapFrequency === opt
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt === "once_per_day"
                    ? t("profile.preferences.once_per_day", "Une fois par jour")
                    : t("profile.preferences.every_open", "À chaque ouverture")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Change email */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <Mail className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="text-base font-semibold text-foreground">{t("profile.email.title", "Changer l'adresse email")}</h2>
        </div>
        <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">{t("profile.email.new_email_label", "Nouvelle adresse email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("profile.email.new_email_placeholder", "nouveau@example.com")}
              value={emailForm.email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmEmail">{t("profile.email.confirm_email_label", "Confirmer l'adresse email")}</Label>
            <Input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              placeholder={t("profile.email.confirm_email_placeholder", "nouveau@example.com")}
              value={emailForm.confirmEmail}
              onChange={handleEmailChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={emailStatus === "loading"}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {emailStatus === "loading" ? t("profile.email.updating", "Mise à jour...") : t("profile.email.update_btn", "Mettre à jour l'email")}
          </Button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <KeyRound className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="text-base font-semibold text-foreground">{t("profile.password.title", "Changer le mot de passe")}</h2>
        </div>
        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">{t("profile.password.current_label", "Mot de passe actuel")}</Label>
            <PasswordField
              id="currentPassword"
              name="currentPassword"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">{t("profile.password.new_label", "Nouveau mot de passe")}</Label>
            <PasswordField
              id="newPassword"
              name="newPassword"
              placeholder="••••••••"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">{t("profile.password.confirm_label", "Confirmer le nouveau mot de passe")}</Label>
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={passwordStatus === "loading"}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            {passwordStatus === "loading" ? t("profile.password.updating", "Mise à jour...") : t("profile.password.update_btn", "Mettre à jour le mot de passe")}
          </Button>
        </form>
      </div>

      {/* Logout */}
      <div className="bg-card border border-border rounded-xl shadow-sm">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
          <LogOut className="w-4 h-4 text-muted-foreground/70" />
          <h2 className="text-base font-semibold text-foreground">{t("profile.security.title", "Session")}</h2>
        </div>
        <div className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{t("profile.security.logout_desc", "Se déconnecter de votre compte")}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">{t("profile.security.logout_hint", "Vous serez redirigé vers la page de connexion.")}</p>
          </div>
          <Button
            type="button"
            onClick={handleLogout}
            className="bg-rose-600 hover:bg-rose-700 text-white shrink-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("profile.security.logout_btn", "Se déconnecter")}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
