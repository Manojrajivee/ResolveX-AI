'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';

export default function LicensesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-16 px-4 max-w-4xl mx-auto space-y-6 w-full text-xs text-slate-300">
        <h1 className="text-3xl font-extrabold text-white">Open Source Licenses & Attributions</h1>
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3 font-mono">
          <div>Next.js 15 — MIT License</div>
          <div>Tailwind CSS — MIT License</div>
          <div>Framer Motion — MIT License</div>
          <div>Lucide React Icons — ISC License</div>
          <div>Recharts — MIT License</div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
