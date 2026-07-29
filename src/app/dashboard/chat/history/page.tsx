'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSidebarStore } from '@/hooks/useSidebar';
import { MessageSquare, Clock, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function ChatHistoryPage() {
  const { isCollapsed } = useSidebarStore();
  const sessions = [
    { id: 'session-2026-9041', title: 'PostgreSQL HA Node-02 Failover', date: 'Today, 14:02', status: 'RESOLVED', messagesCount: 6 },
    { id: 'session-2026-8920', title: 'Nginx Certbot SSL Renewal', date: 'Yesterday, 09:15', status: 'RESOLVED', messagesCount: 4 },
    { id: 'session-2026-8894', title: 'Payment Pod OOMKilled Memory Leak', date: '2 days ago', status: 'RESOLVED', messagesCount: 8 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-5xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="AI Chat Incident History"
            description="Archive of past AI Agent reasoning sessions, terminal command logs, and incident workflows."
          />

          <div className="space-y-3">
            {sessions.map((ses) => (
              <Card key={ses.id} hoverEffect className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{ses.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Ref: {ses.id} • {ses.date} • {ses.messagesCount} Messages</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant="success" size="sm">{ses.status}</Badge>
                  <Link href="/chat">
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
                      Open Session
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
