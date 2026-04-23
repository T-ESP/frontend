import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/components/ui/card";
import type { KPI } from "@/ui/features/dashboard/types";

export function KPICard({ kpi }: { kpi: KPI }) {
  const isUp = kpi.trend === "up";
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{kpi.title}</CardTitle>
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-purple-50 shrink-0">
          <kpi.icon className="w-4 h-4 text-purple-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              isUp ? "text-emerald-600" : "text-rose-500"
            }`}
          >
            <TrendIcon className="w-3 h-3" />
            {kpi.change}
          </span>
          <span>{kpi.description}</span>
        </p>
      </CardContent>
    </Card>
  );
}
