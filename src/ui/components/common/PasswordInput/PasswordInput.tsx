import { forwardRef, useState } from "react";
import type { PasswordInputProps } from "./index";

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, showToggle = true, className = "", id, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputId = id || props.name;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="block mb-1 text-sm font-medium text-neutral900">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            className={`px-3 py-2 ${showToggle ? "pr-10" : ""} w-full text-sm rounded-lg border outline-none border-border focus:ring-2 focus:ring-primary focus:border-primary ${error ? "border-red-500" : ""} ${className}`}
            {...props}
          />
          {showToggle && (
            <button
              tabIndex={-1}
              type="button"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
              className="absolute inset-y-0 right-2 my-auto w-8 h-8 rounded-md text-neutral700 hover:text-neutral900"
            >
              {visible ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M1.53 12.22a1 1 0 0 1 0-.44C3.03 7.98 7.2 5 12 5c4.8 0 8.97 2.98 10.47 6.78.06.14.06.3 0 .44C20.97 16.02 16.8 19 12 19c-4.8 0-8.97-2.98-10.47-6.78ZM12 17c3.86 0 7.33-2.23 8.9-5-1.57-2.77-5.04-5-8.9-5S4.67 9.23 3.1 12c1.57 2.77 5.04 5 8.9 5Zm0-1a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M3.28 2.22a.75.75 0 1 0-1.06 1.06l1.88 1.88C2.9 6.1 1.97 7.41 1.53 8.56a1 1 0 0 0 0 .88C3.03 13.02 7.2 16 12 16c1.43 0 2.8-.26 4.02-.73l2.7 2.7a.75.75 0 1 0 1.06-1.06l-16.5-16.5ZM12 14c-3.86 0-7.33-2.23-8.9-5 .42-.75 1.02-1.54 1.77-2.26l2.3 2.3A4 4 0 0 0 12 16c.57 0 1.11-.1 1.62-.27l-1.58-1.58c-.01 0-.03 0-.04 0ZM20.9 12a13.6 13.6 0 0 0-1.9-2.42l-1.1 1.1a5.98 5.98 0 0 1 .98 1.32c-1.57 2.77-5.04 5-8.9 5-.23 0-.46-.01-.68-.03l1.66 1.66c.67-.06 1.31-.18 1.92-.34 2.34-.62 4.29-1.86 5.66-3.3a14.6 14.6 0 0 0 1.36-1.66c.06-.14.06-.3 0-.44Z" />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

