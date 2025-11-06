import { usePageTitle } from '@/hooks/usePageTitle';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import abstract1 from '@/assets/svg/abstract1.svg';
import abstract2 from '@/assets/svg/abstract2.svg';
import abstract3 from '@/assets/svg/abstract3.svg';
import abstract4 from '@/assets/svg/abstract4.svg';

type AuthLayoutProps = {
  children?: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  usePageTitle("StockS - Connexion");

  return (
    <div className="flex overflow-hidden relative justify-center items-center min-h-screen">
      {/* SVG decorations */}
      <img
        src={abstract4}
        alt=""
        className="absolute top-0 left-0 z-20 w-[35%]"
        aria-hidden="true"
      />
      <img
        src={abstract3}
        alt=""
        className="absolute top-0 right-0 z-20 w-[35%]"
        aria-hidden="true"
      />
      <img
        src={abstract2}
        alt=""
        className="absolute right-0 bottom-0 z-20 w-[35%]"
        aria-hidden="true"
      />
      <img
        src={abstract1}
        alt=""
        className="absolute bottom-0 left-0 z-20 w-[35%]"
        aria-hidden="true"
      />

      <div className="relative p-6 w-full bg-[#8C74AE]">
        {children ?? <Outlet />}
      </div>
    </div>
  );
}
