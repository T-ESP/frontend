import { lazy } from "react";

export const PAGES = {
  Home: lazy(() => import("@/pages/HomePage")),
  Login: lazy(() => import("@/pages/LoginPage")),
  Dashboard: lazy(() => import("@/pages/DashboardPage")),
  Users: lazy(() => import("@/pages/UsersPage")),
  NotFound: lazy(() => import("@/pages/NotFoundPage")),
  Playground: lazy(() => import("@/pages/PlaygroundPage")),
  DisplaySite: lazy(() => import("@/pages/DisplaySite/Index")),
};
