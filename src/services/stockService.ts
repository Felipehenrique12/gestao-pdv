import api from './api';
import { db } from './mockData';
import { StockMovement, StockMovementType } from '../types';
import { StockMovementFormData } from '../schemas';

export const stockService = {
  async getMovements(): Promise<StockMovement[]> {
    try {
      const response = await api.get<StockMovement[]>('/stock/movements');
      return response.data;
    } catch {
      return db.getStockMovements();
    }
  },

  async registerMovement(data: StockMovementFormData, userName = 'Usuário do Sistema'): Promise<StockMovement> {
    const products = db.getProducts();
    const product = products.find((p) => p.id === data.produtoId);

    if (!product) throw new Error('Produto não encontrado');

    const previousQty = product.quantidade;
    let newQty = previousQty;

    switch (data.tipo) {
      case 'entrada':
        newQty += data.quantidade;
        break;
      case 'saida':
      case 'perda':
        if (data.quantidade > previousQty) {
          throw new Error(`Quantidade indisponível em estoque. Atual: ${previousQty}`);
        }
        newQty -= data.quantidade;
        break;
      case 'ajuste':
        newQty = data.quantidade;
        break;
      case 'transferencia':
        newQty -= data.quantidade;
        break;
    }

    product.quantidade = Math.max(0, newQty);
    product.updatedAt = new Date().toISOString();
    db.saveProducts(products);

    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      produtoId: product.id,
      produtoNome: product.nome,
      produtoCodigo: product.codigo,
      tipo: data.tipo as StockMovementType,
      dataHora: new Date().toISOString(),
      quantidade: data.quantidade,
      quantidadeAnterior: previousQty,
      quantidadeAtual: product.quantidade,
      usuario: userName,
      motivo: data.motivo,
      observacao: data.observacao,
      origemDestino: data.origemDestino,
    };

    try {
      const response = await api.post<StockMovement>('/stock/movements', newMovement);
      return response.data;
    } catch {
      const currentMovements = db.getStockMovements();
      db.saveStockMovements([newMovement, ...currentMovements]);
      return newMovement;
    }
  },
};
