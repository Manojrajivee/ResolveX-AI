import React from 'react';
import { Spinner } from '@/components/ui/Spinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
      <Spinner size="lg" />
      <p className="text-xs text-slate-400 font-mono animate-pulse">Loading Runbook Agent interface...</p>
    </div>
  );
}
