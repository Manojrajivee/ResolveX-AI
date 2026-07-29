'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI Agent execute shell commands safely?',
      a: 'The platform utilizes a Model Context Protocol (MCP) server connected to a Python shell wrapper with an strict command allowlist. Diagnostic commands (e.g. ps aux, df -h) are executed automatically, while potentially destructive commands (e.g. systemctl restart, service stop) require explicit human SRE confirmation before invocation.',
    },
    {
      q: 'What file formats are supported for Runbook uploads?',
      a: 'We support PDF, Markdown (.md), and Plain Text (.txt) SOP documents. Upon upload, our parser extracts headings, prerequisite steps, and code snippets before generating 1536-dimensional vector embeddings stored in ChromaDB.',
    },
    {
      q: 'How does ChromaDB RAG ensure accurate procedure retrieval?',
      a: 'When an alert or query occurs (e.g. "Database server is down"), the RAG engine converts the issue into vector space and performs top-k semantic similarity search against indexed runbook chunks, ensuring the exact procedure section is supplied to the AI Planner Agent.',
    },
    {
      q: 'What role does LangGraph play in the architecture?',
      a: 'LangGraph orchestrates the multi-agent graph state transition between the Planner Agent, Execution Agent, Decision Agent, and Reporter Agent. This ensures predictable state persistence and deterministic fallback branches.',
    },
    {
      q: 'Can human engineers override or interrupt AI step execution?',
      a: 'Yes. Every execution session includes real-time step visualization, live stdout streaming, and instant cancellation controls. High-risk commands halt the execution graph until an authorized engineer clicks "Approve".',
    },
    {
      q: 'How are post-incident PDF reports generated?',
      a: 'After the Decision Agent confirms incident resolution, the Reporter Agent aggregates all executed commands, terminal outputs, timestamps, and MTTR metrics into a formal downloadable PDF summary.',
    },
    {
      q: 'Is the platform suitable for multi-cloud enterprise environments?',
      a: 'Absolutely. The architecture is fully containerized using Docker, allowing seamless deployment across AWS, Microsoft Azure, Google Cloud Platform (GCP), or hybrid on-premises Kubernetes infrastructure.',
    },
    {
      q: 'What authentication and access controls are implemented?',
      a: 'The platform integrates Spring Security with stateless JWT tokens and BCrypt password encryption, enforcing strict Role-Based Access Control (Admin, SRE Engineer, Viewer).',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            Frequently Asked Questions
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Got Questions? We Have Answers
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Everything you need to know about safety, RAG retrieval, MCP integration, and deployment.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 overflow-hidden transition-colors shadow-2xs text-slate-900 dark:text-slate-100"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/80 dark:border-slate-800/60 pt-4 font-medium"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
