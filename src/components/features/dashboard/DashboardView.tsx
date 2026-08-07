import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../../services/dashboardService';
import { StatCard } from '../../ui/StatCard';
import { ChartCard } from '../../ui/ChartCard';
import { DateFilterPeriod } from '../../../types';
import { formatCurrency, formatNumber } from '../../../utils/formatters';
import {
  DollarSign,
  TrendingUp,
  Package,
  AlertTriangle,
  Users,
  Truck,
  CreditCard,
  Receipt,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const [period, setPeriod] = useState<DateFilterPeriod>('mes');

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats', period],
    queryFn: () => dashboardService.getDashboardStats({ periodo: period }),
  });

  const { data: entradasSaidas } = useQuery({
    queryKey: ['chartEntradasSaidas'],
    queryFn: dashboardService.getChartEntradasSaidas,
  });

  const { data: vendasMes } = useQuery({
    queryKey: ['chartVendasMes'],
    queryFn: dashboardService.getChartVendasPorMes,
  });

  const { data: produtosMaisVendidos } = useQuery({
    queryKey: ['chartProdutosMaisVendidos'],
    queryFn: dashboardService.getChartProdutosMaisVendidos,
  });

  const { data: categorias } = useQuery({
    queryKey: ['chartCategorias'],
    queryFn: dashboardService.getChartCategorias,
  });

  const { data: giroEstoque } = useQuery({
    queryKey: ['chartGiroEstoque'],
    queryFn: dashboardService.getChartGiroEstoque,
  });

  const periodOptions: { value: DateFilterPeriod; label: string }[] = [
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Semana' },
    { value: 'mes', label: 'Mês' },
    { value: 'ano', label: 'Ano' },
  ];

  return (
    <div className="space-y-6">
      {/* Date Period Filters */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>Filtrar por Período:</span>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {periodOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                period === opt.value
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Faturamento"
          value={formatCurrency(stats?.faturamentoTotal)}
          variation={stats?.faturamentoVariacao}
          icon={<DollarSign className="w-5 h-5" />}
          iconBgColor="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          title="Lucro Estimado"
          value={formatCurrency(stats?.lucroTotal)}
          variation={stats?.lucroVariacao}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBgColor="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Produtos Cadastrados"
          value={formatNumber(stats?.produtosCadastrados)}
          subtitle="Itens ativos no catálogo"
          icon={<Package className="w-5 h-5" />}
          iconBgColor="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Estoque Baixo"
          value={formatNumber(stats?.produtosEstoqueBaixo)}
          subtitle="Necessitam reabastecimento"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconBgColor="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          title="Clientes Ativos"
          value={formatNumber(stats?.totalClientes)}
          subtitle="Base total de clientes"
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
        />
        <StatCard
          title="Fornecedores"
          value={formatNumber(stats?.totalFornecedores)}
          subtitle="Parceiros homologados"
          icon={<Truck className="w-5 h-5" />}
          iconBgColor="bg-teal-500/10 text-teal-600 dark:text-teal-400"
        />
        <StatCard
          title="Contas a Pagar"
          value={formatCurrency(stats?.valorContasPagar)}
          subtitle={`${stats?.contasPagarPendent} faturas pendentes`}
          icon={<CreditCard className="w-5 h-5" />}
          iconBgColor="bg-rose-500/10 text-rose-600 dark:text-rose-400"
        />
        <StatCard
          title="Contas a Receber"
          value={formatCurrency(stats?.valorContasReceber)}
          subtitle={`${stats?.contasReceberPendent} títulos em aberto`}
          icon={<Receipt className="w-5 h-5" />}
          iconBgColor="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
        />
      </div>

      {/* Main Analytical Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entradas x Saídas */}
        <ChartCard
          title="Entradas x Saídas de Estoque"
          subtitle="Comparativo de movimentação física de mercadorias"
        >
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={entradasSaidas || []}>
              <defs>
                <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Area type="monotone" dataKey="entradas" name="Entradas (R$)" stroke="#10b981" fillOpacity={1} fill="url(#colorEntradas)" />
              <Area type="monotone" dataKey="saidas" name="Saídas (R$)" stroke="#f43f5e" fillOpacity={1} fill="url(#colorSaidas)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Vendas por Mês */}
        <ChartCard
          title="Vendas por Mês vs Meta"
          subtitle="Evolução do faturamento comercial bruto"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={vendasMes || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="vendas" name="Realizado (R$)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="metas" name="Meta (R$)" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Produtos mais Vendidos */}
        <ChartCard
          title="Produtos Mais Vendidos"
          subtitle="Top 5 produtos com maior giro comercial"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart layout="vertical" data={produtosMaisVendidos || []}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="nome" type="category" stroke="#94a3b8" fontSize={11} width={130} />
              <Tooltip formatter={(value: number) => `${value} unidades`} />
              <Bar dataKey="quantidade" name="Quantidade Vendida" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Distribuição por Categorias */}
        <ChartCard
          title="Distribuição por Categorias"
          subtitle="Participação das categorias no portfólio"
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categorias || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {(categorias || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};
