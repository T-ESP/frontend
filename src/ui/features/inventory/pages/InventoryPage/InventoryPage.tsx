import PageLayout from "@/layouts/PageLayout";
import { InventoryStats } from "./InventoryStats";
import { InventoryTable } from "./InventoryTable";
import { PageActions } from "./PageActions";

export default function InventoryPage() {
  return (
    <PageLayout
      title="Inventory"
      subtitle="Manage your stock, products and availability."
      actions={<PageActions />}
    >
      <InventoryStats />
      <InventoryTable />
    </PageLayout>
  );
}

