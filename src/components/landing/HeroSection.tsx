'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, ShieldCheck, Database, Terminal, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-blue-500/20 via-cyan-500/15 to-indigo-500/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 dark:bg-slate-900/80 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold shadow-xs">
              <Sparkles className="h-4 w-4 text-cyan-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Next-Gen SRE Incident Resolution Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              AI Powered <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-blue-400 dark:via-cyan-300 dark:to-indigo-400 bg-clip-text text-transparent">
                Runbook Following Agent
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Automate DevOps incident response. Ingest operational runbooks (PDF, Markdown, TXT), parse semantic chunks with ChromaDB RAG, orchestrate multi-agent execution graphs, and execute safe shell commands via Model Context Protocol (MCP).
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="glow" size="lg" className="w-full sm:w-auto text-sm px-7 py-3.5" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started Free
                </Button>
              </Link>
              <Link href="#dashboard-preview" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm px-7 py-3.5" leftIcon={<Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />}>
                  View Live Demo
                </Button>
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600 dark:text-slate-400 font-mono font-semibold">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Zero Risk Execution</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-cyan-500" />
                <span>ChromaDB RAG Embeddings</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-blue-500" />
                <span>MCP Shell Wrapper</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Floating AI Architecture Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Main Central Card */}
            <div className="w-full max-w-md p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl shadow-2xl space-y-5 relative z-10 group hover:border-blue-500/50 transition-colors text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-lg shadow-blue-500/25">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">AI Agent Orchestrator</h3>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Active Workflow #INC-8941</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  HEALTHY
                </span>
              </div>

              {/* Terminal Code Execution Simulation */}
              <div className="p-3.5 rounded-xl bg-slate-950 font-mono text-xs space-y-2 border border-slate-800 text-slate-100 shadow-inner">
                <div className="text-slate-400 text-[10px] flex justify-between">
                  <span>Target: prod-db-node-01</span>
                  <span className="text-cyan-400">RAG Chunk #04</span>
                </div>
                <div className="text-slate-300">
                  <span className="text-emerald-400">$</span> systemctl status postgresql
                </div>
                <div className="text-rose-400 text-[11px]">
                  [ALERT] Active: inactive (dead)
                </div>
                <div className="text-amber-400 text-[11px] pt-1 flex items-center gap-1.5 border-t border-slate-900">
                  <Zap className="h-3.5 w-3.5 animate-bounce" />
                  <span>Planner Agent: Require Human Approval for Restart</span>
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono font-medium">Execution Safety: 100%</span>
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-md shadow-blue-500/20">
                  Authorize & Execute
                </span>
              </div>
            </div>

            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-4 -left-4 z-20 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <Database className="h-4 w-4 text-cyan-500" />
              <span>ChromaDB Vector RAG</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute -bottom-4 -right-4 z-20 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700/80 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <Terminal className="h-4 w-4 text-blue-500" />
              <span>Model Context Protocol (MCP)</span>
            </motion.div>

            <motion.div
              animate={{ x: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute top-1/2 -right-8 z-20 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 border border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-xl text-[11px] font-mono font-bold"
            >
              GPT-4.1 LangGraph
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
