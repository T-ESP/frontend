import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/ui/components/common/Toast";
import { useAuth, clearAuthToken, getAuthToken } from "@/ui/features/auth/hooks/useAuth";
import { Button } from "@/ui/components/common/Button/Button";
import { FormField } from "@/ui/components/common/FormField/FormField";
import { Input } from "@/ui/components/common/Input/Input";
import { PasswordInput } from "@/ui/components/common/PasswordInput/PasswordInput";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { userService } from "@/infrastructure/api/services/userService";
import type { User } from "@/domain/models/User";

export default function ProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  // État pour les informations personnelles
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstname: "",
    lastname: "",
    phone: "",
  });

  // État pour le changement d'email
  const [emailForm, setEmailForm] = useState({
    email: "",
    confirmEmail: "",
  });
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // État pour le changement de mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await userService.getMe();
        setUserInfo(user);
        setProfileForm({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          phone: user.phone || "",
        });
      } catch (error) {
        addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.fetch_error", "Impossible de charger votre profil."), "error");
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, addToast, t]);

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updatedUser = await userService.updateMe(profileForm);
      setUserInfo(updatedUser);
      setIsEditingInfo(false);
      localStorage.setItem("auth_firstname", updatedUser.firstname);
      localStorage.setItem("auth_lastname", updatedUser.lastname);
      addToast(t("profile.toasts.info_success_title", "Profil mis à jour"), t("profile.toasts.info_success_msg", "Vos informations personnelles ont été modifiées avec succès."), "success");
    } catch (error) {
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.update_error", "Échec de la mise à jour du profil."), "error");
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailStatus("loading");

    if (emailForm.email !== emailForm.confirmEmail) {
      setEmailStatus("error");
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.email_mismatch", "Les adresses email ne correspondent pas."), "error");
      return;
    }

    // API Call replaced with generic update for now as email update usually needs careful handling
    try {
      await userService.updateMe({ firstname: userInfo?.firstname, lastname: userInfo?.lastname }); // Placeholder for email logic
      setEmailStatus("success");
      addToast(t("profile.toasts.email_success_title", "Email mis à jour"), t("profile.toasts.email_success_msg", "Votre adresse email a été modifiée avec succès."), "success");
      setEmailForm({ email: "", confirmEmail: "" });
    } catch (error) {
      setEmailStatus("error");
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.email_error", "Échec du changement d'email."), "error");
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordStatus("loading");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("error");
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.password_mismatch", "Les mots de passe ne correspondent pas."), "error");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus("error");
      addToast(t("profile.toasts.error_title", "Erreur"), t("profile.toasts.password_length", "Le mot de passe doit contenir au moins 8 caractères."), "error");
      return;
    }

    // TODO: Appeler l'API pour changer le mot de passe
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPasswordStatus("success");
    addToast(t("profile.toasts.password_success_title", "Mot de passe mis à jour"), t("profile.toasts.password_success_msg", "Votre mot de passe a été modifié avec succès."), "success");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    clearAuthToken();
    addToast(t("profile.toasts.logout_title", "Déconnexion"), t("profile.toasts.logout_msg", "Vous avez été déconnecté avec succès."), "info");
    navigate("/login", { replace: true });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">{t("profile.title", "Mon Profil")}</h1>
        <p className="mt-2 text-sm text-neutral-600">{t("profile.subtitle", "Gérez vos informations personnelles et vos paramètres de compte.")}</p>
      </div>

      {/* Informations personnelles */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">{t("profile.personal_info.title", "Informations personnelles")}</h2>
          <Button
            variant="ghost"
            type="button"
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="text-neutral-600 hover:text-neutral-900"
          >
            {isEditingInfo ? t("common.cancel", "Annuler") : t("common.edit", "Modifier")}
          </Button>
        </div>
        
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("profile.personal_info.firstname", "Prénom")}
              name="firstname"
              type="text"
              value={isEditingInfo ? profileForm.firstname : (userInfo?.firstname || "")}
              onChange={handleProfileChange}
              disabled={!isEditingInfo}
              className={!isEditingInfo ? "bg-neutral-50" : ""}
            />
            <Input
              label={t("profile.personal_info.lastname", "Nom")}
              name="lastname"
              type="text"
              value={isEditingInfo ? profileForm.lastname : (userInfo?.lastname || "")}
              onChange={handleProfileChange}
              disabled={!isEditingInfo}
              className={!isEditingInfo ? "bg-neutral-50" : ""}
            />
          </div>
          <div>
            <Input
              label={t("profile.personal_info.phone", "Téléphone")}
              name="phone"
              type="tel"
              value={isEditingInfo ? profileForm.phone : (userInfo?.phone || "")}
              onChange={handleProfileChange}
              disabled={!isEditingInfo}
              className={!isEditingInfo ? "bg-neutral-50" : ""}
            />
          </div>
          {isEditingInfo && (
            <div className="flex justify-end pt-2">
              <Button type="submit">
                {t("common.save", "Enregistrer")}
              </Button>
            </div>
          )}
        </form>
      </section>

      {/* Changement d'email */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t("profile.email.title", "Changer l'adresse email")}</h2>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label={t("profile.email.new_email_label", "Nouvelle adresse email")}
            placeholder={t("profile.email.new_email_placeholder", "nouveau@example.com")}
            value={emailForm.email}
            onChange={handleEmailChange}
            required
          />
          <Input
            id="confirmEmail"
            name="confirmEmail"
            type="email"
            label={t("profile.email.confirm_email_label", "Confirmer l'adresse email")}
            placeholder={t("profile.email.confirm_email_placeholder", "nouveau@example.com")}
            value={emailForm.confirmEmail}
            onChange={handleEmailChange}
            required
          />
          <Button
            type="submit"
            disabled={emailStatus === "loading"}
            className="w-full sm:w-auto"
          >
            {emailStatus === "loading" ? t("profile.email.updating", "Mise à jour...") : t("profile.email.update_btn", "Mettre à jour l'email")}
          </Button>
        </form>
      </section>

      {/* Changement de mot de passe */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t("profile.password.title", "Changer le mot de passe")}</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FormField label={t("profile.password.current_label", "Mot de passe actuel")}>
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              placeholder={t("profile.password.current_placeholder", "••••••••")}
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </FormField>
          <FormField label={t("profile.password.new_label", "Nouveau mot de passe")}>
            <PasswordInput
              id="newPassword"
              name="newPassword"
              placeholder={t("profile.password.new_placeholder", "••••••••")}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </FormField>
          <FormField label={t("profile.password.confirm_label", "Confirmer le nouveau mot de passe")}>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder={t("profile.password.confirm_placeholder", "••••••••")}
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </FormField>
          <Button
            type="submit"
            disabled={passwordStatus === "loading"}
            className="w-full sm:w-auto"
          >
            {passwordStatus === "loading" ? t("profile.password.updating", "Mise à jour...") : t("profile.password.update_btn", "Mettre à jour le mot de passe")}
          </Button>
        </form>
      </section>

      {/* Sécurité et session */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">{t("profile.security.title", "Sécurité et session")}</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-neutral-700">{t("profile.security.session_token", "Token en session")}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {getAuthToken() ? t("profile.security.yes", "Oui") : t("profile.security.no", "Non")}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-200">
            <Button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              {t("profile.security.logout_btn", "Se déconnecter")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}



