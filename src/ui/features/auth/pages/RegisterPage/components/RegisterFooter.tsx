import { Link } from "react-router-dom";

export function RegisterFooter() {
  return (
    <div className="mt-6 text-sm text-center text-gray-500">
      Déjà un compte ?{' '}
      <Link to="/login" className="font-semibold transition-colors" style={{ color: "#7b5fa2" }}>
        Se connecter
      </Link>
    </div>
  );
}