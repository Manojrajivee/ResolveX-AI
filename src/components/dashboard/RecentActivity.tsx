'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CheckCircle2, ShieldAlert, Terminal, FileText } from 'lucide-react';
import Link from 'next/link';

export const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 'act-1',
      title: 'PostgreSQL HA Primary Recovered',
      details: 'Executed systemctl restart postgresql after checking disk space.',
      time: '12 mins ago',
      type: 'RESOLVED',
      incidentId: 'INC-2026-8941',
    },
    {
      id: 'act-2',
      title: 'Risky Command Intercepted',
      details: 'systemctl stop mysql required user confirmation. Human approved.',
      time: '45 mins ago',
      type: 'APPROVAL',
      incidentId: 'INC-2026-8935',
    },
    {
      id: 'act-3',
      title: 'New Runbook Ingested',
      details: 'K8s OOMKilled Recovery manual split into 18 semantic chunks.',
      time: '2 hours ago',
      type: 'RUNBOOK',
      incidentId: 'RB-K8S-09',
    },
    {
      id: 'act-4',
      title: 'PDF Incident Report Exported',
      details: 'Report #INC-2026-8920 archived to S3 storage bucket.',
      time: '4 hours ago',
      type: 'REPORT',
      incidentId: 'INC-2026-8920',
    },
  ];

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span>Recent System Activity Feed</span>
        </h3>
        <Link href="/dashboard/operations/logs" className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold">
          View All Logs
        </Link>
      </div>

      <div className="space-y-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-500/40 transition-colors"
          >
            <div className="mt-0.5 shrink-0">
              {act.type === 'RESOLVED' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {act.type === 'APPROVAL' && <ShieldAlert className="h-5 w-5 text-amber-500" />}
              {act.type === 'RUNBOOK' && <Terminal className="h-5 w-5 text-blue-500" />}
              {act.type === 'REPORT' && <FileText className="h-5 w-5 text-purple-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{act.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">{act.time}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{act.details}</p>
            </div>
            <Badge variant={act.type === 'RESOLVED' ? 'success' : act.type === 'APPROVAL' ? 'warning' : 'info'} size="sm" className="shrink-0">
              {act.incidentId}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
};
