import { LoginHeader } from "./components/LoginHeader";
import { LoginForm } from "./components/LoginForm";
import { LoginFooter } from "./components/LoginFooter";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center px-4 py-8 min-h-screen">
      <div className="z-30 p-6 w-full max-w-md bg-white rounded-xl border shadow-sm md:max-w-lg border-border sm:p-8">
        <LoginHeader />

        <LoginForm />

        <LoginFooter />
      </div>
    </div>
  );
}
