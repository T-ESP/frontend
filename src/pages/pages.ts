import { lazy } from "react";

export const PAGES = {
  Home: lazy(() => import("@/ui/features/home/pages/HomePage")),
  Login: lazy(() => import("@/ui/features/auth/pages/LoginPage")),
  Register: lazy(() => import("@/ui/features/auth/pages/RegisterPage")),
  Dashboard: lazy(() => import("@/ui/features/dashboard/pages/DashboardPage")),
  Users: lazy(() => import("@/ui/features/team/pages/UsersPage")),
  NotFound: lazy(() => import("@/pages/NotFoundPage")),
  Playground: lazy(() => import("@/pages/PlaygroundPage")),
  Inventory: lazy(() => import("@/ui/features/inventory/pages/InventoryPage")),
  Insights: lazy(() => import("@/ui/features/insights/pages/InsightsPage")),
  Sales: lazy(() => import("@/ui/features/sales/pages/SalesPage")),
  Clients: lazy(() => import("@/pages/ClientsPage")),
  PricingNewsAlerts: lazy(() => import("@/pages/PricingNewsAlertsPage")),
  Suppliers: lazy(() => import("@/ui/features/suppliers/pages/SuppliersPage")),
  Orders: lazy(() => import("@/ui/features/orders/pages/OrdersPage")),
  AIAssistant: lazy(() => import("@/ui/features/ai-assistant/pages/AIAssistantPage")),
  Team: lazy(() => import("@/ui/features/team/pages/TeamPage")),
  Settings: lazy(() => import("@/ui/features/settings/pages/SettingsPage")),
  Logout: lazy(() => import("@/ui/features/auth/pages/LogoutPage")),
};
