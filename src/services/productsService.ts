import api from './api';
import { db } from './mockData';
import { Product } from '../types';
import { ProductFormData } from '../schemas';

export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      const response = await api.get<Product[]>('/products');
      return response.data;
    } catch {
      return db.getProducts();
    }
  },

  async getById(id: string): Promise<Product | null> {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return response.data;
    } catch {
      const products = db.getProducts();
      return products.find((p) => p.id === id) || null;
    }
  },

  async create(data: ProductFormData & { imagens?: Product['imagens'] }): Promise<Product> {
    const cost = data.precoCusto;
    const salePrice = data.precoVenda;
    const margin = cost > 0 ? ((salePrice - cost) / cost) * 100 : 100;

    const suppliers = db.getSuppliers();
    const supplier = suppliers.find((s) => s.id === data.fornecedorId);

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      ...data,
      fornecedorNome: supplier?.nomeFantasia || supplier?.razaoSocial || 'Fornecedor Padrão',
      margemLucro: parseFloat(margin.toFixed(1)),
      imagens: data.imagens || [
        { id: `img-${Date.now()}`, url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop', name: 'produto.jpg', isMain: true, order: 0 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await api.post<Product>('/products', newProduct);
      return response.data;
    } catch {
      const current = db.getProducts();
      db.saveProducts([newProduct, ...current]);
      return newProduct;
    }
  },

  async update(id: string, data: Partial<ProductFormData> & { imagens?: Product['imagens'] }): Promise<Product> {
    try {
      const response = await api.put<Product>(`/products/${id}`, data);
      return response.data;
    } catch {
      const products = db.getProducts();
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Produto não encontrado');

      const existing = products[index];
      const cost = data.precoCusto ?? existing.precoCusto;
      const salePrice = data.precoVenda ?? existing.precoVenda;
      const margin = cost > 0 ? ((salePrice - cost) / cost) * 100 : 100;

      let supplierName = existing.fornecedorNome;
      if (data.fornecedorId) {
        const suppliers = db.getSuppliers();
        const sup = suppliers.find((s) => s.id === data.fornecedorId);
        if (sup) supplierName = sup.nomeFantasia;
      }

      const updatedProduct: Product = {
        ...existing,
        ...data,
        precoCusto: cost,
        precoVenda: salePrice,
        margemLucro: parseFloat(margin.toFixed(1)),
        fornecedorNome: supplierName,
        updatedAt: new Date().toISOString(),
      };

      products[index] = updatedProduct;
      db.saveProducts(products);
      return updatedProduct;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch {
      const products = db.getProducts();
      const filtered = products.filter((p) => p.id !== id);
      db.saveProducts(filtered);
    }
  },
};
