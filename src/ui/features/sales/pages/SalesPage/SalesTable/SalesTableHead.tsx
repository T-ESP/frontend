export function SalesTableHead() {
  return (
    <thead>
      <tr className="border-b border-gray-100 bg-gray-50/50">
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Date
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Orders Count
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Revenue
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Average Basket
        </th>
      </tr>
    </thead>
  );
}

