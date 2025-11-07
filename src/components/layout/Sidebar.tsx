// components/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import Logo from "../icons/Logo";
import { items } from "@/constants/sidebar/sidebarItem";

type SidebarProps = {
  isOpen: boolean;
};

export function Sidebar({ isOpen }: SidebarProps) {

  // Dashboard, invetory, sales, insights, clients

  // pricing news & alerts, siplliers, ai assistant, team

  // Setting, logout



  const topSections = items.slice(0, 2);
  const bottomSection = items[2] ?? [];

  return (
    <aside
      className={`relative h-screen bg-white text-white transition-[width] duration-300 border-r border-gray-200
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

      {/* Nav (sections du haut) */}
      <div className="overflow-y-auto flex-1">
        {topSections.map((section, index) => (
          <div key={index} className="px-2">
            <ul className="flex flex-col items-center space-y-1">
              {section.map(({ label, to, icon: Icon }) => (
                <li key={to} className="relative w-full">
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
                        <Icon
                          className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-black"}`}
                        />
                        {isOpen && (
                          <span className={`truncate ${isActive ? "text-white" : "text-black"}`}>
                            {label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
            {index < topSections.length - 1 && (
              <div className="mx-4 my-3 h-px bg-gray-200" />
            )}
          </div>
        ))}
      </div>

      {/* Section du bas (3e section) */}
      <div className="px-2 py-4 border-t border-gray-200">
        <ul className="flex flex-col items-center space-y-1">
          {bottomSection.map(({ label, to, icon: Icon }) => (
            <li key={to} className="relative w-full">
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
                    <Icon
                      className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-black"}`}
                    />
                    {isOpen && (
                      <span className={`truncate ${isActive ? "text-white" : "text-black"}`}>
                        {label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
