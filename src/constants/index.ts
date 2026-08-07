export const PRODUCT_CATEGORIES = [
  'Eletrônicos',
  'Informática',
  'Acessórios',
  'Escritório',
  'Móveis & Decoração',
  'Ferramentas',
  'Vestuário',
  'Alimentos & Bebidas',
  'Outros'
];

export const PRODUCT_UNITS = [
  { value: 'UN', label: 'Unidade (UN)' },
  { value: 'CX', label: 'Caixa (CX)' },
  { value: 'KG', label: 'Quilograma (KG)' },
  { value: 'M', label: 'Metro (M)' },
  { value: 'L', label: 'Litro (L)' },
  { value: 'PCT', label: 'Pacote (PCT)' },
  { value: 'PAR', label: 'Par (PAR)' },
  { value: 'FD', label: 'Fardo (FD)' }
];

export const PAYMENT_METHODS = [
  { value: 'pix', label: 'PIX', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  { value: 'dinheiro', label: 'Dinheiro', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  { value: 'credito', label: 'Cartão de Crédito', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  { value: 'debito', label: 'Cartão de Débito', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' }
];

export const STOCK_MOVEMENT_REASONS = [
  'Compra de fornecedor',
  'Venda de balcão',
  'Ajuste de inventário',
  'Avaria / Danificado',
  'Validade vencida',
  'Transferência de depósito',
  'Devolução de cliente',
  'Uso interno',
  'Outros'
];

export const AI_PRESET_QUESTIONS = [
  'Quais produtos devo comprar este mês?',
  'Quais produtos estão com estoque parado a mais de 30 dias?',
  'Qual é o meu produto campeão de vendas?',
  'Meu estoque atual está saudável em termos de giro?',
  'Quais despesas operacionais mais cresceram?',
  'Faça uma previsão de vendas para as próximas semanas.',
  'Qual a minha margem de lucro média por categoria?'
];

export const EXPENSE_CATEGORIES = [
  'Fornecedores / Mercadorias',
  'Aluguel & Condomínio',
  'Energia, Água & Internet',
  'Folha de Pagamento',
  'Impostos & Taxas',
  'Marketing & Vendas',
  'Manutenção & Equipamentos',
  'Logística & Frete',
  'Outras Despesas'
];
