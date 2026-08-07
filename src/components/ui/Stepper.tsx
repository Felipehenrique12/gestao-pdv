import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface StepItem {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full my-4">
      <div className="flex items-center justify-between">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all',
                    isCompleted && 'bg-emerald-600 text-white',
                    isCurrent && 'bg-blue-600 text-white ring-4 ring-blue-500/20',
                    !isCompleted && !isCurrent && 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <div className="hidden sm:block">
                  <p className={cn('text-xs font-semibold', isCurrent ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300')}>
                    {step.title}
                  </p>
                  {step.description && <p className="text-[10px] text-slate-400">{step.description}</p>}
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-3 transition-colors',
                    idx < currentStep ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
