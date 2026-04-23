import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
}

function Progress({ className, value = 0, ...props }: ProgressProps) {
  return (
    <div
      className={cn("relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100", className)}
      {...props}
    >
      <div
        className="h-full bg-purple-600 transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export { Progress };
