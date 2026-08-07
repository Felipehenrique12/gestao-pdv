import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { salesService, CreateSaleInput } from '../services/salesService';

export function useSales() {
  const queryClient = useQueryClient();

  const salesQuery = useQuery({
    queryKey: ['sales'],
    queryFn: salesService.getAll,
  });

  const createSaleMutation = useMutation({
    mutationFn: (input: CreateSaleInput) => salesService.createSale(input),
    onSuccess: (newSale) => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['stockMovements'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['cashFlow'] });
      toast.success(`Venda #${newSale.codigoVenda} finalizada com sucesso!`);
    },
    onError: (err: Error) => {
      toast.error(`Erro ao finalizar venda: ${err.message}`);
    },
  });

  return {
    sales: salesQuery.data || [],
    isLoading: salesQuery.isLoading,
    createSale: createSaleMutation.mutateAsync,
    isCreating: createSaleMutation.isPending,
  };
}
