export function getApiUrl(): string {
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return import.meta.env.VITE_API_URL || 'http://localhost:8080';
    }

    return 'https://api.stock-s.fr';
}
