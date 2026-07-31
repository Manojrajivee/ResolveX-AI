'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Mail, Key, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'RESET' | 'SUCCESS'>('EMAIL');
  const [email, setEmail] = useState('alex.mercer@enterprise.com');
  const [otp, setOtp] = useState(['9', '0', '4', '1', '2', '8']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('RESET');
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('SUCCESS');
    }, 1000);
  };

  return (
    <AuthLayout
      title="Self-Service Password Reset"
      subtitle="Enterprise Identity Verification & Multi-Factor OTP Verification"
    >
      {step === 'EMAIL' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 font-medium">
            Enter your corporate email address to receive a 6-digit Okta/Entra OTP code.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Work Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@enterprise.com"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isLoading} rightIcon={<ArrowRight className="h-4 w-4" />}>
            Transmit Security OTP
          </Button>
        </form>
      )}

      {step === 'OTP' && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 font-medium text-center">
            Verification code dispatched to <strong>{email}</strong>
          </div>

          <div className="space-y-2 text-center">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">6-Digit Security OTP</label>
            <div className="flex justify-center gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                  }}
                  className="w-10 h-12 text-center text-lg font-black font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none shadow-xs"
                />
              ))}
            </div>
          </div>

          <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isLoading}>
            Verify Code & Continue
          </Button>
        </form>
      )}

      {step === 'RESET' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New strong password..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isLoading}>
            Update Password & Encrypt Credentials
          </Button>
        </form>
      )}

      {step === 'SUCCESS' && (
        <div className="p-8 text-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Password Updated</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your corporate credentials have been updated. Active sessions refreshed.
          </p>
          <Button variant="outline" size="sm" onClick={() => (window.location.href = '/login')}>
            Return to SSO Login
          </Button>
        </div>
      )}

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
        <Link href="/login" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
          Return to Login
        </Link>
      </div>
    </AuthLayout>
  );
}
