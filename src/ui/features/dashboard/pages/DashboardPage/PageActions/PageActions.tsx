import { FiCalendar, FiDownload } from "react-icons/fi";

export function PageActions() {
  return (
    <div className="flex gap-3">
      <button className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
        <FiCalendar size={16} />
        Last 30 days
      </button>
      <button className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 transition-colors hover:bg-gray-50">
        <FiDownload size={16} />
        Export
      </button>
    </div>
  );
}