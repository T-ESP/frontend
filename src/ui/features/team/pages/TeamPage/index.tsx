import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { userService } from '@/infrastructure/api/services/userService';
import type { User } from '@/domain/models/User';
import { Edit, Trash2, Plus, User as UserIcon, RefreshCw, Search, X, Download, Users as UsersIcon, Phone, UserCheck, UserX } from 'lucide-react';
import { AddUserModal } from '@/ui/features/users/components/AddUserModal';
import { EditUserModal } from '@/ui/features/users/components/EditUserModal';
import { DeleteUserModal } from '@/ui/features/users/components/DeleteUserModal';
import PageLayout from '../../../../components/layouts/PageLayout';
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

function SortableHead({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
}: {
  label: string;
  field: keyof User;
  sortField: keyof User;
  sortDirection: 'asc' | 'desc';
  onSort: (field: keyof User) => void;
}) {
  const isActive = sortField === field;
  return (
    <TableHead
      className="cursor-pointer select-none px-6 hover:bg-muted/40"
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-2">
        {label}
        {isActive && (
          <span className="text-xs text-muted-foreground">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </span>
    </TableHead>
  );
}

export default function TeamPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof User>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const csv = [
      ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Status'],
      ...users.map(u => [u.id, u.firstname, u.lastname, u.email, u.phone || '', u.status || 'active'])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.id.toString().includes(query) ||
        user.firstname.toLowerCase().includes(query) ||
        user.lastname.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.toLowerCase().includes(query))
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
  }, [users, searchQuery, sortField, sortDirection]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage);

  const stats = useMemo(() => {
    const activeUsers = users.filter(u => u.status === 'active').length;
    const inactiveUsers = users.length - activeUsers;
    return {
      total: users.length,
      active: activeUsers,
      inactive: inactiveUsers,
      withPhone: users.filter(u => u.phone).length
    };
  }, [users]);

  if (loading) {
    return (
      <PageLayout title={t('team.members.title')} icon={<UsersIcon size={28} />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-xl">{t('team.members.loading')}</div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title={t('team.members.title')} icon={<UsersIcon size={28} />}>
        <div className="flex items-center justify-center min-h-100">
          <div className="text-red-600">
            <h2 className="text-2xl font-bold mb-2">{t('team.members.error_title')}</h2>
            <p>{error}</p>
            <button
              onClick={loadUsers}
              className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {t('team.members.retry')}
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title={t('team.members.title')} icon={<UsersIcon size={28} />}>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('team.members.total')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <UsersIcon className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('team.members.active_label')}</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <UserCheck className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('team.members.inactive_label')}</p>
              <p className="text-2xl font-bold text-slate-500 mt-2">{stats.inactive}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center">
              <UserX className="text-slate-500" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{t('team.members.with_phone')}</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{stats.withPhone}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Phone className="text-indigo-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={t('team.members.search_placeholder')}
                className="h-10 pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadUsers}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {t('team.members.refresh')}
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Download size={16} />
              {t('team.members.export')}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={16} />
              {t('team.members.add')}
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin text-gray-400" size={32} />
          </div>
        ) : filteredAndSortedUsers.length === 0 ? (
          <div className="text-center py-12">
            <UserIcon className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600 text-lg">{t('team.members.no_members')}</p>
            <p className="text-slate-500 text-sm mt-2">
              {searchQuery ? t('team.members.try_adjusting') : t('team.members.get_started')}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHead label={t('team.members.table.id')} field="id" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHead label={t('team.members.table.name')} field="firstname" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <SortableHead label={t('team.members.table.email')} field="email" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHead className="px-6">{t('team.members.table.phone')}</TableHead>
                  <SortableHead label={t('team.members.table.status')} field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHead className="px-6">{t('team.members.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-6 py-4 text-sm">{user.id}</TableCell>
                    <TableCell className="px-6 py-4 text-sm font-medium">
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {user.phone || '-'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        <span
                          className={`size-1.5 rounded-full ${
                            user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'
                          }`}
                        />
                        {user.status === 'active' ? t('team.status.active') : t('team.status.inactive')}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(user)}
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

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-100 rounded-b-xl">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>{t('team.members.pagination.show')}</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>{t('team.members.pagination.per_page')}</span>
                <span className="ml-4 font-medium text-slate-900">
                  {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} {t('team.members.pagination.of')} {filteredAndSortedUsers.length}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('team.members.pagination.first')}
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('team.members.pagination.previous')}
                </button>
                <span className="flex items-center px-4 py-1.5 text-sm font-medium text-slate-700">
                  {t('team.members.pagination.page')} {currentPage} {t('team.members.pagination.of')} {totalPages || 1}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('team.members.pagination.next')}
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t('team.members.pagination.last')}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onUserAdded={loadUsers}
      />

      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUserUpdated={loadUsers}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onUserDeleted={loadUsers}
        userId={selectedUser?.id || null}
        userName={selectedUser ? `${selectedUser.firstname} ${selectedUser.lastname}` : ""}
      />
    </PageLayout>
  );
}
