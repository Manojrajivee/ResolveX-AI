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
import { Monitor, Smartphone, LogOut } from 'lucide-react';

export default function SettingsSessionsPage() {
  const { isCollapsed } = useSidebarStore();
  const sessions = [
    { id: 's-1', device: 'MacBook Pro 16"', browser: 'Chrome 126.0 (macOS)', ip: '192.168.1.45', lastActive: 'Active Now', current: true },
    { id: 's-2', device: 'Windows Workstation', browser: 'Edge 125.0 (Windows 11)', ip: '192.168.1.88', lastActive: '2 hours ago', current: false },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Active Device & JWT Sessions"
            description="Inspect active session tokens and terminate unauthorized device logins."
          />

          <div className="space-y-4">
            {sessions.map((s) => (
              <Card key={s.id} className="p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">{s.device}</h4>
                      {s.current && <Badge variant="success" size="sm">Current Session</Badge>}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">{s.browser} • IP: {s.ip}</span>
                  </div>
                </div>

                {!s.current && (
                  <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300" leftIcon={<LogOut className="h-3.5 w-3.5" />}>
                    Terminate
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
