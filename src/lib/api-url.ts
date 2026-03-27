export function getApiUrl(): string {
    const hostname = window.location.hostname;

    // localhost → backend principal
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return import.meta.env.VITE_API_URL || 'http://localhost:8090';
    }

    // stock-s.fr → backend principal
    if (hostname === 'stock-s.fr') {
        return 'https://api.stock-s.fr';
    }

    // miskinette.stock-s.fr → miskinette-api.stock-s.fr
    const slug = hostname.split('.')[0];
    return `https://${slug}-api.stock-s.fr`;
}
