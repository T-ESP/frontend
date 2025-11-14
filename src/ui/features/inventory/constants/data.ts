import type { InventoryItem } from "../types";

export const mockInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Apple Watch Series 9",
    category: "Digital Product",
    price: "$690.00",
    piece: 63,
    status: "In Stock",
    colors: ["#000000", "#d1d5db", "#f43f5e", "#6b7280"],
    image: "https://i.imgur.com/U7W9aYj.png",
    sku: "AW-S9-001",
    lastUpdated: "2 hours ago"
  },
  {
    id: 2,
    name: "MacBook Pro 16\"",
    category: "Electronics",
    price: "$2,499.00",
    piece: 24,
    status: "Low Stock",
    colors: ["#374151", "#d1d5db"],
    image: "https://i.imgur.com/mbNua4x.png",
    sku: "MBP-16-002",
    lastUpdated: "5 hours ago"
  },
  {
    id: 3,
    name: "iPhone 15 Pro",
    category: "Mobile Devices",
    price: "$999.00",
    piece: 156,
    status: "In Stock",
    colors: ["#000000", "#374151", "#3b82f6", "#f59e0b"],
    image: "https://i.imgur.com/7j9X5Kw.png",
    sku: "IP15P-003",
    lastUpdated: "1 hour ago"
  },
  {
    id: 4,
    name: "AirPods Pro",
    category: "Audio",
    price: "$249.00",
    piece: 0,
    status: "Out of Stock",
    colors: ["#ffffff"],
    image: "https://i.imgur.com/9wQm5Nx.png",
    sku: "APP-004",
    lastUpdated: "3 days ago"
  },
  {
    id: 5,
    name: "iPad Air",
    category: "Tablets",
    price: "$599.00",
    piece: 89,
    status: "In Stock",
    colors: ["#d1d5db", "#3b82f6", "#f59e0b", "#ec4899"],
    image: "https://i.imgur.com/K2jX8mL.png",
    sku: "IPAD-A-005",
    lastUpdated: "30 minutes ago"
  }
];

export const inventoryStats = {
  inStock: 332,
  lowStock: 24,
  outOfStock: 12,
  totalProducts: 368
};

