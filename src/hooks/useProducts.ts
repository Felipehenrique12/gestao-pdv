import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { productsService } from '../services/productsService';
import { ProductFormData } from '../schemas';
import { Product } from '../types';

export function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData & { imagens?: Product['imagens'] }) =>
      productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Produto cadastrado com sucesso!');
    },
    onError: (err: Error) => {
      toast.error(`Erro ao cadastrar produto: ${err.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> & { imagens?: Product['imagens'] } }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Produto atualizado com sucesso!');
    },
    onError: (err: Error) => {
      toast.error(`Erro ao atualizar produto: ${err.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Produto excluído com sucesso!');
    },
    onError: (err: Error) => {
      toast.error(`Erro ao excluir produto: ${err.message}`);
    },
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    refetch: productsQuery.refetch,
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
