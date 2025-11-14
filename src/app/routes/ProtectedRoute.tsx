import { Navigate } from 'react-router-dom';

// Simule un utilisateur connecté avec un rôle (à remplacer par un vrai hook ou provider)
const fakeUser = {
  isAuthenticated: true,
  role: 'admin', // ex: admin, manager, viewer
};

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[]; // Rôles autorisés (facultatif)
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = fakeUser;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}