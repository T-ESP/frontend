import type { SidebarItemType, SidebarSectionType } from "@/ui/components/layouts/Sidebar/Sidebar.types";
import { Bell, Box, ChartLine, Gift, LayoutDashboard, LogOut, Package, Settings, ShoppingCartIcon, Tag } from "lucide-react";

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
      { label: "sidebar.orders", to: "/orders", icon: Package },
      { label: "sidebar.sales", to: "/sales", icon: ShoppingCartIcon },
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
