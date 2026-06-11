import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createLoginUserUsecase } from "@/application/usecases/LoginUser/LoginUser";
import type { LoginRequest } from "@/application/usecases/LoginUser/LoginUser.types";
import { HttpLoginUserGateway } from "@/infrastructure/http/loginUserGateway";
import { useToast } from "@/ui/components/common/Toast";
import { Button } from "@/ui/components/ui/button";
import { Input } from "@/ui/components/ui/input";
import { Label } from "@/ui/components/ui/label";
import { Checkbox } from "@/ui/components/ui/checkbox";
import { PasswordInput } from "@/ui/components/common/PasswordInput/PasswordInput";

const INITIAL_VALUES = {
  email: "",
  password: "",
  remember: false,
};

type FormValues = typeof INITIAL_VALUES;

export function LoginForm() {
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_VALUES);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const navigate = useNavigate();
  const { addToast } = useToast();
  const gateway = useMemo(() => new HttpLoginUserGateway(), []);
  const loginUser = useMemo(() => createLoginUserUsecase(gateway), [gateway]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }) as FormValues);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setStatus("loading");

    const payload: LoginRequest = {
      email: formValues.email,
      password: formValues.password,
    };

    try {
      const result = await loginUser(payload);
      setStatus("success");
      setFeedback(result.message ?? "Login successful.");

      addToast(
        "Login successful",
        "You are now logged in. You can now access the dashboard.",
        "success"
      );

      const baseDomain = import.meta.env.VITE_BASE_DOMAIN;
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (result.slug && baseDomain && !isLocalhost) {
        const targetUrl = `https://${result.slug}.${baseDomain}/dashboard?token=${result.token}`;
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_firstname");
        localStorage.removeItem("auth_lastname");
        localStorage.removeItem("auth_email");
        localStorage.removeItem("commerce_id");
        localStorage.removeItem("commerce_slug");
        window.location.href = targetUrl;
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      setStatus("error");
      const message = error instanceof Error ? error.message : "An error occurred.";
      setFeedback(message);
      addToast("Login error", message, "error");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
          Adresse e-mail
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={formValues.email}
          onChange={handleInputChange}
          className="h-10 text-gray-900 placeholder:text-gray-400 border-gray-300 focus-visible:ring-[#7b5fa2]/40"
          required
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
            Mot de passe
          </Label>
          <a
            href="#"
            className="text-xs text-gray-400 hover:text-[#7b5fa2] transition-colors font-medium"
          >
            Mot de passe oublié ?
          </a>
        </div>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formValues.password}
          onChange={handleInputChange}
          className="h-10 text-gray-900 placeholder:text-gray-400 border-gray-300 focus-visible:ring-[#7b5fa2]/40"
          required
        />
      </div>

      {/* Remember me */}
      <div className="flex items-center gap-2.5">
        <Checkbox
          id="remember"
          checked={formValues.remember}
          onCheckedChange={(checked) =>
            setFormValues((prev) => ({ ...prev, remember: !!checked }))
          }
        />
        <Label
          htmlFor="remember"
          className="text-sm font-normal text-gray-600 cursor-pointer"
        >
          Se souvenir de moi
        </Label>
      </div>

      {/* Feedback */}
      {feedback && (
        <p
          className={`text-sm font-medium ${
            status === "error" ? "text-red-600" : "text-emerald-600"
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full h-10 font-semibold mt-1"
        style={{ backgroundColor: "#7b5fa2" }}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Connexion en cours…" : "Se connecter"}
      </Button>
    </form>
  );
}
