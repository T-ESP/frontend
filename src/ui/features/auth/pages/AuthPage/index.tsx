import { LoginForm } from "../LoginPage/components/LoginForm";
import { Logo } from "@/ui/components/common/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/components/ui/card";

export default function AuthPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ── Panneau gauche (caché sur mobile) ── */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 text-white"
        style={{ background: "hsl(var(--primary))" }}
      >
        {/* Logo en haut */}
        <div className="flex items-center gap-2">
          <Logo className="w-6 h-6 brightness-0 invert opacity-90" />
          <span className="text-sm font-semibold tracking-tight opacity-90">Stocks</span>
        </div>

        {/* Illustration centrale */}
        <div className="flex justify-center items-center flex-1 py-12">
          <Logo
            className="w-52 h-52 opacity-20"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>

        {/* Citation en bas */}
        <blockquote className="space-y-2">
          <p className="text-sm leading-relaxed opacity-80">
            "Gérez vos stocks, vos commandes et vos fournisseurs depuis un seul endroit."
          </p>
        </blockquote>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="flex flex-col items-center justify-center px-4 py-12 bg-[hsl(var(--background))]">

        {/* Logo visible sur mobile uniquement */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <Logo className="w-5 h-5 text-[hsl(var(--primary))]" />
          <span className="text-base font-semibold tracking-tight">Stocks</span>
        </div>

        <Card className="w-full max-w-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Bon retour</CardTitle>
            <CardDescription>
              Connectez-vous à votre espace de travail
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
