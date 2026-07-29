'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { BarChart3, TrendingUp, Cpu, Clock, CheckCircle } from 'lucide-react';

export const IncidentAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* SRE Key Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Mean Time to Resolve (MTTR)</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">3.2 Mins</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">↓ 91% faster vs manual</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Incident Auto-Resolution Rate</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">94.5%</h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">121 / 128 resolved</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">ChromaDB RAG Accuracy</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">97.8%</h3>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-mono font-bold">Top-1 chunk relevance</span>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Human Risk Intercepts</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">23 Approved</h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">0 unapproved risks executed</span>
          </div>
        </Card>
      </div>

      {/* Visual Chart Representation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span>Weekly Incident Activity & Resolution Trend</span>
          </h3>
          <div className="h-64 flex items-end gap-3 pt-6 px-2 border-b border-slate-200/80 dark:border-slate-800">
            {[
              { day: 'Mon', total: 12, res: 12 },
              { day: 'Tue', total: 18, res: 17 },
              { day: 'Wed', total: 25, res: 24 },
              { day: 'Thu', total: 14, res: 14 },
              { day: 'Fri', total: 22, res: 21 },
              { day: 'Sat', total: 9, res: 9 },
              { day: 'Sun', total: 8, res: 8 },
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full max-w-[28px] bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-t-lg relative flex flex-col justify-end overflow-hidden transition-all" style={{ height: `${(item.total / 25) * 100}%` }}>
                  <div className="w-full bg-gradient-to-t from-blue-600 to-cyan-400" style={{ height: `${(item.res / item.total) * 100}%` }} />
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">{item.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Resolution Distribution Breakdown</h3>
          <div className="space-y-3.5">
            {[
              { label: 'Automated Safe Executions (MCP)', pct: 76, color: 'bg-emerald-500' },
              { label: 'Human SRE Approved (Risky)', pct: 18, color: 'bg-blue-500' },
              { label: 'Manual Escalations', pct: 4, color: 'bg-amber-500' },
              { label: 'Failed / Terminal Errors', pct: 2, color: 'bg-rose-500' },
            ].map((bar, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 dark:text-slate-300 font-semibold">
                  <span>{bar.label}</span>
                  <span className="font-mono">{bar.pct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
                  <div className={`h-2 rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
