'use client';

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { MessageSquare, Calendar, Search, ArrowRight, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const PAST_SESSIONS = [
  { id: 'sess-1', title: 'PostgreSQL Primary Crash Recovery', date: '2026-07-29 14:32', messagesCount: 14, status: 'Resolved', category: 'Database' },
  { id: 'sess-2', title: 'K8s OOMKilled Container Inspection', date: '2026-07-28 11:15', messagesCount: 8, status: 'Resolved', category: 'Kubernetes' },
  { id: 'sess-3', title: 'Nginx 502 Bad Gateway Triage', date: '2026-07-27 09:40', messagesCount: 19, status: 'Resolved', category: 'Web Services' },
  { id: 'sess-4', title: 'Redis Cache Maxmemory Eviction Alert', date: '2026-07-25 16:05', messagesCount: 6, status: 'Resolved', category: 'Cache' },
];

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Copilot Session History"
        description="Historical incident conversations, multi-agent execution logs, and resolution transcripts."
        action={
          <Link href="/dashboard/chat">
            <Button variant="glow" size="md">
              Start New Chat
            </Button>
          </Link>
        }
      />

      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search historical transcripts..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none"
            />
          </div>
          <span className="text-xs font-mono text-slate-400 font-bold">{PAST_SESSIONS.length} Historical Sessions</span>
        </div>

        <div className="space-y-3">
          {PAST_SESSIONS.map((sess) => (
            <div
              key={sess.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 hover:border-blue-500/40 transition-all text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{sess.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold">
                      {sess.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {sess.date}
                    </span>
                    <span>• {sess.messagesCount} Messages</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
                  {sess.status}
                </span>
                <Link href="/dashboard/chat">
                  <Button size="sm" variant="outline" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                    Open Session
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
