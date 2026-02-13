// SidebarItem.tsx
import { NavLink } from "react-router-dom";
import type { SidebarItemProps } from "./Sidebar.types";
import { useTranslation } from "react-i18next";

export function SidebarItem({ label, to, icon: Icon, isOpen }: SidebarItemProps) {
  const { t } = useTranslation();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center transition mx-[20%] px-2 py-2 rounded-md
         ${isActive ? "bg-primary" : ""} ${isOpen ? "gap-3" : "justify-center"}`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div className="absolute top-0 -left-1 w-2 h-full rounded-md bg-primary" />
          )}

          <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-black"}`} />

          {isOpen && (
            <span className={`truncate ${isActive ? "text-white" : "text-black"}`}>
              {t(label)}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
