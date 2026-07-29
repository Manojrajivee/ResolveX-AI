'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { Bot, ShieldCheck, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-20 px-4 max-w-4xl mx-auto space-y-8 w-full text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-blue-500/25 mx-auto">
          <Bot className="h-10 w-10" />
        </div>

        <h1 className="text-4xl font-black text-white tracking-tight">
          About Runbook Following Agent
        </h1>

        <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto">
          Runbook Following Agent is an AI-powered intelligent incident resolution platform built for enterprise DevOps and SRE teams. By digesting SOP documents (PDF/MD/TXT) into vector embeddings, our multi-agent architecture reduces MTTR from hours to minutes while guaranteeing command execution safety through interactive human-in-the-loop guardrails.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            <h4 className="font-bold text-white text-base">SOC-2 Safety</h4>
            <p className="text-xs text-slate-400">Cryptographically signed authorization for all risky terminal commands.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            <h4 className="font-bold text-white text-base">Instant RAG Match</h4>
            <p className="text-xs text-slate-400">ChromaDB vector store returns top-1 chunk SOP steps in under 100ms.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <Bot className="h-6 w-6 text-purple-400" />
            <h4 className="font-bold text-white text-base">Multi-Agent Graph</h4>
            <p className="text-xs text-slate-400">LangGraph orchestration of Planner, Retrieval, Execution, and Reporter agents.</p>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
