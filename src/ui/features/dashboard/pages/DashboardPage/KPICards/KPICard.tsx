import type { KPI } from "@/ui/features/dashboard/types";
import { TrendingUp, ArrowUpRight } from "lucide-react";

export function KPICard({ kpi }: { kpi: KPI }) {
  return (
    <div className={`p-6 transition-all duration-300 bg-white shadow-sm hover:shadow-md group flex flex-col justify-between
      ${kpi.isPrimary
        ? "rounded-[1.4rem] border"
        : "rounded-2xl border border-gray-100"}`}
      style={kpi.isPrimary ? {
        background: "linear-gradient(135deg,rgba(123,95,162,0.07),rgba(157,123,221,0.06))",
        borderColor: "rgba(123,95,162,0.09)"
      } : {}}
    >
      <div className="flex justify-between items-center">
        <div className={`flex gap-4 items-center`}>
          <div className={`flex justify-center items-center w-11 h-11 rounded-xl`}
            style={kpi.isPrimary ? {
              background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)",
              boxShadow: "0 6px 18px rgba(123,95,162,0.28)"
            } : {
              background: "rgba(123,95,162,0.08)",
            }}
          >
            {kpi.isPrimary ? <TrendingUp size={18} className="text-white" /> : <kpi.icon className="w-6 h-6 text-[#7b5fa2]" />}
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: kpi.isPrimary ? "var(--color-primary-dark)" : "#6b7280" }}>
              {kpi.title}
            </h3>
            <p className="mt-0.5 text-[1.6rem] font-[900] tabular-nums leading-none text-gray-900">{kpi.value}</p>
          </div>
        </div>

        {kpi.isPrimary && (
          <div className="flex flex-col items-end gap-1.5 self-start">
            {/* <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-bold text-[10px] border border-emerald-100">
              <ArrowUpRight size={10} /> {kpi.change}
            </div> */}
            <p className="mt-1 text-xs font-medium text-[#7b5fa2]/70">{kpi.description}</p>
          </div>
        )}
      </div>

      {!kpi.isPrimary && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-xs font-medium text-gray-500">{kpi.description}</p>
          {/* <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${kpi.trend === "up" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
            kpi.trend === "down" && kpi.color === "amber" ? "bg-amber-50 text-amber-600 border-amber-100" :
              kpi.trend === "down" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-gray-50 text-gray-600 border-gray-100"
            }`}>
            {kpi.change}
          </span> */}
        </div>
      )}
    </div>
  );
}
