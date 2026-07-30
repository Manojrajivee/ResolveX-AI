'use client';

import React from 'react';
import { Brain, Database, ShieldAlert, Terminal, FileCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface WorkflowStep {
  id: string;
  name: string;
  role: 'Planner' | 'Retriever' | 'Decision' | 'Execution' | 'Reporter';
  status: 'completed' | 'active' | 'pending';
  detail: string;
  duration?: string;
  icon: any;
}

const DEFAULT_STEPS: WorkflowStep[] = [
  { id: '1', name: 'Planner Agent', role: 'Planner', status: 'completed', detail: 'Decomposed incident query into 3 diagnostic steps', duration: '140ms', icon: Brain },
  { id: '2', name: 'Retriever Agent', role: 'Retriever', status: 'completed', detail: 'Found 2 matching runbooks in ChromaDB vector store (98.4% score)', duration: '210ms', icon: Database },
  { id: '3', name: 'Decision Agent', role: 'Decision', status: 'completed', detail: 'Evaluated command risk level: SAFE (allowlist check passed)', duration: '85ms', icon: ShieldAlert },
  { id: '4', name: 'Execution Agent', role: 'Execution', status: 'active', detail: 'Executing systemctl status postgresql in MCP sandbox...', duration: 'In progress', icon: Terminal },
  { id: '5', name: 'Reporter Agent', role: 'Reporter', status: 'pending', detail: 'Pending final output summary generation', icon: FileCheck },
];

export const LangGraphWorkflow: React.FC<{ steps?: WorkflowStep[] }> = ({ steps = DEFAULT_STEPS }) => {
  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl space-y-4 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200 font-mono">
            LangGraph Multi-Agent Workflow Pipeline
          </h3>
        </div>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2 py-0.5 rounded font-mono font-bold border border-cyan-500/30">
          5 Nodes Active
        </span>
      </div>

      {/* Node Workflow Visualizer */}
      <div className="relative space-y-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = step.status === 'completed';
          const isActive = step.status === 'active';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                'flex items-start gap-3 p-3 rounded-xl border transition-all text-xs relative overflow-hidden',
                isActive
                  ? 'bg-blue-600/10 dark:bg-blue-600/20 border-blue-500/50 shadow-md shadow-blue-500/10'
                  : isCompleted
                  ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80'
                  : 'bg-slate-50/40 dark:bg-slate-950/20 border-dashed border-slate-200 dark:border-slate-800 opacity-60'
              )}
            >
              {/* Active Node Pulse line */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-400 to-indigo-500"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}

              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-bold text-xs',
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    : isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Icon className="h-3.5 w-3.5" />
                )}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between font-bold">
                  <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}>
                    {step.name}
                  </span>
                  {step.duration && (
                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{step.duration}</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{step.detail}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
