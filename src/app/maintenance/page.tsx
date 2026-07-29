'use client';

import React from 'react';
import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="p-4 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/30 mb-4">
        <Wrench className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-white mb-2">Scheduled System Maintenance</h1>
      <p className="text-slate-400 text-sm max-w-md">
        We are upgrading the ChromaDB vector store clusters. All systems will resume normal incident resolution operations shortly.
      </p>
    </div>
  );
}
