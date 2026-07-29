'use client';

import React, { useState } from 'react';
import { ChevronDown, Brain, Cpu, Database } from 'lucide-react';

export interface ReasoningPanelProps {
  detectedIssue?: string;
  matchedRunbook?: string;
  reasoningSteps?: string[];
  confidence?: number;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({
  detectedIssue = 'Database service PostgreSQL unresponsive on port 5432',
  matchedRunbook = 'PostgreSQL High Availability Recovery Guide',
  reasoningSteps = [
    'Queried ChromaDB vector store using alert text embedding.',
    'Extracted top-1 relevant chunk (Cosine Similarity: 0.984).',
    'LangGraph Planner Agent generated 4-step execution graph.',
    'Identified Step 3 (systemctl restart) as RISKY operation.',
  ],
  confidence = 98.4,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 flex items-center justify-between font-semibold text-slate-300 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2 text-cyan-400">
          <Brain className="h-4 w-4" />
          <span>AI Agent Reasoning & RAG Retrieval Analysis</span>
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="p-3.5 border-t border-slate-800 space-y-3 bg-slate-950/80 font-mono text-[11px] text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-500">Detected Alert:</span>
            <span className="text-white font-bold">{detectedIssue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Matched Runbook:</span>
            <span className="text-emerald-400">{matchedRunbook}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Confidence Score:</span>
            <span className="text-purple-400">{confidence}%</span>
          </div>

          <div className="pt-2 border-t border-slate-900 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Decision Steps:</span>
            {reasoningSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-400">
                <span className="text-cyan-400">›</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
