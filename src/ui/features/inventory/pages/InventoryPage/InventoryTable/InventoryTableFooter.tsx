export function InventoryTableFooter() {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/30">
      <p className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">1-5</span> of <span className="font-semibold text-gray-900">368</span> products
      </p>
      <div className="flex gap-2">
        <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Previous
        </button>
        <button className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
          Next
        </button>
      </div>
    </div>
  );
}

