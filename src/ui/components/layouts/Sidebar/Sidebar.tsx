import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronsUpDown, MoreVertical, User, LogOut } from "lucide-react";

import { Logo } from "@/ui/components/common/Logo";
import { sections, footerItems } from "@/ui/constants/sidebar/sidebarItem";
import { ROUTES } from "@/ui/routing/metaRoutes";
import type { SidebarSectionType } from "./Sidebar.types";

const allDestinations = [
  ...sections.flatMap((section) => section.items.map((item) => item.to)),
  ...footerItems.map((item) => item.to),
];

// path -> roles autorisés (undefined = accessible à tout utilisateur connecté)
const ROLES_BY_PATH = new Map(
  Object.values(ROUTES).map((route) => [route.path, route.roles]),
);

function isVisibleForRole(to: string, role: string): boolean {
  const roles = ROLES_BY_PATH.get(to);
  return !roles || roles.includes(role);
}

function filterSections(items: SidebarSectionType[], role: string): SidebarSectionType[] {
  return items
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => isVisibleForRole(item.to, role)),
    }))
    .filter((section) => section.items.length > 0);
}
import { useAuth } from "@/ui/features/auth/hooks/useAuth";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SidebarItemType } from "./Sidebar.types";

function pathMatches(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

function isItemActive(pathname: string, to: string) {
  if (!pathMatches(pathname, to)) return false;
  // Only the most specific matching route wins, so a parent item like
  // "/orders" isn't highlighted while on a child route like "/orders/kpis".
  return !allDestinations.some(
    (other) =>
      other !== to && other.startsWith(`${to}/`) && pathMatches(pathname, other),
  );
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

function getInitials(firstname: string, lastname: string, email: string) {
  const f = firstname.trim();
  const l = lastname.trim();
  if (f || l) return `${f.charAt(0)}${l.charAt(0)}`.toUpperCase();
  return email.charAt(0).toUpperCase() || "?";
}

function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { firstname, lastname, email } = useAuth();

  const fullName = `${firstname} ${lastname}`.trim() || email || t("sidebar.profile");
  const initials = getInitials(firstname, lastname, email);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" tooltip={fullName}>
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                {initials}
              </div>
              <div className="flex min-w-0 flex-col items-start leading-tight">
                <span className="truncate text-sm font-medium">{fullName}</span>
                {email && (
                  <span className="max-w-[140px] truncate text-[12px] text-sidebar-foreground/60">
                    {email}
                  </span>
                )}
              </div>
              <MoreVertical className="ml-auto size-4 shrink-0 text-sidebar-foreground/50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={8}
            className="min-w-56"
          >
            <DropdownMenuLabel className="flex flex-col">
              <span className="truncate text-sm font-medium">{fullName}</span>
              {email && (
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {email}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <User className="size-4" />
              {t("sidebar.profile")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/logout")}
              className="text-rose-600 dark:text-rose-400 focus:text-rose-600 dark:text-rose-400"
            >
              <LogOut className="size-4" />
              {t("sidebar.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function Sidebar() {
  const { t } = useTranslation();
  const { toggleSidebar } = useSidebar();
  const { role } = useAuth();

  const visibleSections = filterSections(sections, role);
  const visibleFooterItems = footerItems.filter((item) => isVisibleForRole(item.to, role));

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

      <SidebarContent data-tour="nav">
        {visibleSections.map((section, index) => (
          <SidebarGroup key={section.label ?? index}>
            {section.label && (
              <SidebarGroupLabel>{t(section.label)}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <NavItem key={item.to} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        {visibleFooterItems.length > 0 && (
          <SidebarMenu>
            {visibleFooterItems.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </SidebarMenu>
        )}

        <UserMenu />
      </SidebarFooter>
    </SidebarRoot>
  );
}
