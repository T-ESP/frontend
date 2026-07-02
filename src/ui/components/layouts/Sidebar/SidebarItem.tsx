// SidebarItem.tsx
import { NavLink } from "react-router-dom";
import type { SidebarItemProps } from "./Sidebar.types";
import { useTranslation } from "react-i18next";


import { ChevronRight } from "lucide-react";

export function SidebarItem({ label, to, icon: Icon, isOpen }: SidebarItemProps) {
  const { t } = useTranslation();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center justify-between transition-colors px-3 py-2 rounded-md
         ${isActive ? "bg-[#e4e4e7]" : "hover:bg-black/5"} ${isOpen ? "mx-3 gap-0" : "mx-auto justify-center w-10 h-10"}`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            <Icon
              className={`h-[18px] w-[18px] shrink-0 stroke-[1.5] transition-colors ${
                isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
              }`}
            />
            {isOpen && (
              <span
                className={`truncate text-sm transition-colors ${
                  isActive ? "text-gray-900 font-medium" : "text-gray-600 font-medium group-hover:text-gray-900"
                }`}
              >
                {t(label)}
              </span>
            )}
          </div>
          {isOpen && !isActive && (
            <ChevronRight className="w-4 h-4 text-gray-400 opacity-50 flex-shrink-0" />
          )}
        </>
      )}
    </NavLink>
  );
}
