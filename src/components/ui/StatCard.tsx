import React from 'react';
import { Card } from './Card';
import { cn } from '../../utils/cn';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variation?: number; // e.g. +14.2%
  subtitle?: string;
  badge?: string;
  iconBgColor?: string;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  variation,
  subtitle,
  badge,
  iconBgColor = 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  className,
  onClick,
}) => {
  const isPositive = variation !== undefined && variation >= 0;

  return (
    <Card
      onClick={onClick}
      hoverable={!!onClick}
      className={cn('relative overflow-hidden cursor-default', onClick && 'cursor-pointer', className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>
        </div>
        <div className={cn('p-2.5 rounded-xl flex items-center justify-center shrink-0', iconBgColor)}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {variation !== undefined ? (
          <div className={cn('flex items-center gap-1 font-semibold', isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositive ? `+${variation}%` : `${variation}%`}</span>
            <span className="text-slate-500 dark:text-slate-400 font-normal">vs período anterior</span>
          </div>
        ) : subtitle ? (
          <span className="text-slate-500 dark:text-slate-400">{subtitle}</span>
        ) : null}

        {badge && (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {badge}
          </span>
        )}
      </div>
    </Card>
  );
};
