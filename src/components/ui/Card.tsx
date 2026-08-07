import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hoverable = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-all duration-200',
        hoverable && 'hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
