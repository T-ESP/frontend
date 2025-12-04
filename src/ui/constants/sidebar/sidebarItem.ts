import type { SidebarItemType } from "@/ui/components/layouts/Sidebar/Sidebar.types";
import { Bell, Box, Brain, ChartLine, LayoutDashboard, LogOut, Package, Settings, ShoppingCartIcon, Truck, Users } from "lucide-react";

export const items: SidebarItemType[][] = [
  [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Inventory", to: "/inventory", icon: Box },
    { label: "Orders", to: "/orders", icon: Package },
    { label: "Insights", to: "/insights", icon: ChartLine },
    { label: "Sales", to: "/sales", icon: ShoppingCartIcon },
    { label: "Clients", to: "/clients", icon: Users }
  ],
  [
    { label: "Pricing News & Alerts", to: "/pricing-news-alerts", icon: Bell },
    { label: "Suppliers", to: "/suppliers", icon: Truck },
    { label: "AI Assistant", to: "/ai-assistant", icon: Brain },
    { label: "Team", to: "/team", icon: Users }
  ],
  [
    { label: "Settings", to: "/settings", icon: Settings },
    { label: "Logout", to: "/logout", icon: LogOut }
  ]
];