'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Play } from 'lucide-react';

export default function TutorialsPage() {
  const tutorials = [
    { title: 'Uploading & Vectorizing Your First Runbook', duration: '3 mins', difficulty: 'Beginner', desc: 'Learn how to drag & drop SOP manuals into ChromaDB.' },
    { title: 'Handling Risky Command Approval Intercepts', duration: '5 mins', difficulty: 'Intermediate', desc: 'Understand how human authorization protects production clusters.' },
    { title: 'Exporting SOC-2 Compliant Incident Reports', duration: '4 mins', difficulty: 'Advanced', desc: 'Generate downloadable PDF incident audit reports automatically.' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-16 px-4 max-w-5xl mx-auto space-y-8 w-full">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Interactive SRE Video Tutorials</h1>
          <p className="text-slate-400 text-sm">Step-by-step video guides for DevOps engineers and system administrators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tutorials.map((t, idx) => (
            <Card key={idx} hoverEffect className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="sm">{t.difficulty}</Badge>
                <span className="text-[10px] text-slate-400 font-mono">{t.duration}</span>
              </div>
              <h4 className="font-bold text-white text-base leading-snug">{t.title}</h4>
              <p className="text-xs text-slate-400">{t.desc}</p>
            </Card>
          ))}
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
