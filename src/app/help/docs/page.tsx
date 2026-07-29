'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { Card } from '@/components/ui/Card';
import { BookOpen } from 'lucide-react';

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-16 px-4 max-w-5xl mx-auto space-y-8 w-full">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">System Documentation</h1>
          <p className="text-slate-400 text-sm">Comprehensive architecture guides and SRE runbook ingestion workflows.</p>
        </div>

        <Card className="p-8 space-y-4">
          <h3 className="font-bold text-white text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <span>1. Vector RAG Ingestion Engine</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Runbook Following Agent converts uploaded operational runbooks (PDF, Markdown, TXT) into chunked vector embeddings. Embeddings are stored inside ChromaDB using text-embedding-3-small vectors. When an alert arrives, Cosine Similarity matching identifies the top-1 SOP procedure chunk.
          </p>
        </Card>

        <Card className="p-8 space-y-4">
          <h3 className="font-bold text-white text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            <span>2. MCP Safe Command Guardrails</span>
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Commands categorized as RISKY (e.g. systemctl restart, rm -rf, reboot) are intercepted by the Decision Agent. Execution pauses and requires explicit human SRE authorization via interactive prompt before the shell wrapper fires.
          </p>
        </Card>
      </main>

      <FooterSection />
    </div>
  );
}
