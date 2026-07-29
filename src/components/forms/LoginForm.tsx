'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '../ui/Button';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { validateEmail } from '@/lib/validators';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('alex.mercer@enterprise.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const response = await AuthService.login({ email, password, rememberMe });
      login(response.user as any, response.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="engineer@company.com"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500"
          />
          <span>Remember session</span>
        </label>
        <a href="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
          Forgot password?
        </a>
      </div>

      <Button type="submit" variant="glow" size="lg" className="w-full mt-2" isLoading={isLoading} rightIcon={<LogIn className="h-4 w-4" />}>
        Sign In to Portal
      </Button>
    </form>
  );
};
