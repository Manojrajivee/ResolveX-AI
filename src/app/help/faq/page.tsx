'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { FaqSection } from '@/components/landing/FaqSection';

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-16">
        <FaqSection />
      </main>

      <FooterSection />
    </div>
  );
}
