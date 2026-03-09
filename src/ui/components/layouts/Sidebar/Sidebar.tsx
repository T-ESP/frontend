import { Logo } from "@/ui/components/common/Logo";
import { items } from "@/ui/constants/sidebar/sidebarItem";
import { SidebarSection } from "./SidebarSection";
import type { SidebarProps } from "./Sidebar.types";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { t } = useTranslation();
  const topSections = items.slice(0, 2);
  const bottomSection = items[2] ?? [];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white transition-[width] duration-300 border-r border-gray-100 z-30
      ${isOpen ? "w-64" : "w-20"} flex flex-col`}
    >
      {/* Header */}
      <div className={`flex items-center h-16 ${isOpen ? "px-5 border-b border-gray-100" : "justify-center"}`}>
        <button
          onClick={onToggle}
          className="inline-flex items-center justify-center w-10 h-10 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
          aria-label={isOpen ? t('common.collapse_sidebar', 'Collapse sidebar') : t('common.expand_sidebar', 'Expand sidebar')}
        >
          <Menu className="w-5 h-5" />
        </button>

        {isOpen && (
          <div className="flex items-center gap-2 ml-2 overflow-hidden transition-opacity duration-300">
            <Logo className="w-7 h-7 shrink-0" />
            <span className="text-xl font-extrabold tracking-tight text-gray-900 truncate">
              Stocks
            </span>
          </div>
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
