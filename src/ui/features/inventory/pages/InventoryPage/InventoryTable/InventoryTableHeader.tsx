import { FiSearch, FiFilter, FiDownload, FiRefreshCw, FiX, FiChevronDown } from "react-icons/fi";
import { useState } from "react";

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
            <h3 className="text-xl font-bold text-gray-900">Inventory Management</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredProducts === totalProducts 
                ? `${totalProducts.toLocaleString()} products` 
                : `${filteredProducts.toLocaleString()} of ${totalProducts.toLocaleString()} products`}
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FiX className="w-3 h-3" />
              Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh data"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            title="Export to CSV"
          >
            <FiDownload className="w-4 h-4" />
            Export
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
              placeholder="Search by product name, SKU, or category..."
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
            <option value="All Categories">All Categories</option>
            <option value="Alimentaire">🍎 Alimentaire</option>
            <option value="Électronique">💻 Électronique</option>
            <option value="Hygiène">🧼 Hygiène</option>
            <option value="Maison">🏠 Maison</option>
            <option value="Vêtements">👕 Vêtements</option>
            <option value="Papeterie">📝 Papeterie</option>
            <option value="Jardin">🌿 Jardin</option>
            <option value="Jeux">🎮 Jeux</option>
          </select>

          {/* Status Filter */}
          <select 
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="All Status">All Status</option>
            <option value="In Stock">✓ In Stock</option>
            <option value="Low Stock">⚠ Low Stock</option>
            <option value="Out of Stock">✗ Out of Stock</option>
          </select>

          {/* Sort By */}
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all cursor-pointer min-w-[160px]"
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="stock">Sort: Stock</option>
            <option value="category">Sort: Category</option>
            <option value="updated">Sort: Updated</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑ A-Z' : '↓ Z-A'}
          </button>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-colors ${
              showAdvancedFilters 
                ? 'text-purple-700 bg-purple-50 border-purple-200' 
                : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FiFilter className="w-4 h-4" />
            Filters
            <FiChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Advanced Filters</h4>
              <button
                onClick={() => {
                  onPriceRangeChange({ min: 0, max: 10000 });
                  onStockRangeChange({ min: 0, max: 10000 });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors"
              >
                <FiX className="w-3 h-3" />
                Reset Filters
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Price Range (€)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                    placeholder="Min"
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                    placeholder="Max"
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Stock Range */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Stock Quantity Range
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={stockRange.min}
                    onChange={(e) => onStockRangeChange({ ...stockRange, min: Number(e.target.value) })}
                    placeholder="Min"
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    value={stockRange.max}
                    onChange={(e) => onStockRangeChange({ ...stockRange, max: Number(e.target.value) })}
                    placeholder="Max"
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

