import type { SidebarItemType, SidebarSectionType } from "@/ui/components/layouts/Sidebar/Sidebar.types";
import { BarChart2, Bell, Box, Brain, ChartLine, Gift, LayoutDashboard, List, LogOut, ScanLine, Settings, ShoppingCartIcon, Tag, UserCog, Users } from "lucide-react";

export const sections: SidebarSectionType[] = [
  {
    label: "sidebar.sections.overview",
    items: [
      { label: "sidebar.dashboard", to: "/dashboard", icon: LayoutDashboard },
      { label: "sidebar.insights", to: "/insights", icon: ChartLine },
      { label: "sidebar.predictions", to: "/predictions", icon: Brain },
    ],
  },
  {
    label: "sidebar.sections.operations",
    items: [
      { label: "sidebar.caisse", to: "/caisse", icon: ScanLine },
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
      { label: "sidebar.users", to: "/users", icon: Users },
      { label: "sidebar.team", to: "/staff", icon: UserCog },
    ],
  },
];

export const footerItems: SidebarItemType[] = [
  { label: "sidebar.profile", to: "/profile", icon: Settings },
  { label: "sidebar.logout", to: "/logout", icon: LogOut },
];
