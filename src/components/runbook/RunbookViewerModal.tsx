'use client';

import React, { useState } from 'react';
import { X, Eye, FileText, Download, Copy, Sparkles, BookOpen, Layers, CheckCircle2, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Runbook } from '@/types/runbook';

interface ViewerModalProps {
  runbook: Runbook | null;
  onClose: () => void;
}

export const RunbookViewerModal: React.FC<ViewerModalProps> = ({ runbook, onClose }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'summary' | 'history'>('content');
  const [copied, setCopied] = useState(false);

  if (!runbook) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-4xl h-[85vh] rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl z-10 text-slate-900 dark:text-slate-100"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 px-6 py-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">{runbook.title}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                  <span>Format: {runbook.format}</span>
                  <span>• Size: {runbook.fileSize}</span>
                  <span>• Author: {runbook.uploadedBy}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Download className="h-3.5 w-3.5" />}
                onClick={() => alert(`Downloading ${runbook.title}`)}
              >
                Download
              </Button>
              <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-4 px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'content'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Document Content
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'summary'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> AI Executive Summary
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <History className="h-3.5 w-3.5" /> Version History
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span>Path: {runbook.filePath}</span>
                  <button
                    onClick={() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 text-blue-500 hover:underline font-semibold"
                  >
                    <Copy className="h-3 w-3" /> {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>

                {/* Render Steps Code Block */}
                <div className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs space-y-4 border border-slate-800">
                  <p className="text-slate-400 italic">// Document: {runbook.title}</p>
                  <p className="text-slate-400 italic">// {runbook.description}</p>
                  {runbook.steps.map((st, i) => (
                    <div key={i} className="space-y-1 pt-2 border-t border-slate-800">
                      <div className="text-cyan-400 font-bold"># Step {st.stepNumber}: {st.title}</div>
                      <div className="text-slate-400 pl-4">Description: {st.description}</div>
                      {st.command && (
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-emerald-400 font-bold flex items-center justify-between">
                          <span>$ {st.command}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">{st.riskLevel}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-cyan-500/10 border border-blue-500/30 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400 text-sm">
                    <Sparkles className="h-4 w-4" /> AI Generated Runbook Insights
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    This runbook describes automated failover, service status checking, and recovery logic for enterprise infrastructure incidents.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                    <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Est. Duration</span>
                      <span className="font-bold text-emerald-500">~5 mins</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Risk Rating</span>
                      <span className="font-bold text-amber-500">Medium</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">Vector Chunks</span>
                      <span className="font-bold text-cyan-500">{runbook.chunksCount}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold block">AI Indexed</span>
                      <span className="font-bold text-blue-500">ChromaDB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl border border-blue-500/40 bg-blue-50/50 dark:bg-blue-950/40 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-blue-600 dark:text-blue-400">v2.1.0 (Current Version)</span>
                      <p className="text-slate-500 text-[11px]">Updated failover step commands and added systemctl verification.</p>
                    </div>
                    <span className="text-[10px] text-slate-400">2026-07-28</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between opacity-70">
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">v2.0.0</span>
                      <p className="text-slate-500 text-[11px]">Initial production release of procedure document.</p>
                    </div>
                    <span className="text-[10px] text-slate-400">2026-06-12</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
