import { Button } from "@/ui/components/common/Button/Button";
import { Checkbox } from "@/ui/components/common/Checkbox/Checkbox";
import { FormField } from "@/ui/components/common/FormField/FormField";
import { Input } from "@/ui/components/common/Input/Input";
import { PasswordInput } from "@/ui/components/common/PasswordInput/PasswordInput";

export function RegisterForm() {
  return (
    <form className="space-y-4 sm:space-y-5">

      <Input
        id="Username"
        name="Username"
        type="text"
        label="Username"
        autoComplete="Username"
        placeholder="yourusername"
      />

      <Input
        id="email"
        name="email"
        type="email"
        label="Email adress"
        autoComplete="email"
        placeholder="you@example.com"
      />

      <FormField
        label="Password"
        labelRight={
          <a
            href="#"
            tabIndex={-1}
            className="text-xs sm:text-sm text-primary hover:text-primaryDark"
          >
            Forget password?
          </a>
        }
      >
        <PasswordInput
          id="password"
          name="Password"
          autoComplete="new-password"
          placeholder="••••••••"
        />
      </FormField>

      <Checkbox
        id="terms"
        name="terms"
        label="I accept terms and conditions"
        className="pt-2"
      />

      <Button type="submit" fullWidth className="mt-2 sm:mt-3">
        Sign up
      </Button>
    </form>
  );
} 