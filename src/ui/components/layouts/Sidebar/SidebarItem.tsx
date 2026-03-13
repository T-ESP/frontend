// SidebarItem.tsx
import { NavLink } from "react-router-dom";
import type { SidebarItemProps } from "./Sidebar.types";
import { useTranslation } from "react-i18next";

const BRAND = "#7b5fa2";

export function SidebarItem({ label, to, icon: Icon, isOpen }: SidebarItemProps) {
  const { t } = useTranslation();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center transition-all duration-200 mx-3 px-3 py-3 rounded-xl
         ${isActive ? "bg-[#f4f0f9]" : "hover:bg-gray-50"} ${isOpen ? "gap-4" : "justify-center"}`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {isActive && (
            <div
              className="absolute top-1/2 -left-3 -translate-y-1/2 w-1 h-8 rounded-r-md"
              style={{ backgroundColor: BRAND }}
            />
          )}

          <Icon
            className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "" : "text-gray-400 group-hover:text-gray-600"
              }`}
            style={isActive ? { color: BRAND } : {}}
          />

          {isOpen && (
            <span
              className={`truncate font-medium text-sm transition-colors ${isActive ? "" : "text-gray-600 group-hover:text-gray-900"
                }`}
              style={isActive ? { color: BRAND } : {}}
            >
              {t(label)}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
