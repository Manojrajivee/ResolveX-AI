'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Cpu, ShieldCheck, Database, Terminal, Zap } from 'lucide-react';

export const AuthIllustration: React.FC = () => {
  return (
    <div className="relative flex flex-col items-center justify-center p-12 text-center h-full overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Floating Graphic */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="w-full max-w-sm p-6 rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-2xl shadow-2xl space-y-4 relative z-10 text-left"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs">Runbook Agent SRE</h4>
              <span className="text-[10px] text-emerald-400 font-mono">MCP Safe Execution</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
            ONLINE
          </span>
        </div>

        <div className="space-y-2 font-mono text-[11px] p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
          <div className="text-cyan-400">$ ChromaDB RAG: Match Found (98.4%)</div>
          <div className="text-emerald-400">$ systemctl status postgresql [SAFE]</div>
          <div className="text-amber-400">$ Require Human Approval for Restart</div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> SOC-2 Certified</span>
          <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-amber-400" /> 3.2m MTTR</span>
        </div>
      </motion.div>

      <div className="mt-8 space-y-2 relative z-10">
        <h3 className="text-xl font-extrabold text-white tracking-tight">Autonomous SRE Operations</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Connect runbooks, execute safe commands via MCP, and resolve incidents in minutes.
        </p>
      </div>
    </div>
  );
};
