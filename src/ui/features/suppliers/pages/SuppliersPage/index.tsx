import { useState, useEffect, useMemo } from 'react';
import { supplierService } from '@/infrastructure/api/services/supplierService';
import type { Supplier } from '@/domain/models/Supplier';
import { Edit, Trash2, Plus, RefreshCw, Search, X, Users, Mail, Phone, MapPin } from 'lucide-react';
import { AddSupplierModal } from '@/ui/features/suppliers/components/AddSupplierModal';
import { EditSupplierModal } from '@/ui/features/suppliers/components/EditSupplierModal';
import { DeleteSupplierModal } from '@/ui/features/suppliers/components/DeleteSupplierModal';
import PageLayout from '../../../../components/layouts/PageLayout';
import { useTranslation } from 'react-i18next';

export default function SuppliersPage() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name_sup' | 'email_sup' | 'phone_sup'>('name_sup');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
      console.error('Error loading suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowEditModal(true);
  };

  const handleDelete = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDeleteModal(true);
  };

  const handleSort = (field: 'name_sup' | 'email_sup' | 'phone_sup') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedSuppliers = useMemo(() => {
    let filtered = suppliers.filter((supplier) => {
      const query = searchQuery.toLowerCase();
      return (
        supplier.id.toString().includes(query) ||
        supplier.name_sup.toLowerCase().includes(query) ||
        supplier.email_sup.toLowerCase().includes(query) ||
        supplier.phone_sup.toLowerCase().includes(query) ||
        supplier.address_sup.toLowerCase().includes(query)
      );
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [suppliers, searchQuery, sortField, sortDirection]);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedSuppliers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedSuppliers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedSuppliers.length / itemsPerPage);

  const stats = useMemo(() => {
    return {
      total: suppliers.length,
      withPhone: suppliers.filter(s => s.phone_sup).length,
      locations: new Set(suppliers.map(s => s.address_sup.split(',')[0])).size
    };
  }, [suppliers]);

  if (loading) {
    return (
      <PageLayout title="Supplier Management" icon={<Users size={28} />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-xl">Loading suppliers...</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Supplier Management" icon={<Users size={28} />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-red-600">
            <h2 className="mb-2 text-2xl font-bold">Error</h2>
            <p>{error}</p>
            <button
              onClick={loadSuppliers}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('suppliers.title')} icon={<Users size={28} />}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white border rounded-xl border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('suppliers.total')}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border rounded-xl border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('suppliers.active')}</p>
              <p className="mt-2 text-2xl font-bold text-green-600">{stats.total}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-50">
              <Mail className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border rounded-xl border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('suppliers.with_phone')}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats.withPhone}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50">
              <Phone className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border rounded-xl border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('suppliers.locations')}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{stats.locations}</p>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-50">
              <MapPin className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 mb-8 bg-white border rounded-xl border-slate-100">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t('suppliers.search_placeholder')}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadSuppliers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {t('common.refresh')}
            </button>
            {/* <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Download size={16} />
              {t('common.export')}
            </button> */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              {t('suppliers.add')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border rounded-xl border-slate-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="text-blue-600 animate-spin" size={32} />
          </div>
        ) : filteredAndSortedSuppliers.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="text-lg text-slate-600">{t('suppliers.no_suppliers')}</p>
            <p className="mt-2 text-sm text-slate-500">
              {searchQuery ? t('suppliers.try_adjusting') : t('suppliers.get_started')}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      ID
                    </th>
                    <th
                      onClick={() => handleSort('name_sup')}
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer text-slate-500 hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        {t('suppliers.table.name')}
                        {sortField === 'name_sup' && (
                          <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('email_sup')}
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer text-slate-500 hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        {t('suppliers.table.email')}
                        {sortField === 'email_sup' && (
                          <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('phone_sup')}
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer text-slate-500 hover:bg-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        {t('suppliers.table.phone')}
                        {sortField === 'phone_sup' && (
                          <span className="text-blue-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      {t('suppliers.table.address')}
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      {t('suppliers.table.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {paginatedSuppliers.map((supplier) => (
                    <tr key={supplier.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-900">
                        {supplier.id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-slate-900">
                        {supplier.name_sup}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                        {supplier.email_sup}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600">
                        {supplier.phone_sup}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {supplier.address_sup}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(supplier)}
                            className="p-2 text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                            title={t('common.edit')}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(supplier)}
                            className="p-2 transition-colors rounded-lg text-rose-600 hover:bg-rose-50"
                            title={t('common.delete')}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100 rounded-b-xl">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>per page</span>
                <span className="ml-4 font-medium text-slate-900">
                  {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedSuppliers.length)} of {filteredAndSortedSuppliers.length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 py-1.5 text-sm font-medium text-slate-700">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddSupplierModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSupplierAdded={loadSuppliers}
      />

      <EditSupplierModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSupplierUpdated={loadSuppliers}
        supplier={selectedSupplier}
      />

      <DeleteSupplierModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSupplierDeleted={loadSuppliers}
        supplierId={selectedSupplier?.id || null}
        supplierName={selectedSupplier?.name_sup || ""}
      />
    </PageLayout>
  );
}


