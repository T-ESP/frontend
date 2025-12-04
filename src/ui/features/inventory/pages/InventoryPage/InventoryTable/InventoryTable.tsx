import { useState, useEffect } from "react";
import { productService } from "@/infrastructure/api/services/productService";
import type { Product } from "@/domain/models/Product";
import type { InventoryItem } from "@/ui/features/inventory/types";
import { InventoryTableBody } from "./InventoryTableBody";
import { InventoryTableFooter } from "./InventoryTableFooter";
import { InventoryTableHead } from "./InventoryTableHead";
import { InventoryTableHeader } from "./InventoryTableHeader";

export function InventoryTable() {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

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
        colors: ["#000000"], // Default color since backend doesn't have this
        image: "https://via.placeholder.com/150", // Placeholder since backend doesn't have images
        sku: product.reference,
        lastUpdated: product.updated_at || product.created_at || "Unknown"
      }));
      setProducts(inventoryItems);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-gray-600">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
      <InventoryTableHeader />
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <InventoryTableHead />
          <InventoryTableBody data={products} />
        </table>
      </div>
      <InventoryTableFooter />
    </div>
  );
}

