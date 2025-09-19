import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
  useEffect,
} from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type Toast = {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
  duration: number;
};

type ToastContextType = {
  addToast: (
    title: string,
    description?: string,
    type?: ToastType,
    duration?: number
  ) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const refMap = useRef(new Map<string, HTMLDivElement | null>()); // Map de refs DOM

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    refMap.current.delete(id);
  }, []);

  const addToast = useCallback(
    (
      title: string,
      description?: string,
      type: ToastType = "info",
      duration = 10000
    ) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type, duration }]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
        <TransitionGroup>
          {toasts.map((t) => (
            <CSSTransition
              key={t.id}
              nodeRef={{
                current: refMap.current.get(t.id) ?? null,
              }}
              timeout={200}
              classNames="toast"
              unmountOnExit
            >
              <div
                ref={(el) => {
                  refMap.current.set(t.id, el);
                }}
                className="toast-wrapper"
              >
                <ToastItem toast={t} onRemove={() => removeToast(t.id)} />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const { title, description, type, duration } = toast;
  const [progress, setProgress] = useState(100);

  // Timer indépendant par toast
  useEffect(() => {
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.max(100 - (elapsed / duration) * 100, 0);
      setProgress(pct);
      if (elapsed >= duration) {
        onRemove();
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, onRemove]);

  const color =
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500";

  return (
    <div className="relative w-80 rounded-md shadow-md bg-white border border-neutral-200 overflow-hidden">
      <div
        className={`h-1 ${color}`}
        style={{ width: `${progress}%`, transition: "width 100ms linear" }}
      />
      <div className="p-4 flex justify-between">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-neutral-600">{description}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="ml-2 text-neutral-500 hover:text-neutral-800 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
