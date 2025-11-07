import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function LoginForm() {
  return (
    <form className="space-y-4 sm:space-y-5">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email adress"
        autoComplete="email"
        placeholder="you@example.com"
      />

      {/* <Input
        id="username"
        name="username"
        type="text"
        label="Username"
        autoComplete="username"
        placeholder="yourusername"
      /> */}

      <FormField
        label="Password"
      // labelRight={
      //   <a href="#" tabIndex={-1} className="text-xs sm:text-sm text-primary hover:text-primaryDark">
      //     Forget password?
      //   </a>
      // }
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
        />
      </FormField>

      <Checkbox
        id="remember"
        name="remember"
        label="Remember me"
        className="pt-2"
      />

      <Button type="submit" fullWidth className="mt-2 sm:mt-3">
        Log in
      </Button>
    </form>
  );
}


