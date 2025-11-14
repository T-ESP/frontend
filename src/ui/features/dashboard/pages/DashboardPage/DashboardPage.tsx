import PageLayout from "@/layouts/PageLayout";
import { kpiData, topProducts } from "../../constants/data";
import { KPICards } from "./KPICards";
import { ChartContainer } from "./ChartContainer";
import { TopProducts } from "./TopProducts";
import { PageActions } from "./PageActions/PageActions";

export default function DashboardPage() {
  return (
    <PageLayout
      title="Dashboard"
      subtitle="Monitor your business performance in real-time"
      actions={<PageActions />}
    >
      {/* KPI Cards */}
      <KPICards data={kpiData} />

      <ChartContainer />

      <TopProducts products={topProducts} />
    </PageLayout>
  );
}