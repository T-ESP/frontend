export function SalesTableHeader() {
  return (
    <div className="flex justify-between items-center px-6 py-5 from-gray-50 to-white border-b border-gray-100 bg-linear-to-r">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Deals Details</h3>
        <p className="text-sm text-gray-500 mt-0.5">Recent transactions and orders</p>
      </div>
      <select className="px-4 py-2 text-sm bg-white rounded-lg border border-gray-200 transition-all cursor-pointer outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300">
        <option>October</option>
        <option>September</option>
        <option>August</option>
      </select>
    </div>
  );
}

