import { useState } from "react";
import PageLayout from "@/layouts/PageLayout";
import { InventoryStats } from "./InventoryStats";
import { InventoryTable } from "./InventoryTable";
import { PageActions } from "./PageActions";
import { AddProductModal } from "../../components/AddProductModal";
import { EditProductModal } from "../../components/EditProductModal";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import type { InventoryItem } from "@/ui/features/inventory/types";
import type { Product } from "@/domain/models/Product";

export default function InventoryPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [deleteProductName, setDeleteProductName] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  return (
    <PageLayout
      title="Inventory"
      subtitle="Manage your stock, products and availability."
      actions={<PageActions onAddProduct={() => setShowAddModal(true)} />}
    >
      <InventoryStats />
      <InventoryTable 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        refreshTrigger={refreshTrigger}
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

