import { useState } from "react";

export function SalesTableHeader() {
  const [selectedMonth, setSelectedMonth] = useState<string>("October");

  return (
    <div className="flex justify-between items-center px-6 py-5 from-gray-50 to-white border-b border-border bg-linear-to-r">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Deals Details</h3>
        <p className="text-sm text-muted-foreground mt-0.5">Recent transactions and orders</p>
      </div>
      <select 
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="px-4 py-2 text-sm bg-card rounded-lg border border-border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-border"
      >
        <option value="October">October</option>
        <option value="September">September</option>
        <option value="August">August</option>
      </select>
    </div>
  );
}

