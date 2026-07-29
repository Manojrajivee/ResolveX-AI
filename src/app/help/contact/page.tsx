'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { FooterSection } from '@/components/landing/FooterSection';
import { ContactSection } from '@/components/landing/ContactSection';

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <LandingNavbar />

      <main className="flex-1 py-12">
        <ContactSection />
      </main>

      <FooterSection />
    </div>
  );
}
