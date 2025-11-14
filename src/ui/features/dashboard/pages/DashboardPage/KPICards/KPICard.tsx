import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";
import type { KPI } from "@/ui/features/dashboard/types";

export function KPICard({ kpi }: { kpi: KPI }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md group">
      <div className="flex justify-between items-center">
        <div className={`p-3 rounded-xl bg-${kpi.color}-50 group-hover:bg-${kpi.color}-100 transition-colors`}>
          <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
        </div>

        <div className="flex gap-1 items-center text-sm">
          {kpi.trend === "up" ? (
            <FiArrowUpRight className="w-4 h-4 text-emerald-500" />
          ) : (
            <FiArrowDownLeft className="w-4 h-4 text-rose-500" />
          )}
          <span className={`font-medium ${kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
            {kpi.change}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
        <p className="mt-1 text-3xl font-bold text-gray-900">{kpi.value}</p>
        <p className="mt-1 text-xs text-gray-500">{kpi.description}</p>
      </div>
    </div>
  );
}
