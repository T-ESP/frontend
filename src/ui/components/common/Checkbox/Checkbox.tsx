import { forwardRef, type KeyboardEvent } from "react";
import type { CheckboxProps } from "./index";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, onKeyDown, onChange, ...props }, ref) => {
    const checkboxId = id || props.name;

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      // Laisser le comportement natif (Espace) gérer le toggle
      // et simplement relayer les autres handlers clavier éventuels
      onKeyDown?.(e);
    };

    return (
      <div>
        <div className="flex gap-2 items-start">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary ${className}`}
            onKeyDown={handleKeyDown}
            onChange={onChange}
            {...props}
          />
          {label && (
            <label htmlFor={checkboxId} className="text-sm text-neutral900">
              {label}
            </label>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

