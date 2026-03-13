export type KpiCardColor = "emerald" | "amber" | "rose" | "blue" | "primary" | "purple";

export interface KpiCardProps {
  label: string;
  value: string | number;
  color?: KpiCardColor;
}

const colorClasses: Record<KpiCardColor, { gradient: string; border: string; text: string; textBold: string }> = {
  primary: {
    gradient: "from-info-bg to-primary-plus/10",
    border: "border-primary-plus/20",
    text: "text-primary-dark",
    textBold: "text-primary-night",
  },
  emerald: {
    gradient: "from-success-bg to-white",
    border: "border-success/10",
    text: "text-success",
    textBold: "text-neutral-900",
  },
  amber: {
    gradient: "from-warning-bg to-white",
    border: "border-warning/10",
    text: "text-warning",
    textBold: "text-neutral-900",
  },
  rose: {
    gradient: "from-error-bg to-white",
    border: "border-error/10",
    text: "text-error",
    textBold: "text-neutral-900",
  },
  blue: {
    gradient: "from-info-bg to-white",
    border: "border-info/10",
    text: "text-info",
    textBold: "text-neutral-900",
  },
  purple: {
    gradient: "from-purple-50 to-white",
    border: "border-purple-200/30",
    text: "text-purple-600",
    textBold: "text-neutral-900",
  },
};

export function KpiCard({ label, value, color = "primary" }: KpiCardProps) {
  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`bg-linear-to-r ${colors.gradient} p-4 rounded-xl border ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`${colors.text} text-sm font-medium`}>{label}</p>
          <p className={`text-2xl font-bold ${colors.textBold}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
