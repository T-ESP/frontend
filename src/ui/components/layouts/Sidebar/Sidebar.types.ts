import type React from "react";

export type SidebarItemType = {
  label: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type SidebarSectionType = {
  /** i18n key for the section title (optional: omit for an unlabeled group) */
  label?: string;
  items: SidebarItemType[];
};

export type SidebarItemProps = SidebarItemType & {
  isOpen: boolean;
};

export type SidebarSectionProps = SidebarSectionType & {
  isOpen: boolean;
};
