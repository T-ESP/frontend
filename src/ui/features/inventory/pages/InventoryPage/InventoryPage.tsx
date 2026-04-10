import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageLayout from "@/ui/components/layouts/PageLayout";
import { InventoryStats } from "./InventoryStats";
import { InventoryTable } from "./InventoryTable";
import { PageActions } from "./PageActions";
import { AddProductModal } from "../../components/AddProductModal";
import { EditProductModal } from "../../components/EditProductModal";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import type { InventoryItem } from "@/ui/features/inventory/types";
import type { Product } from "@/domain/models/Product";
import { useTranslation } from "react-i18next";

export default function InventoryPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [deleteProductName, setDeleteProductName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [products, setProducts] = useState<InventoryItem[]>([]);

  // Effect to handle direct product links (e.g., from Dashboard)
  useEffect(() => {
    const productId = searchParams.get("productId");
    if (productId) {
      navigate(`/inventory/${productId}/kpis`);
    }
  }, [searchParams]);

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

  const handleViewKPIs = (id: number, _name: string) => {
    navigate(`/inventory/${id}/kpis`);
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

    </PageLayout>
  );
}

