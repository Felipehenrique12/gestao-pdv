import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormData } from '../../../schemas';
import { Product, ProductImage } from '../../../types';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { MoneyInput } from '../../ui/MoneyInput';
import { Button } from '../../ui/Button';
import { ImageUploader } from '../../common/ImageUploader';
import { PRODUCT_CATEGORIES, PRODUCT_UNITS } from '../../../constants';
import { generateRandomBarcode } from '../../../utils/formatters';
import { useSuppliers } from '../../../hooks/useSuppliers';
import { Barcode, RefreshCw } from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSubmit: (data: ProductFormData & { imagens?: ProductImage[] }) => Promise<void>;
  isLoading?: boolean;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSubmit,
  isLoading = false,
}) => {
  const { suppliers } = useSuppliers();
  const [images, setImages] = useState<ProductImage[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      nome: '',
      codigo: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
      codigoBarras: generateRandomBarcode(),
      categoria: PRODUCT_CATEGORIES[0],
      marca: '',
      fornecedorId: suppliers[0]?.id || 'sup-1',
      unidade: 'UN',
      precoCusto: 0,
      precoVenda: 0,
      quantidade: 0,
      quantidadeMinima: 5,
      pontoReabastecimento: 10,
      localizacao: '',
      status: 'ativo',
      descricao: '',
    },
  });

  const cost = watch('precoCusto') || 0;
  const sale = watch('precoVenda') || 0;
  const computedMargin = cost > 0 ? (((sale - cost) / cost) * 100).toFixed(1) : '0.0';

  useEffect(() => {
    if (productToEdit) {
      reset({
        nome: productToEdit.nome,
        codigo: productToEdit.codigo,
        codigoBarras: productToEdit.codigoBarras,
        categoria: productToEdit.categoria,
        marca: productToEdit.marca,
        fornecedorId: productToEdit.fornecedorId,
        unidade: productToEdit.unidade,
        precoCusto: productToEdit.precoCusto,
        precoVenda: productToEdit.precoVenda,
        quantidade: productToEdit.quantidade,
        quantidadeMinima: productToEdit.quantidadeMinima,
        pontoReabastecimento: productToEdit.pontoReabastecimento,
        localizacao: productToEdit.localizacao,
        status: productToEdit.status,
        descricao: productToEdit.descricao,
      });
      setImages(productToEdit.imagens || []);
    } else {
      reset({
        nome: '',
        codigo: `PRD-${Math.floor(1000 + Math.random() * 9000)}`,
        codigoBarras: generateRandomBarcode(),
        categoria: PRODUCT_CATEGORIES[0],
        marca: '',
        fornecedorId: suppliers[0]?.id || 'sup-1',
        unidade: 'UN',
        precoCusto: 0,
        precoVenda: 0,
        quantidade: 0,
        quantidadeMinima: 5,
        pontoReabastecimento: 10,
        localizacao: '',
        status: 'ativo',
        descricao: '',
      });
      setImages([]);
    }
  }, [productToEdit, reset, suppliers]);

  const handleFormSubmit = async (data: ProductFormData) => {
    await onSubmit({ ...data, imagens: images });
    onClose();
  };

  const supplierOptions = suppliers.map((s) => ({
    value: s.id,
    label: `${s.nomeFantasia || s.razaoSocial} (${s.cnpj})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productToEdit ? 'Editar Produto' : 'Novo Produto'}
      description="Preencha os dados cadastrais, precificação e imagens do produto."
      size="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Informações Gerais
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome do Produto *"
              placeholder="Ex: Monitor LED 27 Full HD"
              {...register('nome')}
              error={errors.nome?.message}
            />

            <div className="flex gap-2">
              <Input
                label="Código SKU *"
                placeholder="PRD-1001"
                {...register('codigo')}
                error={errors.codigo?.message}
              />
              <Input
                label="Código de Barras"
                placeholder="789..."
                leftIcon={<Barcode className="w-4 h-4" />}
                {...register('codigoBarras')}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setValue('codigoBarras', generateRandomBarcode())}
                    title="Gerar código aleatório"
                    className="p-1 hover:text-blue-600 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                }
              />
            </div>

            <Select
              label="Categoria *"
              options={PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }))}
              {...register('categoria')}
              error={errors.categoria?.message}
            />

            <Input
              label="Marca / Fabricante *"
              placeholder="Ex: Dell, Logitech"
              {...register('marca')}
              error={errors.marca?.message}
            />

            <Select
              label="Fornecedor Principal *"
              options={supplierOptions}
              {...register('fornecedorId')}
              error={errors.fornecedorId?.message}
            />

            <Select
              label="Unidade de Medida *"
              options={PRODUCT_UNITS}
              {...register('unidade')}
              error={errors.unidade?.message}
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Precificação e Margem de Lucro
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Controller
              name="precoCusto"
              control={control}
              render={({ field }) => (
                <MoneyInput
                  label="Preço de Custo (R$) *"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.precoCusto?.message}
                />
              )}
            />

            <Controller
              name="precoVenda"
              control={control}
              render={({ field }) => (
                <MoneyInput
                  label="Preço de Venda (R$) *"
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.precoVenda?.message}
                />
              )}
            />

            <div className="w-full space-y-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Margem de Lucro Bruta
              </label>
              <div className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {computedMargin}%
              </div>
            </div>
          </div>
        </div>

        {/* Stock */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Estoque & Ponto de Reabastecimento
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="number"
              label="Quantidade Inicial *"
              {...register('quantidade', { valueAsNumber: true })}
              error={errors.quantidade?.message}
            />

            <Input
              type="number"
              label="Estoque Mínimo *"
              {...register('quantidadeMinima', { valueAsNumber: true })}
              error={errors.quantidadeMinima?.message}
            />

            <Input
              type="number"
              label="Ponto de Reabastecimento *"
              {...register('pontoReabastecimento', { valueAsNumber: true })}
              error={errors.pontoReabastecimento?.message}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Localização no Depósito"
              placeholder="Ex: Corredor A - Prateleira 2"
              {...register('localizacao')}
            />

            <Select
              label="Status *"
              options={[
                { value: 'ativo', label: 'Ativo' },
                { value: 'inativo', label: 'Inativo' },
                { value: 'descontinuado', label: 'Descontinuado' },
              ]}
              {...register('status')}
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1">
            Galeria de Imagens (Cloudinary)
          </h3>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
