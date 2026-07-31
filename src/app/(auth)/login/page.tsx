'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth-store';
import { Mail, Lock, User, Key, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [loginMethod, setLoginMethod] = useState<'email' | 'username' | 'empid'>('email');
  const [identifier, setIdentifier] = useState('alex.mercer@enterprise.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter valid enterprise credentials.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      login(
        {
          id: 'usr-1',
          name: 'Alex Mercer',
          email: identifier.includes('@') ? identifier : 'alex.mercer@enterprise.com',
          role: 'ADMIN',
          department: 'Site Reliability Engineering',
          createdAt: new Date().toISOString(),
        },
        'mock_jwt_token_entra_okta_9041'
      );
      setIsLoading(false);
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <AuthLayout
      title="Enterprise IAM Single Sign-On"
      subtitle="Authenticate via Okta, Microsoft Entra ID, or Corporate Active Directory"
    >
      <div className="space-y-6">
        {/* Identity Provider Badges */}
        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between text-xs text-blue-600 dark:text-blue-400 font-medium">
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Okta / Entra ID SSO Enforced</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">2FA Active</span>
        </div>

        {/* Login Identifier Type Selector */}
        <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setLoginMethod('email'); setIdentifier('alex.mercer@enterprise.com'); }}
            className={`flex-1 py-2 rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Email SSO
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('username'); setIdentifier('alex.mercer'); }}
            className={`flex-1 py-2 rounded-lg transition-all ${loginMethod === 'username' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Username
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('empid'); setIdentifier('EMP-9041'); }}
            className={`flex-1 py-2 rounded-lg transition-all ${loginMethod === 'empid' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400'}`}
          >
            Employee ID
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              {loginMethod === 'email' ? 'Work Email Address' : loginMethod === 'username' ? 'Corporate Username' : 'Employee ID Number'}
            </label>
            <div className="relative">
              {loginMethod === 'email' ? (
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              ) : loginMethod === 'username' ? (
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              ) : (
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              )}
              <input
                type={loginMethod === 'email' ? 'email' : 'text'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={loginMethod === 'email' ? 'alex@enterprise.com' : loginMethod === 'username' ? 'alex.mercer' : 'EMP-9041'}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Account Password</label>
              <Link href="/forgot-password" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <span>Remember 30-day SSO Session</span>
            </label>
          </div>

          <Button
            type="submit"
            variant="glow"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Authenticate & Proceed to Dashboard
          </Button>
        </form>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 font-medium">
          Need corporate access?{' '}
          <Link href="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
            Register New Enterprise Account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
