import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple' | 'cyan';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  ...props
}) => {
  const variants = {
    success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    info: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    purple: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    neutral: 'bg-slate-200/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
  };

  const dotVariants = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
    neutral: 'bg-slate-400 dark:bg-slate-500',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border tracking-wide uppercase shadow-2xs transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={cn('animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', dotVariants[variant])} />
          <span className={cn('relative inline-flex rounded-full h-1.5 w-1.5', dotVariants[variant])} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
