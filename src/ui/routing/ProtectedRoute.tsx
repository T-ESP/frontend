import { Navigate } from 'react-router-dom';
import { useAuth } from '@/ui/features/auth/hooks/useAuth';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    // /login est accessible aussi bien sur le site principal (patron) que
    // sur un sous-domaine tenant (employé) : simple navigation, pas de
    // redirection cross-origine nécessaire.
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
