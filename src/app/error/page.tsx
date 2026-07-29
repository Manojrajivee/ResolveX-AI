'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-3xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <ShieldAlert className="h-12 w-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">System Error Encountered</h1>
      <p className="text-slate-400 text-sm max-w-md">
        An unexpected error occurred while communicating with the backend REST gateway. Our engineering team has been notified.
      </p>
      <Link href="/dashboard">
        <Button variant="primary" size="md" leftIcon={<ArrowLeft className="h-4 w-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
