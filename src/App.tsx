import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { ToastProvider } from './ui/components/common/Toast';
import { routes } from './ui/routing/routeConfig';
import { storeAuthFromToken } from './ui/features/auth/hooks/useAuth';
import { getSubdomainSlug } from './lib/subdomain';

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
    storeAuthFromToken(token);
    localStorage.setItem('auth_firstname', '');
    localStorage.setItem('auth_lastname', '');
    const decoded: Record<string, unknown> = JSON.parse(atob(token.split('.')[1]));
    console.log('[Auth] Token stocké — email:', decoded.email, '| commerce_id:', decoded.commerce_id, '| slug:', decoded.slug, '| role:', decoded.role);
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

// Exécuté synchronement après le bootstrap.
// Sur un sous-domaine sans token → redirect immédiat vers stock-s.fr,
// avant que React ne rende quoi que ce soit.
function guardSubdomain(): void {
  const slug = getSubdomainSlug();
  if (!slug) return;

  // /login doit rester accessible sur un sous-domaine tenant : c'est là que
  // les employés se connectent (le commerce est déduit du sous-domaine).
  if (window.location.pathname.startsWith('/login')) return;

  const baseDomain = import.meta.env.VITE_BASE_DOMAIN;
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!baseDomain || isLocalhost) return;

  const token = localStorage.getItem('auth_token');
  console.log('[Auth] guardSubdomain — url:', window.location.href, '| token présent:', !!token);

  if (!token) {
    console.log('[Auth] Pas de token sur sous-domaine, redirect vers', `https://${baseDomain}`);
    window.location.href = `https://${baseDomain}`;
  }
}

guardSubdomain();

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
