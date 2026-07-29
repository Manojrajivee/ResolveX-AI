import React from 'react';
import Link from 'next/link';
import { Home, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-blue-400">
          <SearchX className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white">404</h1>
          <h2 className="text-xl font-bold text-slate-200">Page Not Found</h2>
          <p className="text-xs text-slate-400">The requested runbook or operational route does not exist in the system index.</p>
        </div>
        <Link href="/dashboard" className="inline-block">
          <Button variant="glow" size="md" leftIcon={<Home className="h-4 w-4" />}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
