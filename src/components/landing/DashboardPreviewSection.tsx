'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Activity,
  FileText,
  BarChart3,
  Bot,
  ShieldAlert,
} from 'lucide-react';

export const DashboardPreviewSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'chat' | 'analytics'>('timeline');

  return (
    <section id="dashboard-preview" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            Interactive Product Preview
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise SRE Command Center
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Experience the intuitive interface built for high-tempo DevOps incident management.
          </p>
        </div>

        {/* Mock Application Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100"
        >
          {/* Top Browser Bar */}
          <div className="px-6 py-4 bg-slate-100/90 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-500 ml-4 hidden sm:inline">
                https://app.runbook-agent.enterprise/dashboard
              </span>
            </div>

            <div className="flex items-center gap-2">
              {['timeline', 'chat', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-200/80 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Inner Dashboard Simulation Layout */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50 dark:bg-slate-950/60 backdrop-blur-xl">
            {/* Sidebar Mock (3 cols) */}
            <div className="lg:col-span-3 space-y-4 p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Runbook Agent</span>
              </div>

              <div className="space-y-1 text-xs">
                {[
                  { name: 'Dashboard', icon: LayoutDashboard, active: true },
                  { name: 'Runbook Vault', icon: BookOpen },
                  { name: 'AI Assistant', icon: MessageSquare },
                  { name: 'Execution Timeline', icon: Activity },
                  { name: 'Incident Reports', icon: FileText },
                  { name: 'SRE Analytics', icon: BarChart3 },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl font-semibold ${
                        item.active
                          ? 'bg-blue-500/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Area Mock (9 cols) */}
            <div className="lg:col-span-9 space-y-6">
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">PostgreSQL HA Primary Recovered</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Incident #INC-2026-8941</p>
                    </div>
                    <Badge variant="success" size="sm">
                      RESOLVED (2m 14s)
                    </Badge>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 font-mono text-xs shadow-xs">
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>✓ Step 1: systemctl status postgresql</span>
                      <span>[0.8s]</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>✓ Step 2: df -h /var/lib/postgresql</span>
                      <span>[0.4s]</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-700 dark:text-amber-400 font-semibold">
                      <span className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <span>Step 3: systemctl restart postgresql (Human Confirmed)</span>
                      </span>
                      <Button variant="glow" size="sm" className="text-[10px] px-2.5 py-1">
                        Authorized
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-4 text-xs shadow-xs">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-300 font-medium">
                    <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1">User Alert:</span>
                    Database server PostgreSQL on node-01 is unresponsive.
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-200 font-medium">
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 block mb-1">AI Planner Agent:</span>
                    Found match in runbook "PostgreSQL HA Recovery" (Confidence 98.4%). Generated 4 step execution graph.
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">3.2m</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Mean MTTR</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <h4 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">97.8%</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">RAG Accuracy</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                    <h4 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">100%</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Safe Intercepts</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
