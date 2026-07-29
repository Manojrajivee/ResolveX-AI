'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { User, Layout, Server, Cpu, Database, Terminal, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const nodes = [
    { label: 'End User / SRE', sub: 'Alert Trigger', icon: User, color: 'text-blue-500' },
    { label: 'Next.js Frontend', sub: 'React 19 App Router', icon: Layout, color: 'text-cyan-500' },
    { label: 'Spring Boot API', sub: 'Java 21 Core Backend', icon: Server, color: 'text-emerald-500' },
    { label: 'LangGraph AI Agents', sub: 'Planner / Decision', icon: Cpu, color: 'text-indigo-500' },
    { label: 'ChromaDB Vector DB', sub: 'RAG Embeddings', icon: Database, color: 'text-purple-500' },
    { label: 'MCP Protocol Server', sub: 'Tool Wrapper Host', icon: Terminal, color: 'text-amber-500' },
    { label: 'Safe Shell Execution', sub: 'Linux / Docker Sandbox', icon: ShieldCheck, color: 'text-emerald-500' },
    { label: 'Incident Report', sub: 'PDF Report Generator', icon: FileText, color: 'text-cyan-500' },
  ];

  return (
    <section id="architecture" className="py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            System Topology
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Enterprise Architecture Flow
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Secure multi-tier system decoupling AI reasoning from shell execution using Model Context Protocol.
          </p>
        </div>

        {/* Diagram Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {nodes.map((node, i) => {
            const Icon = node.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card hoverEffect className="h-full flex flex-col justify-between p-6 space-y-4 relative group">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 shadow-xs">
                      <Icon className={`h-6 w-6 ${node.color}`} />
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">0{i + 1}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">{node.label}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 font-medium">{node.sub}</p>
                  </div>

                  {i < nodes.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
