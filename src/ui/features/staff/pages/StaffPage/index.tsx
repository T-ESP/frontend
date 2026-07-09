import { useState, useEffect, useMemo } from 'react';
import { staffService } from '@/infrastructure/api/services/staffService';
import type { Staff } from '@/domain/models/Staff';
import { Edit, Trash2, Plus, UserCog, RefreshCw, Search, X, UserCheck, UserX } from 'lucide-react';
import { AddStaffModal } from '@/ui/features/staff/components/AddStaffModal';
import { EditStaffModal } from '@/ui/features/staff/components/EditStaffModal';
import { DeleteStaffModal } from '@/ui/features/staff/components/DeleteStaffModal';
import PageLayout from '@/ui/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ROLE_LABEL: Record<string, string> = {
  employee: 'Employé',
  manager: 'Manager',
};

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les employés');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member: Staff) => {
    setSelectedStaff(member);
    setShowEditModal(true);
  };

  const handleDelete = (member: Staff) => {
    setSelectedStaff(member);
    setShowDeleteModal(true);
  };

  const filteredStaff = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return staff.filter((member) =>
      member.firstname.toLowerCase().includes(query) ||
      member.lastname.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  }, [staff, searchQuery]);

  const stats = useMemo(() => {
    const active = staff.filter((s) => s.status === 'active').length;
    return { total: staff.length, active, inactive: staff.length - active };
  }, [staff]);

  return (
    <PageLayout
      title="Employés"
      subtitle="Gère les comptes de ton équipe — chacun se connecte avec ses propres identifiants."
      actions={
        <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Ajouter un employé
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <UserCog className="text-muted-foreground" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Actifs</p>
              <p className="text-2xl font-bold text-emerald-500 mt-2">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <UserCheck className="text-emerald-500" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Inactifs</p>
              <p className="text-2xl font-bold text-muted-foreground mt-2">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <UserX className="text-muted-foreground" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" size={20} />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un employé..."
              className="h-10 pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={loadStaff}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 text-muted-foreground bg-card border border-border rounded-lg hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualiser
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-muted-foreground/70" size={32} />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadStaff}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="mx-auto text-muted-foreground/70 mb-4" size={48} />
            <p className="text-muted-foreground text-lg">Aucun employé</p>
            <p className="text-muted-foreground/80 text-sm mt-2">
              {searchQuery ? 'Essaie une autre recherche.' : 'Ajoute ton premier employé pour lui donner accès au dashboard.'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">ID</TableHead>
                <TableHead className="px-6">Nom</TableHead>
                <TableHead className="px-6">Email</TableHead>
                <TableHead className="px-6">Rôle</TableHead>
                <TableHead className="px-6">Statut</TableHead>
                <TableHead className="px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="px-6 py-4 text-sm">{member.id}</TableCell>
                  <TableCell className="px-6 py-4 text-sm font-medium">
                    {member.firstname} {member.lastname}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {ROLE_LABEL[member.role] ?? member.role}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      <span
                        className={`size-1.5 rounded-full ${
                          member.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'
                        }`}
                      />
                      {member.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(member)}>
                        <Edit />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(member)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onStaffAdded={loadStaff}
      />

      <EditStaffModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onStaffUpdated={loadStaff}
        staff={selectedStaff}
      />

      <DeleteStaffModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onStaffDeleted={loadStaff}
        staffId={selectedStaff?.id || null}
        staffName={selectedStaff ? `${selectedStaff.firstname} ${selectedStaff.lastname}` : ""}
      />
    </PageLayout>
  );
}
