import React from 'react';
import { StockMovement } from '../../types';
import { formatDateTime } from '../../utils/formatters';
import { ArrowDownRight, ArrowUpRight, RefreshCw, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { Badge } from './Badge';

interface TimelineProps {
  movements: StockMovement[];
}

export const Timeline: React.FC<TimelineProps> = ({ movements }) => {
  if (!movements || movements.length === 0) {
    return <p className="text-xs text-slate-500 py-4 text-center">Nenhuma movimentação registrada.</p>;
  }

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return <ArrowDownRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'saida':
        return <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'ajuste':
        return <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'transferencia':
        return <ArrowLeftRight className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'perda':
        return <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default:
        return null;
    }
  };

  const getBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return 'success';
      case 'saida': return 'danger';
      case 'ajuste': return 'info';
      case 'transferencia': return 'default';
      case 'perda': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 my-2 space-y-6">
      {movements.map((mov) => (
        <div key={mov.id} className="relative pl-6 group">
          {/* Timeline Dot */}
          <div className="absolute -left-3 top-0.5 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xs">
            {getIcon(mov.tipo)}
          </div>

          <div className="bg-white dark:bg-slate-900/60 p-3.5 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={getBadgeVariant(mov.tipo)} size="sm">
                  {mov.tipo.toUpperCase()}
                </Badge>
                <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {mov.produtoNome}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {formatDateTime(mov.dataHora)}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-medium">Motivo:</span> {mov.motivo}
              {mov.observacao && <span className="italic font-normal"> — "{mov.observacao}"</span>}
            </p>

            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/60 mt-2">
              <span>
                Qtd: <strong className="text-slate-900 dark:text-slate-100">{mov.quantidade}</strong> | Anterior: {mov.quantidadeAnterior} | Atual: {mov.quantidadeAtual}
              </span>
              <span className="text-slate-400">Por: {mov.usuario}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
