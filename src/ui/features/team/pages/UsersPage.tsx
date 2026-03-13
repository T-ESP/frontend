import { useState } from "react";
import { FiSearch, FiRefreshCw, FiPlus, FiMail, FiPhone, FiShield, FiMoreVertical } from "react-icons/fi";
import { useTranslation } from "react-i18next";

const mockUsers = [
  { id: 1, name: "Alice Martin", email: "alice.martin@company.com", phone: "+33 6 12 34 56 78", role: "Admin", department: "Management", status: "Active", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
  { id: 2, name: "Bob Dubois", email: "bob.dubois@company.com", phone: "+33 6 23 45 67 89", role: "Manager", department: "Sales", status: "Active", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
  { id: 3, name: "Claire Bernard", email: "claire.bernard@company.com", phone: "+33 6 34 56 78 90", role: "Employee", department: "Inventory", status: "Active", avatar: "https://randomuser.me/api/portraits/women/3.jpg" },
  { id: 4, name: "David Petit", email: "david.petit@company.com", phone: "+33 6 45 67 89 01", role: "Employee", department: "Warehouse", status: "Inactive", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
  { id: 5, name: "Emma Moreau", email: "emma.moreau@company.com", phone: "+33 6 56 78 90 12", role: "Manager", department: "Operations", status: "Active", avatar: "https://randomuser.me/api/portraits/women/5.jpg" },
];

export default function UsersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All Roles" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "All Status" || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{t('team.users.title')}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t('team.users.count', { count: filteredUsers.length })}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <FiRefreshCw className="w-4 h-4" />
              {t('common.refresh')}
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
              <FiDownload className="w-4 h-4" />
              {t('common.export')}
            </button> */}
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700">
              <FiPlus className="w-4 h-4" />
              {t('team.users.add')}
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('team.users.search_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-35"
            >
              <option value="All Roles">{t('team.filters.all_roles')}</option>
              <option value="Admin">👑 {t('team.roles.admin')}</option>
              <option value="Manager">👔 {t('team.roles.manager')}</option>
              <option value="Employee">👤 {t('team.roles.employee')}</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 text-sm font-medium bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-35"
            >
              <option value="All Status">{t('team.filters.all_status')}</option>
              <option value="Active">✓ {t('team.status.active')}</option>
              <option value="Inactive">✗ {t('team.status.inactive')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-l-4 hover:border-l-purple-500 group">
            <div className="flex items-center gap-4 p-4">
              <img src={user.avatar} alt={user.name} className="w-12 h-12 border-2 border-gray-200 rounded-full" />

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold leading-tight text-gray-900 transition-colors group-hover:text-purple-600">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">{user.department}</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiMail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  <FiShield className="w-3.5 h-3.5" />
                  {t(`team.roles.${user.role.toLowerCase()}`, { defaultValue: user.role })}
                </div>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-700 border border-gray-200'
                  }`}>
                  {t(`team.status.${user.status.toLowerCase()}`, { defaultValue: user.status })}
                </span>
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