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
      className={`relative h-screen bg-gray-800 text-white transition-[width] duration-300
      ${isOpen ? "w-64" : "w-16"} flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
          aria-label="Accueil"
        >
          {isOpen && <h2 className="text-xl font-bold truncate">Menu</h2>}
        </button>

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
      <ul className="flex-1 space-y-1 px-2">
        {items.map(({ label, to, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex items-center rounded transition px-2 py-2
                 hover:bg-gray-700 ${isActive ? "bg-gray-700" : ""} ${isOpen ? "gap-3" : "justify-center"
                }`
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="truncate">{label}</span>}
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
