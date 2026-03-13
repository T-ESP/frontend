import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { InventoryStats } from "./InventoryStats";
import { InventoryTable } from "./InventoryTable";
import { PageActions } from "./PageActions";
import { AddProductModal } from "../../components/AddProductModal";
import { EditProductModal } from "../../components/EditProductModal";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { ProductKPIsModal } from "../../components/ProductKPIsModal";
import { productService } from "@/infrastructure/api/services/productService";
import type { InventoryItem } from "@/ui/features/inventory/types";
import type { Product } from "@/domain/models/Product";
import { useTranslation } from "react-i18next";

export default function InventoryPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showKPIsModal, setShowKPIsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [deleteProductName, setDeleteProductName] = useState("");
  const [kpiProductId, setKpiProductId] = useState<number | null>(null);
  const [kpiProductName, setKpiProductName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [products, setProducts] = useState<InventoryItem[]>([]);

  // Effect to handle direct product links (e.g., from Dashboard)
  useEffect(() => {
    const productId = searchParams.get("productId");
    if (productId) {
      const id = parseInt(productId);
      loadSingleProduct(id);
    }
  }, [searchParams]);

  const loadSingleProduct = async (id: number) => {
    try {
      const product = await productService.getById(id);
      if (product) {
        handleViewKPIs(product.id, product.name);
      }
    } catch (error) {
      console.error("Error loading single product:", error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    // Convert InventoryItem back to Product for editing
    const product: Product = {
      id: item.id,
      name: item.name,
      category: item.category,
      reference: item.sku,
      supplier_id: 1, // Default, would need to be stored in InventoryItem
      stock_quantity: item.piece,
      buying_price: parseFloat(item.price.replace(" €", "")),
      date_last_reassor: new Date().toISOString(),
      created_at: item.lastUpdated,
      updated_at: item.lastUpdated,
    };
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = (id: number, name: string) => {
    setDeleteProductId(id);
    setDeleteProductName(name);
    setShowDeleteModal(true);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProductsLoaded = (loadedProducts: InventoryItem[]) => {
    setProducts(loadedProducts);
  };

  const handleViewKPIs = (id: number, name: string) => {
    setKpiProductId(id);
    setKpiProductName(name);
    setShowKPIsModal(true);
  };

  return (
    <PageLayout
      title={t('inventory.title')}
      subtitle={t('inventory.subtitle')}
      actions={<PageActions onAddProduct={() => setShowAddModal(true)} />}
    >
      <InventoryStats products={products} />
      <InventoryTable
        onEdit={handleEdit}
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
        onViewKPIs={handleViewKPIs}
        onProductsLoaded={handleProductsLoaded}
      />

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductAdded={handleRefresh}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProductUpdated={handleRefresh}
        product={selectedProduct}
      />

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onProductDeleted={handleRefresh}
        productId={deleteProductId}
        productName={deleteProductName}
      />

      {kpiProductId && (
        <ProductKPIsModal
          isOpen={showKPIsModal}
          onClose={() => {
            setShowKPIsModal(false);
            setKpiProductId(null);
            setKpiProductName("");
            // Clear productId from URL
            if (searchParams.has("productId")) {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete("productId");
              setSearchParams(newParams);
            }
          }}
          productId={kpiProductId}
          productName={kpiProductName}
        />
      )}
    </PageLayout>
  );
}

