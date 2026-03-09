import { Logo } from "@/ui/components/common/Logo";
import { items } from "@/ui/constants/sidebar/sidebarItem";
import { SidebarSection } from "./SidebarSection";
import type { SidebarProps } from "./Sidebar.types";

export function Sidebar({ isOpen }: SidebarProps) {
  const topSections = items.slice(0, 2);
  const bottomSection = items[2] ?? [];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white transition-[width] duration-300 border-r border-gray-100 z-30
      ${isOpen ? "w-64" : "w-20"} flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center px-6 py-8 ${isOpen ? "gap-3" : "justify-center"}`}>
        <Logo className="w-8 h-8 shrink-0" />
        {isOpen && (
          <span className="text-xl font-extrabold tracking-tight text-gray-900 truncate">
            Stocks
          </span>
        )}
      </div>

      {/* Top sections */}
      <div className="overflow-y-auto flex-1 py-2 space-y-6">
        {topSections.map((section, index) => (
          <SidebarSection key={index} items={section} isOpen={isOpen} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="py-4 border-t border-gray-100 space-y-4">
        <SidebarSection items={bottomSection} isOpen={isOpen} />
      </div>
    </aside>
  );
}
