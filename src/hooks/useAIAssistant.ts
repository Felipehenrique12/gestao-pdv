import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiAssistantService } from '../services/aiAssistantService';
import { AIChatMessage } from '../types';

export function useAIAssistant() {
  const queryClient = useQueryClient();

  const insightsQuery = useQuery({
    queryKey: ['aiInsights'],
    queryFn: aiAssistantService.getInsights,
  });

  const askMutation = useMutation({
    mutationFn: ({ question, history }: { question: string; history: AIChatMessage[] }) =>
      aiAssistantService.askQuestion(question, history),
  });

  return {
    insights: insightsQuery.data || [],
    isLoadingInsights: insightsQuery.isLoading,
    askQuestion: askMutation.mutateAsync,
    isAsking: askMutation.isPending,
  };
}
