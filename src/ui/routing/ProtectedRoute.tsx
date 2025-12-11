import { Navigate } from 'react-router-dom';
import { useAuth } from '@/ui/features/auth/hooks/useAuth';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[]; // Rôles autorisés (facultatif)
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}