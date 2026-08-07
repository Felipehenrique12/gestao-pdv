import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { financeService } from '../services/financeService';
import { AccountPayableFormData } from '../schemas';

export function useFinance() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ['accountsPayable'],
    queryFn: financeService.getAccountsPayable,
  });

  const cashFlowQuery = useQuery({
    queryKey: ['cashFlow'],
    queryFn: financeService.getCashFlow,
  });

  const createAccountMutation = useMutation({
    mutationFn: (data: AccountPayableFormData) => financeService.createAccountPayable(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountsPayable'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Conta a pagar cadastrada!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => financeService.markAccountAsPaid(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountsPayable'] });
      queryClient.invalidateQueries({ queryKey: ['cashFlow'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Conta marcada como PAGA e baixada no Fluxo de Caixa!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    accountsPayable: accountsQuery.data || [],
    isLoadingAccounts: accountsQuery.isLoading,
    cashFlow: cashFlowQuery.data || [],
    isLoadingCashFlow: cashFlowQuery.isLoading,
    createAccountPayable: createAccountMutation.mutateAsync,
    isCreatingAccount: createAccountMutation.isPending,
    markAccountAsPaid: markPaidMutation.mutateAsync,
    isMarkingPaid: markPaidMutation.isPending,
  };
}
