import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardView } from '../components/features/dashboard/DashboardView';
import { ProductsList } from '../components/features/produtos/ProductsList';
import { StockView } from '../components/features/estoque/StockView';
import { CustomersList } from '../components/features/clientes/CustomersList';
import { SuppliersList } from '../components/features/fornecedores/SuppliersList';
import { PdvView } from '../components/features/vendas/PdvView';
import { FinanceView } from '../components/features/financeiro/FinanceView';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardView />} />
      <Route path="/produtos" element={<ProductsList />} />
      <Route path="/estoque" element={<StockView />} />
      <Route path="/clientes" element={<CustomersList />} />
      <Route path="/fornecedores" element={<SuppliersList />} />
      <Route path="/vendas" element={<PdvView />} />
      <Route path="/financeiro" element={<FinanceView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
