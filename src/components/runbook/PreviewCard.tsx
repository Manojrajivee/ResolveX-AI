import React from 'react';
import { Runbook } from '@/types/runbook';
import { Badge } from '../ui/Badge';
import { FileText } from 'lucide-react';

export const PreviewCard: React.FC<{ runbook: Runbook }> = ({ runbook }) => {
  return (
    <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
        <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{runbook.title}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{runbook.filePath}</p>
        </div>
      </div>

      <div>
        <h5 className="font-bold text-slate-900 dark:text-white mb-2">Parsed Steps ({runbook.steps.length})</h5>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {runbook.steps.map((step) => (
            <div key={step.stepNumber} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-600 dark:text-blue-400">Step {step.stepNumber}: {step.title}</span>
                <Badge variant={step.riskLevel === 'SAFE' ? 'info' : 'warning'} size="sm">
                  {step.riskLevel}
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{step.description}</p>
              {step.command && (
                <div className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  $ {step.command}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
