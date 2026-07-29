'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-16 px-4 max-w-4xl mx-auto space-y-6 w-full text-xs text-slate-300">
        <h1 className="text-3xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-slate-400">Effective Date: July 2026</p>
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
          <h3 className="font-bold text-white text-sm">1. Acceptance of Terms</h3>
          <p>By using the Runbook Following Agent platform, enterprise customers agree to abide by safe MCP execution guidelines and human approval protocols.</p>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
