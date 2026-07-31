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
import { Palette, Type, Layers, Box, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function DesignSystemPage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <Breadcrumb />

          <PageHeader
            title="Enterprise Design System & Token Documentation"
            description="Production-grade design tokens, typography scales, glassmorphism surfaces, and Framer Motion animation benchmarks."
          />

          {/* Color Tokens Showcase */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-500" />
              <span>Semantic Color Tokens</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 font-mono text-xs">
              {[
                { name: 'Primary Blue', class: 'bg-blue-600 text-white', hex: '#2563EB' },
                { name: 'Cyan Accent', class: 'bg-cyan-500 text-white', hex: '#06B6D4' },
                { name: 'Emerald Success', class: 'bg-emerald-500 text-white', hex: '#10B981' },
                { name: 'Amber Warning', class: 'bg-amber-500 text-slate-900', hex: '#F59E0B' },
                { name: 'Rose Critical', class: 'bg-rose-500 text-white', hex: '#F43F5E' },
                { name: 'Purple Admin', class: 'bg-purple-600 text-white', hex: '#9333EA' },
              ].map((c, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
                  <div className={`h-12 rounded-xl ${c.class} flex items-center justify-center font-bold`}>{c.hex}</div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">{c.name}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Typography Hierarchy */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Type className="h-5 w-5 text-cyan-500" />
              <span>Typography Hierarchy</span>
            </h3>

            <Card className="p-6 space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400">Display Hero (3.5rem / 56px)</span>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">Autonomous Incident Engine</h1>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-mono text-slate-400">Heading 1 (1.875rem / 30px)</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">SRE Command Center Dashboard</h2>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-mono text-slate-400">Body Large (1rem / 16px)</span>
                <p className="text-base text-slate-700 dark:text-slate-300 font-medium">Parses uploaded SOP manuals into 1536-dimensional vector embeddings for ChromaDB retrieval.</p>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                <span className="text-xs font-mono text-slate-400">Code Spec (0.75rem / 12px)</span>
                <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                  $ systemctl status postgresql.service
                </pre>
              </div>
            </Card>
          </div>

          {/* Component Primitives Showcase */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Box className="h-5 w-5 text-emerald-500" />
              <span>UI Component Primitives</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buttons */}
              <Card className="p-6 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Button Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="glow" size="sm">Glow Primary</Button>
                  <Button variant="outline" size="sm">Outline Secondary</Button>
                  <Button variant="ghost" size="sm">Ghost Neutral</Button>
                  <Button variant="danger" size="sm">Danger Critical</Button>
                </div>
              </Card>

              {/* Badges */}
              <Card className="p-6 space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Status & Priority Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" size="sm">RESOLVED</Badge>
                  <Badge variant="warning" size="sm">CRITICAL RISK</Badge>
                  <Badge variant="info" size="sm">SAFE EXECUTED</Badge>
                  <Badge variant="purple" size="sm">SUPER ADMIN</Badge>
                  <Badge variant="neutral" size="sm">INACTIVE</Badge>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
