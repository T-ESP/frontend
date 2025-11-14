import { forwardRef } from "react";
import type { ButtonProps } from "./index";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      primary:
        "bg-primary text-white hover:bg-primaryDark focus:ring-2 focus:ring-primary",
      secondary:
        "bg-neutral200 text-neutral900 hover:bg-neutral300 focus:ring-2 focus:ring-neutral400",
      outline:
        "border border-border bg-white text-neutral900 hover:bg-neutral50 focus:ring-2 focus:ring-primary",
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none ${fullWidth ? "w-full" : ""
          } ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

