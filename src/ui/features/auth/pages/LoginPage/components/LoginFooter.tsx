import { Link } from "react-router-dom";

export function LoginFooter() {
  return (
    <div className="mt-6 text-sm text-center text-gray-500">
      Pas encore de compte ?{' '}
      <Link to="/register" className="font-semibold transition-colors" style={{ color: "#7b5fa2" }}>
        Créer un compte
      </Link>
    </div>
  );
}


