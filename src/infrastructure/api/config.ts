// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8090',
  timeout: 10000,
} as const;

export const API_ENDPOINTS = {
  products: {
    getAll: '/products',
    getById: (id: number) => `/products/${id}`,
    getByReference: (ref: string) => `/products/reference/${ref}`,
    create: '/products',
    update: (id: number) => `/products/${id}`,
    delete: (id: number) => `/products/${id}`,
    updateStock: (id: number) => `/products/${id}/stock`,
    lowStock: '/products/low-stock',
    withSupplier: '/products/with-supplier',
    searchLight: '/products/light',
    getAllKpis: (id: number) => `/products/${id}/kpis/all`,
  },
  suppliers: {
    getAll: '/suppliers',
    getById: (id: number) => `/suppliers/${id}`,
    create: '/suppliers',
    update: (id: number) => `/suppliers/${id}`,
    delete: (id: number) => `/suppliers/${id}`,
  },
  users: {
    getAll: '/users',
    getById: (id: number) => `/users/${id}`,
    create: '/users',
    update: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
  },
  orders: {
    getAll: '/orders',
    getById: (id: number) => `/orders/${id}`,
    getItems: (id: number) => `/orders/${id}/items`,
    getByUser: (userId: number) => `/orders/user/${userId}`,
    getStats: '/orders/stats',
    create: '/orders',
    update: (id: number) => `/orders/${id}`,
    delete: (id: number) => `/orders/${id}`,
  },
  sales: {
    totalRevenue: '/sales/total',
    evolution: '/sales/evolution',
    comparison: '/sales/comparison',
    averageBasket: '/sales/average-basket',
    averageBasketByClientType: '/sales/average-basket-by-client-type',
  },
  stocks: {
    getAll: '/stocks',
    update: (id: number) => `/stocks/${id}`,
  },
} as const;
