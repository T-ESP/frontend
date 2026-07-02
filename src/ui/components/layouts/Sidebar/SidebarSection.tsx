// SidebarSection.tsx
import type { SidebarSectionProps } from "./Sidebar.types";
import { SidebarItem } from "./SidebarItem";

export function SidebarSection({ items, isOpen }: SidebarSectionProps) {
  return (
    <ul className="flex flex-col space-y-1.5 w-full">
      {items.map((item) => (
        <li key={item.to} className="relative w-full">
          <SidebarItem {...item} isOpen={isOpen} />
        </li>
      ))}
    </ul>
  );
}
