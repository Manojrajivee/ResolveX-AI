'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import {
  FileUp,
  BrainCircuit,
  Search,
  Cpu,
  Terminal,
  ShieldCheck,
  Zap,
  BarChart3,
  FileCheck,
  Bell,
  Lock,
  Workflow,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: FileUp,
      title: 'Runbook Document Upload',
      desc: 'Native parsing support for PDF manuals, Markdown (.md), and Plain Text (.txt) SOPs with automatic metadata indexing.',
      color: 'text-blue-500',
    },
    {
      icon: BrainCircuit,
      title: 'AI Document Understanding',
      desc: 'Extracts section headings, preconditions, numbered steps, parameters, and risk classifications automatically.',
      color: 'text-cyan-500',
    },
    {
      icon: Search,
      title: 'ChromaDB Vector RAG Search',
      desc: 'Retrieves top-k semantic procedure chunks in milliseconds when alerts trigger, ensuring high accuracy.',
      color: 'text-emerald-500',
    },
    {
      icon: Cpu,
      title: 'AI Planner Agent',
      desc: 'Synthesizes problem descriptions and maps out a deterministic, step-by-step resolution sequence.',
      color: 'text-indigo-500',
    },
    {
      icon: Terminal,
      title: 'AI Execution Agent',
      desc: 'Dispatches shell commands through controlled tool wrappers with stdout/stderr stream collection.',
      color: 'text-purple-500',
    },
    {
      icon: Workflow,
      title: 'Model Context Protocol (MCP)',
      desc: 'Standardized enterprise protocol decoupling LLM reasoning from host system tool execution.',
      color: 'text-blue-500',
    },
    {
      icon: ShieldCheck,
      title: 'Safe Command Execution',
      desc: 'Strict allowlist rules enforce auto-execution for diagnostic commands while pausing for dangerous actions.',
      color: 'text-emerald-500',
    },
    {
      icon: Zap,
      title: 'Output Analysis & Decision',
      desc: 'Interprets stdout metrics (e.g. Disk 95%) and automatically triggers conditional remediation steps.',
      color: 'text-amber-500',
    },
    {
      icon: FileCheck,
      title: 'PDF Incident Report Generator',
      desc: 'Compiles full execution logs, command outputs, timestamps, and MTTR into executive PDF summaries.',
      color: 'text-cyan-500',
    },
    {
      icon: BarChart3,
      title: 'SRE Analytics Dashboard',
      desc: 'Visualizes resolution time velocity, incident frequency trends, AI step accuracy, and team metrics.',
      color: 'text-indigo-500',
    },
    {
      icon: Bell,
      title: 'Real-Time Alerts & Audit Logs',
      desc: 'Maintains an unalterable audit trail of all commands run by AI or confirmed by SRE engineers.',
      color: 'text-blue-500',
    },
    {
      icon: Lock,
      title: 'Enterprise RBAC & Security',
      desc: 'Role-Based Access Control (Admin/Engineer/Viewer) with BCrypt password hashing and JWT authentication.',
      color: 'text-emerald-500',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            Capabilities & Architecture
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Features Built for SRE Scale
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Everything your DevOps team needs to convert manual documentation into safe, autonomous incident resolution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card hoverEffect className="h-full flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 w-fit shadow-xs">
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">{feature.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
