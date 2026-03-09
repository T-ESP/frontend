import { lazy } from "react";

export const PAGES = {
  Home: lazy(() => import("@/ui/features/home/pages/HomePage")),
  DisplaySite: lazy(() => import("@/ui/features/home/pages/HomePage")),
  Pricing: lazy(() => import("@/ui/features/home/pages/PricingPage")),
  Terms: lazy(() => import("@/ui/features/home/pages/TermsPage")),
  Login: lazy(() =>
    import("@/ui/features/auth/pages/AuthPage").then((m) => ({
      default: () => m.default({ initialMode: "login" }),
    }))
  ),
  Register: lazy(() =>
    import("@/ui/features/auth/pages/AuthPage").then((m) => ({
      default: () => m.default({ initialMode: "register" }),
    }))
  ),
  Dashboard: lazy(() => import("@/ui/features/dashboard/pages/DashboardPage")),
  Users: lazy(() => import("@/ui/features/team/pages/UsersPage")),
  NotFound: lazy(() => import("@/ui/pages/NotFoundPage")),
  Playground: lazy(() => import("@/ui/pages/PlaygroundPage")),
  Inventory: lazy(() => import("@/ui/features/inventory/pages/InventoryPage")),
  Insights: lazy(() => import("@/ui/features/insights/pages/InsightsPage")),
  Sales: lazy(() => import("@/ui/features/sales/pages/SalesPage")),
  Clients: lazy(() => import("@/ui/features/clients/pages/ClientsPage")),
  PricingNewsAlerts: lazy(() => import("@/ui/features/pricing/pages/PricingNewsAlertsPage")),
  Suppliers: lazy(() => import("@/ui/features/suppliers/pages/SuppliersPage")),
  Orders: lazy(() => import("@/ui/features/orders/pages/OrdersPage")),
  AIAssistant: lazy(() => import("@/ui/features/ai-assistant/pages/AIAssistantPage")),
  Team: lazy(() => import("@/ui/features/team/pages/TeamPage")),
  Settings: lazy(() => import("@/ui/features/settings/pages/SettingsPage")),
  Profile: lazy(() => import("@/ui/features/profile/pages/ProfilePage")),
  Logout: lazy(() => import("@/ui/features/auth/pages/LogoutPage")),
};
