import { Navigate } from 'react-router-dom';
import { useAuth } from '@/ui/features/auth/hooks/useAuth';

function getSubdomainSlug(): string | null {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;
  const parts = hostname.split('.');
  if (parts.length < 3) return null;
  const subdomain = parts[0];
  const reserved = ['admin', 'www', 'api', 'grafana', 'prom'];
  if (reserved.includes(subdomain)) return null;
  return subdomain;
}

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: string[];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    const baseDomain = import.meta.env.VITE_BASE_DOMAIN;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const slug = getSubdomainSlug();

    console.log('[ProtectedRoute] Non authentifié — url:', window.location.href, '| slug:', slug, '| baseDomain:', baseDomain);

    // Sur un sous-domaine tenant sans token → retour sur le site principal
    if (slug && baseDomain && !isLocalhost) {
      console.log('[ProtectedRoute] Redirect vers', `https://${baseDomain}`);
      window.location.href = `https://${baseDomain}`;
      return null;
    }

    console.log('[ProtectedRoute] Redirect vers /login');
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
