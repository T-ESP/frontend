import { RegisterHeader } from "./components/RegisterHeader";
import { RegisterForm } from "./components/RegisterForm";
import { RegisterFooter } from "./components/RegisterFooter";

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center px-4 py-8 min-h-screen sm:px-6 sm:py-12">
      <div className="z-30 p-6 w-full max-w-md bg-white rounded-xl border shadow-sm sm:p-8 md:max-w-lg border-border">
        <RegisterHeader />

        <RegisterForm />

        <RegisterFooter />
      </div>
    </div>
  );
}






