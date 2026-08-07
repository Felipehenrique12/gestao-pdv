import React from 'react';
import { Supplier } from '../../../types';
import { Drawer } from '../../ui/Drawer';
import { Badge } from '../../ui/Badge';
import { Truck, Mail, Phone, Calendar, CreditCard, Clock } from 'lucide-react';

interface SupplierDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export const SupplierDetailDrawer: React.FC<SupplierDetailDrawerProps> = ({
  isOpen,
  onClose,
  supplier,
}) => {
  if (!supplier) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={supplier.nomeFantasia || supplier.razaoSocial}
      subtitle={`Razão Social: ${supplier.razaoSocial} | CNPJ: ${supplier.cnpj}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Quick Terms Metrics Card */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-teal-50/50 dark:bg-teal-950/20 rounded-xl border border-teal-100 dark:border-teal-900/40">
          <div>
            <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Prazo de Entrega
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {supplier.prazoMedioEntregaDias} Dias úteis
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Faturamento
            </p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {supplier.condicoesPagamento || 'A Combinar'}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contatos Comerciais</p>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{supplier.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{supplier.telefone}</span>
          </div>
          {supplier.contatoNome && (
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
              <Truck className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Vendedor Representante: <strong>{supplier.contatoNome}</strong></span>
            </div>
          )}
        </div>

        {/* Supplied Products */}
        {supplier.produtosFornecidos && supplier.produtosFornecidos.length > 0 && (
          <div className="space-y-2 text-xs">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Produtos Atrelados no Catálogo ({supplier.produtosFornecidos.length})
            </p>
            <div className="flex flex-wrap gap-1.5">
              {supplier.produtosFornecidos.map((prodName, idx) => (
                <Badge key={idx} variant="info" size="sm">
                  {prodName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
};
