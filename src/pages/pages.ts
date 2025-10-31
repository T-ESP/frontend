import { lazy } from "react";

export const PAGES = {
  Home: lazy(() => import("@/pages/HomePage")),
  Login: lazy(() => import("@/pages/LoginPage")),
  Dashboard: lazy(() => import("@/pages/DashboardPage")),
  Users: lazy(() => import("@/pages/UsersPage")),
  NotFound: lazy(() => import("@/pages/NotFoundPage")),
  Playground: lazy(() => import("@/pages/PlaygroundPage")),
  Inventory: lazy(() => import("@/pages/InventoryPage")),
  Insights: lazy(() => import("@/pages/InsightsPage")),
  Sales: lazy(() => import("@/pages/SalesPage")),
  Clients: lazy(() => import("@/pages/ClientsPage")),
  PricingNewsAlerts: lazy(() => import("@/pages/PricingNewsAlertsPage")),
  Suppliers: lazy(() => import("@/pages/SuppliersPage")),
  AIAssistant: lazy(() => import("@/pages/AIAssistantPage")),
  Team: lazy(() => import("@/pages/TeamPage")),
  Settings: lazy(() => import("@/pages/SettingsPage")),
  Logout: lazy(() => import("@/pages/LogoutPage")),
};
