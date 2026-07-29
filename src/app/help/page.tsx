'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { Card } from '@/components/ui/Card';
import { BookOpen, HelpCircle, Play, Mail, Activity, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-20 px-4 max-w-6xl mx-auto space-y-12 w-full">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Help Center & Knowledge Base</h1>
          <p className="text-slate-400 text-sm">
            Everything you need to deploy, configure, and operate the Runbook Following Agent platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/help/docs">
            <Card hoverEffect className="p-6 space-y-3 h-full">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <h3 className="font-bold text-white text-lg">System Documentation</h3>
              <p className="text-xs text-slate-400">Architecture diagrams, ChromaDB vector indexing, and MCP tool configuration.</p>
            </Card>
          </Link>

          <Link href="/help/faq">
            <Card hoverEffect className="p-6 space-y-3 h-full">
              <HelpCircle className="h-8 w-8 text-cyan-400" />
              <h3 className="font-bold text-white text-lg">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-400">Answers to common SRE questions regarding command safety and PDF ingestion.</p>
            </Card>
          </Link>

          <Link href="/help/tutorials">
            <Card hoverEffect className="p-6 space-y-3 h-full">
              <Play className="h-8 w-8 text-purple-400" />
              <h3 className="font-bold text-white text-lg">Interactive Tutorials</h3>
              <p className="text-xs text-slate-400">Step-by-step onboarding walkthroughs for first-time DevOps engineers.</p>
            </Card>
          </Link>

          <Link href="/help/system-status">
            <Card hoverEffect className="p-6 space-y-3 h-full">
              <Activity className="h-8 w-8 text-emerald-400" />
              <h3 className="font-bold text-white text-lg">Platform System Status</h3>
              <p className="text-xs text-slate-400">Real-time status metrics for backend APIs, MongoDB, and vector stores.</p>
            </Card>
          </Link>

          <Link href="/help/contact">
            <Card hoverEffect className="p-6 space-y-3 h-full">
              <Mail className="h-8 w-8 text-amber-400" />
              <h3 className="font-bold text-white text-lg">Contact Enterprise Support</h3>
              <p className="text-xs text-slate-400">Submit a support ticket or reach out directly to our engineering team.</p>
            </Card>
          </Link>

          <Link href="/help/release-notes">
            <Card hoverEffect className="p-6 space-y-3 h-full">
              <Shield className="h-8 w-8 text-rose-400" />
              <h3 className="font-bold text-white text-lg">Release Notes & Updates</h3>
              <p className="text-xs text-slate-400">Track latest feature additions, security patches, and version changelogs.</p>
            </Card>
          </Link>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
