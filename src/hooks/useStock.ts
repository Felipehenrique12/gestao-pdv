import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { stockService } from '../services/stockService';
import { StockMovementFormData } from '../schemas';

export function useStock() {
  const queryClient = useQueryClient();

  const movementsQuery = useQuery({
    queryKey: ['stockMovements'],
    queryFn: stockService.getMovements,
  });

  const registerMovementMutation = useMutation({
    mutationFn: (data: StockMovementFormData) => stockService.registerMovement(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['stockMovements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success(`Movimentação de ${variables.tipo.toUpperCase()} registrada com sucesso!`);
    },
    onError: (err: Error) => {
      toast.error(`Erro na movimentação: ${err.message}`);
    },
  });

  return {
    movements: movementsQuery.data || [],
    isLoading: movementsQuery.isLoading,
    registerMovement: registerMovementMutation.mutateAsync,
    isRegistering: registerMovementMutation.isPending,
  };
}
