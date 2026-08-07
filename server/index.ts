import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import { pool, testDatabaseConnection } from './db';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4001);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      codigo TEXT NOT NULL,
      codigo_barras TEXT,
      categoria TEXT,
      marca TEXT,
      fornecedor_id TEXT,
      fornecedor_nome TEXT,
      unidade TEXT,
      preco_custo NUMERIC(12,2) DEFAULT 0,
      preco_venda NUMERIC(12,2) DEFAULT 0,
      margem_lucro NUMERIC(8,2) DEFAULT 0,
      quantidade INTEGER DEFAULT 0,
      quantidade_minima INTEGER DEFAULT 0,
      ponto_reabastecimento INTEGER DEFAULT 0,
      localizacao TEXT,
      status TEXT DEFAULT 'ativo',
      descricao TEXT,
      imagens JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      tipo_pessoa TEXT NOT NULL,
      nome_razao TEXT NOT NULL,
      cpf_cnpj TEXT,
      rg_ie TEXT,
      email TEXT,
      telefone TEXT,
      cep TEXT,
      logradouro TEXT,
      numero TEXT,
      bairro TEXT,
      cidade TEXT,
      uf TEXT,
      observacao TEXT,
      total_comprado NUMERIC(12,2) DEFAULT 0,
      ultima_compra TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id TEXT PRIMARY KEY,
      razao_social TEXT NOT NULL,
      nome_fantasia TEXT,
      cnpj TEXT,
      inscricao_estadual TEXT,
      email TEXT,
      telefone TEXT,
      contato_nome TEXT,
      prazo_medio_entrega_dias INTEGER DEFAULT 0,
      condicoes_pagamento TEXT,
      cep TEXT,
      logradouro TEXT,
      numero TEXT,
      bairro TEXT,
      cidade TEXT,
      uf TEXT,
      observacao TEXT,
      produtos_fornecidos JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      codigo_venda TEXT NOT NULL,
      cliente_id TEXT,
      cliente_nome TEXT NOT NULL,
      data_hora TIMESTAMPTZ DEFAULT now(),
      itens JSONB DEFAULT '[]'::jsonb,
      subtotal NUMERIC(12,2) DEFAULT 0,
      desconto_total NUMERIC(12,2) DEFAULT 0,
      acrescimo_total NUMERIC(12,2) DEFAULT 0,
      valor_total NUMERIC(12,2) DEFAULT 0,
      pagamento JSONB DEFAULT '{}'::jsonb,
      vendedor TEXT,
      status TEXT DEFAULT 'concluida'
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      produto_id TEXT NOT NULL,
      produto_nome TEXT,
      produto_codigo TEXT,
      tipo TEXT NOT NULL,
      data_hora TIMESTAMPTZ DEFAULT now(),
      quantidade INTEGER DEFAULT 0,
      quantidade_anterior INTEGER DEFAULT 0,
      quantidade_atual INTEGER DEFAULT 0,
      usuario TEXT,
      motivo TEXT,
      observacao TEXT,
      origem_destino TEXT
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS accounts_payable (
      id TEXT PRIMARY KEY,
      descricao TEXT NOT NULL,
      categoria TEXT,
      fornecedor_id TEXT,
      fornecedor_nome TEXT,
      valor NUMERIC(12,2) DEFAULT 0,
      data_vencimento DATE,
      data_competencia DATE,
      tipo_custo TEXT,
      status TEXT,
      parcelas INTEGER DEFAULT 1,
      forma_pagamento TEXT,
      data_pagamento DATE,
      observacao TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  const productCount = await pool.query('SELECT COUNT(*)::int AS total FROM products');
  if ((productCount.rows[0]?.total ?? 0) === 0) {
    await pool.query(`
      INSERT INTO products (
        id, nome, codigo, codigo_barras, categoria, marca, fornecedor_id, fornecedor_nome,
        unidade, preco_custo, preco_venda, margem_lucro, quantidade, quantidade_minima,
        ponto_reabastecimento, localizacao, status, descricao, imagens, created_at, updated_at
      ) VALUES
        (
          'prd-1',
          'Monitor Dell UltraSharp 27" 4K USB-C',
          'PRD-1001',
          '7891234560012',
          'Informática & Hardware',
          'Dell',
          'sup-1',
          'Dell do Brasil Ltda',
          'UN',
          2150.00,
          3499.00,
          62.70,
          14,
          5,
          8,
          'Corredor A - Prateleira 2',
          'ativo',
          'Monitor de alta fidelidade de cor para profissionais de design e tecnologia.',
          '[{"id":"img-1","url":"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=80","name":"monitor-dell.jpg","isMain":true,"order":0}]'::jsonb,
          now(),
          now()
        ),
        (
          'prd-2',
          'Teclado Mecânico Sem Fio Logitech MX Keys Mini',
          'PRD-1002',
          '7891234560029',
          'Periféricos & Acessórios',
          'Logitech',
          'sup-2',
          'Ingram Micro Brasil',
          'UN',
          380.00,
          699.90,
          84.20,
          3,
          6,
          10,
          'Corredor B - Gaveta 4',
          'ativo',
          'Teclado compacto ergonômico premium com digitação esférica e teclas iluminadas.',
          '[{"id":"img-2","url":"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80","name":"logitech-mx.jpg","isMain":true,"order":0}]'::jsonb,
          now(),
          now()
        );
    `);
  }

  const customerCount = await pool.query('SELECT COUNT(*)::int AS total FROM customers');
  if ((customerCount.rows[0]?.total ?? 0) === 0) {
    await pool.query(`
      INSERT INTO customers (
        id, tipo_pessoa, nome_razao, cpf_cnpj, rg_ie, email, telefone, cep, logradouro,
        numero, bairro, cidade, uf, observacao, total_comprado, ultima_compra, created_at, updated_at
      ) VALUES
        (
          'cli-1', 'PJ', 'TechSolutions Desenvolvimento de Software Ltda', '12.345.678/0001-90',
          '112.334.556.110', 'compras@techsolutions.com.br', '(11) 98765-4321', '01310-100',
          'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP',
          'Cliente corporativo com pagamento via faturamento 30 dias.', 18450.00, now(), now(), now()
        ),
        (
          'cli-2', 'PF', 'Carlos Eduardo Oliveira Santos', '321.654.987-00', NULL,
          'carlos.santos@email.com', '(21) 97654-3210', NULL, NULL, NULL, NULL,
          'Rio de Janeiro', 'RJ', NULL, 3499.00, now(), now(), now()
        );
    `);
  }

  const supplierCount = await pool.query('SELECT COUNT(*)::int AS total FROM suppliers');
  if ((supplierCount.rows[0]?.total ?? 0) === 0) {
    await pool.query(`
      INSERT INTO suppliers (
        id, razao_social, nome_fantasia, cnpj, inscricao_estadual, email, telefone, contato_nome,
        prazo_medio_entrega_dias, condicoes_pagamento, cep, logradouro, numero, bairro, cidade, uf,
        observacao, produtos_fornecidos, created_at
      ) VALUES
        (
          'sup-1', 'Dell do Brasil Computadores Ltda', 'Dell Brasil', '72.381.189/0001-10',
          'distribuidores@dell.com.br', '(11) 4004-0100', 'Roberto Vendedor Dell', 4,
          '28 / 56 Dias no Boleto', 'Hortolândia', 'SP',
          '["Monitores 4K","Desktops","Servidores"]'::jsonb, now()
        ),
        (
          'sup-2', 'Ingram Micro Brasil Distribuição S/A', 'Ingram Micro', '01.520.123/0001-44',
          'vendas@ingrammicro.com.br', '(11) 2078-4000', 'Juliana BDM Periféricos', 2,
          '30 Dias Faturado', 'Barueri', 'SP',
          '["Teclados Logitech","Mouses","Headsets"]'::jsonb, now()
        );
    `);
  }

  const saleCount = await pool.query('SELECT COUNT(*)::int AS total FROM sales');
  if ((saleCount.rows[0]?.total ?? 0) === 0) {
    await pool.query(`
      INSERT INTO sales (
        id, codigo_venda, cliente_id, cliente_nome, data_hora, itens, subtotal,
        desconto_total, acrescimo_total, valor_total, pagamento, vendedor, status
      ) VALUES (
        'sale-1', 'VND-1041', 'cli-2', 'Carlos Eduardo Oliveira Santos', now(),
        '[{"produtoId":"prd-1","produtoNome":"Monitor Dell UltraSharp 27\" 4K USB-C","quantidade":1,"precoUnitario":3499.0,"desconto":0,"subtotal":3499.0}]'::jsonb,
        3499.00, 0.00, 0.00, 3499.00,
        '{"pix":3499.0,"dinheiro":0,"cartaoCredito":0,"cartaoDebito":0}'::jsonb,
        'Felipe Comercial', 'concluida'
      );
    `);
  }

  const movementCount = await pool.query('SELECT COUNT(*)::int AS total FROM stock_movements');
  if ((movementCount.rows[0]?.total ?? 0) === 0) {
    await pool.query(`
      INSERT INTO stock_movements (
        id, produto_id, produto_nome, produto_codigo, tipo, data_hora, quantidade,
        quantidade_anterior, quantidade_atual, usuario, motivo, observacao
      ) VALUES (
        'mov-1', 'prd-1', 'Monitor Dell UltraSharp 27" 4K USB-C', 'PRD-1001', 'entrada',
        now(), 10, 4, 14, 'Felipe Comercial', 'Compra de fornecedor (NF 45892)',
        'Lote recebido com nota fiscal conferida'
      );
    `);
  }
};

const mapProductRow = (row: any) => ({
  id: row.id,
  nome: row.nome,
  codigo: row.codigo,
  codigoBarras: row.codigo_barras ?? row.codigoBarras,
  categoria: row.categoria,
  marca: row.marca,
  fornecedorId: row.fornecedor_id ?? row.fornecedorId,
  fornecedorNome: row.fornecedor_nome ?? row.fornecedorNome,
  unidade: row.unidade,
  precoCusto: Number(row.preco_custo ?? row.precoCusto ?? 0),
  precoVenda: Number(row.preco_venda ?? row.precoVenda ?? 0),
  margemLucro: Number(row.margem_lucro ?? row.margemLucro ?? 0),
  quantidade: Number(row.quantidade ?? 0),
  quantidadeMinima: Number(row.quantidade_minima ?? row.quantidadeMinima ?? 0),
  pontoReabastecimento: Number(row.ponto_reabastecimento ?? row.pontoReabastecimento ?? 0),
  localizacao: row.localizacao,
  status: row.status ?? 'ativo',
  descricao: row.descricao,
  imagens: Array.isArray(row.imagens) ? row.imagens : [],
  createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
  updatedAt: row.updated_at ?? row.updatedAt ?? new Date().toISOString(),
});

const mapCustomerRow = (row: any) => ({
  id: row.id,
  tipoPessoa: row.tipo_pessoa ?? row.tipoPessoa,
  nomeRazao: row.nome_razao ?? row.nomeRazao,
  cpfCnpj: row.cpf_cnpj ?? row.cpfCnpj,
  rgIe: row.rg_ie ?? row.rgIe,
  email: row.email,
  telefone: row.telefone,
  cep: row.cep,
  logradouro: row.logradouro,
  numero: row.numero,
  bairro: row.bairro,
  cidade: row.cidade,
  uf: row.uf,
  observacao: row.observacao,
  totalComprado: Number(row.total_comprado ?? row.totalComprado ?? 0),
  ultimaCompra: row.ultima_compra ?? row.ultimaCompra ?? null,
  createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
  updatedAt: row.updated_at ?? row.updatedAt ?? null,
});

const mapSupplierRow = (row: any) => ({
  id: row.id,
  razaoSocial: row.razao_social ?? row.razaoSocial,
  nomeFantasia: row.nome_fantasia ?? row.nomeFantasia,
  cnpj: row.cnpj,
  inscricaoEstadual: row.inscricao_estadual ?? row.inscricaoEstadual,
  email: row.email,
  telefone: row.telefone,
  contatoNome: row.contato_nome ?? row.contatoNome,
  prazoMedioEntregaDias: Number(row.prazo_medio_entrega_dias ?? row.prazoMedioEntregaDias ?? 0),
  condicoesPagamento: row.condicoes_pagamento ?? row.condicoesPagamento,
  cep: row.cep,
  logradouro: row.logradouro,
  numero: row.numero,
  bairro: row.bairro,
  cidade: row.cidade,
  uf: row.uf,
  observacao: row.observacao,
  produtosFornecidos: Array.isArray(row.produtos_fornecidos ?? row.produtosFornecidos)
    ? (row.produtos_fornecidos ?? row.produtosFornecidos)
    : [],
  createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
});

const mapSaleRow = (row: any) => ({
  id: row.id,
  codigoVenda: row.codigo_venda ?? row.codigoVenda,
  clienteId: row.cliente_id ?? row.clienteId,
  clienteNome: row.cliente_nome ?? row.clienteNome,
  dataHora: row.data_hora ?? row.dataHora ?? new Date().toISOString(),
  itens: Array.isArray(row.itens) ? row.itens : [],
  subtotal: Number(row.subtotal ?? 0),
  descontoTotal: Number(row.desconto_total ?? row.descontoTotal ?? 0),
  acrescimoTotal: Number(row.acrescimo_total ?? row.acrescimoTotal ?? 0),
  valorTotal: Number(row.valor_total ?? row.valorTotal ?? 0),
  pagamento: row.pagamento ?? {},
  vendedor: row.vendedor,
  status: row.status,
});

const mapAccountRow = (row: any) => ({
  id: row.id,
  descricao: row.descricao,
  categoria: row.categoria,
  fornecedorId: row.fornecedor_id ?? row.fornecedorId,
  fornecedorNome: row.fornecedor_nome ?? row.fornecedorNome,
  valor: Number(row.valor ?? 0),
  dataVencimento: row.data_vencimento ?? row.dataVencimento ?? null,
  dataCompetencia: row.data_competencia ?? row.dataCompetencia ?? null,
  tipoCusto: row.tipo_custo ?? row.tipoCusto,
  status: row.status,
  parcelas: Number(row.parcelas ?? 1),
  formaPagamento: row.forma_pagamento ?? row.formaPagamento,
  dataPagamento: row.data_pagamento ?? row.dataPagamento ?? null,
  observacao: row.observacao,
  createdAt: row.created_at ?? row.createdAt ?? new Date().toISOString(),
});

const buildMonthlySeries = (rows: Array<{ data_hora?: string; data?: string; valor_total?: string | number; valor?: string | number; total?: string | number }>) => {
  const map = new Map<string, { mes: string; entradas: number; saidas: number; saldo: number }>();

  for (const row of rows) {
    const date = new Date(row.data_hora ?? row.data ?? new Date().toISOString());
    const monthLabel = date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '');
    if (!map.has(monthLabel)) {
      map.set(monthLabel, { mes: monthLabel, entradas: 0, saidas: 0, saldo: 0 });
    }

    const current = map.get(monthLabel)!.;
    const value = Number(row.valor_total ?? row.valor ?? row.total ?? 0);
    if (row.valor_total != null || row.total != null) {
      current.entradas += value;
      current.saldo += value;
    } else if (row.valor != null) {
      current.saidas += value;
      current.saldo -= value;
    }
  }

  return Array.from(map.values()).slice(-6);
};

app.get('/api/health', async (_req, res) => {
  try {
    const result = await testDatabaseConnection();

    res.json({
      ok: true,
      database: 'cockroachdb',
      timestamp: result.now,
      version: result.version,
    });
  } catch (error) {
    console.error('Database healthcheck failed:', error);
    res.status(500).json({
      ok: false,
      database: 'cockroachdb',
      message: 'Falha ao conectar com o CockroachDB.',
    });
  }
});

app.get('/api/test-query', async (_req, res) => {
  try {
    const result = await pool.query('SELECT 1 AS ok');
    res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    console.error('Query failed:', error);
    res.status(500).json({ ok: false, message: 'Erro ao executar consulta de teste.' });
  }
});

app.get('/api/products', async (_req, res) => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  res.json(result.rows.map(mapProductRow));
});

app.get('/api/products/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: 'Produto não encontrado' });
  return res.json(mapProductRow(result.rows[0]));
});

app.post('/api/products', async (req, res) => {
  const product = req.body;
  const id = product.id || `prod-${Date.now()}`;
  const result = await pool.query(
    `INSERT INTO products (
      id, nome, codigo, codigo_barras, categoria, marca, fornecedor_id, fornecedor_nome,
      unidade, preco_custo, preco_venda, margem_lucro, quantidade, quantidade_minima,
      ponto_reabastecimento, localizacao, status, descricao, imagens, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::jsonb, now(), now())
    RETURNING *`,
    [
      id,
      product.nome,
      product.codigo,
      product.codigoBarras,
      product.categoria,
      product.marca,
      product.fornecedorId,
      product.fornecedorNome,
      product.unidade,
      product.precoCusto !== undefined ? Number(product.precoCusto) : null,
      product.precoVenda !== undefined ? Number(product.precoVenda) : null,
      product.margemLucro !== undefined ? Number(product.margemLucro) : null,
      product.quantidade !== undefined ? Number(product.quantidade) : null,
      product.quantidadeMinima !== undefined ? Number(product.quantidadeMinima) : null,
      product.pontoReabastecimento !== undefined ? Number(product.pontoReabastecimento) : null,
      product.localizacao,
      product.status,
      product.descricao,
      product.imagens ? JSON.stringify(product.imagens) : null,
    ]
  );

  res.status(201).json(mapProductRow(result.rows[0]));
});

app.put('/api/products/:id', async (req, res) => {
  const product = req.body;
  const result = await pool.query(
    `UPDATE products SET
      nome = COALESCE($2, nome),
      codigo = COALESCE($3, codigo),
      codigo_barras = COALESCE($4, codigo_barras),
      categoria = COALESCE($5, categoria),
      marca = COALESCE($6, marca),
      fornecedor_id = COALESCE($7, fornecedor_id),
      fornecedor_nome = COALESCE($8, fornecedor_nome),
      unidade = COALESCE($9, unidade),
      preco_custo = COALESCE($10, preco_custo),
      preco_venda = COALESCE($11, preco_venda),
      margem_lucro = COALESCE($12, margem_lucro),
      quantidade = COALESCE($13, quantidade),
      quantidade_minima = COALESCE($14, quantidade_minima),
      ponto_reabastecimento = COALESCE($15, ponto_reabastecimento),
      localizacao = COALESCE($16, localizacao),
      status = COALESCE($17, status),
      descricao = COALESCE($18, descricao),
      imagens = COALESCE($19::jsonb, imagens),
      updated_at = now()
    WHERE id = $1
    RETURNING *`,
    [
      req.params.id,
      product.nome,
      product.codigo,
      product.codigoBarras,
      product.categoria,
      product.marca,
      product.fornecedorId,
      product.fornecedorNome,
      product.unidade,
      product.precoCusto !== undefined ? Number(product.precoCusto) : null,
      product.precoVenda !== undefined ? Number(product.precoVenda) : null,
      product.margemLucro !== undefined ? Number(product.margemLucro) : null,
      product.quantidade !== undefined ? Number(product.quantidade) : null,
      product.quantidadeMinima !== undefined ? Number(product.quantidadeMinima) : null,
      product.pontoReabastecimento !== undefined ? Number(product.pontoReabastecimento) : null,
      product.localizacao,
      product.status,
      product.descricao,
      product.imagens ? JSON.stringify(product.imagens) : null,
    ]
  );

  if (!result.rows[0]) return res.status(404).json({ message: 'Produto não encontrado' });
  return res.json(mapProductRow(result.rows[0]));
});

app.delete('/api/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

app.get('/api/customers', async (_req, res) => {
  const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
  res.json(result.rows.map(mapCustomerRow));
});

app.get('/api/customers/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM customers WHERE id = $1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: 'Cliente não encontrado' });
  return res.json(mapCustomerRow(result.rows[0]));
});

app.post('/api/customers', async (req, res) => {
  const customer = req.body;
  const result = await pool.query(
    `INSERT INTO customers (
      id, tipo_pessoa, nome_razao, cpf_cnpj, rg_ie, email, telefone, cep, logradouro,
      numero, bairro, cidade, uf, observacao, total_comprado, ultima_compra, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, now(), now())
    RETURNING *`,
    [
      customer.id || `cli-${Date.now()}`,
      customer.tipoPessoa,
      customer.nomeRazao,
      customer.cpfCnpj,
      customer.rgIe ?? null,
      customer.email,
      customer.telefone,
      customer.cep ?? null,
      customer.logradouro ?? null,
      customer.numero ?? null,
      customer.bairro ?? null,
      customer.cidade ?? null,
      customer.uf ?? null,
      customer.observacao ?? null,
      customer.totalComprado !== undefined ? Number(customer.totalComprado) : null,
      customer.ultimaCompra ?? null,
    ]
  );
  res.status(201).json(mapCustomerRow(result.rows[0]));
});

app.put('/api/customers/:id', async (req, res) => {
  const customer = req.body;
  const result = await pool.query(
    `UPDATE customers SET
      tipo_pessoa = COALESCE($2, tipo_pessoa),
      nome_razao = COALESCE($3, nome_razao),
      cpf_cnpj = COALESCE($4, cpf_cnpj),
      rg_ie = COALESCE($5, rg_ie),
      email = COALESCE($6, email),
      telefone = COALESCE($7, telefone),
      cep = COALESCE($8, cep),
      logradouro = COALESCE($9, logradouro),
      numero = COALESCE($10, numero),
      bairro = COALESCE($11, bairro),
      cidade = COALESCE($12, cidade),
      uf = COALESCE($13, uf),
      observacao = COALESCE($14, observacao),
      total_comprado = COALESCE($15, total_comprado),
      ultima_compra = COALESCE($16, ultima_compra),
      updated_at = now()
    WHERE id = $1
    RETURNING *`,
    [
      req.params.id,
      customer.tipoPessoa,
      customer.nomeRazao,
      customer.cpfCnpj,
      customer.rgIe ?? null,
      customer.email,
      customer.telefone,
      customer.cep ?? null,
      customer.logradouro ?? null,
      customer.numero ?? null,
      customer.bairro ?? null,
      customer.cidade ?? null,
      customer.uf ?? null,
      customer.observacao ?? null,
      customer.totalComprado !== undefined ? Number(customer.totalComprado) : null,
      customer.ultimaCompra ?? null,
    ]
  );
  if (!result.rows[0]) return res.status(404).json({ message: 'Cliente não encontrado' });
  return res.json(mapCustomerRow(result.rows[0]));
});

app.delete('/api/customers/:id', async (req, res) => {
  await pool.query('DELETE FROM customers WHERE id = $1', [req.params.id]);
  res.status(204).send();
});

app.get('/api/suppliers', async (_req, res) => {
  const result = await pool.query('SELECT * FROM suppliers ORDER BY created_at DESC');
  res.json(result.rows.map(mapSupplierRow));
});

app.get('/api/suppliers/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM suppliers WHERE id = $1', [req.params.id]);
  if (!result.rows[0]) return res.status(404).json({ message: 'Fornecedor não encontrado' });
  return res.json(mapSupplierRow(result.rows[0]));
});

app.post('/api/suppliers', async (req, res) => {
  const supplier = req.body;
  const result = await pool.query(
    `INSERT INTO suppliers (
      id, razao_social, nome_fantasia, cnpj, inscricao_estadual, email, telefone, contato_nome,
      prazo_medio_entrega_dias, condicoes_pagamento, cep, logradouro, numero, bairro, cidade, uf,
      observacao, produtos_fornecidos, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18::jsonb, now())
    RETURNING *`,
    [
      supplier.id || `sup-${Date.now()}`,
      supplier.razaoSocial,
      supplier.nomeFantasia ?? null,
      supplier.cnpj,
      supplier.inscricaoEstadual ?? null,
      supplier.email,
      supplier.telefone,
      supplier.contatoNome ?? null,
      Number(supplier.prazoMedioEntregaDias ?? 0),
      supplier.condicoesPagamento ?? null,
      supplier.cep ?? null,
      supplier.logradouro ?? null,
      supplier.numero ?? null,
      supplier.bairro ?? null,
      supplier.cidade ?? null,
      supplier.uf ?? null,
      supplier.observacao ?? null,
      JSON.stringify(supplier.produtosFornecidos ?? []),
    ]
  );
  res.status(201).json(mapSupplierRow(result.rows[0]));
});

app.get('/api/sales', async (_req, res) => {
  const result = await pool.query('SELECT * FROM sales ORDER BY data_hora DESC');
  res.json(result.rows.map(mapSaleRow));
});

app.post('/api/sales', async (req, res) => {
  const sale = req.body;
  const result = await pool.query(
    `INSERT INTO sales (
      id, codigo_venda, cliente_id, cliente_nome, data_hora, itens, subtotal,
      desconto_total, acrescimo_total, valor_total, pagamento, vendedor, status
    ) VALUES ($1, $2, $3, $4, now(), $5::jsonb, $6, $7, $8, $9, $10::jsonb, $11, $12)
    RETURNING *`,
    [
      sale.id || `sale-${Date.now()}`,
      sale.codigoVenda || `VND-${Date.now()}`,
      sale.clienteId ?? null,
      sale.clienteNome || 'Cliente Não Identificado',
      JSON.stringify(sale.itens ?? []),
      Number(sale.subtotal ?? 0),
      Number(sale.descontoTotal ?? 0),
      Number(sale.acrescimoTotal ?? 0),
      Number(sale.valorTotal ?? 0),
      JSON.stringify(sale.pagamento ?? {}),
      sale.vendedor || 'Operador de Caixa',
      sale.status || 'concluida',
    ]
  );

  res.status(201).json(mapSaleRow(result.rows[0]));
});

app.get('/api/stock-movements', async (_req, res) => {
  const result = await pool.query('SELECT * FROM stock_movements ORDER BY data_hora DESC');
  res.json(result.rows);
});

app.get('/api/dashboard/summary', async (_req, res) => {
  const [products, customers, suppliers, sales, accounts] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS total, SUM(quantidade)::int AS estoque_total FROM products'),
    pool.query('SELECT COUNT(*)::int AS total FROM customers'),
    pool.query('SELECT COUNT(*)::int AS total FROM suppliers'),
    pool.query('SELECT COALESCE(SUM(valor_total),0)::numeric AS faturamento FROM sales'),
    pool.query('SELECT COALESCE(SUM(valor),0)::numeric AS valor FROM accounts_payable WHERE status = $1', ['pendente']),
  ]);

  res.json({
    faturamentoTotal: Number(sales.rows[0]?.faturamento ?? 0),
    produtosCadastrados: Number(products.rows[0]?.total ?? 0),
    totalClientes: Number(customers.rows[0]?.total ?? 0),
    totalFornecedores: Number(suppliers.rows[0]?.total ?? 0),
    valorContasPagar: Number(accounts.rows[0]?.valor ?? 0),
    estoqueTotal: Number(products.rows[0]?.estoque_total ?? 0),
  });
});

app.get('/api/search', async (req, res) => {
  const searchTerm = String(req.query.q ?? '').trim();
  if (!searchTerm) {
    return res.json([]);
  }

  const likePattern = `%${searchTerm}%`;
  const [products, customers, suppliers] = await Promise.all([
    pool.query(
      `SELECT id, nome AS titulo, categoria AS subtitulo, 'produto' AS tipo FROM products WHERE nome ILIKE $1 OR codigo ILIKE $1 LIMIT 5`,
      [likePattern]
    ),
    pool.query(
      `SELECT id, nome_razao AS titulo, cidade AS subtitulo, 'cliente' AS tipo FROM customers WHERE nome_razao ILIKE $1 OR cpf_cnpj ILIKE $1 LIMIT 5`,
      [likePattern]
    ),
    pool.query(
      `SELECT id, razao_social AS titulo, cidade AS subtitulo, 'fornecedor' AS tipo FROM suppliers WHERE razao_social ILIKE $1 OR cnpj ILIKE $1 LIMIT 5`,
      [likePattern]
    ),
  ]);

  const results = [...products.rows, ...customers.rows, ...suppliers.rows];
  res.json(results);
});

const startServer = async () => {
  try {
    await ensureSchema();
    const server = app.listen(port, () => {
      console.log(`API do CockroachDB iniciada em http://localhost:${port}`);
    });

    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Porta ${port} já está em uso. Feche o processo antigo ou altere PORT no .env.`);
      } else {
        console.error('Erro ao iniciar o servidor:', error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor do CockroachDB:', error);
    process.exit(1);
  }
};

startServer();
