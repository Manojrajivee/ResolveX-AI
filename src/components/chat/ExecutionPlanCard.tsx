'use client';

import React from 'react';
import { Badge } from '../ui/Badge';
import { CheckCircle2, ShieldAlert, Clock, Play } from 'lucide-react';

export interface PlanStep {
  stepNumber: number;
  title: string;
  command: string;
  riskLevel: 'SAFE' | 'RISKY' | 'CRITICAL';
  status: 'COMPLETED' | 'WAITING_APPROVAL' | 'PENDING';
}

export const ExecutionPlanCard: React.FC<{ steps: PlanStep[] }> = ({ steps }) => {
  return (
    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono flex items-center gap-2">
          <Play className="h-3.5 w-3.5 text-blue-400" />
          <span>Planner Agent Execution Sequence</span>
        </h4>
        <span className="text-[10px] text-slate-400 font-mono">{steps.length} Steps</span>
      </div>

      <div className="space-y-3 relative pl-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {steps.map((st) => (
          <div key={st.stepNumber} className="relative space-y-1">
            <div className={`absolute -left-4 top-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 ${
              st.status === 'COMPLETED' ? 'bg-emerald-400' : st.status === 'WAITING_APPROVAL' ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
            }`} />

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Step {st.stepNumber}: {st.title}</span>
              <Badge variant={st.riskLevel === 'SAFE' ? 'info' : 'warning'} size="sm">
                {st.riskLevel}
              </Badge>
            </div>

            <div className="font-mono text-[11px] p-2 rounded bg-slate-900 text-cyan-400 border border-slate-800">
              $ {st.command}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
