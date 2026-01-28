import { Link } from "react-router-dom";
import { usePageTitle } from "@/ui/hooks/usePageTitle";
import abstract1 from "@/assets/svg/abstract1.svg";
import abstract2 from "@/assets/svg/abstract2.svg";
import abstract3 from "@/assets/svg/abstract3.svg";
import abstract4 from "@/assets/svg/abstract4.svg";
import illustration404 from "@/assets/svg/404Icon.svg";

export default function NotFoundPage() {
  usePageTitle("StockS - Page introuvable");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#8C74AE]">
      {/* Décors identiques au layout d'authentification */}
      <img src={abstract4} alt="" aria-hidden className="absolute top-0 left-0 z-20 w-[35%]" />
      <img src={abstract3} alt="" aria-hidden className="absolute top-0 right-0 z-20 w-[35%]" />
      <img src={abstract2} alt="" aria-hidden className="absolute bottom-0 right-0 z-20 w-[35%]" />
      <img src={abstract1} alt="" aria-hidden className="absolute bottom-0 left-0 z-20 w-[35%]" />

      <div className="relative z-30 w-full max-w-[420px] rounded-[28px] bg-white p-10 text-center shadow-2xl">
        <img src={illustration404} alt="Illustration 404" className="mx-auto w-56" />
        <h1 className="mt-8 text-2xl font-semibold text-gray-900">Oups, page introuvable</h1>
        <p className="mt-3 text-sm text-gray-500">
          It seems the page you're looking for no longer exists or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex justify-center items-center px-6 mt-8 h-11 text-sm font-medium text-white rounded-md shadow-sm transition bg-primary hover:opacity-90"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}