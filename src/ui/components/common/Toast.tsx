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
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

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

const MAX_TOASTS = 3;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const refMap = useRef(new Map<string, HTMLDivElement | null>());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    refMap.current.delete(id);
  }, []);

  const addToast = useCallback(
    (
      title: string,
      description?: string,
      type: ToastType = "info",
      duration = 5000
    ) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => {
        const next = [...prev, { id, title, description, type, duration }];
        // Keep only the last MAX_TOASTS, drop the oldest
        return next.slice(-MAX_TOASTS);
      });
    },
    []
  );

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 items-end">
        <TransitionGroup>
          {toasts.map((t) => (
            <CSSTransition
              key={t.id}
              nodeRef={{ current: refMap.current.get(t.id) ?? null }}
              timeout={180}
              classNames="toast"
              unmountOnExit
            >
              <div
                ref={(el) => { refMap.current.set(t.id, el); }}
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

const CONFIG: Record<ToastType, { icon: typeof CheckCircle; accent: string; iconClass: string }> = {
  success: {
    icon: CheckCircle,
    accent: "bg-emerald-500",
    iconClass: "text-emerald-500",
  },
  error: {
    icon: AlertCircle,
    accent: "bg-red-500",
    iconClass: "text-red-500",
  },
  info: {
    icon: Info,
    accent: "bg-gray-900",
    iconClass: "text-gray-500",
  },
};

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const { title, description, type, duration } = toast;
  const [progress, setProgress] = useState(100);
  const { icon: Icon, accent, iconClass } = CONFIG[type];

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

  return (
    <div className="relative w-72 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${accent}`} />

      <div className="flex items-start gap-3 px-4 py-3 pl-5">
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 leading-snug">{title}</p>
          {description && (
            <p className="mt-0.5 text-[12px] text-gray-500 leading-snug">{description}</p>
          )}
        </div>
        <button
          onClick={onRemove}
          className="shrink-0 text-gray-400 hover:text-gray-700 transition-colors mt-0.5"
        >
          <X size={14} />
        </button>
      </div>

      {/* Progress bar at bottom */}
      <div className="h-[2px] bg-gray-100">
        <div
          className={`h-full ${accent} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
