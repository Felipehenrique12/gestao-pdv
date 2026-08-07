import api from './api';
import { db } from './mockData';
import { AccountPayable, CashFlowEntry, MonthlyCashFlow } from '../types';
import { AccountPayableFormData } from '../schemas';

export const financeService = {
  async getAccountsPayable(): Promise<AccountPayable[]> {
    try {
      const response = await api.get<AccountPayable[]>('/finance/accounts-payable');
      return response.data;
    } catch {
      return db.getAccountsPayable();
    }
  },

  async createAccountPayable(data: AccountPayableFormData): Promise<AccountPayable> {
    const suppliers = db.getSuppliers();
    const sup = suppliers.find((s) => s.id === data.fornecedorId);

    const newAccount: AccountPayable = {
      id: `acc-${Date.now()}`,
      ...data,
      fornecedorNome: sup?.nomeFantasia || sup?.razaoSocial,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await api.post<AccountPayable>('/finance/accounts-payable', newAccount);
      return response.data;
    } catch {
      const accounts = db.getAccountsPayable();
      db.saveAccountsPayable([newAccount, ...accounts]);
      return newAccount;
    }
  },

  async markAccountAsPaid(id: string): Promise<AccountPayable> {
    const accounts = db.getAccountsPayable();
    const account = accounts.find((a) => a.id === id);
    if (!account) throw new Error('Conta não encontrada');

    account.status = 'pago';
    account.dataPagamento = new Date().toISOString().split('T')[0];
    db.saveAccountsPayable(accounts);

    // Register expense in cash flow
    const cashFlow = db.getCashFlow();
    cashFlow.unshift({
      id: `cf-${Date.now()}`,
      data: new Date().toISOString().split('T')[0],
      descricao: `Pagamento Despesa: ${account.descricao}`,
      tipo: 'saida',
      categoria: account.categoria,
      valor: account.valor,
      origem: 'despesa',
      referenciaId: account.id,
    });
    db.saveCashFlow(cashFlow);

    return account;
  },

  async getCashFlow(): Promise<MonthlyCashFlow[]> {
    try {
      const response = await api.get<MonthlyCashFlow[]>('/finance/cash-flow');
      return response.data;
    } catch {
      // Mock consolidated monthly cash flow
      return [
        { mes: 'Jan', entradas: 42000, saidas: 18000, saldo: 24000 },
        { mes: 'Fev', entradas: 48500, saidas: 21000, saldo: 27500 },
        { mes: 'Mar', entradas: 52000, saidas: 19500, saldo: 32500 },
        { mes: 'Abr', entradas: 61000, saidas: 24000, saldo: 37000 },
        { mes: 'Mai', entradas: 58000, saidas: 22000, saldo: 36000 },
        { mes: 'Jun', entradas: 69450, saidas: 26800, saldo: 42650 },
      ];
    }
  },
};
