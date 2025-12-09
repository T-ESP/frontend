import { useState, useEffect } from 'react';
import { supplierService } from '@/infrastructure/api/services/supplierService';
import type { Supplier } from '@/domain/models/Supplier';
import { FiEdit2, FiTrash, FiPlus } from 'react-icons/fi';
import { AddSupplierModal } from '@/components/suppliers/AddSupplierModal';
import { EditSupplierModal } from '@/components/suppliers/EditSupplierModal';
import { DeleteSupplierModal } from '@/components/suppliers/DeleteSupplierModal';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement des fournisseurs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">
          <h2 className="text-2xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
          <button
            onClick={loadSuppliers}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fournisseurs</h1>
            <p className="text-gray-600 mt-2">
              {suppliers.length} fournisseur{suppliers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={20} />
            Ajouter un fournisseur
          </button>
        </div>

        {suppliers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">Aucun fournisseur trouvé</p>
            <p className="text-gray-500 text-sm mt-2">
              Ajoutez un fournisseur pour commencer
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Téléphone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.name_sup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.email_sup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supplier.phone_sup}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {supplier.address_sup}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <FiTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    </>
  );
}


