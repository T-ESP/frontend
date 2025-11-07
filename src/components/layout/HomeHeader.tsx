import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import avatarImg from "@/assets/images/BOT.png";

type HomeHeaderProps = {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
};

export function HomeHeader(props: HomeHeaderProps): JSX.Element {
  const { onMenuClick, isSidebarOpen } = props;
  return (
    <header className="flex sticky top-0 z-30 justify-between items-center px-3 h-16 bg-white border-b border-primary-soft md:px-5">
      {/* Menu + Recherche */}
      <div className="flex gap-3 items-center min-w-0 md:gap-4">
        <button
          type="button"
          className="inline-flex justify-center items-center w-9 h-9 text-gray-700 rounded-md hover:bg-gray-100"
          onClick={onMenuClick}
          aria-label={(isSidebarOpen ?? false) ? "Replier la sidebar" : "Déplier la sidebar"}
          aria-pressed={isSidebarOpen ?? false}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 w-[260px] md:w-[360px]">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Actions droites */}
      <div className="flex gap-2 items-center md:gap-4">
        {/* Notifications */}
        <button className="inline-flex relative justify-center items-center w-9 h-9 text-gray-700 rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full">6</span>
        </button>

        {/* Langue */}
        <div className="hidden gap-2 items-center sm:flex">
          <span className="text-lg" aria-hidden>🇬🇧</span>
          <button className="inline-flex gap-1 items-center text-sm text-gray-700 hover:text-gray-900">
            English
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Profil utilisateur */}
        <button className="flex gap-2 items-center py-1 pr-2 pl-1 rounded-full hover:bg-gray-100">
          <img src={avatarImg} alt="Avatar" className="object-cover w-8 h-8 rounded-full" />
          <div className="hidden flex-col items-start leading-tight md:flex">
            <span className="text-sm font-medium text-gray-900">Moni Roy</span>
            <span className="text-[11px] text-gray-500">Admin</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </header>
  );
}