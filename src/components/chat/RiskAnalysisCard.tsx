'use client';

import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RiskAnalysisProps {
  severity?: 'Critical' | 'High' | 'Medium' | 'Low';
  impact?: string;
  confidence?: number;
  safetyScore?: number;
  rollbackAvailable?: boolean;
}

export const RiskAnalysisCard: React.FC<RiskAnalysisProps> = ({
  severity = 'High',
  impact = 'Primary PostgreSQL Cluster Connection Latency & Pool Exhaustion',
  confidence = 96,
  safetyScore = 92,
  rollbackAvailable = true,
}) => {
  const getSeverityBadge = () => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      case 'High':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Medium':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      default:
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl space-y-3 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-amber-500" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200 font-mono">
            AI Incident Risk Evaluation
          </h3>
        </div>
        <span className={cn('px-2 py-0.5 rounded font-mono text-[10px] font-bold border', getSeverityBadge())}>
          {severity} Risk
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">Impact Sphere</span>
          <p className="font-medium text-slate-800 dark:text-slate-200 text-[11px] leading-snug">{impact}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-bold block">AI Confidence</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{confidence}%</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[10px] text-slate-400 font-bold block">Safety Guard Score</span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{safetyScore}/100</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-1">
            <RotateCcw className="h-3.5 w-3.5 text-blue-500" />
            Auto Rollback: {rollbackAvailable ? 'Available' : 'N/A'}
          </span>
          <span className="flex items-center gap-1 text-emerald-500 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" /> Approved Sandbox
          </span>
        </div>
      </div>
    </div>
  );
};
