'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { AuthService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await AuthService.forgotPassword(email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="font-extrabold text-white text-xl tracking-wide">Runbook Agent</span>
          </Link>
          <h2 className="text-2xl font-bold text-white tracking-tight">Reset Account Password</h2>
          <p className="text-xs text-slate-400">Enter your email to receive recovery instructions</p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl space-y-4">
          {isSubmitted ? (
            <div className="text-center space-y-3 py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <h3 className="font-bold text-white text-base">Check Your Inbox</h3>
              <p className="text-xs text-slate-400">Instructions sent to <span className="font-mono text-blue-400">{email}</span></p>
              <Link href="/login">
                <Button variant="outline" size="sm" className="mt-4" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="glow" size="lg" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
            <Link href="/login" className="text-slate-400 hover:text-white flex items-center justify-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
