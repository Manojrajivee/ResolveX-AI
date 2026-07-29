'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileUp, BookOpen, Brain, Terminal, Activity, FileCheck, ArrowRight } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Upload Runbook Document',
      desc: 'SRE uploads operational PDF, Markdown, or TXT manual to the secure vault.',
      icon: FileUp,
      badge: 'PDF / MD / TXT',
    },
    {
      num: '02',
      title: 'AI Semantic Ingestion',
      desc: 'Parses headings, steps, and commands; generates embeddings in ChromaDB.',
      icon: BookOpen,
      badge: 'ChromaDB Vector RAG',
    },
    {
      num: '03',
      title: 'Planner Agent Graph',
      desc: 'Matches incoming incident alert to retrieved chunk and emits step plan.',
      icon: Brain,
      badge: 'LangGraph Planner',
    },
    {
      num: '04',
      title: 'Execution & Safety Check',
      desc: 'Auto-executes safe diagnostics; requests SRE approval for risky operations.',
      icon: Terminal,
      badge: 'MCP Safe Shell Wrapper',
    },
    {
      num: '05',
      title: 'Output Analysis & Decision',
      desc: 'Evaluates command stdout/stderr to determine if issue is resolved.',
      icon: Activity,
      badge: 'Decision Agent',
    },
    {
      num: '06',
      title: 'PDF Report Generation',
      desc: 'Auto-compiles execution summary, audit logs, and MTTR into executive PDF.',
      icon: FileCheck,
      badge: 'Reporter Agent',
    },
  ];

  return (
    <section id="workflow" className="py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            End-to-End Execution Sequence
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How the Autonomous AI Workflow Functions
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            From raw manual ingestion to automated shell execution and incident resolution reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xs flex flex-col justify-between space-y-6 group hover:border-blue-500/50 transition-all text-slate-900 dark:text-slate-100"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text font-mono">
                      {step.num}
                    </span>
                    <div className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform shadow-2xs">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <h4 className="font-extrabold text-lg">{step.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-blue-600 dark:text-cyan-400">
                    {step.badge}
                  </span>
                  {idx < steps.length - 1 && <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-600 hidden lg:block" />}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
