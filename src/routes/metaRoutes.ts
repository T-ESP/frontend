import type { RouteMeta } from "./types";

export const ROUTES: Record<string, RouteMeta> = {
  HOME: {
    path: '/',
    label: 'Home',
    page: 'Home',
    icon: 'home',
    restricted: false,
    layout: 'home',
    title: 'StockS',
  },
  LOGIN: {
    path: '/login',
    label: 'Login',
    page: 'Login',
    layout: 'auth',
    restricted: false,
    hiddenInMenu: true,
    title: 'StockS - Connexion',
  },
  DASHBOARD: {
    path: '/dashboard',
    label: 'Dashboard',
    page: 'Dashboard',
    icon: 'dashboard',
    restricted: true,
    roles: ['admin', 'manager'],
    layout: 'app',
    title: 'StockS - Dashboard',
  },
  USERS: {
    path: '/users',
    label: 'Users',
    page: 'Users',
    icon: 'users',
    restricted: true,
    roles: ['admin'],
    layout: 'app',
    title: 'StockS - Utilisateurs',
  },
  NOTFOUND: {
    path: '*',
    label: 'NotFound',
    page: 'NotFound',
    layout: 'app',
    restricted: false,
    title: 'StockS - Page non trouvée',
  },
  PLAYGROUND: {
    path: '/playground',
    label: 'Playground',
    page: 'Playground',
    layout: 'app',
    restricted: false,
    title: 'StockS - Playground',
  },
  displaySite: {
  path: '/DisplaySite',
  label: 'Display Site',
  page: 'DisplaySite',
  layout: 'none', // or 'none' if you want NO layout at all
  restricted: false,
},

};