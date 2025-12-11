import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/ui/components/common/Toast";
import { useAuth, clearAuthToken, getAuthToken } from "@/ui/features/auth/hooks/useAuth";
import { Button } from "@/ui/components/common/Button/Button";
import { FormField } from "@/ui/components/common/FormField/FormField";
import { Input } from "@/ui/components/common/Input/Input";
import { PasswordInput } from "@/ui/components/common/PasswordInput/PasswordInput";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isAuthenticated } = useAuth();

  // État pour les informations personnelles (mockées pour l'instant)
  const [userInfo] = useState({
    firstname: "John",
    lastname: "Doe",
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

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
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
      addToast("Erreur", "Les adresses email ne correspondent pas.", "error");
      return;
    }

    // TODO: Appeler l'API pour changer l'email
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setEmailStatus("success");
    addToast("Email mis à jour", "Votre adresse email a été modifiée avec succès.", "success");
    setEmailForm({ email: "", confirmEmail: "" });
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordStatus("loading");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus("error");
      addToast("Erreur", "Les mots de passe ne correspondent pas.", "error");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordStatus("error");
      addToast("Erreur", "Le mot de passe doit contenir au moins 8 caractères.", "error");
      return;
    }

    // TODO: Appeler l'API pour changer le mot de passe
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setPasswordStatus("success");
    addToast("Mot de passe mis à jour", "Votre mot de passe a été modifié avec succès.", "success");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleLogout = () => {
    clearAuthToken();
    addToast("Déconnexion", "Vous avez été déconnecté avec succès.", "info");
    navigate("/login", { replace: true });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Mon Profil</h1>
        <p className="mt-2 text-sm text-neutral-600">Gérez vos informations personnelles et vos paramètres de compte.</p>
      </div>

      {/* Informations personnelles */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Informations personnelles</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Prénom</label>
            <Input
              type="text"
              value={userInfo.firstname}
              disabled
              className="bg-neutral-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Nom</label>
            <Input
              type="text"
              value={userInfo.lastname}
              disabled
              className="bg-neutral-50"
            />
          </div>
        </div>
      </section>

      {/* Changement d'email */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Changer l'adresse email</h2>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            id="email"
            name="email"
            type="email"
            label="Nouvelle adresse email"
            placeholder="nouveau@example.com"
            value={emailForm.email}
            onChange={handleEmailChange}
            required
          />
          <Input
            id="confirmEmail"
            name="confirmEmail"
            type="email"
            label="Confirmer l'adresse email"
            placeholder="nouveau@example.com"
            value={emailForm.confirmEmail}
            onChange={handleEmailChange}
            required
          />
          <Button
            type="submit"
            disabled={emailStatus === "loading"}
            className="w-full sm:w-auto"
          >
            {emailStatus === "loading" ? "Mise à jour..." : "Mettre à jour l'email"}
          </Button>
        </form>
      </section>

      {/* Changement de mot de passe */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Changer le mot de passe</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <FormField label="Mot de passe actuel">
            <PasswordInput
              id="currentPassword"
              name="currentPassword"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </FormField>
          <FormField label="Nouveau mot de passe">
            <PasswordInput
              id="newPassword"
              name="newPassword"
              placeholder="••••••••"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
          </FormField>
          <FormField label="Confirmer le nouveau mot de passe">
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
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
            {passwordStatus === "loading" ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </Button>
        </form>
      </section>

      {/* Sécurité et session */}
      <section className="p-6 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Sécurité et session</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-neutral-700">Token en session</p>
              <p className="text-xs text-neutral-500 mt-1">
                {getAuthToken() ? "Oui" : "Non"}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-200">
            <Button
              type="button"
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}



