const RESERVED_SUBDOMAINS = ['admin', 'www', 'api', 'grafana', 'prom'];

/**
 * Extrait le slug du commerce depuis le sous-domaine courant
 * (ex: "tayna" pour tayna.stock-s.fr). Retourne null sur localhost,
 * l'apex domain, ou un sous-domaine réservé (admin, api, ...).
 */
export function getSubdomainSlug(): string | null {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null;
  const parts = hostname.split('.');
  if (parts.length < 3) return null;
  const subdomain = parts[0];
  if (RESERVED_SUBDOMAINS.includes(subdomain)) return null;
  return subdomain;
}
