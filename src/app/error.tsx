'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Application Exception Triggered</h2>
          <p className="text-xs text-slate-400 font-mono">{error.message || 'An unhandled system error occurred during execution.'}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => reset()} leftIcon={<RotateCcw className="h-4 w-4" />}>
            Retry Operation
          </Button>
          <Link href="/dashboard">
            <Button variant="glow" size="sm" leftIcon={<Home className="h-4 w-4" />}>
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
