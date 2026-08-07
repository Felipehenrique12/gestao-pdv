import React from 'react';
import { Customer } from '../../../types';
import { Drawer } from '../../ui/Drawer';
import { Badge } from '../../ui/Badge';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { User, Mail, Phone, MapPin, Calendar, ShoppingBag } from 'lucide-react';

interface CustomerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  if (!customer) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={customer.nomeRazao}
      subtitle={`Documento: ${customer.cpfCnpj} (${customer.tipoPessoa})`}
      size="md"
    >
      <div className="space-y-6">
        {/* Quick Sales Metrics Card */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40">
          <div>
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
              Total em Compras
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {formatCurrency(customer.totalComprado)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase">
              Última Compra
            </p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {formatDate(customer.ultimaCompra)}
            </p>
          </div>
        </div>

        {/* Contact info list */}
        <div className="space-y-3 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contatos</p>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{customer.telefone}</span>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2 text-xs border-b border-slate-100 dark:border-slate-800 pb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Endereço Registrado</p>
          <div className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {customer.logradouro || 'Sem logradouro'}, {customer.numero || 'S/N'}
              </p>
              <p className="text-slate-500">
                {customer.bairro || 'Sem bairro'} — {customer.cidade || 'Sem cidade'}/{customer.uf || 'UF'}
              </p>
              <p className="text-slate-400 font-mono mt-0.5">CEP: {customer.cep || 'Não informado'}</p>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="space-y-2 text-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Dados Adicionais</p>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Cliente Desde:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(customer.createdAt)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-400">
            <span>Inscrição Estadual / RG:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{customer.rgIe || 'Isento'}</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
