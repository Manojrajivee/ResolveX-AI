import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shadow-xs">
      <div className="p-4 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-cyan-500/10 dark:bg-slate-800/80 rounded-2xl text-blue-600 dark:text-blue-400 mb-4 shadow-md shadow-blue-500/10 border border-blue-500/20">
        {icon || <FolderOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
