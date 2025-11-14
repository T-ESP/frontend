import { forwardRef } from "react";
import type { CheckboxProps } from "./index";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, onKeyDown, ...props }, ref) => {
    const checkboxId = id || props.name;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const input = e.currentTarget;
        input.checked = !input.checked;
        // Déclencher l'événement change pour que les handlers soient appelés
        const changeEvent = new Event("change", { bubbles: true });
        input.dispatchEvent(changeEvent);
      }
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

