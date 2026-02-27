import type { LucideIcon } from "lucide-react";

interface OrderStatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: "emerald" | "amber" | "rose" | "blue" | "purple";
}

const colorClasses = {
  emerald: {
    gradient: "from-emerald-50 to-emerald-100",
    border: "border-emerald-200",
    text: "text-emerald-600",
    textBold: "text-emerald-700"
  },
  amber: {
    gradient: "from-amber-50 to-amber-100",
    border: "border-amber-200",
    text: "text-amber-600",
    textBold: "text-amber-700"
  },
  rose: {
    gradient: "from-rose-50 to-rose-100",
    border: "border-rose-200",
    text: "text-rose-600",
    textBold: "text-rose-700"
  },
  blue: {
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-200",
    text: "text-blue-600",
    textBold: "text-blue-700"
  },
  purple: {
    gradient: "from-purple-50 to-purple-100",
    border: "border-purple-200",
    text: "text-purple-600",
    textBold: "text-purple-700"
  }
};

export function OrderStatCard({ label, value, icon: Icon, color }: OrderStatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className={`bg-linear-to-r ${colors.gradient} p-4 rounded-xl border ${colors.border}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className={`${colors.text} text-sm font-medium`}>{label}</p>
          <p className={`text-2xl font-bold ${colors.textBold}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${colors.text}`} />
      </div>
    </div>
  );
}
