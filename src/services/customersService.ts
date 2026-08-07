import api from './api';
import { db } from './mockData';
import { Customer } from '../types';
import { CustomerFormData } from '../schemas';

export const customersService = {
  async getAll(): Promise<Customer[]> {
    try {
      const response = await api.get<Customer[]>('/customers');
      return response.data;
    } catch {
      return db.getCustomers();
    }
  },

  async getById(id: string): Promise<Customer | null> {
    try {
      const response = await api.get<Customer>(`/customers/${id}`);
      return response.data;
    } catch {
      const customers = db.getCustomers();
      return customers.find((c) => c.id === id) || null;
    }
  },

  async create(data: CustomerFormData): Promise<Customer> {
    const newCustomer: Customer = {
      id: `cli-${Date.now()}`,
      ...data,
      totalComprado: 0,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await api.post<Customer>('/customers', newCustomer);
      return response.data;
    } catch {
      const current = db.getCustomers();
      db.saveCustomers([newCustomer, ...current]);
      return newCustomer;
    }
  },

  async update(id: string, data: Partial<CustomerFormData>): Promise<Customer> {
    try {
      const response = await api.put<Customer>(`/customers/${id}`, data);
      return response.data;
    } catch {
      const customers = db.getCustomers();
      const index = customers.findIndex((c) => c.id === id);
      if (index === -1) throw new Error('Cliente não encontrado');

      const updated = { ...customers[index], ...data, updatedAt: new Date().toISOString() };
      customers[index] = updated;
      db.saveCustomers(customers);
      return updated;
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/customers/${id}`);
    } catch {
      const customers = db.getCustomers();
      db.saveCustomers(customers.filter((c) => c.id !== id));
    }
  },
};
