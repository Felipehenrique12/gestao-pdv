import React, { useState } from 'react';
import { useSuppliers } from '../../../hooks/useSuppliers';
import { Supplier } from '../../../types';
import { PageHeader } from '../../layout/PageHeader';
import { Button } from '../../ui/Button';
import { Table, Column } from '../../ui/Table';
import { SearchInput } from '../../ui/SearchInput';
import { Pagination } from '../../ui/Pagination';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { SupplierFormModal } from './SupplierFormModal';
import { SupplierDetailDrawer } from './SupplierDetailDrawer';
import { Plus, Edit2, Trash2, Eye, Truck } from 'lucide-react';

export const SuppliersList: React.FC = () => {
  const { suppliers, isLoading, createSupplier, updateSupplier, deleteSupplier, isCreating, isUpdating, isDeleting } = useSuppliers();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [viewingSupplier, setViewingSupplier] = useState<Supplier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [deletingSupplierId, setDeletingSupplierId] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter((s) => {
    const razaoSocial = (s.razaoSocial ?? '').trim();
    const nomeFantasia = (s.nomeFantasia ?? '').trim();
    const cnpj = (s.cnpj ?? '').trim();
    const email = (s.email ?? '').trim();

    return (
      razaoSocial.toLowerCase().includes(search.toLowerCase()) ||
      nomeFantasia.toLowerCase().includes(search.toLowerCase()) ||
      cnpj.includes(search) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredSuppliers.length / pageSize) || 1;
  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Supplier, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSupplier(s);
    setIsModalOpen(true);
  };

  const handleOpenView = (s: Supplier) => {
    setViewingSupplier(s);
    setIsDrawerOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingSupplierId) {
      await deleteSupplier(deletingSupplierId);
      setDeletingSupplierId(null);
    }
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'fornecedor',
      header: 'Fornecedor / Razão Social',
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-500/10 text-teal-600 font-bold text-xs flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {s.nomeFantasia || s.razaoSocial}
            </p>
            <p className="text-xs text-slate-500">CNPJ: {s.cnpj}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contato',
      header: 'E-mail / Vendedor',
      render: (s) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">{s.email}</span>
          <span className="text-[11px] text-slate-500">{s.contatoNome || s.telefone}</span>
        </div>
      ),
    },
    {
      key: 'prazo',
      header: 'Prazo Entrega',
      render: (s) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {s.prazoMedioEntregaDias} Dias úteis
        </span>
      ),
    },
    {
      key: 'condicoes',
      header: 'Faturamento',
      render: (s) => (
        <span className="text-xs text-slate-600 dark:text-slate-400">
          {s.condicoesPagamento || 'Padrão'}
        </span>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      className: 'text-right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button size="icon" variant="ghost" onClick={() => handleOpenView(s)} title="Ver Detalhes">
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button size="icon" variant="ghost" onClick={(e) => handleOpenEdit(s, e)} title="Editar">
            <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setDeletingSupplierId(s.id)} title="Excluir">
            <Trash2 className="w-4 h-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão de Fornecedores"
        description="Cadastro de parceiros de reposição de estoque, prazos de entrega e compras."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
            Novo Fornecedor
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Buscar por razão social, nome fantasia ou CNPJ..."
          className="w-full sm:w-96"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedSuppliers}
        keyExtractor={(s) => s.id}
        isLoading={isLoading}
        onRowClick={handleOpenView}
        emptyText="Nenhum fornecedor encontrado."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredSuppliers.length}
        pageSize={pageSize}
      />

      {/* Modals & Drawers */}
      <SupplierFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        supplierToEdit={editingSupplier}
        onSubmit={async (data) => {
          if (editingSupplier) {
            await updateSupplier({ id: editingSupplier.id, data });
          } else {
            await createSupplier(data);
          }
        }}
        isLoading={isCreating || isUpdating}
      />

      <SupplierDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        supplier={viewingSupplier}
      />

      <ConfirmDialog
        isOpen={!!deletingSupplierId}
        onClose={() => setDeletingSupplierId(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Fornecedor"
        description="Tem certeza que deseja remover este fornecedor do cadastro? Os produtos vinculados perderão a associação primária."
        isLoading={isDeleting}
      />
    </div>
  );
};
