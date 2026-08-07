import React, { useState } from 'react';
import { useStock } from '../../../hooks/useStock';
import { useProducts } from '../../../hooks/useProducts';
import { PageHeader } from '../../layout/PageHeader';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { Select } from '../../ui/Select';
import { Input } from '../../ui/Input';
import { Timeline } from '../../ui/Timeline';
import { STOCK_MOVEMENT_REASONS } from '../../../constants';
import { StockMovementType } from '../../../types';
import { ArrowDownRight, ArrowUpRight, RefreshCw, ArrowLeftRight, AlertTriangle, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockMovementSchema, StockMovementFormData } from '../../../schemas';

export const StockView: React.FC = () => {
  const { movements, isLoading, registerMovement, isRegistering } = useStock();
  const { products } = useProducts();

  const [activeModalType, setActiveModalType] = useState<StockMovementType | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StockMovementFormData>({
    resolver: zodResolver(stockMovementSchema) as any,
    defaultValues: {
      produtoId: '',
      tipo: 'entrada',
      quantidade: 1,
      motivo: STOCK_MOVEMENT_REASONS[0],
      observacao: '',
      origemDestino: '',
    },
  });

  const handleOpenModal = (type: StockMovementType) => {
    setActiveModalType(type);
    reset({
      produtoId: products[0]?.id || '',
      tipo: type,
      quantidade: 1,
      motivo:
        type === 'entrada'
          ? 'Compra de fornecedor'
          : type === 'saida'
          ? 'Venda de balcão'
          : type === 'perda'
          ? 'Avaria / Danificado'
          : 'Ajuste de inventário',
      observacao: '',
      origemDestino: '',
    });
  };

  const handleFormSubmit = async (data: StockMovementFormData) => {
    await registerMovement(data);
    setActiveModalType(null);
  };

  // Filter movements
  const filteredMovements = movements.filter((m) => {
    const matchesType = filterType ? m.tipo === filterType : true;
    const matchesProduct = selectedProductId ? m.produtoId === selectedProductId : true;
    return matchesType && matchesProduct;
  });

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.nome} (Atual: ${p.quantidade} ${p.unidade})`,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Controle & Movimentação de Estoque"
        description="Lançamentos físicos de entradas, saídas, ajustes, transferências e histórico em timeline."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="success"
              size="sm"
              leftIcon={<ArrowDownRight className="w-4 h-4" />}
              onClick={() => handleOpenModal('entrada')}
            >
              Entrada
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<ArrowUpRight className="w-4 h-4" />}
              onClick={() => handleOpenModal('saida')}
            >
              Saída
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => handleOpenModal('ajuste')}
            >
              Ajuste
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowLeftRight className="w-4 h-4" />}
              onClick={() => handleOpenModal('transferencia')}
            >
              Transferência
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              leftIcon={<AlertTriangle className="w-4 h-4" />}
              onClick={() => handleOpenModal('perda')}
            >
              Perda
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Filter className="w-4 h-4 text-blue-500" />
          <span>Filtrar Histórico:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            options={[
              { value: '', label: 'Todos os Produtos' },
              ...products.map((p) => ({ value: p.id, label: p.nome })),
            ]}
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full sm:w-56 text-xs"
          />

          <Select
            options={[
              { value: '', label: 'Todos os Tipos' },
              { value: 'entrada', label: 'Entradas' },
              { value: 'saida', label: 'Saídas' },
              { value: 'ajuste', label: 'Ajustes' },
              { value: 'transferencia', label: 'Transferências' },
              { value: 'perda', label: 'Perdas / Avarias' },
            ]}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-44 text-xs"
          />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
          Linha do Tempo de Lançamentos ({filteredMovements.length})
        </h3>
        <Timeline movements={filteredMovements} />
      </div>

      {/* Movement Modal */}
      <Modal
        isOpen={!!activeModalType}
        onClose={() => setActiveModalType(null)}
        title={`Registrar Movimentação: ${activeModalType?.toUpperCase()}`}
        description="Lançamento com auditoria física e atualização de saldo em tempo real."
        size="md"
      >
        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-4">
          <Select
            label="Selecione o Produto *"
            options={productOptions}
            {...register('produtoId')}
            error={errors.produtoId?.message}
          />

          <Input
            type="number"
            label="Quantidade *"
            {...register('quantidade', { valueAsNumber: true })}
            error={errors.quantidade?.message}
          />

          <Select
            label="Motivo *"
            options={STOCK_MOVEMENT_REASONS.map((r) => ({ value: r, label: r }))}
            {...register('motivo')}
            error={errors.motivo?.message}
          />

          {activeModalType === 'transferencia' && (
            <Input
              label="Depósito Origem / Destino *"
              placeholder="Ex: Depósito A -> Depósito B"
              {...register('origemDestino')}
            />
          )}

          <Input
            label="Observações / Nota Fiscal"
            placeholder="Ex: NF-e #45821 aprovada"
            {...register('observacao')}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={() => setActiveModalType(null)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isRegistering}>
              Confirmar Lançamento
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
