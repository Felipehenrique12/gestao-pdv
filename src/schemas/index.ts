import { z } from 'zod';

export const productSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  codigo: z.string().min(1, 'Código é obrigatório'),
  codigoBarras: z.string().default(''),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  marca: z.string().min(1, 'Marca é obrigatória'),
  fornecedorId: z.string().min(1, 'Selecione um fornecedor'),
  unidade: z.string().min(1, 'Selecione a unidade'),
  precoCusto: z.number().min(0, 'Preço de custo inválido'),
  precoVenda: z.number().min(0.01, 'Preço de venda deve ser maior que zero'),
  quantidade: z.number().int().min(0, 'Quantidade não pode ser negativa'),
  quantidadeMinima: z.number().int().min(0, 'Quantidade mínima inválida'),
  pontoReabastecimento: z.number().int().min(0, 'Ponto de reabastecimento inválido'),
  localizacao: z.string().default(''),
  status: z.enum(['ativo', 'inativo', 'descontinuado']).default('ativo'),
  descricao: z.string().default(''),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const stockMovementSchema = z.object({
  produtoId: z.string().min(1, 'Selecione o produto'),
  tipo: z.enum(['entrada', 'saida', 'ajuste', 'transferencia', 'perda']),
  quantidade: z.number().int().min(1, 'A quantidade deve ser de pelo menos 1'),
  motivo: z.string().min(2, 'Informe o motivo da movimentação'),
  observacao: z.string().default(''),
  origemDestino: z.string().default(''),
});

export type StockMovementFormData = z.infer<typeof stockMovementSchema>;

export const customerSchema = z.object({
  tipoPessoa: z.enum(['PF', 'PJ']).default('PF'),
  nomeRazao: z.string().min(2, 'Nome ou Razão Social é obrigatório'),
  cpfCnpj: z.string().min(11, 'CPF ou CNPJ inválido'),
  rgIe: z.string().default(''),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  cep: z.string().default(''),
  logradouro: z.string().default(''),
  numero: z.string().default(''),
  bairro: z.string().default(''),
  cidade: z.string().default(''),
  uf: z.string().default('SP'),
  observacao: z.string().default(''),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export const supplierSchema = z.object({
  razaoSocial: z.string().min(2, 'Razão social é obrigatória'),
  nomeFantasia: z.string().default(''),
  cnpj: z.string().min(14, 'CNPJ inválido'),
  inscricaoEstadual: z.string().default(''),
  email: z.string().email('E-mail inválido'),
  telefone: z.string().min(8, 'Telefone inválido'),
  contatoNome: z.string().default(''),
  prazoMedioEntregaDias: z.number().int().min(1, 'Prazo de entrega inválido'),
  condicoesPagamento: z.string().default(''),
  cep: z.string().default(''),
  logradouro: z.string().default(''),
  numero: z.string().default(''),
  bairro: z.string().default(''),
  cidade: z.string().default(''),
  uf: z.string().default('SP'),
  observacao: z.string().default(''),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;

export const accountPayableSchema = z.object({
  descricao: z.string().min(2, 'Descrição é obrigatória'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  fornecedorId: z.string().default(''),
  valor: z.number().min(0.01, 'Valor deve ser positivo'),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória'),
  dataCompetencia: z.string().min(1, 'Data de competência é obrigatória'),
  tipoCusto: z.enum(['fixo', 'variavel']).default('fixo'),
  status: z.enum(['pago', 'pendente', 'atrasada', 'cancelada']).default('pendente'),
  parcelas: z.number().int().min(1).default(1),
  formaPagamento: z.string().default('PIX'),
  observacao: z.string().default(''),
});

export type AccountPayableFormData = z.infer<typeof accountPayableSchema>;
