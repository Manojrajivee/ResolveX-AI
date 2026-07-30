'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/Button';
import { Upload, Play, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="SRE Incident Resolution Control Center"
        description="Autonomous Runbook Execution, MCP Tool Integration & Real-time Metrics"
        action={
          <div className="flex items-center gap-3">
            <Link href="/dashboard/runbooks/upload">
              <Button variant="outline" size="md" leftIcon={<Upload className="h-4 w-4" />}>
                Upload Runbook
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button variant="glow" size="md" leftIcon={<Play className="h-4 w-4" />}>
                Trigger Incident Session
              </Button>
            </Link>
          </div>
        }
      />

      {/* Cards Metrics */}
      <DashboardCards />

      {/* Activity & Operational Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick SRE Status Box */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl space-y-4 shadow-sm text-slate-900 dark:text-slate-100">
          <div className="flex items-center gap-2 text-sm font-bold">
            <ShieldAlert className="h-5 w-5 text-emerald-500" />
            <span>AI Execution Guardrail Status</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            MCP Safe Shell Sandbox is actively filtering shell execution commands. Destructive operations require human engineer SRE confirmation.
          </p>

          <div className="space-y-2.5 font-mono text-xs pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Allowlist Rules:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">142 Commands</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Vector Index:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">ChromaDB Healthy</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>LLM Agent State:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">GPT-4.1 Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
