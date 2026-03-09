// Sidebar.types.ts
import type React from "react";

export type SidebarItemType = {
  label: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type SidebarItemProps = {
  label: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isOpen: boolean;
};

export type SidebarSectionProps = {
  items: Omit<SidebarItemProps, 'isOpen'>[];
  isOpen: boolean;
};

export type SidebarProps = {
  isOpen: boolean;
  onToggle: () => void;
};
