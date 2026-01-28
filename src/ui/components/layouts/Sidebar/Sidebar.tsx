import { Logo } from "@/ui/components/common/Logo";
import { items } from "@/ui/constants/sidebar/sidebarItem";
import { SidebarSection } from "./SidebarSection";
import type { SidebarProps } from "./Sidebar.types";

export function Sidebar({ isOpen }: SidebarProps) {
  const topSections = items.slice(0, 2);
  const bottomSection = items[2] ?? [];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white transition-[width] duration-300 border-r border-gray-200 z-30
      ${isOpen ? "w-64" : "w-16"} flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-4">
        <div className="flex gap-2 items-center">
          <Logo className="w-10 h-10" />
          {isOpen && (
            <span className="text-xl font-bold text-primary">
              Stock<span className="text-black">S</span>
            </span>
          )}
        </div>
      </div>

      {/* Top sections */}
      <div className="overflow-y-auto flex-1 space-y-4">
        {topSections.map((section, index) => (
          <SidebarSection key={index} items={section} isOpen={isOpen} />
        ))}
      </div>

      {/* Bottom section */}
      <div className="px-2 py-4 border-t border-gray-200 space-y-4">
        <SidebarSection items={bottomSection} isOpen={isOpen} />
      </div>
    </aside>
  );
}
