import React from 'react';
import { cn } from '../../utils/cn';

export interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  value: number;
  onChange: (value: number) => void;
}

export const MoneyInput: React.FC<MoneyInputProps> = ({
  label,
  error,
  value,
  onChange,
  className,
  id,
  disabled,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  const displayValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    const numValue = rawDigits ? parseFloat(rawDigits) / 100 : 0;
    onChange(numValue);
  };

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <span className="absolute left-3 text-xs font-semibold text-slate-500 dark:text-slate-400 pointer-events-none">
          R$
        </span>
        <input
          id={inputId}
          type="text"
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm pl-9 pr-3 py-2 text-right font-mono transition-all duration-150 outline-none',
            'border-slate-300 dark:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            disabled && 'opacity-60 bg-slate-50 dark:bg-slate-800',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 mt-1 font-medium">{error}</p>}
    </div>
  );
};
