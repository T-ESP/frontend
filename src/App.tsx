import { Suspense, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { ToastProvider } from './ui/components/common/Toast';
import { routes } from './ui/routing/routeConfig';

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

// Lit le token depuis ?token=xxx, le stocke et nettoie l'URL
function useIncomingToken() {
  const navigate = useNavigate();

  useEffect(() => {
    const slug = getSubdomainSlug();
    if (!slug) return;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) return;

    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_email', decoded.email ?? '');
      localStorage.setItem('auth_firstname', '');
      localStorage.setItem('auth_lastname', '');
      if (decoded.commerce_id) {
        localStorage.setItem('commerce_id', String(decoded.commerce_id));
      }
    } catch {
      // token malformé
    }

    // Nettoyer le token de l'URL puis aller sur /dashboard
    navigate('/dashboard', { replace: true });
  }, [navigate]);
}

function AppContent() {
  useIncomingToken();
  return useRoutes(routes);
}

export default function App() {
  return (
    <Suspense>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </Suspense>
  );
}