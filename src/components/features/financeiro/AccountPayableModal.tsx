import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountPayableSchema, AccountPayableFormData } from '../../../schemas';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { MoneyInput } from '../../ui/MoneyInput';
import { DatePicker } from '../../ui/DatePicker';
import { Button } from '../../ui/Button';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../../../constants';
import { useSuppliers } from '../../../hooks/useSuppliers';

interface AccountPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AccountPayableFormData) => Promise<void>;
  isLoading?: boolean;
}

export const AccountPayableModal: React.FC<AccountPayableModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const { suppliers } = useSuppliers();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AccountPayableFormData>({
    resolver: zodResolver(accountPayableSchema) as any,
    defaultValues: {
      descricao: '',
      categoria: EXPENSE_CATEGORIES[0],
      fornecedorId: suppliers[0]?.id || 'sup-1',
      valor: 100,
      dataVencimento: new Date().toISOString().split('T')[0],
      dataCompetencia: new Date().toISOString().split('T')[0],
      tipoCusto: 'fixo',
      parcelas: 1,
      formaPagamento: PAYMENT_METHODS[0].label,
      observacao: '',
    },
  });

  const handleFormSubmit = async (data: AccountPayableFormData) => {
    await onSubmit(data);
    onClose();
    reset();
  };

  const supplierOptions = [
    { value: 'sem-fornecedor', label: '-- Despesa Sem Fornecedor Vinculado --' },
    ...suppliers.map((s) => ({ value: s.id, label: s.nomeFantasia || s.razaoSocial })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nova Conta a Pagar"
      description="Lançamento financeiro de despesa, vencimento e provisão no Fluxo de Caixa."
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-4">
        <Input
          label="Descrição da Conta / Fatura *"
          placeholder="Ex: Aluguel do Galpão Comercial"
          {...register('descricao')}
          error={errors.descricao?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Categoria Financeira *"
            options={EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c }))}
            {...register('categoria')}
            error={errors.categoria?.message}
          />

          <Select
            label="Fornecedor Vinculado"
            options={supplierOptions}
            {...register('fornecedorId')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="valor"
            control={control}
            render={({ field }) => (
              <MoneyInput
                label="Valor Total (R$) *"
                value={field.value}
                onChange={field.onChange}
                error={errors.valor?.message}
              />
            )}
          />

          <Select
            label="Tipo de Custo *"
            options={[
              { value: 'fixo', label: 'Custo Fixo (Recorrente)' },
              { value: 'variavel', label: 'Custo Variável' },
            ]}
            {...register('tipoCusto')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DatePicker
            label="Data de Vencimento *"
            {...register('dataVencimento')}
            error={errors.dataVencimento?.message}
          />

          <DatePicker
            label="Data de Competência *"
            {...register('dataCompetencia')}
            error={errors.dataCompetencia?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="number"
            label="Número de Parcelas *"
            {...register('parcelas', { valueAsNumber: true })}
            error={errors.parcelas?.message}
          />

          <Select
            label="Forma de Pagamento Prevista *"
            options={PAYMENT_METHODS.map((m) => ({ value: m.label, label: m.label }))}
            {...register('formaPagamento')}
          />
        </div>

        <Input
          label="Observações / Anotações"
          placeholder="Ex: Boleto disponível no portal do banco"
          {...register('observacao')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Lançar Conta a Pagar
          </Button>
        </div>
      </form>
    </Modal>
  );
};
