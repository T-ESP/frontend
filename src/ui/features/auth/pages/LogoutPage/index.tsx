
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/ui/components/common/Toast";

export default function LogoutPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    // Clear auth token
    localStorage.removeItem('auth_token');
    
    // Show success message
    addToast(
      "Déconnexion réussie",
      "Vous avez été déconnecté avec succès.",
      "success"
    );
    
    // Redirect to login
    navigate("/login", { replace: true });
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


