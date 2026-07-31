'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useSidebarStore } from '@/hooks/useSidebar';
import { useCollaborationStore } from '@/store/collaboration-store';
import { ShieldCheck, Lock, Smartphone, Laptop, Key, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SecuritySettingsPage() {
  const { isCollapsed } = useSidebarStore();
  const { addToast } = useCollaborationStore();

  const [twoFactor, setTwoFactor] = useState(true);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast({ title: 'Password Mismatch', desc: 'New passwords do not match.', variant: 'error' });
      return;
    }
    addToast({ title: 'Password Updated', desc: 'Your SOC-2 compliance password has been updated.', variant: 'success' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Breadcrumb />

          <PageHeader
            title="Security Center & SOC-2 Compliance"
            description="Multi-factor authentication (2FA), trusted devices, password expiration, and security score."
          />

          {/* Security Score Header Card */}
          <Card className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Security Score: 98/100</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">SOC-2 Type II Certified Access Controls Active</p>
              </div>
            </div>

            <Badge variant="success" size="sm">COMPLIANT</Badge>
          </Card>

          {/* 2FA Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">Two-Factor Authentication (2FA)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Protect your account using Okta Verify or Google Authenticator TOTP.</p>
                </div>
              </div>

              <Button variant={twoFactor ? 'outline' : 'glow'} size="sm" onClick={() => setIs2FAModalOpen(true)}>
                {twoFactor ? 'Reconfigure TOTP' : 'Enable 2FA'}
              </Button>
            </div>
          </Card>

          {/* Password Change Form */}
          <Card className="p-6">
            <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
              <h4 className="text-base font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                Change Corporate Password
              </h4>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-slate-900 dark:text-white focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="glow" size="lg" leftIcon={<Lock className="h-4 w-4" />}>
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      {/* 2FA Setup Modal */}
      <Modal isOpen={is2FAModalOpen} onClose={() => setIs2FAModalOpen(false)} title="Configure Two-Factor TOTP Authenticator">
        <div className="space-y-4 text-xs text-center">
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            Scan this QR code with your Authenticator app to link your SSO account.
          </p>

          <div className="w-40 h-40 bg-white p-3 mx-auto rounded-2xl border border-slate-300 dark:border-slate-700 flex items-center justify-center font-mono text-slate-900 text-xs font-bold shadow-inner">
            [MOCK 2FA QR CODE]
          </div>

          <p className="font-mono text-blue-600 dark:text-blue-400 font-bold">Secret Key: JBSWY3DPEHPK3PXP</p>

          <Button
            variant="glow"
            size="lg"
            className="w-full mt-2"
            onClick={() => {
              setTwoFactor(true);
              setIs2FAModalOpen(false);
              addToast({ title: '2FA TOTP Verified', desc: 'Authenticator app paired.', variant: 'success' });
            }}
          >
            Confirm & Verify TOTP Pair
          </Button>
        </div>
      </Modal>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
