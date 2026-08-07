import React, { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { Product } from '../../../types';
import { PageHeader } from '../../layout/PageHeader';
import { Button } from '../../ui/Button';
import { Table, Column } from '../../ui/Table';
import { SearchInput } from '../../ui/SearchInput';
import { Select } from '../../ui/Select';
import { Badge } from '../../ui/Badge';
import { Pagination } from '../../ui/Pagination';
import { ConfirmDialog } from '../../ui/ConfirmDialog';
import { ProductFormModal } from './ProductFormModal';
import { ProductDetailDrawer } from './ProductDetailDrawer';
import { formatCurrency } from '../../../utils/formatters';
import { PRODUCT_CATEGORIES } from '../../../constants';
import { Plus, Edit2, Trash2, Eye, Package, Barcode } from 'lucide-react';

export const ProductsList: React.FC = () => {
  const { products, isLoading, createProduct, updateProduct, deleteProduct, isCreating, isUpdating, isDeleting } = useProducts();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Filters logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.codigoBarras.includes(search);

    const matchesCategory = selectedCategory ? p.categoria === selectedCategory : true;

    let matchesStock = true;
    if (stockFilter === 'baixo') matchesStock = p.quantidade <= p.quantidadeMinima;
    if (stockFilter === 'regular') matchesStock = p.quantidade > p.quantidadeMinima;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProduct(p);
    setIsModalOpen(true);
  };

  const handleOpenView = (p: Product) => {
    setViewingProduct(p);
    setIsDrawerOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingProductId) {
      await deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  const columns: Column<Product>[] = [
    {
      key: 'produto',
      header: 'Produto',
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
            {p.imagens && p.imagens.length > 0 ? (
              <img src={p.imagens[0].url} alt={p.nome} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400">
                <Package className="w-5 h-5" />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">{p.nome}</p>
            <p className="text-xs text-slate-500 font-mono">SKU: {p.codigo}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'categoria',
      header: 'Categoria & Marca',
      render: (p) => (
        <div>
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">{p.categoria}</span>
          <span className="text-[11px] text-slate-500">{p.marca}</span>
        </div>
      ),
    },
    {
      key: 'preco',
      header: 'Preço Venda (Margem)',
      render: (p) => (
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 block">
            {formatCurrency(p.precoVenda)}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Margem: {p.margemLucro}%
          </span>
        </div>
      ),
    },
    {
      key: 'estoque',
      header: 'Estoque Atual',
      render: (p) => {
        const isLow = p.quantidade <= p.quantidadeMinima;
        return (
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              {p.quantidade} {p.unidade}
            </span>
            {isLow ? (
              <Badge variant="danger" size="sm">Estoque Baixo</Badge>
            ) : (
              <Badge variant="success" size="sm">Regular</Badge>
            )}
          </div>
        );
      },
    },
    {
      key: 'fornecedor',
      header: 'Fornecedor',
      render: (p) => (
        <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[140px] block">
          {p.fornecedorNome || '-'}
        </span>
      ),
    },
    {
      key: 'acoes',
      header: 'Ações',
      className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleOpenView(p)}
            title="Visualizar Detalhes"
          >
            <Eye className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => handleOpenEdit(p, e)}
            title="Editar Produto"
          >
            <Edit2 className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setDeletingProductId(p.id)}
            title="Excluir Produto"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catálogo de Produtos"
        description="Gestão centralizada do portfólio, preços de custo/venda, margens e upload de imagens."
        actions={
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenCreate}>
            Novo Produto
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Buscar por nome, SKU ou código de barras..."
          className="w-full sm:w-80"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            options={[
              { value: '', label: 'Todas Categorias' },
              ...PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-44 text-xs"
          />

          <Select
            options={[
              { value: '', label: 'Todo Estoque' },
              { value: 'baixo', label: 'Apenas Estoque Baixo' },
              { value: 'regular', label: 'Estoque Regular' },
            ]}
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full sm:w-44 text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={paginatedProducts}
        keyExtractor={(p) => p.id}
        isLoading={isLoading}
        onRowClick={handleOpenView}
        emptyText="Nenhum produto cadastrado com esses filtros."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredProducts.length}
        pageSize={pageSize}
      />

      {/* Modals & Drawers */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
        onSubmit={async (data) => {
          if (editingProduct) {
            await updateProduct({ id: editingProduct.id, data });
          } else {
            await createProduct(data);
          }
        }}
        isLoading={isCreating || isUpdating}
      />

      <ProductDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={viewingProduct}
      />

      <ConfirmDialog
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleDeleteConfirm}
        title="Excluir Produto"
        description="Tem certeza que deseja excluir este produto do catálogo? Esta ação não poderá ser desfeita."
        isLoading={isDeleting}
      />
    </div>
  );
};
