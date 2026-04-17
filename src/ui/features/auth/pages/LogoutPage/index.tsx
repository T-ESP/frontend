
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/ui/components/common/Toast";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_firstname');
    localStorage.removeItem('auth_lastname');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('commerce_id');

    addToast(
      "Déconnexion réussie",
      "Vous avez été déconnecté avec succès.",
      "success"
    );

    const baseDomain = import.meta.env.VITE_BASE_DOMAIN;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (baseDomain && !isLocalhost) {
      window.location.href = `https://${baseDomain}`;
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate, addToast]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  );
}


