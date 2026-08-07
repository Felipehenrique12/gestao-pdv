export type ProductStatus = 'ativo' | 'inativo' | 'descontinuado';

export interface ProductImage {
  id: string;
  url: string;
  name: string;
  isMain?: boolean;
  order: number;
}

export interface Product {
  id: string;
  nome: string;
  codigo: string;
  codigoBarras: string;
  categoria: string;
  marca: string;
  fornecedorId: string;
  fornecedorNome?: string;
  unidade: string; // UN, KG, CX, M, L, Lote, etc.
  precoCusto: number;
  precoVenda: number;
  margemLucro: number; // calculated %
  quantidade: number;
  quantidadeMinima: number;
  pontoReabastecimento: number;
  localizacao: string; // e.g., "Corredor A - Prateleira 3"
  status: ProductStatus;
  descricao: string;
  imagens: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export type StockMovementType = 'entrada' | 'saida' | 'ajuste' | 'transferencia' | 'perda';

export interface StockMovement {
  id: string;
  produtoId: string;
  produtoNome: string;
  produtoCodigo: string;
  tipo: StockMovementType;
  dataHora: string;
  quantidade: number;
  quantidadeAnterior: number;
  quantidadeAtual: number;
  usuario: string;
  motivo: string;
  observacao?: string;
  origemDestino?: string;
}

export interface Customer {
  id: string;
  tipoPessoa: 'PF' | 'PJ';
  nomeRazao: string;
  cpfCnpj: string;
  rgIe?: string;
  email: string;
  telefone: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  observacao?: string;
  totalComprado: number;
  ultimaCompra?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Supplier {
  id: string;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  email: string;
  telefone: string;
  contatoNome?: string;
  prazoMedioEntregaDias: number;
  condicoesPagamento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  observacao?: string;
  produtosFornecidos?: string[];
  createdAt: string;
}

export type PaymentMethod = 'pix' | 'dinheiro' | 'credito' | 'debito';

export interface PaymentDetail {
  metodo: PaymentMethod;
  valor: number;
  percentual?: number;
}

export interface CartItem {
  produto: Product;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  subtotal: number;
}

export interface SaleItem {
  produtoId: string;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  subtotal: number;
}

export interface SalePaymentSplit {
  pix: number;
  dinheiro: number;
  cartaoCredito: number;
  cartaoDebito: number;
}

export interface Sale {
  id: string;
  codigoVenda: string;
  clienteId?: string;
  clienteNome: string;
  dataHora: string;
  itens: SaleItem[];
  subtotal: number;
  descontoTotal: number;
  acrescimoTotal: number;
  valorTotal: number;
  pagamento: SalePaymentSplit;
  vendedor: string;
  status: 'concluida' | 'cancelada';
}

export type AccountType = 'fixo' | 'variavel';
export type AccountStatus = 'pago' | 'pendente' | 'atrasada' | 'cancelada';

export interface AccountPayable {
  id: string;
  descricao: string;
  categoria: string;
  fornecedorId?: string;
  fornecedorNome?: string;
  valor: number;
  dataVencimento: string;
  dataCompetencia: string;
  tipoCusto: AccountType;
  status: AccountStatus;
  parcelas: number;
  formaPagamento: string;
  dataPagamento?: string;
  observacao?: string;
  createdAt: string;
}

export interface CashFlowEntry {
  id: string;
  data: string;
  descricao: string;
  tipo: 'entrada' | 'saida';
  categoria: string;
  valor: number;
  origem: 'venda' | 'despesa' | 'investimento' | 'outros';
  referenciaId?: string;
}

export interface MonthlyCashFlow {
  mes: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export type DateFilterPeriod = 'hoje' | 'semana' | 'mes' | 'ano' | 'personalizado';

export interface DateRangeFilter {
  periodo: DateFilterPeriod;
  inicio?: string;
  fim?: string;
}

export interface DashboardStats {
  faturamentoTotal: number;
  faturamentoVariacao: number;
  lucroTotal: number;
  lucroVariacao: number;
  produtosCadastrados: number;
  produtosEstoqueBaixo: number;
  totalClientes: number;
  totalFornecedores: number;
  contasPagarPendent: number;
  valorContasPagar: number;
  contasReceberPendent: number;
  valorContasReceber: number;
}

export interface AIInsightCard {
  id: string;
  tipo: 'alerta_reabastecimento' | 'produto_sem_giro' | 'margem_baixa' | 'tendencia_alta';
  titulo: string;
  descricao: string;
  nivelUrgencia: 'alta' | 'media' | 'baixa';
  acaoSugerida: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface GlobalSearchResultItem {
  id: string;
  tipo: 'produto' | 'cliente' | 'fornecedor' | 'venda' | 'despesa';
  titulo: string;
  subtitulo: string;
  url: string;
  badge?: string;
}
