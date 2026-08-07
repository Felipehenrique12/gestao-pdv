import React, { useState } from 'react';
import { useCustomers } from '../../../hooks/useCustomers';
import { Customer } from '../../../types';
import { PageHeader } from '../../layout/PageHeader';
import { Button } from '../../ui/Button';
import { Table, Column } from '../../ui/Table';
import { SearchInput } from '../../ui/SearchInput';
import { Select } from '../../ui/Select';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { CustomerFormModal } from './CustomerFormModal';
import { CustomerDetailDrawer } from './CustomerDetailDrawer';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { Plus, Edit2, Trash2, Eye, UserCheck } from 'lucide-react';

export const CustomersList: React.FC = () => {
  const { customers, isLoading, createCustomer, updateCustomer, deleteCustomer, isCreating, isUpdating, isDeleting } = useCustomers();

  const [search, setSearch] = useState('');
  const [personTypeFilter, setPersonTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [deletingCustomerId, setDeletingCustomerId] = useState<string | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.nomeRazao.toLowerCase().includes(search.toLowerCase()) ||
      c.cpfCnpj.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.telefone.includes(search);

    const matchesType = personTypeFilter ? c.tipoPessoa === personTypeFilter : true;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredCustomers.length / pageSize) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCustomer(c);
    setIsModalOpen(true);
  };

  const handleOpenView = (c: Customer) => {
    setViewingCustomer(c);
    setIsDrawerOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingCustomerId) {
      await deleteCustomer(deletingCustomerId);
      setDeletingCustomerId(null);
    }
  };

  const columns: Column<Customer>[] = [
    {
      key: 'cliente',
      header: 'Cliente / Razão Social',
      render: (c) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500/10 text-blue-600 font-bold text-xs flex items-center justify-center shrink-0">
            {c.nomeRazao.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{c.nomeRazao}</p>
            <p className="text-xs text-slate-500">{c.cpfCnpj} ({c.tipoPessoa})</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contato',
      header: 'Contatos',
      render: (c) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">{c.email}</span>
          <span className="text-[11px] text-slate-500">{c.telefone}</span>
        </div>
      ),
    },
    {
      key: 'localidade',
      header: 'Cidade / UF',
      render: (c) => (
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
          {c.cidade ? `${c.cidade}/${c.uf}` : 'Não informado'}
        </span>
      ),
    },
    {
      key: 'compras',
      header: 'Total em Compras',
      render: (c) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">
            {formatCurrency(c.totalComprado)}
          </span>
          <span className="text-[10px] text-slate-400">
            Última: {formatDate(c.ultimaCompra)}
          </span>
        </div>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      className: 'text-right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button size="icon" variant="ghost" onClick={() => handleOpenView(c)} title="Ver Perfil">
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button size="icon" variant="ghost" onClick={(e) => handleOpenEdit(c, e)} title="Editar">
            <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setDeletingCustomerId(c.id)} title="Excluir">
            <Trash2 className="w-4 h-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Clientes"
        description="Base unificada de clientes (Pessoa Física e Jurídica) com histórico financeiro."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
            Novo Cliente
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Buscar por nome, CPF/CNPJ, e-mail ou telefone..."
          className="w-full sm:w-80"
        />

        <Select
          options={[
            { value: '', label: 'Todos os Tipos' },
            { value: 'PF', label: 'Pessoa Física (PF)' },
            { value: 'PJ', label: 'Pessoa Jurídica (PJ)' },
          ]}
          value={personTypeFilter}
          onChange={(e) => setPersonTypeFilter(e.target.value)}
          className="w-full sm:w-48 text-xs"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedCustomers}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        onRowClick={handleOpenView}
        emptyText="Nenhum cliente cadastrado com esses termos."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredCustomers.length}
        pageSize={pageSize}
      />

      {/* Modals & Drawers */}
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customerToEdit={editingCustomer}
        onSubmit={async (data) => {
          if (editingCustomer) {
            await updateCustomer({ id: editingCustomer.id, data });
          } else {
            await createCustomer(data);
          }
        }}
        isLoading={isCreating || isUpdating}
      />

      <CustomerDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        customer={viewingCustomer}
      />

      <ConfirmDialog
        isOpen={!!deletingCustomerId}
        onClose={() => setDeletingCustomerId(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Cliente"
        description="Deseja realmente remover este cliente da base? O histórico de compras permanecerá arquivado nas vendas passadas."
        isLoading={isDeleting}
      />
    </div>
  );
};
