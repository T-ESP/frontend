import { Logo } from "@/ui/components/common/Logo";
import { items } from "@/ui/constants/sidebar/sidebarItem";
import { SidebarSection } from "./SidebarSection";
import type { SidebarProps } from "./Sidebar.types";
import { ChevronsUpDown, MoreVertical } from "lucide-react";

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const topSections = items.slice(0, 2);
  const bottomSection = items[2] ?? [];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#fafafa] transition-[width] duration-300 border-r border-gray-200 z-30
      ${isOpen ? "w-[260px]" : "w-[72px]"} flex flex-col`}
    >
      {/* Header */}
      <div className={`p-4 mt-1 mb-1 ${!isOpen && "flex justify-center"}`}>
        {isOpen ? (
          <button onClick={onToggle} className="flex items-center justify-between w-full hover:bg-black/5 p-2 rounded-lg transition-colors -m-2">
            <div className="flex items-center gap-3">
              <div className="rounded-[8px] w-8 h-8 flex items-center justify-center shrink-0">
                <Logo className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[15px] text-gray-900 tracking-tight">StockS</span>
            </div>
            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
          </button>
        ) : (
          <button onClick={onToggle} className="rounded-lg w-8 h-8 flex items-center justify-center shrink-0 hover:opacity-80 transition-opacity">
            <Logo className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1 flex flex-col gap-6 py-2 pb-6">
        {topSections.map((section, index) => (
          <div key={index}>
            {isOpen && index === 0 && <span className="px-5 text-xs font-medium text-gray-400 mb-2 block">Dashboards</span>}
            <SidebarSection items={section} isOpen={isOpen} />
          </div>
        ))}


      </div>

      {/* Bottom section & Profile */}
      <div className={`p-4 border-t border-gray-100 ${isOpen ? "" : "flex flex-col items-center gap-2"}`}>
        {bottomSection.length > 0 && <SidebarSection items={bottomSection} isOpen={isOpen} />}

        <div className={`mt-2 flex items-center ${isOpen ? "justify-between p-2 hover:bg-black/5 rounded-lg transition-colors cursor-pointer -mx-2" : "justify-center mt-4"}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Toby&backgroundColor=e2e8f0" alt="User" className="w-full h-full object-cover" />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900 leading-none">Toby Belhome</span>
                <span className="text-[12px] text-gray-500 mt-1 truncate max-w-[130px]">hello@tobybelhome.com</span>
              </div>
            )}
          </div>
          {isOpen && <MoreVertical className="w-4 h-4 text-gray-400 shrink-0" />}
        </div>
      </div>
    </aside>
  );
}
