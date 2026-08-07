import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, CustomerFormData } from '../../../schemas';
import { Customer } from '../../../types';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Button } from '../../ui/Button';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isLoading?: boolean;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  customerToEdit,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema) as any,
    defaultValues: {
      tipoPessoa: 'PF',
      nomeRazao: '',
      cpfCnpj: '',
      rgIe: '',
      email: '',
      telefone: '',
      cep: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      uf: 'SP',
      observacao: '',
    },
  });

  const tipoPessoa = watch('tipoPessoa');

  useEffect(() => {
    if (customerToEdit) {
      reset({
        tipoPessoa: customerToEdit.tipoPessoa,
        nomeRazao: customerToEdit.nomeRazao,
        cpfCnpj: customerToEdit.cpfCnpj,
        rgIe: customerToEdit.rgIe || '',
        email: customerToEdit.email,
        telefone: customerToEdit.telefone,
        cep: customerToEdit.cep || '',
        logradouro: customerToEdit.logradouro || '',
        numero: customerToEdit.numero || '',
        bairro: customerToEdit.bairro || '',
        cidade: customerToEdit.cidade || '',
        uf: customerToEdit.uf || 'SP',
        observacao: customerToEdit.observacao || '',
      });
    } else {
      reset({
        tipoPessoa: 'PF',
        nomeRazao: '',
        cpfCnpj: '',
        rgIe: '',
        email: '',
        telefone: '',
        cep: '',
        logradouro: '',
        numero: '',
        bairro: '',
        cidade: '',
        uf: 'SP',
        observacao: '',
      });
    }
  }, [customerToEdit, reset]);

  const handleFormSubmit = async (data: CustomerFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customerToEdit ? 'Editar Cliente' : 'Novo Cliente'}
      description="Cadastro completo de pessoa física ou jurídica para faturamento."
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
        {/* Person Type & Primary Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Dados Cadastrais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Tipo de Pessoa *"
              options={[
                { value: 'PF', label: 'Pessoa Física (PF)' },
                { value: 'PJ', label: 'Pessoa Jurídica (PJ)' },
              ]}
              {...register('tipoPessoa')}
            />

            <div className="sm:col-span-2">
              <Input
                label={tipoPessoa === 'PJ' ? 'Razão Social *' : 'Nome Completo *'}
                placeholder={tipoPessoa === 'PJ' ? 'Empresa Exemplo LTDA' : 'João da Silva'}
                {...register('nomeRazao')}
                error={errors.nomeRazao?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={tipoPessoa === 'PJ' ? 'CNPJ *' : 'CPF *'}
              placeholder={tipoPessoa === 'PJ' ? '12.345.678/0001-90' : '123.456.789-00'}
              {...register('cpfCnpj')}
              error={errors.cpfCnpj?.message}
            />

            <Input
              label={tipoPessoa === 'PJ' ? 'Inscrição Estadual (IE)' : 'RG'}
              placeholder="Isento ou código"
              {...register('rgIe')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="email"
              label="E-mail *"
              placeholder="cliente@email.com"
              {...register('email')}
              error={errors.email?.message}
            />

            <Input
              label="Telefone / WhatsApp *"
              placeholder="(11) 98765-4321"
              {...register('telefone')}
              error={errors.telefone?.message}
            />
          </div>
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Endereço de Entrega e Cobrança
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="CEP" placeholder="01000-000" {...register('cep')} />
            <div className="sm:col-span-2">
              <Input label="Logradouro" placeholder="Rua / Avenida" {...register('logradouro')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Número" placeholder="123" {...register('numero')} />
            <Input label="Bairro" placeholder="Centro" {...register('bairro')} />
            <div className="flex gap-2">
              <Input label="Cidade" placeholder="São Paulo" {...register('cidade')} />
              <Input label="UF" placeholder="SP" className="w-16 uppercase" {...register('uf')} />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {customerToEdit ? 'Salvar Alterações' : 'Cadastrar Cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
