import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ChevronLeft,
  LogOut,
} from "lucide-react";

export function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    console.log("Déconnexion");
  };

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Utilisateurs", href: "/users", icon: Users },
    { label: "Produits", href: "/products", icon: Package },
    { label: "Commandes", href: "/orders", icon: ShoppingCart },
  ];

  return (
    <aside
      className={`relative h-screen bg-gray-800 text-white transition-all duration-300 
        ${isOpen ? "w-64" : "w-16"} flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4">
        <div
          onClick={handleLogoClick}
          className="cursor-pointer flex items-center gap-2"
        >
          {isOpen && <h2 className="text-xl font-bold truncate">Menu</h2>}
        </div>

        <ChevronLeft
          onClick={() => setIsOpen(!isOpen)}
          className={`h-5 w-5 cursor-pointer text-gray-400 hover:text-white 
            transform transition-transform ${isOpen ? "" : "rotate-180"}`}
        />
      </div>

      {/* Navigation */}
      <ul className="flex-1 space-y-2 px-2">
        {menuItems.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a
              href={href}
              className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-700 transition"
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="truncate">{label}</span>}
            </a>
          </li>
        ))}
      </ul>

      {/* Déconnexion en bas */}
      <div className="px-2 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full rounded hover:bg-gray-700 transition text-red-400 hover:text-red-300
            ${isOpen ? "px-2 py-2" : "justify-center p-2"}`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {isOpen && <span className="truncate">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
