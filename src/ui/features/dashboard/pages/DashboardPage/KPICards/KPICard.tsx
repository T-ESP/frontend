import type { KPI } from "@/ui/features/dashboard/types";

export function KPICard({ kpi }: { kpi: KPI }) {
  return (
    <div className="p-6 transition-all duration-200 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md group">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl transition-colors`}>
          <kpi.icon className={`w-6 h-6 text-primary`} />
        </div>

        {/* <div className="flex items-center gap-1 text-sm">
          {kpi.trend === "up" ? (
            <FiArrowUpRight className="w-4 h-4 text-emerald-500" />
          ) : (
            <FiArrowDownLeft className="w-4 h-4 text-rose-500" />
          )}
          <span className={`font-medium ${kpi.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>
            {kpi.change}
          </span>
        </div> */}
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
        <p className="mt-1 text-3xl font-bold text-gray-900">{kpi.value}</p>
        <p className="mt-1 text-xs text-gray-500">{kpi.description}</p>
      </div>
    </div>
  );
}
