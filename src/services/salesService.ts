import api from './api';
import { db } from './mockData';
import { Sale, SaleItem, SalePaymentSplit, StockMovement } from '../types';

export interface CreateSaleInput {
  clienteId?: string;
  clienteNome: string;
  itens: SaleItem[];
  descontoTotal: number;
  acrescimoTotal: number;
  pagamento: SalePaymentSplit;
  vendedor: string;
}

export const salesService = {
  async getAll(): Promise<Sale[]> {
    try {
      const response = await api.get<Sale[]>('/sales');
      return response.data;
    } catch {
      return db.getSales();
    }
  },

  async createSale(input: CreateSaleInput): Promise<Sale> {
    const code = `VND-${Math.floor(1000 + Math.random() * 9000)}`;

    const itemsSubtotal = input.itens.reduce((acc, item) => acc + item.subtotal, 0);
    const totalFinal = Math.max(0, itemsSubtotal - input.descontoTotal + input.acrescimoTotal);

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      codigoVenda: code,
      clienteId: input.clienteId,
      clienteNome: input.clienteNome || 'Cliente Não Identificado',
      dataHora: new Date().toISOString(),
      itens: input.itens,
      subtotal: itemsSubtotal,
      descontoTotal: input.descontoTotal,
      acrescimoTotal: input.acrescimoTotal,
      valorTotal: totalFinal,
      pagamento: input.pagamento,
      vendedor: input.vendedor || 'Operador de Caixa',
      status: 'concluida',
    };

    // 1. Deduct product quantities and register stock movements
    const products = db.getProducts();
    const movements = db.getStockMovements();

    input.itens.forEach((item) => {
      const prod = products.find((p) => p.id === item.produtoId);
      if (prod) {
        const prevQty = prod.quantidade;
        prod.quantidade = Math.max(0, prod.quantidade - item.quantidade);
        prod.updatedAt = new Date().toISOString();

        const mov: StockMovement = {
          id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          produtoId: prod.id,
          produtoNome: prod.nome,
          produtoCodigo: prod.codigo,
          tipo: 'saida',
          dataHora: new Date().toISOString(),
          quantidade: item.quantidade,
          quantidadeAnterior: prevQty,
          quantidadeAtual: prod.quantidade,
          usuario: input.vendedor || 'Caixa PDV',
          motivo: `Venda PDV (#${code})`,
        };
        movements.unshift(mov);
      }
    });

    db.saveProducts(products);
    db.saveStockMovements(movements);

    // 2. Update customer statistics if identified
    if (input.clienteId) {
      const customers = db.getCustomers();
      const customer = customers.find((c) => c.id === input.clienteId);
      if (customer) {
        customer.totalComprado += totalFinal;
        customer.ultimaCompra = new Date().toISOString();
        db.saveCustomers(customers);
      }
    }

    // Save sale
    try {
      const response = await api.post<Sale>('/sales', newSale);
      return response.data;
    } catch {
      const sales = db.getSales();
      db.saveSales([newSale, ...sales]);
      return newSale;
    }
  },
};
