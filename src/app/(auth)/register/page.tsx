import React from 'react';
import Link from 'next/link';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create SRE Account"
      subtitle="Join your team to automate incident response with AI runbooks."
    >
      <RegisterForm />
      <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
