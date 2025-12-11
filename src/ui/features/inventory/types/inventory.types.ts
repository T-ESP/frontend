export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  price: string;
  piece: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  image: string;
  sku: string;
  lastUpdated: string;
};

export type InventoryStats = {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalProducts: number;
};

