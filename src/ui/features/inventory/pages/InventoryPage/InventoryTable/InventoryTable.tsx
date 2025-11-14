import { mockInventory } from "@/ui/features/inventory/constants";
import { InventoryTableBody } from "./InventoryTableBody";
import { InventoryTableFooter } from "./InventoryTableFooter";
import { InventoryTableHead } from "./InventoryTableHead";
import { InventoryTableHeader } from "./InventoryTableHeader";

export function InventoryTable() {
  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <InventoryTableHeader />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <InventoryTableHead />
          <InventoryTableBody data={mockInventory} />
        </table>
      </div>
      <InventoryTableFooter />
    </div>
  );
}

