import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { productService } from "@/infrastructure/api/services/productService";
import type { Product } from "@/domain/models/Product";
import type { InventoryItem } from "@/ui/features/inventory/types";
import { InventoryTableHeader } from "./InventoryTableHeader";
import { InventoryCardGrid } from "./InventoryCardGrid";
import { InventoryTableSkeleton } from "./InventoryTableSkeleton";
import { useToast } from "@/ui/components/common/Toast";
import { useTranslation } from "react-i18next";

interface InventoryTableProps {
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: number, name: string) => void;
  refreshTrigger: number;
  onViewKPIs: (id: number, name: string) => void;
  onProductsLoaded?: (products: InventoryItem[]) => void;
}

export function InventoryTable({ onEdit, onDelete, refreshTrigger, onViewKPIs, onProductsLoaded }: InventoryTableProps) {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });
  const [stockRange, setStockRange] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  useEffect(() => {
    loadProducts();
  }, [refreshTrigger]);

  // Sync URL -> State
  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null && search !== searchQuery) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Sync State -> URL
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    if (searchQuery !== currentSearch) {
      if (searchQuery) {
        setSearchParams(prev => {
          prev.set("search", searchQuery);
          return prev;
        });
      } else {
        setSearchParams(prev => {
          prev.delete("search");
          return prev;
        });
      }
    }
  }, [searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      // Transform backend Product to frontend InventoryItem
      const inventoryItems: InventoryItem[] = data.map((product: Product) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: `${product.buying_price.toFixed(2)} €`,
        piece: product.stock_quantity,
        status: product.stock_quantity === 0
          ? "Out of Stock"
          : product.stock_quantity < 10
            ? "Low Stock"
            : "In Stock",
        image: "https://via.placeholder.com/150", // Placeholder since backend doesn't have images
        sku: product.reference,
        lastUpdated: product.updated_at || product.created_at || "Unknown"
      }));
      setProducts(inventoryItems);
      onProductsLoaded?.(inventoryItems);
    } catch (error) {
      console.error("Error loading products:", error);
      addToast("Failed to load products", "Please check your connection and try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (id: number, change: number) => {
    try {
      // Get current product
      const product = products.find(p => p.id === id);
      if (!product) return;

      const newQuantity = product.piece + change;
      if (newQuantity < 0) return; // Don't allow negative stock

      await productService.updateStock(id, newQuantity);

      // Update local state
      setProducts(prev => prev.map(p =>
        p.id === id
          ? {
            ...p,
            piece: newQuantity,
            status: newQuantity === 0
              ? "Out of Stock"
              : newQuantity < 10
                ? "Low Stock"
                : "In Stock"
          }
          : p
      ));

      addToast("Stock updated", `Successfully updated stock for ${product.name}`, "success");
    } catch (error) {
      console.error("Error updating stock:", error);
      addToast("Failed to update stock", "Please try again.", "error");
      throw error; // Re-throw to show error in UI
    }
  };

  // Advanced filtering and sorting logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "All Status") {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    filtered = filtered.filter(p => {
      const price = parseFloat(p.price.replace(' €', ''));
      return price >= priceRange.min && price <= priceRange.max;
    });

    // Stock range filter
    filtered = filtered.filter(p =>
      p.piece >= stockRange.min && p.piece <= stockRange.max
    );

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          const priceA = parseFloat(a.price.replace(' €', ''));
          const priceB = parseFloat(b.price.replace(' €', ''));
          comparison = priceA - priceB;
          break;
        case 'stock':
          comparison = a.piece - b.piece;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'updated':
          comparison = new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, selectedCategory, selectedStatus, searchQuery, sortBy, sortOrder, priceRange, stockRange]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus, searchQuery, priceRange, stockRange]);

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Last Updated'];
    const rows = filteredAndSortedProducts.map(p => [
      p.id,
      p.name,
      p.sku,
      p.category,
      p.price,
      p.piece,
      p.status,
      p.lastUpdated
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Derive categories from data
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).filter(Boolean).sort();
  }, [products]);

  if (loading) {
    return <InventoryTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <InventoryTableHeader
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          stockRange={stockRange}
          onStockRangeChange={setStockRange}
          onRefresh={loadProducts}
          onExport={handleExport}
          totalProducts={products.length}
          filteredProducts={filteredAndSortedProducts.length}
        />
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t('inventory.table.no_products_title')}</h3>
            <p className="text-sm text-gray-500 max-w-md">
              {t('inventory.table.no_products_desc')}
            </p>
          </div>
        </div>
      ) : (
        <>
          <InventoryCardGrid
            data={paginatedProducts}
            onEdit={onEdit}
            onDelete={onDelete}
            onStockUpdate={handleStockUpdate}
            onViewKPIs={onViewKPIs}
          />

          {/* Pagination */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {t('inventory.table.showing_range', {
                    start: ((currentPage - 1) * itemsPerPage) + 1,
                    end: Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length),
                    total: filteredAndSortedProducts.length
                  })}
                </span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={10}>10 {t('inventory.table.per_page')}</option>
                  <option value={25}>25 {t('inventory.table.per_page')}</option>
                  <option value={50}>50 {t('inventory.table.per_page')}</option>
                  <option value={100}>100 {t('inventory.table.per_page')}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('inventory.table.first')}
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('inventory.table.previous')}
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${currentPage === pageNum
                          ? 'text-white bg-purple-600'
                          : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('inventory.table.next')}
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('inventory.table.last')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

