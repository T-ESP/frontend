import PageLayout from "@/layouts/PageLayout";
import { FiEdit2, FiTrash, FiPackage, FiTrendingUp } from "react-icons/fi";

const mockInventory = [
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

const statusStyles = {
  "In Stock": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "Low Stock": "bg-amber-50 text-amber-700 border border-amber-200",
  "Out of Stock": "bg-rose-50 text-rose-700 border border-rose-200"
};

export default function InventoryPage() {
  return (
    <PageLayout
      title="Inventory"
      subtitle="Manage your stock, products and availability."
      actions={
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Export
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
            Add Product
          </button>
        </div>
      }
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-linear-to-r from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">In Stock</p>
              <p className="text-2xl font-bold text-emerald-700">332</p>
            </div>
            <FiPackage className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <div className="bg-linear-to-r from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-amber-700">24</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-linear-to-r from-rose-50 to-rose-100 p-4 rounded-xl border border-rose-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-600 text-sm font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-rose-700">12</p>
            </div>
            <FiPackage className="w-8 h-8 text-rose-600" />
          </div>
        </div>
        <div className="bg-linear-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Products</p>
              <p className="text-2xl font-bold text-blue-700">368</p>
            </div>
            <FiTrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Table Container - Same as SalesTable */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header - Same as SalesTable */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Product Inventory</h3>
            <p className="text-sm text-gray-500 mt-0.5">Manage your products and stock levels</p>
          </div>
          <select className="bg-white border border-gray-200 text-sm px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-300">
            <option>All Categories</option>
            <option>Digital Product</option>
            <option>Electronics</option>
            <option>Mobile Devices</option>
            <option>Audio</option>
            <option>Tablets</option>
          </select>
        </div>

        {/* Table - Same styling as SalesTable */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Colors
                </th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockInventory.map((item, index) => (
                <tr
                  key={item.id}
                  className="hover:bg-purple-50/30 transition-colors duration-150 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          {item.name}
                        </span>
                        <div className="text-xs text-gray-500 mt-0.5">
                          SKU: {item.sku}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiPackage className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{item.category}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-900 font-semibold text-base">
                      {item.price}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-gray-700 font-medium">
                      {item.piece.toLocaleString()}
                      <span className="text-xs text-gray-400">units</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[item.status as keyof typeof statusStyles]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'In Stock' ? 'bg-emerald-500' :
                        item.status === 'Low Stock' ? 'bg-amber-500' :
                          'bg-rose-500'
                        }`}></span>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-1.5">
                      {item.colors.map((color, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-gray-200"
                          style={{ backgroundColor: color }}
                        ></span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-150">
                        <FiEdit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-150">
                        <FiTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer - Same as SalesTable */}
        <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">1-5</span> of <span className="font-semibold text-gray-900">368</span> products
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 border border-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
