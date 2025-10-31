import type { Item } from "@/types/sidebar";
import { Bell, Box, Brain, ChartLine, LayoutDashboard, LogOut, Settings, ShoppingCartIcon, Truck, Users } from "lucide-react";

export const items: Item[][] = [
  [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Inventory", to: "/inventory", icon: Box },
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