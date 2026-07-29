'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tag } from 'lucide-react';

export default function ReleaseNotesPage() {
  const releases = [
    { version: 'v1.4.0', date: 'July 2026', title: 'Multi-Agent Operations & ChromaDB Integration', features: ['Added Multi-Agent system monitoring.', 'Enhanced PDF/MD runbook parsing speed by 40%.', 'Integrated MCP terminal execution guardrails.'] },
    { version: 'v1.2.0', date: 'June 2026', title: 'Enterprise Reports & PDF Export Engine', features: ['Auto-generated SOC-2 incident PDF summaries.', 'Added Recharts analytical visualizations.'] },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-16 px-4 max-w-4xl mx-auto space-y-8 w-full">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Platform Release Notes & Changelog</h1>
          <p className="text-slate-400 text-sm">Stay up to date with new features, performance updates, and security releases.</p>
        </div>

        <div className="space-y-6">
          {releases.map((r, idx) => (
            <Card key={idx} className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-bold text-white text-lg">{r.version} — {r.title}</h3>
                </div>
                <Badge variant="purple" size="sm">{r.date}</Badge>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-5">
                {r.features.map((f, fIdx) => (
                  <li key={fIdx}>{f}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
