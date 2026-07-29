'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, User, Building, MessageSquare, Send, CheckCircle2, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    }, 800);
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
            Enterprise Inquiries
          </h2>
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Get in Touch with Our Engineering Team
          </h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Interested in deploying Runbook Following Agent across your SRE organization?
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form (7 cols) */}
          <Card className="lg:col-span-7 p-8 border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl space-y-6 text-slate-900 dark:text-slate-100">
            <h4 className="text-xl font-bold">Send Enterprise Message</h4>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <h5 className="font-bold text-base">Message Transmitted</h5>
                <p className="text-xs text-slate-600 dark:text-slate-300">Thank you! Our SRE solution architect will reach out within 24 hours.</p>
                <Button variant="outline" size="sm" onClick={() => setIsSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Mercer"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@enterprise.com"
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enterprise SRE Corp"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Project Scope / Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe your incident response requirements..."
                      rows={4}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none resize-none font-medium"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="glow" size="lg" className="w-full" isLoading={isLoading} rightIcon={<Send className="h-4 w-4" />}>
                  Submit Enterprise Inquiry
                </Button>
              </form>
            )}
          </Card>

          {/* Info & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 space-y-4 text-slate-900 dark:text-slate-100">
              <h4 className="font-bold text-base">Company Headquarters</h4>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-mono font-medium">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>San Francisco, CA 94105, United States</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>sre-support@runbook-agent.enterprise</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>+1 (800) 555-RUNBOOK</span>
                </div>
              </div>
            </Card>

            {/* Map Placeholder */}
            <div className="h-48 rounded-2xl bg-white/80 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center justify-center p-6 text-center space-y-2 relative overflow-hidden text-slate-900 dark:text-slate-100">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto" />
                <h5 className="font-bold text-sm">Global Data Centers</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Deployed across US-East, EU-Central & AP-South</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
