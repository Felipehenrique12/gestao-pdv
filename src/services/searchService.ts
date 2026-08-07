import { db } from './mockData';
import { GlobalSearchResultItem } from '../types';

export const searchService = {
  async searchGlobal(query: string): Promise<GlobalSearchResultItem[]> {
    if (!query || query.trim().length < 2) return [];

    const q = query.toLowerCase().trim();
    const results: GlobalSearchResultItem[] = [];

    // Products
    const products = db.getProducts();
    products.forEach((p) => {
      if (
        p.nome.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        p.codigoBarras.includes(q) ||
        p.categoria.toLowerCase().includes(q)
      ) {
        results.push({
          id: p.id,
          tipo: 'produto',
          titulo: p.nome,
          subtitulo: `Código: ${p.codigo} | Estoque: ${p.quantidade} ${p.unidade} | R$ ${p.precoVenda.toFixed(2)}`,
          url: `/produtos?id=${p.id}`,
          badge: p.quantidade <= p.quantidadeMinima ? 'Estoque Baixo' : p.categoria,
        });
      }
    });

    // Customers
    const customers = db.getCustomers();
    customers.forEach((c) => {
      if (
        c.nomeRazao.toLowerCase().includes(q) ||
        c.cpfCnpj.includes(q) ||
        c.email.toLowerCase().includes(q)
      ) {
        results.push({
          id: c.id,
          tipo: 'cliente',
          titulo: c.nomeRazao,
          subtitulo: `Doc: ${c.cpfCnpj} | Tel: ${c.telefone}`,
          url: `/clientes?id=${c.id}`,
          badge: c.tipoPessoa,
        });
      }
    });

    // Suppliers
    const suppliers = db.getSuppliers();
    suppliers.forEach((s) => {
      if (
        (s.nomeFantasia && s.nomeFantasia.toLowerCase().includes(q)) ||
        s.razaoSocial.toLowerCase().includes(q) ||
        s.cnpj.includes(q)
      ) {
        results.push({
          id: s.id,
          tipo: 'fornecedor',
          titulo: s.nomeFantasia || s.razaoSocial,
          subtitulo: `CNPJ: ${s.cnpj} | Entrega: ${s.prazoMedioEntregaDias} dias`,
          url: `/fornecedores?id=${s.id}`,
          badge: 'Fornecedor',
        });
      }
    });

    // Sales
    const sales = db.getSales();
    sales.forEach((v) => {
      if (
        v.codigoVenda.toLowerCase().includes(q) ||
        (v.clienteNome && v.clienteNome.toLowerCase().includes(q))
      ) {
        results.push({
          id: v.id,
          tipo: 'venda',
          titulo: `Venda #${v.codigoVenda}`,
          subtitulo: `Cliente: ${v.clienteNome} | Total: R$ ${v.valorTotal.toFixed(2)}`,
          url: `/vendas?id=${v.id}`,
          badge: 'Venda PDV',
        });
      }
    });

    // Accounts Payable
    const accounts = db.getAccountsPayable();
    accounts.forEach((a) => {
      if (
        a.descricao.toLowerCase().includes(q) ||
        a.categoria.toLowerCase().includes(q)
      ) {
        results.push({
          id: a.id,
          tipo: 'despesa',
          titulo: a.descricao,
          subtitulo: `Valor: R$ ${a.valor.toFixed(2)} | Venc: ${a.dataVencimento}`,
          url: `/financeiro?id=${a.id}`,
          badge: a.status.toUpperCase(),
        });
      }
    });

    return results;
  },
};
