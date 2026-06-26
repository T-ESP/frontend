import type { SidebarItemType, SidebarSectionType } from "@/ui/components/layouts/Sidebar/Sidebar.types";
import { Bell, Box, BarChart2, ChartLine, Gift, LayoutDashboard, List, LogOut, Package, Settings, ShoppingCartIcon, Tag } from "lucide-react";

export const sections: SidebarSectionType[] = [
  {
    label: "sidebar.sections.overview",
    items: [
      { label: "sidebar.dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "sidebar.insights", to: "/insights", icon: ChartLine },
    ],
  },
  {
    label: "sidebar.sections.operations",
    items: [
      { label: "sidebar.inventory", to: "/inventory", icon: Box },
      { label: "sidebar.sales", to: "/sales", icon: ShoppingCartIcon },
    ],
  },
  {
    label: "sidebar.sections.orders",
    items: [
      { label: "sidebar.orders_list", to: "/orders", icon: List },
      { label: "sidebar.orders_kpis", to: "/orders/kpis", icon: BarChart2 },
    ],
  },
  {
    label: "sidebar.sections.engagement",
    items: [
      { label: "sidebar.loyalty", to: "/loyalty", icon: Gift },
      { label: "sidebar.promotions", to: "/promotions", icon: Tag },
      { label: "sidebar.alerts", to: "/alerts", icon: Bell },
    ],
  },
];

export const footerItems: SidebarItemType[] = [
  { label: "sidebar.profile", to: "/profile", icon: Settings },
  { label: "sidebar.logout", to: "/logout", icon: LogOut },
];
