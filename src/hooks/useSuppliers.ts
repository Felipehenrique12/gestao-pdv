import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { suppliersService } from '../services/suppliersService';
import { SupplierFormData } from '../schemas';

export function useSuppliers() {
  const queryClient = useQueryClient();

  const suppliersQuery = useQuery({
    queryKey: ['suppliers'],
    queryFn: suppliersService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: SupplierFormData) => suppliersService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Fornecedor cadastrado com sucesso!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierFormData> }) =>
      suppliersService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Fornecedor atualizado!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => suppliersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Fornecedor removido!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    suppliers: suppliersQuery.data || [],
    isLoading: suppliersQuery.isLoading,
    createSupplier: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateSupplier: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteSupplier: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
