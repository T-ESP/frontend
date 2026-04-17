export const environment = {
  production: true,
  apiUrl: (() => {
    const hostname = window.location.hostname; // ex: z.stock-s.fr
    const tenant = hostname.split('.')[0];     // ex: minette
    return `https://${tenant}-api.stock-s.fr`;
  })()
};
