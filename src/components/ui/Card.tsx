import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassmorphism?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glassmorphism = true,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-all duration-300 relative overflow-hidden',
        glassmorphism
          ? 'bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/90 dark:border-slate-800/90 shadow-sm dark:shadow-slate-950/60 text-slate-900 dark:text-slate-100'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm',
        hoverEffect &&
          'hover:border-blue-500/40 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/15 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
