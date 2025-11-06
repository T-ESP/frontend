export default function LoginPage() {
  return (
    <div className="flex justify-center items-center px-4 py-8 min-h-screen">
      <div className="p-6 w-full max-w-md bg-white rounded-xl border shadow-sm border-border sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-neutral900">Create an Account</h1>
          <p className="mt-1 text-sm text-neutral700">Create a account to continue</p>
        </div>

        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-neutral900">
              Email adress
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="px-3 py-2 w-full text-sm rounded-lg border outline-none border-border focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="username" className="block mb-1 text-sm font-medium text-neutral900">
              username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="px-3 py-2 w-full text-sm rounded-lg border outline-none border-border focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="yourusername"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-neutral900">
                password
              </label>
              <a href="#" className="text-xs text-primary hover:text-primaryDark">
                Forget password?
              </a>
            </div>
            <PasswordInput />
          </div>

          <div className="flex gap-2 items-start pt-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="terms" className="text-sm text-neutral900">
              I accept terms and conditions
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign up
          </button>
        </form>

        <div className="mt-6 text-sm text-center text-neutral700">
          Already have an account ?{' '}
          <a href="#" className="font-medium text-primary hover:text-primaryDark">
            Login
          </a>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

function PasswordInput() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id="password"
        name="password"
        type={visible ? "text" : "password"}
        autoComplete="new-password"
        className="px-3 py-2 pr-10 w-full text-sm rounded-lg border outline-none border-border focus:ring-2 focus:ring-primary focus:border-primary"
        placeholder="••••••••"
      />
      <button
        type="button"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-2 my-auto w-8 h-8 rounded-md text-neutral700 hover:text-neutral900"
      >
        {visible ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M1.53 12.22a1 1 0 0 1 0-.44C3.03 7.98 7.2 5 12 5c4.8 0 8.97 2.98 10.47 6.78.06.14.06.3 0 .44C20.97 16.02 16.8 19 12 19c-4.8 0-8.97-2.98-10.47-6.78ZM12 17c3.86 0 7.33-2.23 8.9-5-1.57-2.77-5.04-5-8.9-5S4.67 9.23 3.1 12c1.57 2.77 5.04 5 8.9 5Zm0-1a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.28 2.22a.75.75 0 1 0-1.06 1.06l1.88 1.88C2.9 6.1 1.97 7.41 1.53 8.56a1 1 0 0 0 0 .88C3.03 13.02 7.2 16 12 16c1.43 0 2.8-.26 4.02-.73l2.7 2.7a.75.75 0 1 0 1.06-1.06l-16.5-16.5ZM12 14c-3.86 0-7.33-2.23-8.9-5 .42-.75 1.02-1.54 1.77-2.26l2.3 2.3A4 4 0 0 0 12 16c.57 0 1.11-.1 1.62-.27l-1.58-1.58c-.01 0-.03 0-.04 0ZM20.9 12a13.6 13.6 0 0 0-1.9-2.42l-1.1 1.1a5.98 5.98 0 0 1 .98 1.32c-1.57 2.77-5.04 5-8.9 5-.23 0-.46-.01-.68-.03l1.66 1.66c.67-.06 1.31-.18 1.92-.34 2.34-.62 4.29-1.86 5.66-3.3a14.6 14.6 0 0 0 1.36-1.66c.06-.14.06-.3 0-.44Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
