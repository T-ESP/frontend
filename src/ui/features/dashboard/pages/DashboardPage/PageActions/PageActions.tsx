import { FiCalendar, FiDownload, FiChevronDown } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface PageActionsProps {
  onDateRangeChange?: (days: number) => void;
  onExport?: () => void;
  currentRange?: number;
}

export function PageActions({ onDateRangeChange, onExport, currentRange = 30 }: PageActionsProps) {
  const { t } = useTranslation();
  const [showDateMenu, setShowDateMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDateMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dateRanges = [
    { label: t('common.date_range.last_7_days'), days: 7 },
    { label: t('common.date_range.last_30_days'), days: 30 },
    { label: t('common.date_range.last_90_days'), days: 90 },
    { label: t('common.date_range.last_year'), days: 365 },
  ];

  const currentLabel = dateRanges.find(r => r.days === currentRange)?.label || t('common.date_range.last_30_days');

  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // Default CSV export
      const csvContent = "data:text/csv;charset=utf-8,Dashboard Export\nGenerated: " + new Date().toISOString();
      const link = document.createElement('a');
      link.setAttribute('href', csvContent);
      link.setAttribute('download', `dashboard-${new Date().toISOString().split('T')[0]}.csv`);
      link.click();
    }
  };

  return (
    <div className="flex gap-3">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDateMenu(!showDateMenu)}
          className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 transition-colors hover:bg-gray-50"
        >
          <FiCalendar size={16} />
          {currentLabel}
          <FiChevronDown size={14} className={`transition-transform ${showDateMenu ? 'rotate-180' : ''}`} />
        </button>
        {showDateMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            {dateRanges.map(range => (
              <button
                key={range.days}
                onClick={() => {
                  onDateRangeChange?.(range.days);
                  setShowDateMenu(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${range.days === currentRange ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleExport}
        className="flex gap-2 items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 transition-colors hover:bg-gray-50"
      >
        <FiDownload size={16} />
        {t('common.export')}
      </button>
    </div>
  );
}