import { useMemo, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createLoginUserUsecase } from "@/application/usecases/LoginUser/LoginUser";
import type { LoginRequest } from "@/application/usecases/LoginUser/LoginUser.types";
import { HttpLoginUserGateway } from "@/infrastructure/http/loginUserGateway";
import { useToast } from "@/ui/components/common/Toast";
import { Button } from "@/ui/components/common/Button/Button";
import { Checkbox } from "@/ui/components/common/Checkbox/Checkbox";
import { FormField } from "@/ui/components/common/FormField/FormField";
import { Input } from "@/ui/components/common/Input/Input";
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

  const handleRememberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormValues((prev) => ({ ...prev, remember: checked }) as FormValues);
  };

  const handleRememberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setFormValues((prev) => ({ ...prev, remember: !prev.remember }) as FormValues);
    }
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

      // En prod, si on a un slug, rediriger vers slug.stock-s.fr/dashboard?token=xxx
      const baseDomain = import.meta.env.VITE_BASE_DOMAIN;
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

      if (result.slug && baseDomain && !isLocalhost) {
        window.location.href = `https://${result.slug}.${baseDomain}/dashboard?token=${result.token}`;
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
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
      <Input
        id="email"
        name="email"
        type="email"
        label="Email adress"
        autoComplete="email"
        placeholder="you@example.com"
        value={formValues.email}
        onChange={handleInputChange}
        required
      />

      <FormField label="Password">
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={formValues.password}
          onChange={handleInputChange}
          required
        />
      </FormField>

      <Checkbox
        id="remember"
        name="remember"
        label="Remember me"
        className="pt-2"
        checked={formValues.remember}
        onChange={handleRememberChange}
        onKeyDown={handleRememberKeyDown}
      />

      {feedback && (
        <p
          className={`text-sm ${status === "error" ? "text-red-600" : "text-emerald-600"
            }`}
        >
          {feedback}
        </p>
      )}

      <Button type="submit" fullWidth className="mt-2 sm:mt-3" disabled={status === "loading"}>
        {status === "loading" ? "Processing..." : "Log in"}
      </Button>
    </form>
  );
}


