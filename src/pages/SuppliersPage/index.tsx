import { useState } from "react";
import { FiSearch, FiFilter, FiDownload, FiRefreshCw, FiPlus, FiPhone, FiMail, FiMapPin, FiPackage } from "react-icons/fi";

const mockSuppliers = [
  { id: 1, name: "TechSupply Co.", contact: "John Smith", email: "contact@techsupply.com", phone: "+1 234 567 8901", location: "Paris, France", products: 142, status: "Active" },
  { id: 2, name: "Fresh Foods Inc.", contact: "Sarah Johnson", email: "sales@freshfoods.com", phone: "+1 234 567 8902", location: "Lyon, France", products: 89, status: "Active" },
  { id: 3, name: "Global Electronics", contact: "Mike Chen", email: "info@globalelec.com", phone: "+1 234 567 8903", location: "Marseille, France", products: 256, status: "Active" },
  { id: 4, name: "Fashion Wholesale", contact: "Emma Davis", email: "orders@fashionwholesale.com", phone: "+1 234 567 8904", location: "Toulouse, France", products: 178, status: "Pending" },
  { id: 5, name: "Office Supplies Ltd", contact: "Robert Wilson", email: "robert@officesupplies.com", phone: "+1 234 567 8905", location: "Nice, France", products: 95, status: "Active" },
];

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.contact.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Status" || supplier.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Supplier Management</h3>
            <p className="text-sm text-gray-500 mt-0.5">{filteredSuppliers.length} suppliers</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              <FiPlus className="w-4 h-4" />
              Add Supplier
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by supplier name or contact..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all cursor-pointer min-w-[160px]"
            >
              <option value="All Status">All Status</option>
              <option value="Active">✓ Active</option>
              <option value="Pending">⏳ Pending</option>
              <option value="Inactive">✗ Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-3">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:border-l-4 hover:border-l-purple-500 group">
            <div className="flex items-center gap-4 p-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-purple-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-purple-600 transition-colors">
                  {supplier.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{supplier.contact}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{supplier.location}</span>
                </div>
                <div className="text-center min-w-[80px]">
                  <p className="text-lg font-bold text-gray-900">{supplier.products}</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                  supplier.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {supplier.status}
                </span>
                <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


