import { KPICard } from "./KPICard";
import type { KPI } from "@/ui/features/dashboard/types";

export function KPICards({ data }: { data: KPI[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
      {data.map((kpi, index) => (
        <KPICard key={index} kpi={kpi} />
      ))}
    </div>
  );
}
