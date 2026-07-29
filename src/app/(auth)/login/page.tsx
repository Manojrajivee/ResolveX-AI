import React from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back to SRE Portal"
      subtitle="Enter your enterprise credentials to access your autonomous runbook workflow."
    >
      <LoginForm />
      <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-400 font-bold hover:underline">
          Create SRE Account
        </Link>
      </div>
    </AuthLayout>
  );
}
