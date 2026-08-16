'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { CheckCircle2, Terminal, Clock, Play, AlertTriangle } from 'lucide-react';

export interface StepItem {
  id: number;
  title: string;
  command: string;
  riskLevel: 'SAFE' | 'RISKY' | 'CRITICAL';
  status: 'COMPLETED' | 'RUNNING' | 'PENDING' | 'WAITING_APPROVAL';
  stdout?: string;
  duration?: string;
}

export const LiveTimeline: React.FC = React.memo(() => {
  const [steps, setSteps] = useState<StepItem[]>([
    {
      id: 1,
      title: 'Inspect PostgreSQL Process Daemon',
      command: 'systemctl status postgresql',
      riskLevel: 'SAFE',
      status: 'COMPLETED',
      stdout: '[OK] systemctl status output:\npostgresql.service - PostgreSQL RDBMS\nLoaded: loaded (/lib/systemd/system/postgresql.service)\nActive: inactive (dead)',
      duration: '0.8s',
    },
    {
      id: 2,
      title: 'Check Storage & File System Limits',
      command: 'df -h /var/lib/postgresql',
      riskLevel: 'SAFE',
      status: 'COMPLETED',
      stdout: 'Filesystem Size Used Avail Use% Mounted on\n/dev/sda1 100G 45G 55G 45% /var/lib/postgresql',
      duration: '0.4s',
    },
    {
      id: 3,
      title: 'Restart PostgreSQL Primary Daemon',
      command: 'systemctl restart postgresql',
      riskLevel: 'RISKY',
      status: 'WAITING_APPROVAL',
      stdout: 'Pending human SRE confirmation for risky command execution...',
    },
    {
      id: 4,
      title: 'Verify Socket & DB Port Response',
      command: 'pg_isready -h localhost -p 5432',
      riskLevel: 'SAFE',
      status: 'PENDING',
    },
  ]);

  const handleApproveStep = React.useCallback((stepId: number) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            status: 'COMPLETED',
            stdout: 'Executing systemctl restart postgresql...\n[OK] Service restarted successfully. Daemon PID: 18492',
            duration: '2.1s',
          };
        }
        if (s.id === stepId + 1) {
          return {
            ...s,
            status: 'COMPLETED',
            stdout: 'localhost:5432 - accepting connections',
            duration: '0.5s',
          };
        }
        return s;
      })
    );
  }, []);

  const completedCount = React.useMemo(() => steps.filter((s) => s.status === 'COMPLETED').length, [steps]);
  const progressPercent = React.useMemo(() => Math.round((completedCount / steps.length) * 100), [completedCount, steps.length]);

  return (
    <Card className="space-y-6">
      {/* Timeline Header & Progress Bar */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Incident INC-2026-8941 Execution Timeline</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">PostgreSQL Primary Cluster Failover & Recovery Sequence</p>
          </div>
          <Badge variant={progressPercent === 100 ? 'success' : 'warning'} size="md">
            {progressPercent}% Complete
          </Badge>
        </div>

        {/* Progress Bar Component */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {steps.map((step) => {
          return (
            <div key={step.id} className="relative group">
              {/* Step Icon Bullet */}
              <div className={`absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                step.status === 'COMPLETED'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                  : step.status === 'WAITING_APPROVAL'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 animate-pulse'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {step.status === 'COMPLETED' ? <CheckCircle2 className="h-4 w-4" /> : step.id}
              </div>

              {/* Step Detail Card */}
              <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{step.title}</h4>
                    <Badge variant={step.riskLevel === 'SAFE' ? 'info' : 'warning'} size="sm">
                      {step.riskLevel}
                    </Badge>
                  </div>
                  {step.duration && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1"><Clock className="h-3 w-3" />{step.duration}</span>}
                </div>

                <div className="font-mono text-xs px-3 py-2 rounded-xl bg-slate-900 text-cyan-400 border border-slate-800">
                  $ {step.command}
                </div>

                {step.stdout && (
                  <pre className="font-mono text-[11px] p-3 rounded-xl bg-slate-950 text-slate-300 overflow-x-auto border border-slate-800 whitespace-pre-wrap">
                    {step.stdout}
                  </pre>
                )}

                {step.status === 'WAITING_APPROVAL' && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-semibold">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>Risky shell action detected. Human confirmation required.</span>
                    </div>
                    <Button
                      variant="glow"
                      size="sm"
                      onClick={() => handleApproveStep(step.id)}
                      leftIcon={<Play className="h-3.5 w-3.5" />}
                    >
                      Authorize Execution
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
});

LiveTimeline.displayName = 'LiveTimeline';

