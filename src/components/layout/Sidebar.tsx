// components/layout/Sidebar.tsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import Logo from "../icons/Logo";

type Item = {
  label: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const items: Item[] = [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "Utilisateurs", to: "/users", icon: Users },
    { label: "Produits", to: "/products", icon: Package },
    { label: "Commandes", to: "/orders", icon: ShoppingCart },
  ];

  return (
    <aside
      className={`relative h-screen bg-white text-white transition-[width] duration-300
      ${isOpen ? "w-64" : "w-16"} flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4">

        <div className="flex items-center gap-2">

          <Logo className="w-10 h-10" />
          {isOpen && <span className="text-xl font-bold text-primary">Stock<span className="text-black">S</span></span>}
        </div>


        <button
          onClick={() => setIsOpen((v) => !v)}
          className="p-1 text-gray-400 hover:text-white transition"
          aria-label={isOpen ? "Replier la sidebar" : "Déplier la sidebar"}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${isOpen ? "" : "rotate-180"}`}
          />
        </button>
      </div>

      {/* Nav */}
      <ul className="flex-1 space-y-1
      flex flex-col items-center
      ">
        {items.map(({ label, to, icon: Icon }) => (
          <li
            key={to}
            className="w-full relative"
          >
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center transition mx-[20%] px-2 py-2 rounded-md
                  ${isActive ? "bg-primary" : ""} ${isOpen ? "gap-3" : "justify-center"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="w-2 h-full bg-primary rounded-md absolute top-0 -left-1" />}
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-black"}`} />
                  {isOpen && <span className={`truncate ${isActive ? "text-white" : "text-black"}`}>{label}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-gray-700">
        <button
          onClick={() => console.log("Déconnexion")}
          className={`flex items-center w-full rounded transition
            text-red-400 hover:text-red-300 hover:bg-gray-700
            ${isOpen ? "gap-3 px-2 py-2" : "justify-center p-2"}`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span className="truncate">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
