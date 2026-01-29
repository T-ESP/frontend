import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { createRegisterUserUsecase } from "@/application/usecases/RegisterUser/RegisterUser";
import type { RegisterRequest } from "@/application/usecases/RegisterUser/RegisterUser.types";
import { HttpRegisterUserGateway } from "@/infrastructure/http/registerUserGateway";
import { Button } from "@/ui/components/common/Button/Button";
import { Checkbox } from "@/ui/components/common/Checkbox/Checkbox";
import { FormField } from "@/ui/components/common/FormField/FormField";
import { Input } from "@/ui/components/common/Input/Input";
import { PasswordInput } from "@/ui/components/common/PasswordInput/PasswordInput";
import { useToast } from "@/ui/components/common/Toast";

const INITIAL_VALUES = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  terms: false,
};

type FormValues = typeof INITIAL_VALUES;

export function RegisterForm() {
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_VALUES);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  const { addToast } = useToast();
  const gateway = useMemo(() => new HttpRegisterUserGateway(), []);
  const registerUser = useMemo(() => createRegisterUserUsecase(gateway), [gateway]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }) as FormValues);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: checked }) as FormValues);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!formValues.terms) {
      setStatus("error");
      setFeedback("You must accept the terms and conditions.");
      return;
    }

    setStatus("loading");

    const payload: RegisterRequest = {
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      email: formValues.email,
      password: formValues.password,
    };

    try {
      const result = await registerUser(payload);
      setStatus("success");
      setFeedback(result.message ?? "Account created successfully.");
      addToast(
        "Account created",
        "Your account has been created successfully. You can now log in.",
        "success"
      );
      setFormValues(INITIAL_VALUES);
    } catch (error) {
      setStatus("error");
      const message = error instanceof Error ? error.message : "An error occurred.";
      setFeedback(message);
      addToast(
        "Registration error",
        message,
        "error"
      );
    }
  };

  return (
    <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
      <Input
        id="firstname"
        name="firstname"
        type="text"
        label="First name"
        autoComplete="given-name"
        placeholder="John"
        value={formValues.firstname}
        onChange={handleInputChange}
        required
      />

      <Input
        id="lastname"
        name="lastname"
        type="text"
        label="Last name"
        autoComplete="family-name"
        placeholder="Doe"
        value={formValues.lastname}
        onChange={handleInputChange}
        required
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email address"
        autoComplete="email"
        placeholder="john.doe@example.com"
        value={formValues.email}
        onChange={handleInputChange}
        required
      />

      <FormField label="Password">
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={formValues.password}
          onChange={handleInputChange}
          required
        />
      </FormField>

      <Checkbox
        id="terms"
        name="terms"
        label="I accept terms and conditions"
        className="pt-2"
        checked={formValues.terms}
        onChange={handleCheckboxChange}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            setFormValues((prev) => ({
              ...prev,
              terms: !prev.terms,
            }) as FormValues);
          }
        }}
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
        {status === "loading" ? "Processing..." : "Sign up"}
      </Button>
    </form>
  );
}