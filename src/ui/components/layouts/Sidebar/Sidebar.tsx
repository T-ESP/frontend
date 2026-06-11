import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, MoreVertical } from "lucide-react";

import { Logo } from "@/ui/components/common/Logo";
import { items } from "@/ui/constants/sidebar/sidebarItem";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { SidebarItemType } from "./Sidebar.types";

function isItemActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

function NavItem({ item }: { item: SidebarItemType }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const active = isItemActive(pathname, item.to);
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={active} tooltip={t(item.label)}>
        <NavLink to={item.to}>
          <Icon />
          <span>{t(item.label)}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function Sidebar() {
  const { toggleSidebar } = useSidebar();
  const [primarySection = [], secondarySection = [], footerSection = []] = items;
  const groupSections = [primarySection, secondarySection].filter(
    (section) => section.length > 0
  );

  return (
    <SidebarRoot collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={toggleSidebar} tooltip="StockS">
              <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                <Logo className="w-5 h-5" />
              </div>
              <span className="font-semibold tracking-tight">StockS</span>
              <ChevronsUpDown className="ml-auto size-4 text-sidebar-foreground/50" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {groupSections.map((section, index) => (
          <SidebarGroup key={index}>
            {index === 0 && <SidebarGroupLabel>Dashboards</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.map((item) => (
                  <NavItem key={item.to} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {footerSection.length > 0 && (
          <SidebarMenu>
            {footerSection.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Toby Belhome">
              <div className="size-8 shrink-0 overflow-hidden rounded-full border border-sidebar-border bg-blue-50">
                <img
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Toby&backgroundColor=e2e8f0"
                  alt="User"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-col items-start leading-tight">
                <span className="text-sm font-medium">Toby Belhome</span>
                <span className="max-w-[140px] truncate text-[12px] text-sidebar-foreground/60">
                  hello@tobybelhome.com
                </span>
              </div>
              <MoreVertical className="ml-auto size-4 shrink-0 text-sidebar-foreground/50" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarRoot>
  );
}
