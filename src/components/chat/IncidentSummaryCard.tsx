'use client';

import React from 'react';
import { FileText, Clock, AlertCircle, CheckCircle, Server } from 'lucide-react';

export const IncidentSummaryCard: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl space-y-3 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-cyan-500" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200 font-mono">
            Incident Brief & Diagnosis
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-bold">INC-2026-9041</span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">Primary Root Cause</span>
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
            Max connection limit reached (100/100) due to unclosed socket connections in microservice-orders v2.4.1.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Server className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">PostgreSQL-Prod-01</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <Clock className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
            <span>Est. Res: ~4 mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
