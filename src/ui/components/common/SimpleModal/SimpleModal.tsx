import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { SimpleModalProps } from "./index";

export function SimpleModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  cancelText,
  acceptText,
  onCancel,
  onAccept,
  size = "md",
}: SimpleModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true)); // évite le flash
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 200); // durée = transition
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  const handleCancel = () => (onCancel ? onCancel() : onClose());
  const handleAccept = () => onAccept && onAccept();

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-opacity duration-200 ease-out
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Overlay avec fondu */}
      <div
        className={`
          absolute inset-0 bg-black/50 transition-opacity duration-200
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]}
          transform transition-all duration-200 ease-out
          ${isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}
        `}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-lg font-semibold leading-6 text-neutral-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-neutral-700">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 ml-4 rounded-sm transition-colors text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">{children}</div>

        {/* Footer */}
        {(cancelText || acceptText) && (
          <div className="flex gap-3 justify-end items-center px-6 py-4 rounded-b-lg border-t bg-neutral-50 border-border">
            {cancelText && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium bg-white rounded-md border transition-colors text-neutral-700 border-border hover:bg-neutral-50"
              >
                {cancelText}
              </button>
            )}
            {acceptText && (
              <button
                onClick={handleAccept}
                style={{
                  backgroundColor: "var(--color-primary)",
                  borderColor: "var(--color-primary)",
                }}
                className="px-4 py-2 text-sm font-medium text-white rounded-md border transition-all hover:opacity-90"
              >
                {acceptText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
