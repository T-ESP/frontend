import { useState } from "react";
import { FiMessageSquare, FiUserPlus, FiSearch, FiMail, FiPhone, FiDownload, FiRefreshCw, FiMoreVertical } from "react-icons/fi";

const mockClients = [
  {
    id: 1,
    name: "Jason Price",
    email: "kulhman.jeremy@yahoo.com",
    phone: "+33 6 12 34 56 78",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    orders: 24,
    totalSpent: 4520,
    status: "Active"
  },
  {
    id: 2,
    name: "Duane Dean",
    email: "rusty.bednar@wind.biz",
    phone: "+33 6 23 45 67 89",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    orders: 18,
    totalSpent: 3280,
    status: "Active"
  },
  {
    id: 3,
    name: "Jonathan Barker",
    email: "cora.haley@quinn.biz",
    phone: "+33 6 34 56 78 90",
    avatar: "https://randomuser.me/api/portraits/men/91.jpg",
    orders: 32,
    totalSpent: 6890,
    status: "VIP"
  },
  {
    id: 4,
    name: "Rosie Glover",
    email: "lockman.manuj@gmail.com",
    phone: "+33 6 45 67 89 01",
    avatar: "https://randomuser.me/api/portraits/women/55.jpg",
    orders: 12,
    totalSpent: 1950,
    status: "Active"
  },
  {
    id: 5,
    name: "Patrick Greer",
    email: "peralta.ehrman@wiso.net",
    phone: "+33 6 56 78 90 12",
    avatar: "https://randomuser.me/api/portraits/men/38.jpg",
    orders: 8,
    totalSpent: 1120,
    status: "Inactive"
  },
  {
    id: 6,
    name: "Darrell Ortega",
    email: "chaya.shield@emjay.info",
    phone: "+33 6 67 89 01 23",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    orders: 45,
    totalSpent: 12450,
    status: "VIP"
  },
];

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "All Status" || client.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Client Management</h3>
            <p className="text-sm text-gray-500 mt-0.5">{filteredClients.length} clients</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
              <FiUserPlus className="w-4 h-4" />
              Add Client
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name or email..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:border-gray-300 transition-all cursor-pointer min-w-40"
            >
              <option value="All Status">All Status</option>
              <option value="Active">✓ Active</option>
              <option value="VIP">⭐ VIP</option>
              <option value="Inactive">✗ Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients List */}
      <div className="space-y-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-l-4 hover:border-l-purple-500 group"
          >
            <div className="flex items-center gap-4 p-4">
              <img
                src={client.avatar}
                alt={client.name}
                className="w-12 h-12 border-2 border-gray-200 rounded-full"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold leading-tight text-gray-900 transition-colors group-hover:text-purple-600">
                  {client.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FiMail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm">{client.email}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <FiPhone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm">{client.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center min-w-20">
                  <p className="text-lg font-bold text-gray-900">{client.orders}</p>
                  <p className="text-xs text-gray-500">Orders</p>
                </div>
                <div className="text-center min-w-25">
                  <p className="text-lg font-bold text-gray-900">{client.totalSpent.toLocaleString()} €</p>
                  <p className="text-xs text-gray-500">Total Spent</p>
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${client.status === 'VIP'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : client.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}>
                  {client.status === 'VIP' && '⭐ '}
                  {client.status}
                </span>
                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100">
                  <FiMessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
