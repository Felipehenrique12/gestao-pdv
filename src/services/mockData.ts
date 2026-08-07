import {
  Product,
  StockMovement,
  Customer,
  Supplier,
  Sale,
  AccountPayable,
  CashFlowEntry,
  MonthlyCashFlow,
  AIInsightCard,
} from '../types';

class LocalStorageDBClass {
  private getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to LocalStorage', e);
    }
  }

  // Initial Seed Data
  public initSeed(): void {
    if (!localStorage.getItem('nexerp_initialized')) {
      const initialProducts: Product[] = [
        {
          id: 'prd-1',
          nome: 'Monitor Dell UltraSharp 27" 4K USB-C',
          codigo: 'PRD-1001',
          codigoBarras: '7891234560012',
          categoria: 'Informática & Hardware',
          marca: 'Dell',
          fornecedorId: 'sup-1',
          fornecedorNome: 'Dell do Brasil Ltda',
          unidade: 'UN',
          precoCusto: 2150.0,
          precoVenda: 3499.0,
          margemLucro: 62.7,
          quantidade: 14,
          quantidadeMinima: 5,
          pontoReabastecimento: 8,
          localizacao: 'Corredor A - Prateleira 2',
          status: 'ativo',
          descricao: 'Monitor de alta fidelidade de cor para profissionais de design e tecnologia.',
          imagens: [
            {
              id: 'img-1',
              url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80',
              name: 'monitor-dell.jpg',
              isMain: true,
              order: 0,
            },
          ],
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prd-2',
          nome: 'Teclado Mecânico Sem Fio Logitech MX Keys Mini',
          codigo: 'PRD-1002',
          codigoBarras: '7891234560029',
          categoria: 'Periféricos & Acessórios',
          marca: 'Logitech',
          fornecedorId: 'sup-2',
          fornecedorNome: 'Ingram Micro Brasil',
          unidade: 'UN',
          precoCusto: 380.0,
          precoVenda: 699.9,
          margemLucro: 84.2,
          quantidade: 3, // Low stock alert!
          quantidadeMinima: 6,
          pontoReabastecimento: 10,
          localizacao: 'Corredor B - Gaveta 4',
          status: 'ativo',
          descricao: 'Teclado compacto ergonômico premium com digitação esférica e teclas iluminadas.',
          imagens: [
            {
              id: 'img-2',
              url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80',
              name: 'logitech-mx.jpg',
              isMain: true,
              order: 0,
            },
          ],
          createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prd-3',
          nome: 'Cadeira Ergonomica Mesh Pro Ajustável Ergodesign',
          codigo: 'PRD-1003',
          codigoBarras: '7891234560036',
          categoria: 'Móveis & Escritório',
          marca: 'Ergodesign',
          fornecedorId: 'sup-1',
          fornecedorNome: 'Dell do Brasil Ltda',
          unidade: 'UN',
          precoCusto: 850.0,
          precoVenda: 1599.0,
          margemLucro: 88.1,
          quantidade: 8,
          quantidadeMinima: 3,
          pontoReabastecimento: 5,
          localizacao: 'Depósito Principal - Setor C',
          status: 'ativo',
          descricao: 'Cadeira ergonômica com apoio lombar dinâmico e suporte de cabeça respirável.',
          imagens: [
            {
              id: 'img-3',
              url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=500&auto=format&fit=crop&q=80',
              name: 'cadeira-mesh.jpg',
              isMain: true,
              order: 0,
            },
          ],
          createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const initialCustomers: Customer[] = [
        {
          id: 'cli-1',
          tipoPessoa: 'PJ',
          nomeRazao: 'TechSolutions Desenvolvimento de Software Ltda',
          cpfCnpj: '12.345.678/0001-90',
          rgIe: '112.334.556.110',
          email: 'compras@techsolutions.com.br',
          telefone: '(11) 98765-4321',
          cep: '01310-100',
          logradouro: 'Av. Paulista',
          numero: '1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          uf: 'SP',
          observacao: 'Cliente corporativo com pagamento via faturamento 30 dias.',
          totalComprado: 18450.0,
          ultimaCompra: new Date(Date.now() - 3 * 86400000).toISOString(),
          createdAt: new Date(Date.now() - 90 * 86400000).toISOString(),
        },
        {
          id: 'cli-2',
          tipoPessoa: 'PF',
          nomeRazao: 'Carlos Eduardo Oliveira Santos',
          cpfCnpj: '321.654.987-00',
          email: 'carlos.santos@email.com',
          telefone: '(21) 97654-3210',
          cidade: 'Rio de Janeiro',
          uf: 'RJ',
          totalComprado: 3499.0,
          ultimaCompra: new Date(Date.now() - 10 * 86400000).toISOString(),
          createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
        },
      ];

      const initialSuppliers: Supplier[] = [
        {
          id: 'sup-1',
          razaoSocial: 'Dell do Brasil Computadores Ltda',
          nomeFantasia: 'Dell Brasil',
          cnpj: '72.381.189/0001-10',
          email: 'distribuidores@dell.com.br',
          telefone: '(11) 4004-0100',
          contatoNome: 'Roberto Vendedor Dell',
          prazoMedioEntregaDias: 4,
          condicoesPagamento: '28 / 56 Dias no Boleto',
          cidade: 'Hortolândia',
          uf: 'SP',
          produtosFornecidos: ['Monitores 4K', 'Desktops', 'Servidores'],
          createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
        },
        {
          id: 'sup-2',
          razaoSocial: 'Ingram Micro Brasil Distribuição S/A',
          nomeFantasia: 'Ingram Micro',
          cnpj: '01.520.123/0001-44',
          email: 'vendas@ingrammicro.com.br',
          telefone: '(11) 2078-4000',
          contatoNome: 'Juliana BDM Periféricos',
          prazoMedioEntregaDias: 2,
          condicoesPagamento: '30 Dias Faturado',
          cidade: 'Barueri',
          uf: 'SP',
          produtosFornecidos: ['Teclados Logitech', 'Mouses', 'Headsets'],
          createdAt: new Date(Date.now() - 100 * 86400000).toISOString(),
        },
      ];

      const initialMovements: StockMovement[] = [
        {
          id: 'mov-1',
          produtoId: 'prd-1',
          produtoNome: 'Monitor Dell UltraSharp 27" 4K USB-C',
          produtoCodigo: 'PRD-1001',
          tipo: 'entrada',
          dataHora: new Date(Date.now() - 5 * 86400000).toISOString(),
          quantidade: 10,
          quantidadeAnterior: 4,
          quantidadeAtual: 14,
          usuario: 'Felipe Comercial',
          motivo: 'Compra de fornecedor (NF 45892)',
          observacao: 'Lote recebido com nota fiscal conferida',
        },
      ];

      const initialAccountsPayable: AccountPayable[] = [
        {
          id: 'acc-1',
          descricao: 'Aluguel do Galpão Logístico',
          categoria: 'Aluguel & Condomínio',
          fornecedorId: 'sup-1',
          fornecedorNome: 'Imobiliária Central',
          valor: 4500.0,
          dataVencimento: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
          dataCompetencia: new Date().toISOString().split('T')[0],
          tipoCusto: 'fixo',
          status: 'pendente',
          parcelas: 1,
          formaPagamento: 'Boleto Bancário',
          createdAt: new Date().toISOString(),
        },
      ];

      const initialSales: Sale[] = [
        {
          id: 'sale-1',
          codigoVenda: 'VND-1041',
          clienteNome: 'Carlos Eduardo Oliveira Santos',
          dataHora: new Date(Date.now() - 10 * 86400000).toISOString(),
          itens: [
            {
              produtoId: 'prd-1',
              produtoNome: 'Monitor Dell UltraSharp 27" 4K USB-C',
              quantidade: 1,
              precoUnitario: 3499.0,
              desconto: 0,
              subtotal: 3499.0,
            },
          ],
          subtotal: 3499.0,
          descontoTotal: 0,
          acrescimoTotal: 0,
          valorTotal: 3499.0,
          pagamento: { pix: 3499.0, dinheiro: 0, cartaoCredito: 0, cartaoDebito: 0 },
          vendedor: 'Felipe Comercial',
          status: 'concluida',
        },
      ];

      this.setItem('products', initialProducts);
      this.setItem('customers', initialCustomers);
      this.setItem('suppliers', initialSuppliers);
      this.setItem('stockMovements', initialMovements);
      this.setItem('accountsPayable', initialAccountsPayable);
      this.setItem('sales', initialSales);
      localStorage.setItem('nexerp_initialized', 'true');
    }
  }

  // Getters & Setters
  public getProducts(): Product[] {
    return this.getItem('products', []);
  }

  public saveProducts(products: Product[]): void {
    this.setItem('products', products);
  }

  public getCustomers(): Customer[] {
    return this.getItem('customers', []);
  }

  public saveCustomers(customers: Customer[]): void {
    this.setItem('customers', customers);
  }

  public getSuppliers(): Supplier[] {
    return this.getItem('suppliers', []);
  }

  public saveSuppliers(suppliers: Supplier[]): void {
    this.setItem('suppliers', suppliers);
  }

  public getStockMovements(): StockMovement[] {
    return this.getItem('stockMovements', []);
  }

  public getMovements(): StockMovement[] {
    return this.getStockMovements();
  }

  public saveStockMovements(movements: StockMovement[]): void {
    this.setItem('stockMovements', movements);
  }

  public saveMovements(movements: StockMovement[]): void {
    this.saveStockMovements(movements);
  }

  public getAccountsPayable(): AccountPayable[] {
    return this.getItem('accountsPayable', []);
  }

  public saveAccountsPayable(accounts: AccountPayable[]): void {
    this.setItem('accountsPayable', accounts);
  }

  public getSales(): Sale[] {
    return this.getItem('sales', []);
  }

  public saveSales(sales: Sale[]): void {
    this.setItem('sales', sales);
  }

  public getCashFlow(): CashFlowEntry[] {
    return this.getItem('cashFlow', []);
  }

  public saveCashFlow(entries: CashFlowEntry[]): void {
    this.setItem('cashFlow', entries);
  }
}

export const db = new LocalStorageDBClass();
export const LocalStorageDB = db;
db.initSeed();
