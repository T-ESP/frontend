import { FiSearch, FiFilter, FiDownload, FiRefreshCw, FiX, FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface InventoryTableHeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  stockRange: { min: number; max: number };
  onStockRangeChange: (range: { min: number; max: number }) => void;
  onRefresh: () => void;
  onExport: () => void;
  totalProducts: number;
  filteredProducts: number;
}

export function InventoryTableHeader({
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  priceRange,
  onPriceRangeChange,
  stockRange,
  onStockRangeChange,
  onRefresh,
  onExport,
  totalProducts,
  filteredProducts
}: InventoryTableHeaderProps) {
  const { t } = useTranslation();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const activeFiltersCount = [
    selectedCategory !== "All Categories",
    selectedStatus !== "All Status",
    searchQuery !== "",
    priceRange.min > 0 || priceRange.max < 10000,
    stockRange.min > 0 || stockRange.max < 10000
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onCategoryChange("All Categories");
    onStatusChange("All Status");
    onSearchChange("");
    onPriceRangeChange({ min: 0, max: 10000 });
    onStockRangeChange({ min: 0, max: 10000 });
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Header Row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('inventory.management')}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredProducts === totalProducts
                ? t('inventory.products_count', { val: totalProducts.toLocaleString() })
                : t('inventory.filtered_count', { filtered: filteredProducts.toLocaleString(), total: totalProducts.toLocaleString() })}
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FiX className="w-3 h-3" />
              {t('inventory.header.clear_filters', { quantity: activeFiltersCount })}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title={t('inventory.header.refresh')}
          >
            <FiRefreshCw className="w-4 h-4" />
            {t('inventory.header.refresh')}
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            title={t('common.export')}
          >
            <FiDownload className="w-4 h-4" />
            {t('common.export')}
          </button>
        </div>
      </div>

      {/* Search and Quick Filters Row */}
      <div className="px-6 py-4 space-y-4">
        <div className="flex gap-3">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('inventory.header.search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all cursor-pointer min-w-[180px]"
          >
            <option value="All Categories">{t('inventory.filters.all_categories')}</option>
            <option value="Alimentaire">🍎 {t('inventory.table.category')}: Alimentaire</option>
            <option value="Électronique">💻 {t('inventory.table.category')}: Électronique</option>
            <option value="Hygiène">🧼 {t('inventory.table.category')}: Hygiène</option>
            <option value="Maison">🏠 {t('inventory.table.category')}: Maison</option>
            <option value="Vêtements">👕 {t('inventory.table.category')}: Vêtements</option>
            <option value="Papeterie">📝 {t('inventory.table.category')}: Papeterie</option>
            <option value="Jardin">🌿 {t('inventory.table.category')}: Jardin</option>
            <option value="Jeux">🎮 {t('inventory.table.category')}: Jeux</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="All Status">{t('inventory.filters.all_status')}</option>
            <option value="In Stock">✓ {t('inventory.status.in_stock')}</option>
            <option value="Low Stock">⚠ {t('inventory.status.low_stock')}</option>
            <option value="Out of Stock">✗ {t('inventory.status.out_of_stock')}</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="name">{t('inventory.sort.name')}</option>
            <option value="price">{t('inventory.sort.price')}</option>
            <option value="stock">{t('inventory.sort.stock')}</option>
            <option value="category">{t('inventory.sort.category')}</option>
            <option value="updated">{t('inventory.sort.updated')}</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title={sortOrder === 'asc' ? t('inventory.sort.asc') : t('inventory.sort.desc')}
          >
            {sortOrder === 'asc' ? `↑ ${t('inventory.sort.a_z')}` : `↓ ${t('inventory.sort.z_a')}`}
          </button>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${showAdvancedFilters
              ? 'text-purple-700 bg-purple-50 border-purple-200'
              : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
              }`}
          >
            <FiFilter className="w-4 h-4" />
            {t('inventory.filters.title')}
            <FiChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">{t('inventory.filters.advanced')}</h4>
              <button
                onClick={() => {
                  onPriceRangeChange({ min: 0, max: 10000 });
                  onStockRangeChange({ min: 0, max: 10000 });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors"
              >
                <FiX className="w-3 h-3" />
                {t('inventory.filters.reset')}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('inventory.filters.price_range')}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                    placeholder={t('inventory.filters.min')}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                    placeholder={t('inventory.filters.max')}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Stock Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('inventory.filters.stock_range')}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={stockRange.min}
                    onChange={(e) => onStockRangeChange({ ...stockRange, min: Number(e.target.value) })}
                    placeholder={t('inventory.filters.min')}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={stockRange.max}
                    onChange={(e) => onStockRangeChange({ ...stockRange, max: Number(e.target.value) })}
                    placeholder={t('inventory.filters.max')}
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

