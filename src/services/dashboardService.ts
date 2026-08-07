import { db } from './mockData';
import { DashboardStats, DateRangeFilter } from '../types';

export const dashboardService = {
  async getDashboardStats(filter?: DateRangeFilter): Promise<DashboardStats> {
    const products = db.getProducts();
    const customers = db.getCustomers();
    const suppliers = db.getSuppliers();
    const accounts = db.getAccountsPayable();
    const sales = db.getSales();

    const lowStock = products.filter((p) => p.quantidade <= p.quantidadeMinima);

    // Revenue calculations
    const salesTotal = sales.reduce((acc, s) => acc + s.valorTotal, 0);
    const faturamentoTotal = 42850.0 + salesTotal;

    // Accounts payable
    const pendingAccounts = accounts.filter((a) => a.status === 'pendente' || a.status === 'atrasada');
    const valorContasPagar = pendingAccounts.reduce((acc, a) => acc + a.valor, 0);

    return {
      faturamentoTotal,
      faturamentoVariacao: 14.2,
      lucroTotal: faturamentoTotal * 0.42,
      lucroVariacao: 9.8,
      produtosCadastrados: products.length,
      produtosEstoqueBaixo: lowStock.length,
      totalClientes: customers.length,
      totalFornecedores: suppliers.length,
      contasPagarPendent: pendingAccounts.length,
      valorContasPagar,
      contasReceberPendent: 4,
      valorContasReceber: 18400.0,
    };
  },

  async getChartEntradasSaidas() {
    return [
      { mes: 'Jan', entradas: 32000, saidas: 24000 },
      { mes: 'Fev', entradas: 41000, saidas: 28500 },
      { mes: 'Mar', entradas: 38000, saidas: 26000 },
      { mes: 'Abr', entradas: 45000, saidas: 31000 },
      { mes: 'Mai', entradas: 52000, saidas: 34000 },
      { mes: 'Jun', entradas: 48000, saidas: 32000 },
      { mes: 'Jul', entradas: 56000, saidas: 37500 },
      { mes: 'Ago', entradas: 62000, saidas: 41000 },
    ];
  },

  async getChartVendasPorMes() {
    return [
      { mes: 'Jan', vendas: 28000, metas: 25000 },
      { mes: 'Fev', vendas: 35000, metas: 30000 },
      { mes: 'Mar', vendas: 32000, metas: 30000 },
      { mes: 'Abr', vendas: 42000, metas: 35000 },
      { mes: 'Mai', vendas: 48000, metas: 40000 },
      { mes: 'Jun', vendas: 44000, metas: 40000 },
      { mes: 'Jul', vendas: 51000, metas: 45000 },
      { mes: 'Ago', vendas: 58000, metas: 50000 },
    ];
  },

  async getChartProdutosMaisVendidos() {
    return [
      { nome: 'Monitor LED 27"', quantidade: 84, valor: 83991.6 },
      { nome: 'Mouse Ergonomico 4000 DPI', quantidade: 142, valor: 26965.8 },
      { nome: 'Teclado Mecânico RGB', quantidade: 68, valor: 23793.2 },
      { nome: 'Mesa Dobrável Escritório', quantidade: 31, valor: 13950.0 },
      { nome: 'Cadeira Presidente Mesh', quantidade: 18, valor: 21420.0 },
    ];
  },

  async getChartCategorias() {
    return [
      { name: 'Eletrônicos', value: 42, color: '#3b82f6' },
      { name: 'Acessórios', value: 25, color: '#8b5cf6' },
      { name: 'Informática', value: 18, color: '#10b981' },
      { name: 'Escritório', value: 10, color: '#f59e0b' },
      { name: 'Móveis', value: 5, color: '#ec4899' },
    ];
  },

  async getChartGiroEstoque() {
    return [
      { categoria: 'Acessórios', diasMedios: 12 },
      { categoria: 'Informática', diasMedios: 18 },
      { categoria: 'Eletrônicos', diasMedios: 22 },
      { categoria: 'Escritório', diasMedios: 35 },
      { categoria: 'Móveis', diasMedios: 48 },
    ];
  },
};
