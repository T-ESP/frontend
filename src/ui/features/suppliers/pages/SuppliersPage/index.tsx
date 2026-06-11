import { useState, useEffect, useMemo } from 'react';
import { supplierService } from '@/infrastructure/api/services/supplierService';
import type { Supplier } from '@/domain/models/Supplier';
import {
  Edit, Trash2, Plus, RefreshCw, Search, X, Users, Mail, Phone, MapPin,
  ArrowLeft, Building2, Calendar, ExternalLink, ChevronRight, Eye,
} from 'lucide-react';
import { AddSupplierModal } from '@/ui/features/suppliers/components/AddSupplierModal';
import { EditSupplierModal } from '@/ui/features/suppliers/components/EditSupplierModal';
import { DeleteSupplierModal } from '@/ui/features/suppliers/components/DeleteSupplierModal';
import PageLayout from '../../../../components/layouts/PageLayout';
import { useTranslation } from 'react-i18next';
import { KpiStatCard, bucketByDay } from '@/ui/components/common/KpiStatCard/KpiStatCard';
import { Input } from '@/components/ui/input';

// ─── Supplier Profile View ────────────────────────────────────────────────────
function SupplierProfile({
  supplier,
  onBack,
  onEdit,
  onDelete,
}: {
  supplier: Supplier;
  onBack: () => void;
  onEdit: (s: Supplier) => void;
  onDelete: (s: Supplier) => void;
}) {
  const initial = supplier.name_sup.charAt(0).toUpperCase();
  const colors = [
    'from-purple-500 to-purple-700',
    'from-blue-500 to-blue-700',
    'from-emerald-500 to-emerald-700',
    'from-rose-500 to-rose-700',
  ];
  const colorIdx = supplier.id % colors.length;
  const gradient = colors[colorIdx];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </button>

      {/* Hero card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className={`h-28 bg-gradient-to-r ${gradient}`} />
        <div className="px-8 pb-8 -mt-12">
          <div className="flex items-end justify-between">
            <div
              className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-4xl font-black shadow-lg border-4 border-white`}
            >
              {initial}
            </div>
            <div className="flex gap-2 mb-2">
              <button
                onClick={() => onEdit(supplier)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Modifier
              </button>
              <button
                onClick={() => onDelete(supplier)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>

          <h2 className="mt-4 text-2xl font-black text-gray-900">{supplier.name_sup}</h2>
          <p className="text-sm text-gray-500 mt-0.5">Fournisseur #{supplier.id}</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Email */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Mail className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Email</span>
          </div>
          <p className="text-sm font-medium text-gray-900 break-all">{supplier.email_sup}</p>
          <a
            href={`mailto:${supplier.email_sup}`}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Envoyer un email
          </a>
        </div>

        {/* Phone */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-green-600">
            <Phone className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Téléphone</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{supplier.phone_sup || '—'}</p>
          {supplier.phone_sup && (
            <a
              href={`tel:${supplier.phone_sup}`}
              className="inline-flex items-center gap-1 text-xs text-green-600 hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              Appeler
            </a>
          )}
        </div>

        {/* Address */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-amber-600">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Adresse</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{supplier.address_sup || '—'}</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          Informations système
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">ID fournisseur</span>
            <p className="font-medium text-gray-900">#{supplier.id}</p>
          </div>
          <div>
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Créé le
            </span>
            <p className="font-medium text-gray-900">
              {supplier.created_at
                ? new Date(supplier.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })
                : '—'}
            </p>
          </div>
          <div>
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Dernière mise à jour
            </span>
            <p className="font-medium text-gray-900">
              {supplier.updated_at
                ? new Date(supplier.updated_at).toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })
                : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SuppliersPage() {
  const { t } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [profileSupplier, setProfileSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField] = useState<'name_sup' | 'email_sup' | 'phone_sup'>('name_sup');
  const [sortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { loadSuppliers(); }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load suppliers');
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

  const filteredAndSortedSuppliers = useMemo(() => {
    let filtered = suppliers.filter((s) => {
      const q = searchQuery.toLowerCase();
      return (
        s.id.toString().includes(q) ||
        s.name_sup.toLowerCase().includes(q) ||
        s.email_sup.toLowerCase().includes(q) ||
        s.phone_sup.toLowerCase().includes(q) ||
        s.address_sup.toLowerCase().includes(q)
      );
    });
    filtered.sort((a, b) => {
      const aV = a[sortField], bV = b[sortField];
      if (aV === null || aV === undefined) return 1;
      if (bV === null || bV === undefined) return -1;
      if (aV < bV) return sortDirection === 'asc' ? -1 : 1;
      if (aV > bV) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [suppliers, searchQuery, sortField, sortDirection]);

  const paginatedSuppliers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedSuppliers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedSuppliers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedSuppliers.length / itemsPerPage);

  const stats = useMemo(() => ({
    total: suppliers.length,
    withPhone: suppliers.filter((s) => s.phone_sup).length,
    locations: new Set(suppliers.map((s) => s.address_sup.split(',')[0])).size,
  }), [suppliers]);

  // ── Profile view ────────────────────────────────────────────────
  if (profileSupplier) {
    return (
      <PageLayout title={t('suppliers.title')} icon={<Users size={28} />}>
        <SupplierProfile
          supplier={profileSupplier}
          onBack={() => setProfileSupplier(null)}
          onEdit={(s) => { setSelectedSupplier(s); setShowEditModal(true); }}
          onDelete={(s) => { setSelectedSupplier(s); setShowDeleteModal(true); }}
        />
        <EditSupplierModal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setSelectedSupplier(null); }}
          onSupplierUpdated={async () => { await loadSuppliers(); setProfileSupplier(null); }}
          supplier={selectedSupplier}
        />
        <DeleteSupplierModal
          isOpen={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setSelectedSupplier(null); }}
          onSupplierDeleted={async () => { await loadSuppliers(); setProfileSupplier(null); }}
          supplierId={selectedSupplier?.id || null}
          supplierName={selectedSupplier?.name_sup || ''}
        />
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout title={t('suppliers.title')} icon={<Users size={28} />}>
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-white border rounded-xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-white border rounded-xl animate-pulse" />
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t('suppliers.title')} icon={<Users size={28} />}>
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center text-red-600">
            <h2 className="mb-2 text-2xl font-bold">Erreur</h2>
            <p>{error}</p>
            <button onClick={loadSuppliers} className="px-4 py-2 mt-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
              Réessayer
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('suppliers.title')} icon={<Users size={28} />}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <KpiStatCard
          title={t('suppliers.total')}
          value={stats.total.toString()}
          description="au total"
          chartData={bucketByDay(suppliers, (s) => s.created_at, (slice) => slice.length, 7)}
          chartType="bar"
        />
        <KpiStatCard
          title={t('suppliers.active')}
          value={stats.total.toString()}
          description="actifs"
          chartData={bucketByDay(suppliers, (s) => s.updated_at, (slice) => slice.length, 7)}
          chartType="line"
        />
        <KpiStatCard
          title={t('suppliers.with_phone')}
          value={stats.withPhone.toString()}
          description="contacts joignables"
          chartData={bucketByDay(
            suppliers.filter((s) => s.phone_sup),
            (s) => s.created_at,
            (slice) => slice.length,
            7,
          )}
          chartType="bar"
        />
        <KpiStatCard
          title={t('suppliers.locations')}
          value={stats.locations.toString()}
          description="localisations distinctes"
          chartData={bucketByDay(suppliers, (s) => s.created_at, (slice) => new Set(slice.map((x) => x.address_sup.split(',')[0])).size, 7)}
          chartType="bar"
        />
      </div>

      {/* Controls */}
      <div className="p-6 mb-6 bg-white border rounded-xl border-slate-100 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder={t('suppliers.search_placeholder')}
                className="h-10 pl-10 pr-10"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="absolute -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadSuppliers} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              {t('common.refresh')}
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Plus size={14} />
              {t('suppliers.add')}
            </button>
          </div>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      {filteredAndSortedSuppliers.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-100 rounded-xl shadow-sm">
          <Users className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-lg font-semibold text-slate-600">{t('suppliers.no_suppliers')}</p>
          <p className="mt-2 text-sm text-slate-400">
            {searchQuery ? t('suppliers.try_adjusting') : t('suppliers.get_started')}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginatedSuppliers.map((supplier) => {
              const initial = supplier.name_sup.charAt(0).toUpperCase();
              const colors = ['from-purple-500 to-purple-700', 'from-blue-500 to-blue-700', 'from-emerald-500 to-emerald-700', 'from-rose-500 to-rose-700'];
              const gradient = colors[supplier.id % colors.length];
              return (
                <div key={supplier.id} className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-lg font-black shadow-sm`}>
                          {initial}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-tight">
                            {supplier.name_sup}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">#{supplier.id}</p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                        Actif
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mail size={13} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{supplier.email_sup}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Phone size={13} className="text-slate-400 flex-shrink-0" />
                        <span>{supplier.phone_sup || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{supplier.address_sup || '—'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setProfileSupplier(supplier)}
                      className="flex items-center gap-1.5 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      <Eye size={13} />
                      Voir le profil
                      <ChevronRight size={12} />
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(supplier)} className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title={t('common.edit')}>
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDelete(supplier)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title={t('common.delete')}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border border-slate-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Afficher</span>
              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))} className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                {[6, 12, 24, 48].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <span>par page — <strong>{((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filteredAndSortedSuppliers.length)}</strong> sur {filteredAndSortedSuppliers.length}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Premier</button>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Préc.</button>
              <span className="flex items-center px-4 text-sm font-medium text-slate-700">Page {currentPage} / {totalPages || 1}</span>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage >= totalPages} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Suiv.</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage >= totalPages} className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">Dernier</button>
            </div>
          </div>
        </>
      )}

      <AddSupplierModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSupplierAdded={loadSuppliers} />
      <EditSupplierModal isOpen={showEditModal} onClose={() => { setShowEditModal(false); setSelectedSupplier(null); }} onSupplierUpdated={loadSuppliers} supplier={selectedSupplier} />
      <DeleteSupplierModal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedSupplier(null); }} onSupplierDeleted={loadSuppliers} supplierId={selectedSupplier?.id || null} supplierName={selectedSupplier?.name_sup || ''} />
    </PageLayout>
  );
}
