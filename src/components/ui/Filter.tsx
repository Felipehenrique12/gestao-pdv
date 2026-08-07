import React from 'react';
import { Button } from './Button';
import { Filter as FilterIcon, X } from 'lucide-react';

interface FilterProps {
  activeCount?: number;
  onClear?: () => void;
  children: React.ReactNode;
}

export const Filter: React.FC<FilterProps> = ({ activeCount = 0, onClear, children }) => {
  return (
    <div className="flex flex-wrap items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0 mr-1">
        <FilterIcon className="w-3.5 h-3.5" />
        <span>Filtros:</span>
        {activeCount > 0 && (
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px]">
            {activeCount}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">{children}</div>

      {activeCount > 0 && onClear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          leftIcon={<X className="w-3.5 h-3.5" />}
          className="text-slate-500 hover:text-rose-600"
        >
          Limpar
        </Button>
      )}
    </div>
  );
};
