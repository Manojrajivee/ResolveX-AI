'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Brain, Terminal, Zap, FileCheck, CheckCircle2 } from 'lucide-react';

export const AgentsSection: React.FC = () => {
  const agents = [
    {
      title: 'Agent 1: Planner Agent',
      icon: Brain,
      color: 'from-blue-600 to-cyan-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      description: 'Understands incoming SRE alerts, searches vector runbooks, and creates structured execution graphs.',
      responsibilities: [
        'Read & parse uploaded Runbook chunks',
        'Extract exact matching procedure steps',
        'Assign risk levels (SAFE, RISKY, CRITICAL)',
        'Emit deterministic JSON execution graph',
      ],
    },
    {
      title: 'Agent 2: Execution Agent',
      icon: Terminal,
      color: 'from-indigo-600 to-purple-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      description: 'Communicates with MCP tool servers to run safe commands and stream stdout/stderr logs.',
      responsibilities: [
        'Transmit commands to MCP Server wrapper',
        'Enforce command allowlist security filters',
        'Intercept risky operations for human SRE review',
        'Capture terminal exit codes & outputs',
      ],
    },
    {
      title: 'Agent 3: Decision Agent',
      icon: Zap,
      color: 'from-amber-600 to-orange-500',
      textColor: 'text-amber-600 dark:text-amber-400',
      description: 'Analyzes command outputs in real-time to determine next resolution steps or trigger fallbacks.',
      responsibilities: [
        'Parse stdout metrics (e.g. Memory > 90%)',
        'Evaluate process health & socket response',
        'Determine if incident is fully resolved',
        'Trigger conditional escalation workflows',
      ],
    },
    {
      title: 'Agent 4: Reporter Agent',
      icon: FileCheck,
      color: 'from-emerald-600 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      description: 'Compiles execution audit logs and MTTR metrics into formal PDF incident resolution reports.',
      responsibilities: [
        'Aggregate command logs & timestamps',
        'Calculate Mean Time to Resolution (MTTR)',
        'Generate executive summary PDF reports',
        'Update MongoDB incident audit archives',
      ],
    },
  ];

  return (
    <section id="agents" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            Multi-Agent Architecture
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Specialized Autonomous AI Agents
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Our multi-agent system divides incident resolution into decoupled, highly specialized LLM workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {agents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card hoverEffect className="h-full space-y-6 p-8 backdrop-blur-2xl">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-tr ${agent.color} text-white shadow-xl`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xl">{agent.title}</h4>
                      <Badge variant="info" size="sm" className="mt-1">
                        LangGraph Agent
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{agent.description}</p>

                  <div className="space-y-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
                    <h5 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Core Responsibilities:
                    </h5>
                    <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {agent.responsibilities.map((resp, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className={`h-4 w-4 shrink-0 ${agent.textColor}`} />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
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
