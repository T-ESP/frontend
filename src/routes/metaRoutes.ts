import type { RouteMeta } from "./types";

export const ROUTES: Record<string, RouteMeta> = {
  HOME: {
    path: '/',
    label: 'Home',
    page: 'Home',
    icon: 'home',
    restricted: false,
    layout: 'app',
  },
  LOGIN: {
    path: '/login',
    label: 'Login',
    page: 'Login',
    layout: 'auth',
    restricted: false,
    hiddenInMenu: true,
  },
  DASHBOARD: {
    path: '/dashboard',
    label: 'Dashboard',
    page: 'Dashboard',
    icon: 'dashboard',
    restricted: true,
    roles: ['admin', 'manager'],
    layout: 'app',
  },
  USERS: {
    path: '/users',
    label: 'Users',
    page: 'Users',
    icon: 'users',
    restricted: true,
    roles: ['admin'],
    layout: 'app',
  },
  NOTFOUND: {
    path: '*',
    label: 'NotFound',
    page: 'NotFound',
    layout: 'app',
    restricted: false,
  }
};