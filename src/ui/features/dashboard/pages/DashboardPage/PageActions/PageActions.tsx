import { CalendarDays, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface PageActionsProps {
  onDateRangeChange?: (days: number) => void;
  currentRange?: number;
}

export function PageActions({ onDateRangeChange, currentRange = 30 }: PageActionsProps) {
  const { t } = useTranslation();
  const [showDateMenu, setShowDateMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDateMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const dateRanges = [
    { label: t("common.date_range.last_7_days"), days: 7 },
    { label: t("common.date_range.last_30_days"), days: 30 },
    { label: t("common.date_range.last_90_days"), days: 90 },
    { label: t("common.date_range.last_year"), days: 365 },
    { label: t("common.date_range.all_time"), days: 0 },
  ];

  const currentLabel =
    dateRanges.find((r) => r.days === currentRange)?.label ??
    t("common.date_range.last_30_days");

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDateMenu(!showDateMenu)}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
      >
        <CalendarDays className="w-4 h-4 text-gray-400" />
        {currentLabel}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${showDateMenu ? "rotate-180" : ""}`}
        />
      </button>
      {showDateMenu && (
        <div className="absolute right-0 z-10 mt-1 w-44 py-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {dateRanges.map((range) => (
            <button
              key={range.days}
              onClick={() => {
                onDateRangeChange?.(range.days);
                setShowDateMenu(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                range.days === currentRange
                  ? "text-purple-600 font-semibold bg-purple-50/50"
                  : "text-gray-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
