import type { FormFieldProps } from "./index";

export function FormField({
  label,
  labelRight,
  error,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      {(label || labelRight) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <label className="block text-sm font-medium text-neutral900">
              {label}
            </label>
          )}
          {labelRight && <div>{labelRight}</div>}
        </div>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

