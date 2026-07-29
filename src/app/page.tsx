import React from 'react';
import { LandingNavbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustedBy } from '@/components/landing/TrustedBy';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { AgentsSection } from '@/components/landing/AgentsSection';
import { ArchitectureSection } from '@/components/landing/ArchitectureSection';
import { TechStackSection } from '@/components/landing/TechStackSection';
import { WhyChooseSection } from '@/components/landing/WhyChooseSection';
import { DashboardPreviewSection } from '@/components/landing/DashboardPreviewSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { FooterSection } from '@/components/landing/FooterSection';

export const metadata = {
  title: 'Runbook Following Agent – AI Powered Intelligent Incident Resolution System',
  description:
    'Enterprise SRE platform that automatically resolves incidents by reading Runbooks (PDF, Markdown, TXT), understanding problems using AI, retrieving relevant steps via ChromaDB RAG, and executing safe commands via Model Context Protocol (MCP).',
  openGraph: {
    title: 'Runbook Following Agent – AI Powered Intelligent Incident Resolution System',
    description:
      'Autonomous DevOps incident resolution engine using Next.js 15, Spring Boot, ChromaDB RAG, and MCP Protocol.',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white transition-colors duration-300">
      {/* Sticky Blurred Navbar */}
      <LandingNavbar />

      {/* Main Landing Sections */}
      <main className="flex-1">
        <HeroSection />
        <TrustedBy />
        <FeaturesSection />
        <WorkflowSection />
        <AgentsSection />
        <ArchitectureSection />
        <TechStackSection />
        <WhyChooseSection />
        <DashboardPreviewSection />
        <FaqSection />
        <ContactSection />
      </main>

      {/* Enterprise Footer */}
      <FooterSection />
    </div>
  );
}
