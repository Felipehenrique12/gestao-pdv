import React, { useState } from 'react';
import { useAIAssistant } from '../../../hooks/useAIAssistant';
import { PageHeader } from '../../layout/PageHeader';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Badge } from '../../ui/Badge';
import { AIChatMessage } from '../../../types';
import { Bot, Send, Sparkles, AlertTriangle, TrendingUp, ShoppingBag, Lightbulb } from 'lucide-react';

export const AIAssistantView: React.FC = () => {
  const { insights, isLoadingInsights, askQuestion, isAsking } = useAIAssistant();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Olá! Sou seu Assistente de Inteligência Artificial do Estoque. Posso analisar o giro de vendas, prever demandas de compra e alertar sobre margens baixas. Como posso te ajudar hoje?',
      timestamp: new Date().toISOString(),
    },
  ]);

  const presetQuestions = [
    'Quais produtos devo comprar com urgência?',
    'Quais produtos estão sem giro (encalhados)?',
    'Qual é o meu produto com maior margem?',
    'Meu estoque atual está saudável?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    try {
      const responseText = await askQuestion({
        question: text,
        history: messages,
      });

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const getInsightIcon = (tipo: string) => {
    switch (tipo) {
      case 'alerta_reabastecimento': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'produto_sem_giro': return <ShoppingBag className="w-5 h-5 text-purple-500" />;
      case 'margem_baixa': return <TrendingUp className="w-5 h-5 text-rose-500" />;
      case 'tendencia_alta': return <Sparkles className="w-5 h-5 text-emerald-500" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assistente AI & Insights de Estoque"
        description="Analista virtual com Gemini AI para otimização de compras, detecção de gargalos e rentabilidade."
      />

      {/* Automatic AI Insights Cards Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-500" />
          Insights Automáticos Gerados pela Inteligência Artificial
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start gap-3.5 hover:border-purple-300 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                {getInsightIcon(insight.tipo)}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{insight.titulo}</h4>
                  <Badge variant={insight.nivelUrgencia === 'alta' ? 'danger' : 'info'} size="sm">
                    {insight.nivelUrgencia.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {insight.descricao}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                  <span>Ação Recomendada: {insight.acaoSugerida}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Chat Window */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-xl text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Gemini Stock AI</h3>
              <p className="text-[10px] text-slate-400">Análise Preditiva em Tempo Real</p>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Gemini 2.5 Active</Badge>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  AI
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isAsking && (
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-semibold italic p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>O assistente está analisando seu banco de dados comercial...</span>
            </div>
          )}
        </div>

        {/* Preset Pills */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 font-semibold shrink-0">Sugestões:</span>
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-full text-xs shrink-0 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Pergunte qualquer coisa sobre o estoque, fornecedores, lucro ou vendas..."
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={() => handleSendMessage()}
            isLoading={isAsking}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );
};
