import api from './api';
import { db } from './mockData';
import { Supplier } from '../types';
import { SupplierFormData } from '../schemas';

export const suppliersService = {
  async getAll(): Promise<Supplier[]> {
    try {
      const response = await api.get<Supplier[]>('/suppliers');
      return response.data;
    } catch {
      return db.getSuppliers();
    }
  },

  async create(data: SupplierFormData): Promise<Supplier> {
    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      ...data,
      produtosFornecidos: [],
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await api.post<Supplier>('/suppliers', newSupplier);
      return response.data;
    } catch {
      const current = db.getSuppliers();
      db.saveSuppliers([newSupplier, ...current]);
      return newSupplier;
    }
  },

  async update(id: string, data: Partial<SupplierFormData>): Promise<Supplier> {
    try {
      const response = await api.put<Supplier>(`/suppliers/${id}`, data);
      return response.data;
    } catch {
      const suppliers = db.getSuppliers();
      const index = suppliers.findIndex((s) => s.id === id);
      if (index === -1) throw new Error('Fornecedor não encontrado');

      const updated = { ...suppliers[index], ...data };
      suppliers[index] = updated;
      db.saveSuppliers(suppliers);
      return updated;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/suppliers/${id}`);
    } catch {
      const suppliers = db.getSuppliers();
      db.saveSuppliers(suppliers.filter((s) => s.id !== id));
    }
  },
};
