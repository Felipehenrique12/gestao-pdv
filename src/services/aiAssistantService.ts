import api from './api';
import { db } from './mockData';
import { AIChatMessage, AIInsightCard } from '../types';

export const aiAssistantService = {
  async getInsights(): Promise<AIInsightCard[]> {
    try {
      const response = await api.get<AIInsightCard[]>('/ai/insights');
      return response.data;
    } catch {
      return [
        {
          id: 'ins-1',
          tipo: 'alerta_reabastecimento',
          titulo: 'Alerta de Reabastecimento Urgente',
          descricao: 'Teclado Logitech MX Keys Mini possui apenas 3 unidades em estoque. O limite mínimo é 6.',
          nivelUrgencia: 'alta',
          acaoSugerida: 'Criar pedido de compra para Ingram Micro Brasil (+15 unidades)',
        },
        {
          id: 'ins-2',
          tipo: 'tendencia_alta',
          titulo: 'Aumento na Procura de Monitores 4K',
          descricao: 'As vendas de monitores aumentaram 35% nos últimos 15 dias com margem média de 62.7%.',
          nivelUrgencia: 'media',
          acaoSugerida: 'Manter estoque de segurança em 10+ unidades',
        },
      ];
    }
  },

  async askQuestion(question: string, history: AIChatMessage[] = []): Promise<string> {
    const products = db.getProducts();
    const lowStock = products.filter((p) => p.quantidade <= p.quantidadeMinima);
    const topSales = [...products].sort((a, b) => b.quantidade - a.quantidade);
    const totalValuation = products.reduce((acc, p) => acc + p.quantidade * p.precoVenda, 0);

    const contextPayload = {
      question,
      history,
      stockSummary: {
        totalProducts: products.length,
        lowStockCount: lowStock.length,
        totalValuation,
        lowStockItems: lowStock.map((p) => ({ nome: p.nome, qty: p.quantidade, min: p.quantidadeMinima })),
        topProducts: topSales.slice(0, 3).map((p) => ({ nome: p.nome, qty: p.quantidade, preco: p.precoVenda })),
      },
    };

    try {
      const response = await api.post<{ text: string }>('/ai/chat', contextPayload);
      return response.data.text;
    } catch {
      const lowerQ = question.toLowerCase();

      if (lowerQ.includes('comprar') || lowerQ.includes('reabastecer')) {
        return (
          `Com base na análise do seu estoque atual, identifiquei **${lowStock.length} produtos** abaixo do ponto de reabastecimento mínimo:\n\n` +
          lowStock
            .map(
              (p) =>
                `• **${p.nome}**: Restam apenas **${p.quantidade} ${p.unidade}** (Mínimo: ${p.quantidadeMinima} ${p.unidade}). Sugestão de pedido: +${p.pontoReabastecimento * 2} un para o fornecedor *${p.fornecedorNome || 'Principal'}*.`
            )
            .join('\n') +
          `\n\n**Estimativa de Investimento:** R$ ${lowStock
            .reduce((acc, p) => acc + p.precoCusto * p.pontoReabastecimento * 2, 0)
            .toFixed(2)}`
        );
      } else if (lowerQ.includes('parado') || lowerQ.includes('encalhado')) {
        return `Analisando a velocidade de rotação do seu inventário:\n\n• **Mesa Dobrável de Escritório**: Possui 12 unidades em estoque e giro estimado de 45 dias.\n• **Mouse Sem Fio Ergonomico**: Estoque atual confortável para 30 dias de operação sem risco de ruptura.`;
      } else if (lowerQ.includes('vende mais') || lowerQ.includes('campeão')) {
        return `Seu produto com maior volume de estoque e giro de vendas ativo é:\n\n🏆 **${topSales[0]?.nome}** (${topSales[0]?.categoria})\n• Preço de Venda: R$ ${topSales[0]?.precoVenda.toFixed(2)}\n• Margem Média: ${topSales[0]?.margemLucro}%\n• Estoque Disponível: ${topSales[0]?.quantidade} unidades`;
      } else if (lowerQ.includes('saudável') || lowerQ.includes('saude')) {
        return `**Diagnóstico de Saúde do Estoque:**\n\n✅ Valor Total do Inventário: R$ ${totalValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n⚠️ Nível de Atenção: **${lowStock.length > 0 ? 'MÉDIO (Ação necessária em itens críticos)' : 'BOM (Estoque equilibrado)'}**\n📊 Taxa de Cobertura Estimada: 28 dias operacionais.`;
      } else {
        return `Entendi sua consulta sobre **"${question}"**!\n\nRevisando as métricas do seu sistema ERP:\n• **Total de Itens Cadastrados**: ${products.length} SKUs\n• **Valor Total de Venda em Prateleira**: R$ ${totalValuation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• **Alertas Ativos**: ${lowStock.length} produtos com necessidade imediata de reposição.\n\nComo posso ajudar a otimizar seus pedidos ou margens de lucro hoje?`;
      }
    }
  },
};
