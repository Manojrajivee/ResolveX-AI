import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'ResolveX AI — Enterprise Runbook Automation',
  description:
    'ResolveX AI reads your runbooks (PDF, Markdown, TXT), plans the fix, and executes approved steps through gated tooling — closing incidents in minutes.',
  openGraph: {
    title: 'ResolveX AI — Enterprise Runbook Automation',
    description:
      'Autonomous SRE incident resolution engine using Next.js 15, ChromaDB RAG, and MCP Safe Shell Protocol.',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0D161F] text-[#20303C] dark:text-[#FAF7F2] font-sans selection:bg-[#2E5E7A] selection:text-white transition-colors duration-300">
      {/* Sticky Blurred Header */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 dark:bg-[#0D161F]/90 backdrop-blur-md border-b border-[#20303C]/12 dark:border-[#FAF7F2]/12">
        <nav className="max-w-[1180px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-sora font-semibold text-lg text-[#20303C] dark:text-[#FAF7F2]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2E5E7A] to-[#8A6636] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              R×
            </div>
            <span>ResolveX AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-9 text-[14.5px] text-[#5C6B76] dark:text-slate-300 font-medium">
            <a href="#how" className="hover:text-[#20303C] dark:hover:text-white transition-colors">How it works</a>
            <a href="#tech" className="hover:text-[#20303C] dark:hover:text-white transition-colors">Technology</a>
            <a href="#users" className="hover:text-[#20303C] dark:hover:text-white transition-colors">Who it&apos;s for</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#5C6B76] dark:text-slate-300 hover:text-[#20303C] dark:hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[14.5px] font-medium bg-[#20303C] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#20303C] hover:-translate-y-0.5 transition-all shadow-sm"
            >
              <span>Launch Platform</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section: 60/40 Split */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left 40% Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-[12.5px] text-[#8A6636] dark:text-[#E7D3B2] bg-[#E7D3B2]/50 dark:bg-[#8A6636]/30 px-3 py-1.5 rounded-full border border-[#8A6636]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A6636] dark:bg-[#E7D3B2] animate-pulse" />
                <span>Enterprise runbook automation</span>
              </div>

              <h1 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.12] text-[#20303C] dark:text-white tracking-tight">
                Static runbooks slow you down. ResolveX AI doesn&apos;t.
              </h1>

              <p className="text-[16.5px] text-[#5C6B76] dark:text-slate-300 leading-relaxed">
                ResolveX AI reads your runbooks, plans the fix, and executes approved steps through gated tooling — so incidents close in minutes, not hours, with a human always holding the risky calls.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/dashboard/chat"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-[#20303C] dark:bg-[#FAF7F2] text-[#FAF7F2] dark:text-[#20303C] hover:-translate-y-0.5 transition-all shadow-md"
                >
                  <span>See it in action</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium border border-[#20303C]/15 dark:border-[#FAF7F2]/20 text-[#20303C] dark:text-[#FAF7F2] hover:border-[#20303C]/40 dark:hover:border-[#FAF7F2]/40 transition-all"
                >
                  How it works
                </a>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#20303C]/12 dark:border-[#FAF7F2]/12">
                <div>
                  <b className="block font-sora text-xl sm:text-2xl font-semibold text-[#20303C] dark:text-white">5 stages</b>
                  <span className="text-[12.5px] text-[#5C6B76] dark:text-slate-400">runbook to resolution</span>
                </div>
                <div>
                  <b className="block font-sora text-xl sm:text-2xl font-semibold text-[#20303C] dark:text-white">100%</b>
                  <span className="text-[12.5px] text-[#5C6B76] dark:text-slate-400">human sign-off on risk</span>
                </div>
                <div>
                  <b className="block font-sora text-xl sm:text-2xl font-semibold text-[#20303C] dark:text-white">auto</b>
                  <span className="text-[12.5px] text-[#5C6B76] dark:text-slate-400">incident reporting</span>
                </div>
              </div>
            </div>

            {/* Right 60% Visual: The Pipeline Flow */}
            <div className="lg:col-span-7">
              <div className="bg-[#F2EAE0] dark:bg-[#121C26] border border-[#20303C]/12 dark:border-[#FAF7F2]/12 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-4 border-b border-[#20303C]/10 dark:border-[#FAF7F2]/10">
                  <div className="flex items-center gap-2 font-mono text-xs text-[#5C6B76] dark:text-slate-400 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2E5E7A]" />
                    <span>RESOLVEX EXECUTION PIPELINE</span>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-[#2E5E7A]/10 text-[#2E5E7A] dark:bg-[#DCE9F2]/20 dark:text-[#DCE9F2] font-semibold">
                    REAL-TIME ACTIVE
                  </span>
                </div>

                {/* Flow Step 01 */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#DCE9F2]/60 dark:bg-[#2E5E7A]/20 border border-[#2E5E7A]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#DCE9F2] text-[#2E5E7A] font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                      01
                    </div>
                    <div>
                      <h4 className="font-sora text-sm font-semibold text-[#20303C] dark:text-white">Runbook ingestion</h4>
                      <p className="text-xs text-[#5C6B76] dark:text-slate-300 mt-0.5">PDF and markdown parsed into structured procedure</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#DCE9F2] text-[#2E5E7A] font-medium shrink-0">
                    RAG
                  </span>
                </div>

                <div className="w-0.5 h-5 ml-[26px] bg-gradient-to-b from-[#2E5E7A] to-[#8A6636]" />

                {/* Flow Step 02 */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#DCE9F2]/60 dark:bg-[#2E5E7A]/20 border border-[#2E5E7A]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#DCE9F2] text-[#2E5E7A] font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                      02
                    </div>
                    <div>
                      <h4 className="font-sora text-sm font-semibold text-[#20303C] dark:text-white">Incident understanding</h4>
                      <p className="text-xs text-[#5C6B76] dark:text-slate-300 mt-0.5">Retrieves the exact steps relevant to the alert</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#DCE9F2] text-[#2E5E7A] font-medium shrink-0">
                    retrieval
                  </span>
                </div>

                <div className="w-0.5 h-5 ml-[26px] bg-gradient-to-b from-[#2E5E7A] to-[#8A6636]" />

                {/* Flow Step 03 */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#E7D3B2]/60 dark:bg-[#8A6636]/20 border border-[#8A6636]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#E7D3B2] text-[#8A6636] font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                      03
                    </div>
                    <div>
                      <h4 className="font-sora text-sm font-semibold text-[#20303C] dark:text-white">Agent planning</h4>
                      <p className="text-xs text-[#5C6B76] dark:text-slate-300 mt-0.5">Drafts a resolution plan from the retrieved procedure</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#E7D3B2] text-[#8A6636] font-medium shrink-0">
                    agent
                  </span>
                </div>

                <div className="w-0.5 h-5 ml-[26px] bg-gradient-to-b from-[#8A6636] to-[#A24F68]" />

                {/* Flow Step 04 */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#E7D3B2]/60 dark:bg-[#8A6636]/20 border border-[#8A6636]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#E7D3B2] text-[#8A6636] font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                      04
                    </div>
                    <div>
                      <h4 className="font-sora text-sm font-semibold text-[#20303C] dark:text-white">Gated execution</h4>
                      <p className="text-xs text-[#5C6B76] dark:text-slate-300 mt-0.5">Runs allowlisted tools; risky actions wait for your yes</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#E7D3B2] text-[#8A6636] font-medium shrink-0">
                    MCP
                  </span>
                </div>

                <div className="w-0.5 h-5 ml-[26px] bg-gradient-to-b from-[#8A6636] to-[#A24F68]" />

                {/* Flow Step 05 */}
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-[#F4DCE3]/60 dark:bg-[#A24F68]/20 border border-[#A24F68]/20">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-[#F4DCE3] text-[#A24F68] font-mono text-sm font-semibold flex items-center justify-center shrink-0">
                      05
                    </div>
                    <div>
                      <h4 className="font-sora text-sm font-semibold text-[#20303C] dark:text-white">Report, automatically</h4>
                      <p className="text-xs text-[#5C6B76] dark:text-slate-300 mt-0.5">Summarizes what ran and what changed</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#F4DCE3] text-[#A24F68] font-medium shrink-0">
                    closed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Strip Banner */}
      <div className="bg-[#F2EAE0] dark:bg-[#121C26] border-y border-[#20303C]/12 dark:border-[#FAF7F2]/12 py-14">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 text-center space-y-3">
          <span className="font-mono text-xs text-[#5C6B76] dark:text-slate-400 uppercase tracking-widest block font-medium">
            The Problem
          </span>
          <p className="font-sora text-xl sm:text-2xl font-medium text-[#20303C] dark:text-white max-w-3xl mx-auto leading-relaxed">
            Manual incident resolution relies on static runbooks, causing slow troubleshooting, human errors, and increased downtime.
          </p>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how" className="py-24">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 space-y-12">
          <div className="max-w-xl">
            <span className="font-mono text-xs text-[#8A6636] dark:text-[#E7D3B2] uppercase tracking-widest block font-semibold mb-3">
              How it works
            </span>
            <h2 className="font-sora text-3xl font-semibold text-[#20303C] dark:text-white mb-3">
              One controlled path from alert to resolved
            </h2>
            <p className="text-[#5C6B76] dark:text-slate-300 text-[15.5px]">
              Each stage hands off to the next — nothing runs against your systems without passing through the gate in stage four.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="border border-[#20303C]/12 dark:border-[#FAF7F2]/12 rounded-2xl p-5 bg-white dark:bg-[#121C26] space-y-4 hover:border-[#2E5E7A]/40 transition-colors">
              <div className="font-mono text-xs text-[#5C6B76] dark:text-slate-400">01</div>
              <div className="w-8 h-8 rounded-lg bg-[#DCE9F2] dark:bg-[#2E5E7A]/40" />
              <h3 className="font-sora text-base font-semibold text-[#20303C] dark:text-white leading-snug">Runbook ingestion</h3>
              <p className="text-xs text-[#5C6B76] dark:text-slate-300 leading-relaxed">Upload PDF or markdown runbooks; ResolveX AI indexes them for retrieval.</p>
            </div>

            <div className="border border-[#20303C]/12 dark:border-[#FAF7F2]/12 rounded-2xl p-5 bg-white dark:bg-[#121C26] space-y-4 hover:border-[#2E5E7A]/40 transition-colors">
              <div className="font-mono text-xs text-[#5C6B76] dark:text-slate-400">02</div>
              <div className="w-8 h-8 rounded-lg bg-[#DCE9F2] dark:bg-[#2E5E7A]/40" />
              <h3 className="font-sora text-base font-semibold text-[#20303C] dark:text-white leading-snug">RAG retrieval</h3>
              <p className="text-xs text-[#5C6B76] dark:text-slate-300 leading-relaxed">Pulls only the procedure steps relevant to the incident at hand.</p>
            </div>

            <div className="border border-[#20303C]/12 dark:border-[#FAF7F2]/12 rounded-2xl p-5 bg-white dark:bg-[#121C26] space-y-4 hover:border-[#8A6636]/40 transition-colors">
              <div className="font-mono text-xs text-[#5C6B76] dark:text-slate-400">03</div>
              <div className="w-8 h-8 rounded-lg bg-[#E7D3B2] dark:bg-[#8A6636]/40" />
              <h3 className="font-sora text-base font-semibold text-[#20303C] dark:text-white leading-snug">Agent planning</h3>
              <p className="text-xs text-[#5C6B76] dark:text-slate-300 leading-relaxed">An AI agent turns retrieved steps into an ordered remediation plan.</p>
            </div>

            <div className="border border-[#20303C]/12 dark:border-[#FAF7F2]/12 rounded-2xl p-5 bg-white dark:bg-[#121C26] space-y-4 hover:border-[#8A6636]/40 transition-colors">
              <div className="font-mono text-xs text-[#5C6B76] dark:text-slate-400">04</div>
              <div className="w-8 h-8 rounded-lg bg-[#E7D3B2] dark:bg-[#8A6636]/40" />
              <h3 className="font-sora text-base font-semibold text-[#20303C] dark:text-white leading-snug">MCP execution</h3>
              <p className="text-xs text-[#5C6B76] dark:text-slate-300 leading-relaxed">Allowlisted tools run the plan; risky actions pause for human confirmation.</p>
            </div>

            <div className="border border-[#20303C]/12 dark:border-[#FAF7F2]/12 rounded-2xl p-5 bg-white dark:bg-[#121C26] space-y-4 hover:border-[#A24F68]/40 transition-colors">
              <div className="font-mono text-xs text-[#5C6B76] dark:text-slate-400">05</div>
              <div className="w-8 h-8 rounded-lg bg-[#F4DCE3] dark:bg-[#A24F68]/40" />
              <h3 className="font-sora text-base font-semibold text-[#20303C] dark:text-white leading-snug">Auto reporting</h3>
              <p className="text-xs text-[#5C6B76] dark:text-slate-300 leading-relaxed">Results are analyzed and written up as an incident report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Users / Tech Split Section */}
      <section id="users" className="pb-24">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            {/* Left: Built For */}
            <div className="space-y-4">
              <div>
                <span className="font-mono text-xs text-[#8A6636] dark:text-[#E7D3B2] uppercase tracking-widest block font-semibold mb-2">
                  Built for
                </span>
                <h2 className="font-sora text-2xl sm:text-3xl font-semibold text-[#20303C] dark:text-white">
                  Teams who own the pager
                </h2>
                <p className="text-[#5C6B76] dark:text-slate-300 text-sm mt-2">
                  ResolveX AI fits into the workflows already run by:
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="text-[13.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  DevOps teams
                </span>
                <span className="text-[13.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  SRE teams
                </span>
                <span className="text-[13.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  IT operations
                </span>
                <span className="text-[13.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  Cloud operations
                </span>
                <span className="text-[13.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  Managed service providers
                </span>
              </div>
            </div>

            {/* Right: Technology */}
            <div id="tech" className="space-y-4">
              <div>
                <span className="font-mono text-xs text-[#8A6636] dark:text-[#E7D3B2] uppercase tracking-widest block font-semibold mb-2">
                  Technology
                </span>
                <h2 className="font-sora text-2xl sm:text-3xl font-semibold text-[#20303C] dark:text-white">
                  Built on a straightforward stack
                </h2>
                <p className="text-[#5C6B76] dark:text-slate-300 text-sm mt-2">
                  No exotic dependencies — just the tools that make the pipeline reliable.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  LLM
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  RAG
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  AI Agents
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  MCP
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  Spring Boot
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  Next.js
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  MongoDB
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  ChromaDB
                </span>
                <span className="font-mono text-[12.5px] px-4 py-2 rounded-lg border border-[#20303C]/12 dark:border-[#FAF7F2]/15 text-[#5C6B76] dark:text-slate-300 bg-[#FAF7F2] dark:bg-[#121C26]">
                  Docker
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Human Control Callout Banner */}
      <section className="pb-24">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10">
          <div className="bg-[#F4DCE3] dark:bg-[#A24F68]/25 border border-[#A24F68]/30 rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-sora text-2xl font-semibold text-[#A24F68] dark:text-[#F4DCE3]">
                Every risky action still needs a human yes.
              </h3>
              <p className="text-[#7A3E52] dark:text-slate-300 text-[14.5px] leading-relaxed">
                Automation handles the retrieval and the planning. You keep the final call on anything that touches production.
              </p>
            </div>
            <Link
              href="/dashboard/chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-[#A24F68] text-white hover:bg-[#8A4257] transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Talk to the team</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#20303C]/12 dark:border-[#FAF7F2]/12 py-10">
        <div className="max-w-[1180px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium text-xs text-[#5C6B76] dark:text-slate-400">
          <div className="flex items-center gap-2.5 font-sora font-semibold text-sm text-[#20303C] dark:text-[#FAF7F2]">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#2E5E7A] to-[#8A6636] flex items-center justify-center text-white font-bold text-xs">
              R×
            </div>
            <span>ResolveX AI</span>
          </div>
          <span>Enterprise AI-powered runbook automation</span>
        </div>
      </footer>
    </div>
  );
}
