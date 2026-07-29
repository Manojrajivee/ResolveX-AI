'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Layout, Server, Cpu, Container } from 'lucide-react';

export const TechStackSection: React.FC = () => {
  const stackCategories = [
    {
      category: 'Frontend Tier',
      icon: Layout,
      color: 'text-blue-500',
      items: [
        { name: 'Next.js 15', desc: 'React 19 App Router & Server Components' },
        { name: 'TypeScript', desc: 'Strict End-to-End Type Safety' },
        { name: 'Tailwind CSS', desc: 'Modern Design System Tokens' },
        { name: 'Framer Motion', desc: '60fps GPU-Accelerated Micro-Animations' },
      ],
    },
    {
      category: 'Backend & Data Tier',
      icon: Server,
      color: 'text-emerald-500',
      items: [
        { name: 'Spring Boot 3 (Java 21)', desc: 'High-Throughput Enterprise Backend' },
        { name: 'Spring Security + JWT', desc: 'Stateless Authentication & RBAC' },
        { name: 'MongoDB Database', desc: 'Scalable Incident & Audit Log Storage' },
        { name: 'Apache PDFBox & CommonMark', desc: 'Multi-Format Runbook Text Parsers' },
      ],
    },
    {
      category: 'AI & Multi-Agent Layer',
      icon: Cpu,
      color: 'text-cyan-500',
      items: [
        { name: 'LangGraph & LangChain', desc: 'Multi-Agent Stateful Graph Orchestration' },
        { name: 'OpenAI GPT-4.1 / GPT-5', desc: 'High-Reasoning LLM Planner & Executor' },
        { name: 'ChromaDB Vector DB', desc: 'Semantic Embedding Search & Storage' },
        { name: 'Model Context Protocol (MCP)', desc: 'Standardized LLM Tool Invocation Protocol' },
      ],
    },
    {
      category: 'Infrastructure & DevOps',
      icon: Container,
      color: 'text-purple-500',
      items: [
        { name: 'Python Safe Shell Sandbox', desc: 'Allowlisted Shell Wrapper Enforcement' },
        { name: 'Docker Containerization', desc: 'Isolated Sandbox Command Execution' },
        { name: 'GitHub CI/CD Pipelines', desc: 'Automated Testing & Deployment' },
        { name: 'Render / Cloud Hosting', desc: 'Production Ready Deployment Target' },
      ],
    },
  ];

  return (
    <section id="stack" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            Production Standard Stack
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Best Choice Enterprise Technologies
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Engineered using proven, scalable technology frameworks for hackathons and enterprise deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stackCategories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hoverEffect className="h-full space-y-6 p-8 backdrop-blur-xl">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-slate-800 shadow-xs">
                      <Icon className={`h-6 w-6 ${cat.color}`} />
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-xl">{cat.category}</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cat.items.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">{item.name}</h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-medium">{item.desc}</p>
                      </div>
                    ))}
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
