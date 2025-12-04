export function SalesTableHead() {
  return (
    <thead>
      <tr className="border-b border-gray-100 bg-gray-50/50">
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Order ID
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          User
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Date & Time
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Amount
        </th>
        <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
          Status
        </th>
      </tr>
    </thead>
  );
}

