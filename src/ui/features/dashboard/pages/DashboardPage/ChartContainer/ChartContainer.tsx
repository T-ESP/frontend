import { customerData, revenueData } from "@/ui/features/dashboard/constants";
import { CustomerDistributionChart } from "./CustomerDistributionChart";
import { RevenueChart } from "./RevenueChart";

export function ChartContainer() {
  return (
    <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-3">
      <RevenueChart data={revenueData} />
      <CustomerDistributionChart data={customerData} />
    </div>
  );
}