'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PageHeader } from '@/components/layout/PageHeader';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useSidebarStore } from '@/hooks/useSidebar';
import { Bot, Play, ShieldAlert, CheckCircle2, Copy } from 'lucide-react';

export default function DesignSystemShowcasePage() {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Sidebar />
      <Navbar />

      <main className={`flex-1 p-6 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <Breadcrumb />

          <PageHeader
            title="Enterprise UI Design System & Component Library"
            description="Documentation showcase for design tokens, buttons, cards, badges, avatars, and dark mode controls."
          />

          {/* Button Variants */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Button Components & Variants</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="md">Primary Action</Button>
              <Button variant="glow" size="md" leftIcon={<Play className="h-4 w-4" />}>Glow Action</Button>
              <Button variant="secondary" size="md">Secondary Action</Button>
              <Button variant="outline" size="md">Outline Action</Button>
              <Button variant="danger" size="md">Danger Action</Button>
              <Button variant="ghost" size="md">Ghost Action</Button>
            </div>
          </Card>

          {/* Badge & Avatar Variants */}
          <Card className="p-6 space-y-4">
            <h3 className="font-bold text-white text-base">Status Badges & User Avatars</h3>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="info">INFO</Badge>
              <Badge variant="success">RESOLVED</Badge>
              <Badge variant="warning">RISKY COMMAND</Badge>
              <Badge variant="danger">CRITICAL</Badge>
              <Badge variant="purple">CHROMA DB</Badge>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Avatar name="Alex Mercer" size="sm" />
              <Avatar name="Sarah SRE" size="md" />
              <Avatar name="Enterprise Admin" size="lg" />
            </div>
          </Card>
        </div>
      </main>

      <div className={`${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} transition-all duration-300`}>
        <Footer />
      </div>
    </div>
  );
}
