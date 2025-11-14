import { mockData } from "@/ui/features/sales/constants";
import type { Sale } from "@/ui/features/sales/types";
import { SalesTableBody } from "./SalesTableBody";
import { SalesTableFooter } from "./SalesTableFooter";
import { SalesTableHead } from "./SalesTableHead";
import { SalesTableHeader } from "./SalesTableHeader";

export default function SalesTable() {
  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <SalesTableHeader />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <SalesTableHead />
          <SalesTableBody data={mockData as Sale[]} />
        </table>
      </div>
      <SalesTableFooter />
    </div>
  );
}
