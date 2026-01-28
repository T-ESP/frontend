export function InventoryTableHead() {
  return (
    <thead>
      <tr className="border-b border-gray-100 bg-gray-50/50">
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Product
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Category
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Price
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Stock
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Status
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Actions
        </th>
      </tr>
    </thead>
  );
}

