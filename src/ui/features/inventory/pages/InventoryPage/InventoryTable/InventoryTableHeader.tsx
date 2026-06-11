import { FiSearch, FiFilter, FiRefreshCw, FiX, FiChevronDown } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

interface InventoryTableHeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
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

const selectClass =
  "w-full h-9 px-3 text-sm bg-background transition-colors border rounded-lg border-input cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent hover:border-primary/30";

export function InventoryTableHeader({
  selectedCategory,
  onCategoryChange,
  categories,
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
    <div>
      {/* Header Row */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">{t('inventory.management')}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {filteredProducts === totalProducts
                ? t('inventory.products_count', { val: totalProducts.toLocaleString() })
                : t('inventory.filtered_count', { filtered: filteredProducts.toLocaleString(), total: totalProducts.toLocaleString() })}
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors rounded-md text-muted-foreground bg-muted hover:bg-accent hover:text-primary"
            >
              <FiX className="w-3 h-3" />
              {t('inventory.header.clear_filters', { quantity: activeFiltersCount })}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-3 h-9 text-sm font-medium transition-colors bg-white border rounded-lg border-border text-foreground hover:bg-muted"
            title={t('inventory.header.refresh')}
          >
            <FiRefreshCw className="w-4 h-4" />
            {t('inventory.header.refresh')}
          </button>
        </div>
      </div>

      {/* Search and Quick Filters Row */}
      <div className="px-6 py-4">
        <div className="grid items-end grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-6">
          {/* Search Bar */}
          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              {t('inventory.header.search_label')}
            </label>
            <div className="relative">
              <FiSearch className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('inventory.header.search_placeholder')}
                className="h-9 pl-9 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute p-1 -translate-y-1/2 right-2 top-1/2 text-muted-foreground hover:text-foreground"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              {t('inventory.header.category_label')}
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={selectClass}
            >
              <option value="All Categories">{t('inventory.filters.all_categories')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              {t('inventory.header.status_label')}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className={selectClass}
            >
              <option value="All Status">{t('inventory.filters.all_status')}</option>
              <option value="In Stock">{t('inventory.status.in_stock')}</option>
              <option value="Low Stock">{t('inventory.status.low_stock')}</option>
              <option value="Out of Stock">{t('inventory.status.out_of_stock')}</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
              {t('inventory.header.sort_label')}
            </label>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className={selectClass}
            >
              <option value="name">{t('inventory.sort.name')}</option>
              <option value="price">{t('inventory.sort.price')}</option>
              <option value="stock">{t('inventory.sort.stock')}</option>
              <option value="category">{t('inventory.sort.category')}</option>
              <option value="updated">{t('inventory.sort.updated')}</option>
            </select>
          </div>

          {/* Order & Advanced */}
          <div className="flex gap-2">
            <div className="flex-1 space-y-1.5">
              <label className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                {t('inventory.header.order_label')}
              </label>
              <button
                onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center justify-center w-full gap-2 px-3 h-9 text-sm font-medium transition-colors bg-white border rounded-lg border-border text-foreground hover:bg-muted"
              >
                {sortOrder === 'asc' ? `↑ ${t('inventory.sort.a_z')}` : `↓ ${t('inventory.sort.z_a')}`}
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground opacity-0">
                .
              </label>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`inline-flex items-center justify-center gap-1.5 px-3 h-9 text-sm font-medium border rounded-lg transition-colors ${
                  showAdvancedFilters
                    ? 'text-primary bg-accent border-primary/20'
                    : 'text-foreground bg-white border-border hover:bg-muted'
                }`}
              >
                <FiFilter className="w-4 h-4" />
                <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="p-4 mt-4 space-y-4 duration-200 border rounded-lg bg-muted/40 border-border animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">{t('inventory.filters.advanced')}</h4>
              <button
                onClick={() => {
                  onPriceRangeChange({ min: 0, max: 10000 });
                  onStockRangeChange({ min: 0, max: 10000 });
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium transition-colors bg-white border rounded-md text-muted-foreground border-border hover:bg-accent hover:text-primary"
              >
                <FiX className="w-3 h-3" />
                {t('inventory.filters.reset')}
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-muted-foreground">
                  {t('inventory.filters.price_range')}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                    placeholder={t('inventory.filters.min')}
                    className="h-9"
                  />
                  <span className="text-muted-foreground">—</span>
                  <Input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                    placeholder={t('inventory.filters.max')}
                    className="h-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-muted-foreground">
                  {t('inventory.filters.stock_range')}
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={stockRange.min}
                    onChange={(e) => onStockRangeChange({ ...stockRange, min: Number(e.target.value) })}
                    placeholder={t('inventory.filters.min')}
                    className="h-9"
                  />
                  <span className="text-muted-foreground">—</span>
                  <Input
                    type="number"
                    value={stockRange.max}
                    onChange={(e) => onStockRangeChange({ ...stockRange, max: Number(e.target.value) })}
                    placeholder={t('inventory.filters.max')}
                    className="h-9"
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
