'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_SERVICES } from '@/services/operations.service';
import { Activity, CheckCircle2 } from 'lucide-react';

export default function SystemStatusPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-16 px-4 max-w-5xl mx-auto space-y-8 w-full">
        <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">All Systems Operational</h1>
          <p className="text-xs text-slate-400">Current platform uptime: 99.98% over past 30 days.</p>
        </div>

        <div className="space-y-4">
          {MOCK_SERVICES.map((s) => (
            <Card key={s.id} className="p-5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">{s.name}</h4>
                <span className="text-xs text-slate-400 font-mono">Response Latency: {s.latencyMs}ms</span>
              </div>
              <Badge variant="success" size="md">{s.status}</Badge>
            </Card>
          ))}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
