import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supplierSchema, SupplierFormData } from '../../../schemas';
import { Supplier } from '../../../types';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierToEdit?: Supplier | null;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  isLoading?: boolean;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  supplierToEdit,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      inscricaoEstadual: '',
      email: '',
      telefone: '',
      contatoNome: '',
      prazoMedioEntregaDias: 5,
      condicoesPagamento: '30 Dias Neto',
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: 'SP',
      observacao: '',
    },
  });

  useEffect(() => {
    if (supplierToEdit) {
      reset({
        razaoSocial: supplierToEdit.razaoSocial,
        nomeFantasia: supplierToEdit.nomeFantasia || '',
        cnpj: supplierToEdit.cnpj,
        inscricaoEstadual: supplierToEdit.inscricaoEstadual || '',
        email: supplierToEdit.email,
        telefone: supplierToEdit.telefone,
        contatoNome: supplierToEdit.contatoNome || '',
        prazoMedioEntregaDias: supplierToEdit.prazoMedioEntregaDias || 5,
        condicoesPagamento: supplierToEdit.condicoesPagamento || '30 Dias Neto',
        cep: supplierToEdit.cep || '',
        logradouro: supplierToEdit.logradouro || '',
        numero: supplierToEdit.numero || '',
        bairro: supplierToEdit.bairro || '',
        cidade: supplierToEdit.cidade || '',
        uf: supplierToEdit.uf || 'SP',
        observacao: supplierToEdit.observacao || '',
      });
    } else {
      reset({
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
        inscricaoEstadual: '',
        email: '',
        telefone: '',
        contatoNome: '',
        prazoMedioEntregaDias: 5,
        condicoesPagamento: '30 Dias Neto',
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: 'SP',
        observacao: '',
      });
    }
  }, [supplierToEdit, reset]);

  const handleFormSubmit = async (data: SupplierFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={supplierToEdit ? 'Editar Fornecedor' : 'Novo Fornecedor'}
      description="Cadastre parceiros comerciais, prazos de entrega e termos de faturamento."
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Dados Empresariais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Razão Social *"
              placeholder="Ex: Distribuidora de Eletrônicos S/A"
              {...register('razaoSocial')}
              error={errors.razaoSocial?.message}
            />

            <Input
              label="Nome Fantasia"
              placeholder="Ex: Eletronics Distribuidora"
              {...register('nomeFantasia')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="CNPJ *"
              placeholder="00.000.000/0001-00"
              {...register('cnpj')}
              error={errors.cnpj?.message}
            />

            <Input
              label="Inscrição Estadual (IE)"
              placeholder="123.456.789.000"
              {...register('inscricaoEstadual')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="email"
              label="E-mail de Pedidos *"
              placeholder="pedidos@fornecedor.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Telefone *"
              placeholder="(11) 3333-4444"
              {...register('telefone')}
              error={errors.telefone?.message}
            />

            <Input
              label="Nome do Vendedor / Contato"
              placeholder="Ex: Rodrigo Santos"
              {...register('contatoNome')}
            />
          </div>
        </div>

        {/* Commercial Terms */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Condições Comerciais & Logística
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="number"
              label="Prazo Médio de Entrega (Dias) *"
              {...register('prazoMedioEntregaDias', { valueAsNumber: true })}
              error={errors.prazoMedioEntregaDias?.message}
            />

            <Input
              label="Condição Padrão de Faturamento"
              placeholder="Ex: 30 / 60 / 90 Dias ou A Vista"
              {...register('condicoesPagamento')}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {supplierToEdit ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
