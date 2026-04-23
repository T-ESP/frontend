import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-transparent bg-purple-100 text-purple-700",
  secondary: "border-transparent bg-gray-100 text-gray-700",
  success: "border-transparent bg-emerald-100 text-emerald-700",
  warning: "border-transparent bg-amber-100 text-amber-700",
  destructive: "border-transparent bg-rose-100 text-rose-700",
  outline: "border-gray-200 bg-transparent text-gray-700",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
