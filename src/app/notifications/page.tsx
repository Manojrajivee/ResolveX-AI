'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSidebarStore } from '@/hooks/useSidebar';
import { ShieldAlert, CheckCircle2, Trash2, CheckSquare } from 'lucide-react';

export default function NotificationsPage() {
  const { isCollapsed } = useSidebarStore();
  const [notifications, setNotifications] = useState([
    { id: 'n-1', title: 'Human Approval Required', desc: 'Command systemctl restart postgresql requires confirmation on node-01.', time: '5m ago', read: false, type: 'RISK' },
    { id: 'n-2', title: 'Incident Resolved Successfully', desc: 'Incident INC-2026-8941 closed in 2m 14s.', time: '12m ago', read: false, type: 'SUCCESS' },
    { id: 'n-3', title: 'New Runbook Ingested', desc: 'PostgreSQL HA Manual split into 12 chunks in ChromaDB.', time: '1h ago', read: true, type: 'INFO' },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="System Notifications & Alerts"
            description="Real-time audit alerts, pending human confirmation requests, and resolution updates."
            action={
              <Button variant="outline" size="sm" onClick={markAllRead} leftIcon={<CheckSquare className="h-4 w-4" />}>
                Mark All as Read
              </Button>
            }
          />

          <div className="space-y-3">
            {notifications.map((n) => (
              <Card key={n.id} className={`flex items-start justify-between gap-4 transition-all ${!n.read ? 'border-blue-500/40 bg-blue-500/10 dark:bg-blue-950/20' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {n.type === 'RISK' ? <ShieldAlert className="h-5 w-5 text-amber-500" /> : <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{n.title}</h4>
                      {!n.read && <Badge variant="info" size="sm">Unread</Badge>}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">{n.time}</span>
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={() => deleteNotif(n.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300">
                  <Trash2 className="h-4 w-4" />
                </Button>
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
