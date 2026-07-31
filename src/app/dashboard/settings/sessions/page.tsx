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
import { useIAMStore } from '@/store/iam-store';
import { useCollaborationStore } from '@/store/collaboration-store';
import { Laptop, Smartphone, Globe, ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';

export default function SessionsSettingsPage() {
  const { isCollapsed } = useSidebarStore();
  const { sessions, terminateSession, terminateAllOtherSessions } = useIAMStore();
  const { addToast } = useCollaborationStore();

  const handleTerminate = (id: string) => {
    terminateSession(id);
    addToast({ title: 'Session Terminated', desc: 'Active token revoked for target device.', variant: 'info' });
  };

  const handleTerminateAll = () => {
    terminateAllOtherSessions();
    addToast({ title: 'All Other Sessions Terminated', desc: 'Only your current device session remains active.', variant: 'warning' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Active Device Sessions & Token Management"
            description="Inspect authenticated SSO sessions across laptops, smartphones, and workstations."
            action={
              <Button variant="outline" size="sm" onClick={handleTerminateAll} leftIcon={<LogOut className="h-4 w-4" />}>
                Terminate All Other Sessions
              </Button>
            }
          />

          {/* Active Sessions List */}
          <div className="space-y-4">
            {sessions.map((sess) => (
              <Card key={sess.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                    {sess.device.includes('iPhone') || sess.device.includes('Mobile') ? (
                      <Smartphone className="h-6 w-6" />
                    ) : (
                      <Laptop className="h-6 w-6" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{sess.device}</h4>
                      {sess.isCurrent && <Badge variant="success" size="sm">Current Device</Badge>}
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {sess.browser} • {sess.os} • IP: {sess.ip}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium pt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5 text-cyan-500" />
                        <span>{sess.location}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">Last Active: {sess.lastActive}</span>
                    </div>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <Button variant="ghost" size="sm" onClick={() => handleTerminate(sess.id)} className="text-rose-600 dark:text-rose-400 font-bold shrink-0">
                    Revoke Token
                  </Button>
                )}
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
