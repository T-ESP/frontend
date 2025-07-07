import type { RouteMeta } from "./types";

export const ROUTES: Record<string, RouteMeta> = {
  HOME: {
    path: '/',
    label: 'Accueil',
    icon: 'home',
    restricted: false,
    layout: 'app',
  },
  LOGIN: {
    path: '/login',
    label: 'Connexion',
    layout: 'auth',
    restricted: false,
    hiddenInMenu: true,
  },
  DASHBOARD: {
    path: '/dashboard',
    label: 'Tableau de bord',
    icon: 'dashboard',
    restricted: true,
    roles: ['admin', 'manager'],
    layout: 'app',
  },
  USERS: {
    path: '/users',
    label: 'Utilisateurs',
    icon: 'users',
    restricted: true,
    roles: ['admin'],
    layout: 'app',
  },
};
