import React, { useState } from 'react';
import { useFinance } from '../../../hooks/useFinance';
import { PageHeader } from '../../layout/PageHeader';
import { Button } from '../../ui/Button';
import { Table, Column } from '../../ui/Table';
import { SearchInput } from '../../ui/SearchInput';
import { Select } from '../../ui/Select';
import { Badge } from '../../ui/Badge';
import { ChartCard } from '../../ui/ChartCard';
import { AccountPayableModal } from './AccountPayableModal';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { AccountPayable } from '../../../types';
import { EXPENSE_CATEGORIES } from '../../../constants';
import {
  Plus,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Receipt,
  CreditCard,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const FinanceView: React.FC = () => {
  const { accountsPayable, isLoadingAccounts, cashFlow, isLoadingCashFlow, createAccountPayable, markAccountAsPaid, isCreatingAccount, isMarkingPaid } = useFinance();

  const [activeTab, setActiveTab] = useState<'contas' | 'fluxo'>('contas');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAccounts = accountsPayable.filter((acc) => {
    const matchesSearch =
      acc.descricao.toLowerCase().includes(search.toLowerCase()) ||
      (acc.fornecedorNome && acc.fornecedorNome.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter ? acc.status === statusFilter : true;
    const matchesCategory = categoryFilter ? acc.categoria === categoryFilter : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPending = accountsPayable
    .filter((a) => a.status === 'pendente')
    .reduce((sum, a) => sum + a.valor, 0);

  const totalPaid = accountsPayable
    .filter((a) => a.status === 'pago')
    .reduce((sum, a) => sum + a.valor, 0);

  const columns: Column<AccountPayable>[] = [
    {
      key: 'descricao',
      header: 'Descrição / Categoria',
      render: (a) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{a.descricao}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-500">{a.categoria}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 font-medium">
              {a.tipoCusto.toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'fornecedor',
      header: 'Fornecedor Vinculado',
      render: (a) => (
        <span className="text-xs text-slate-700 dark:text-slate-300">
          {a.fornecedorNome || '-'}
        </span>
      ),
    },
    {
      key: 'vencimento',
      header: 'Vencimento',
      render: (a) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {formatDate(a.dataVencimento)}
        </span>
      ),
    },
    {
      key: 'valor',
      header: 'Valor Total',
      render: (a) => (
        <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
          {formatCurrency(a.valor)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (a) => (
        <Badge variant={a.status === 'pago' ? 'success' : 'warning'}>
          {a.status === 'pago' ? 'PAGO' : 'PENDENTE'}
        </Badge>
      ),
    },
    {
      key: 'acoes',
      header: 'Baixa / Ações',
      className: 'text-right',
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          {a.status === 'pendente' ? (
            <Button
              size="sm"
              variant="success"
              leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              onClick={() => markAccountAsPaid(a.id)}
              isLoading={isMarkingPaid}
            >
              Baixar (Pagar)
            </Button>
          ) : (
            <span className="text-xs text-slate-400 font-mono italic">
              Baixado em {formatDate(a.dataPagamento)}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestão Financeira & Fluxo de Caixa"
        description="Contas a pagar, liquidação de despesas, conciliação e visão consolidada de entradas e saídas."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Nova Conta a Pagar
          </Button>
        }
      />

      {/* Tabs bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('contas')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'contas'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Contas a Pagar ({accountsPayable.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fluxo')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'fluxo'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Fluxo de Caixa Consolidado</span>
        </button>
      </div>

      {activeTab === 'contas' ? (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">
                  Contas Pendentes de Pagamento
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  {formatCurrency(totalPending)}
                </p>
              </div>
              <div className="p-3 bg-amber-500/20 text-amber-600 rounded-xl">
                <Receipt className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
                  Total Pago e Baixado
                </p>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="p-3 bg-emerald-500/20 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              placeholder="Buscar por descrição ou fornecedor..."
              className="w-full sm:w-80"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                options={[
                  { value: '', label: 'Todos os Status' },
                  { value: 'pendente', label: 'Pendente' },
                  { value: 'pago', label: 'Pago' },
                ]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-40 text-xs"
              />

              <Select
                options={[
                  { value: '', label: 'Todas Categorias' },
                  ...EXPENSE_CATEGORIES.map((c) => ({ value: c, label: c })),
                ]}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full sm:w-48 text-xs"
              />
            </div>
          </div>

          {/* Accounts Payable Table */}
          <Table
            columns={columns}
            data={filteredAccounts}
            keyExtractor={(a) => a.id}
            isLoading={isLoadingAccounts}
            emptyText="Nenhuma conta a pagar encontrada."
          />
        </>
      ) : (
        /* Cash Flow Tab */
        <div className="space-y-6">
          <ChartCard
            title="Evolução Mensal do Fluxo de Caixa (Entradas vs Saídas)"
            subtitle="Receitas de vendas em relação a despesas operacionais liquidadas"
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={cashFlow || []}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="entradas" name="Entradas (Vendas)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="saidas" name="Saídas (Despesas)" fill="#f43f5e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="saldo" name="Saldo Líquido" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Account Payable Creation Modal */}
      <AccountPayableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (data) => {
          await createAccountPayable(data);
        }}
        isLoading={isCreatingAccount}
      />
    </div>
  );
};
