import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
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

// Exécuté une seule fois, de façon synchrone, avant que React monte.
// Si on arrive sur slug.stock-s.fr/dashboard?token=xxx, on stocke le token
// immédiatement dans localStorage et on nettoie l'URL.
function bootstrapSubdomainToken(): void {
  const currentUrl = window.location.href;
  const slug = getSubdomainSlug();

  console.log('[Auth] bootstrapSubdomainToken — url:', currentUrl, '| slug détecté:', slug);

  if (!slug) {
    console.log('[Auth] Pas de sous-domaine tenant, skip bootstrap.');
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  if (!token) {
    console.log('[Auth] Sous-domaine détecté mais pas de ?token dans l\'URL.');
    return;
  }

  console.log('[Auth] Token trouvé dans l\'URL, stockage en localStorage...');

  try {
    const decoded: any = JSON.parse(atob(token.split('.')[1]));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_email', decoded.email ?? '');
    localStorage.setItem('auth_firstname', '');
    localStorage.setItem('auth_lastname', '');
    if (decoded.commerce_id) {
      localStorage.setItem('commerce_id', String(decoded.commerce_id));
    }
    if (decoded.slug) {
      localStorage.setItem('commerce_slug', decoded.slug);
    }
    console.log('[Auth] Token stocké — email:', decoded.email, '| commerce_id:', decoded.commerce_id, '| slug:', decoded.slug);
  } catch {
    console.error('[Auth] Erreur lors du décodage du token JWT.');
  }

  // Retirer ?token de l'URL sans recharger la page
  const url = new URL(window.location.href);
  url.searchParams.delete('token');
  window.history.replaceState({}, '', url.toString());
  console.log('[Auth] URL nettoyée:', url.toString());
}

bootstrapSubdomainToken();

export default function App() {
  const routing = useRoutes(routes);

  return (
    <Suspense>
      <ToastProvider>
        {routing}
      </ToastProvider>
    </Suspense>
  );
}
