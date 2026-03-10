import type { SidebarItemType } from "@/ui/components/layouts/Sidebar/Sidebar.types";
import { Box, Brain, ChartLine, LayoutDashboard, LogOut, Package, Settings, ShoppingCartIcon, CreditCard } from "lucide-react";

export const items: SidebarItemType[][] = [
  [
    { label: "sidebar.dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "sidebar.inventory", to: "/inventory", icon: Box },
    { label: "sidebar.orders", to: "/orders", icon: Package },
    { label: "sidebar.insights", to: "/insights", icon: ChartLine },
    { label: "sidebar.sales", to: "/sales", icon: ShoppingCartIcon },
    { label: "sidebar.ai_assistant", to: "/ai-assistant", icon: Brain },
  ],
  [
    // { label: "sidebar.pricing_news", to: "/pricing-news-alerts", icon: Bell },
    // { label: "sidebar.suppliers", to: "/suppliers", icon: Truck },
    // { label: "sidebar.team", to: "/team", icon: Users }
  ],
  [
    { label: "sidebar.pricing", to: "/abonnement", icon: CreditCard },
    { label: "sidebar.profile", to: "/profile", icon: Settings },
    { label: "sidebar.logout", to: "/logout", icon: LogOut }
  ]
];