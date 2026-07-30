'use client';

import React, { useState } from 'react';
import { BookOpen, ExternalLink, ShieldCheck, Sparkles, Eye, Download } from 'lucide-react';
import { Button } from '../ui/Button';

export interface RunbookReference {
  id: string;
  title: string;
  category: string;
  similarityScore: number;
  confidence: number;
  highlightChunk: string;
  format: 'PDF' | 'MARKDOWN' | 'TXT';
}

const DEFAULT_REFS: RunbookReference[] = [
  {
    id: 'rb-1',
    title: 'PostgreSQL High Availability Recovery Guide',
    category: 'Database',
    similarityScore: 0.984,
    confidence: 98,
    highlightChunk: 'Step 3: Verify listener status with pg_isready -h localhost -p 5432. If connection refused, check systemctl restart postgresql.',
    format: 'MARKDOWN',
  },
  {
    id: 'rb-2',
    title: 'Kubernetes Pod Out Of Memory (OOMKilled) Fix',
    category: 'Infrastructure',
    similarityScore: 0.892,
    confidence: 89,
    highlightChunk: 'Step 1: Check describe pod logs for exit code 137. Inspect memory resource requests and limits in deployment spec.',
    format: 'PDF',
  },
];

export const RunbookReferencesPanel: React.FC<{ references?: RunbookReference[] }> = ({ references = DEFAULT_REFS }) => {
  const [selectedRef, setSelectedRef] = useState<RunbookReference | null>(null);

  return (
    <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl space-y-3 text-slate-900 dark:text-slate-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-blue-500" />
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200 font-mono">
            RAG Vector Retrieved Runbooks
          </h3>
        </div>
        <span className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-mono font-bold">
          ChromaDB Match
        </span>
      </div>

      <div className="space-y-2.5">
        {references.map((ref) => (
          <div
            key={ref.id}
            className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/60 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate pr-2">{ref.title}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold shrink-0">
                {ref.confidence}% Match
              </span>
            </div>

            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60 font-mono leading-relaxed">
              "{ref.highlightChunk}"
            </p>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>Vector Sim: {ref.similarityScore}</span>
              <button
                onClick={() => setSelectedRef(ref)}
                className="text-blue-500 hover:underline font-semibold flex items-center gap-1"
              >
                <Eye className="h-3 w-3" /> Preview Document
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Preview */}
      {selectedRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-800 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{selectedRef.title}</h4>
              <button onClick={() => setSelectedRef(null)} className="text-slate-400 hover:text-white text-xs">
                Close
              </button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-mono text-emerald-400">Category: {selectedRef.category} ({selectedRef.format})</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-200">
                {selectedRef.highlightChunk}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedRef(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
