import { forwardRef } from "react";
import type { InputProps } from "./Input.types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="block mb-1 text-sm font-medium text-neutral900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`px-3 py-2 w-full text-sm rounded-lg border outline-none border-border focus:ring-2 focus:ring-primary focus:border-primary ${error ? "border-red-500" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

