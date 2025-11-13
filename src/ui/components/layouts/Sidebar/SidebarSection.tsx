// SidebarSection.tsx
import type { SidebarSectionProps } from "./Sidebar.types";
import { SidebarItem } from "./SidebarItem";

export function SidebarSection({ items, isOpen }: SidebarSectionProps) {
  return (
    <ul className="flex flex-col items-center space-y-1 px-2">
      {items.map((item) => (
        <li key={item.to} className="relative w-full">
          <SidebarItem {...item} isOpen={isOpen} />
        </li>
      ))}
    </ul>
  );
}
