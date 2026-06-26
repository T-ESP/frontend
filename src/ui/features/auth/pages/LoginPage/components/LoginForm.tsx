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
        <label
          htmlFor="email"
          className="block text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
          style={{ color: "#9ca3af" }}
        >
          Adresse e-mail
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          value={formValues.email}
          onChange={handleInputChange}
          required
          style={{
            height: 42, borderRadius: 12, border: "1.5px solid #e5e7eb",
            background: "#fafafa", fontSize: "0.8rem",
          }}
          className="focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)] focus:bg-white placeholder:text-gray-300"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-[0.65rem] font-semibold uppercase tracking-[0.08em]"
            style={{ color: "#9ca3af" }}
          >
            Mot de passe
          </label>
          <a
            href="#"
            className="text-[0.65rem] font-semibold"
            style={{ color: "#c4b5fd" }}
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
          required
          style={{
            height: 42, borderRadius: 12, border: "1.5px solid #e5e7eb",
            background: "#fafafa", fontSize: "0.8rem",
          }}
          className="focus:border-[#a855f7] focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)] focus:bg-white placeholder:text-gray-300"
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
          className="data-[state=checked]:bg-[#a855f7] data-[state=checked]:border-[#a855f7]"
        />
        <Label
          htmlFor="remember"
          className="text-[0.72rem] font-normal cursor-pointer"
          style={{ color: "#6b7280" }}
        >
          Se souvenir de moi
        </Label>
      </div>

      {/* Feedback */}
      {feedback && (
        <p className={`text-sm font-medium ${
          status === "error" ? "text-red-500" : "text-emerald-500"
        }`}>
          {feedback}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full h-11 font-bold text-white border-none"
        style={{
          borderRadius: 12,
          background: "linear-gradient(135deg, #8b5cf6, #a855f7)",
          fontSize: "0.8rem",
        }}
      >
        {status === "loading" ? "Connexion en cours…" : "Se connecter"}
      </Button>

    </form>
  );
}
