'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';

export interface CommandCardProps {
  command: string;
  description: string;
  riskLevel: 'SAFE' | 'RISKY' | 'CRITICAL';
}

export const CommandCard: React.FC<CommandCardProps> = ({ command, description, riskLevel }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/90 space-y-2 font-mono text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {riskLevel === 'SAFE' ? (
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-amber-400" />
          )}
          <Badge variant={riskLevel === 'SAFE' ? 'info' : 'warning'} size="sm">
            {riskLevel} COMMAND
          </Badge>
        </div>
        <button
          onClick={handleCopy}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Copy command"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="p-2.5 rounded-lg bg-slate-900 text-cyan-400 border border-slate-800/80 overflow-x-auto">
        $ {command}
      </div>

      <p className="text-[11px] font-sans text-slate-400">{description}</p>
    </div>
  );
};
