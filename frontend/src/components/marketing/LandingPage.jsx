import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Database, FileText, 
  Search, CheckCircle2, ChevronRight, Play, Terminal, 
  Lock, Zap, RefreshCw, HardDrive, Layers, Globe, ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

export const presetQuestions = [
  {
    id: 'soc2',
    question: 'What are our SOC2 encryption policies?',
    answer: 'All workspace vector chunks are encrypted using AES-256 at rest and TLS 1.3 in transit. Data namespaces are strictly isolated per enterprise tenant with zero public model training [1].',
    sources: [{ id: 1, title: 'SOC2_TypeII_Audit.pdf', chunk: 'Chunk #14' }]
  },
  {
    id: 'overlap',
    question: 'How does vector overlap prevent context loss?',
    answer: 'The ingestion engine partitions documents into 512-token segments with 64-token sliding window overlap. This preserves boundary semantic context for dense cross-attention retrieval [1].',
    sources: [{ id: 1, title: 'Architecture_2026.pdf', chunk: 'Chunk #8' }]
  },
  {
    id: 'q3',
    question: 'Summarize Q3 enterprise deliverable targets',
    answer: 'Q3 targets include sub-120ms neural vector retrieval, SOC2 Type II final verification, and automated multi-tenant Slack ingestion sync [1].',
    sources: [{ id: 1, title: 'Q3_Deliverables.md', chunk: 'Chunk #2' }]
  }
];

/**
 * LandingPage Component - Knowva Public Product Experience
 */
export const LandingPage = ({
  onOpenAuth,
  onNavigate
}) => {
  const [activeQuestion, setActiveQuestion] = useState(presetQuestions[0]);
  const [selectedHeroTab, setSelectedHeroTab] = useState('chat'); // 'chat' | 'docs' | 'search'

  return (
    <div className="space-y-20 sm:space-y-28 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient AI Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-purple-600/15 to-pink-600/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

        {/* Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-semibold mb-6 animate-in fade-in zoom-in-95 duration-200">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Knowva 2.0 Released: Sub-120ms Vector Retrieval Engine</span>
          <ArrowRight className="w-3 h-3" />
        </div>

        {/* High-Impact Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary max-w-4xl mx-auto leading-[1.1]">
          Your Enterprise AI{' '}
          <span className="ai-gradient-text">Knowledge Workspace</span>
        </h1>

        {/* Subhead Value Prop */}
        <p className="mt-6 text-base sm:text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
          Unify Notion collaborative docs, ChatGPT neural reasoning, and Google Drive multi-format ingestion in a secure, tenant-isolated workspace.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="ai"
            size="lg"
            onClick={() => onOpenAuth?.('register')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto shadow-xl shadow-brand-500/25 font-bold"
          >
            Start 14-Day Free Trial
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => onNavigate?.('pricing')}
            className="w-full sm:w-auto"
          >
            View Pricing & Plans
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted font-mono">
          <span>✓ No credit card required</span>
          <span>•</span>
          <span>✓ SOC2 Type II Certified</span>
          <span>•</span>
          <span>✓ 5-minute setup</span>
        </div>

        {/* LIVE PRODUCT HERO PREVIEW CANVAS */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-border-default bg-surface/90 shadow-2xl p-2 sm:p-4 backdrop-blur-md ai-border-glow">
          <div className="rounded-xl border border-border-subtle bg-canvas overflow-hidden text-left">
            {/* Mock Top Nav */}
            <div className="h-10 px-4 bg-surface border-b border-border-subtle flex items-center justify-between text-xs text-secondary">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="ml-2 font-mono text-muted text-[11px]">app.knowva.ai/workspace/engineering</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Vector Index Active</span>
              </div>
            </div>

            {/* Mock Workspace Content Grid */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Recent Files */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                  Knowledge Ingested
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { name: 'Architecture_2026.pdf', chunks: '48 chunks', status: 'ready' },
                    { name: 'RAG_Pipeline.md', chunks: '12 chunks', status: 'ready' },
                    { name: 'SOC2_TypeII_Audit.pdf', chunks: '24 chunks', status: 'ready' },
                  ].map((f, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-surface border border-border-default flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        <span className="truncate font-semibold text-primary">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500">{f.chunks}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 2 Columns: Live AI Synthesized Canvas */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Live Neural RAG Query Preview</span>
                  </div>
                  <Badge variant="ai" size="sm">Sub-120ms</Badge>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-purple-500/25 space-y-3">
                  <div className="text-xs font-semibold text-primary flex items-center gap-2 pb-2 border-b border-border-subtle">
                    <span className="text-brand-400">Query:</span>
                    <span>&ldquo;How does Knowva ensure zero data leakage for enterprise clients?&rdquo;</span>
                  </div>

                  <p className="text-xs text-secondary leading-relaxed">
                    Knowva isolates each organization in dedicated vector namespaces. Raw documents undergo client-side tokenization and AES-256 encryption{' '}
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-400 font-mono text-[10px] font-bold border border-purple-500/30">
                      [1] SOC2_TypeII_Audit.pdf
                    </span>
                    . Zero customer queries or embeddings are shared with foundational models for training.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-muted">
                    <span>Retrieved 3 chunks • Similarity Score: 0.94</span>
                    <span className="text-brand-400 font-mono font-semibold">100% Verified Citations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-muted">
          Trusted by high-growth engineering & AI research teams
        </p>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-secondary/60 opacity-80">
          {['VERTEX AI', 'HYPERSCALE SYSTEMS', 'DATAMIND LABS', 'PRISMA CLOUD', 'CLOUDNATIVE'].map((logo, idx) => (
            <span key={idx} className="font-extrabold text-sm sm:text-base tracking-widest font-mono hover:text-primary transition-colors cursor-default">
              {logo}
            </span>
          ))}
        </div>
      </section>

      {/* 3. FOUR CORE VALUE PROPOSITION PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-primary">
            Engineered for High-Velocity Teams
          </h2>
          <p className="text-xs sm:text-sm text-secondary">
            Combining the intuitive structure of Notion with the lightning speed of Linear and the reasoning of ChatGPT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Database,
              title: 'Multi-Tenant Vector Retrieval',
              desc: 'Sub-150ms semantic search across 500k+ vector chunks with tenant isolation and strict RBAC.',
              badge: 'Performance'
            },
            {
              icon: Sparkles,
              title: 'Grounded AI Synthesizer',
              desc: 'Eliminates hallucinations with exact chunk citations [1], [2] linked to the underlying source document.',
              badge: 'Accuracy'
            },
            {
              icon: HardDrive,
              title: 'Multi-Cloud Ingestion Engine',
              desc: 'Automated drag-and-drop ingestion for PDF, Markdown, Docx, Code, Notion pages, and Slack threads.',
              badge: 'Flexibility'
            },
            {
              icon: ShieldCheck,
              title: 'Enterprise SOC2 & GDPR',
              desc: 'AES-256 encryption at rest, zero data retention SLA, and granular role-based permissions.',
              badge: 'Security'
            }
          ].map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Card key={idx} variant="interactive" className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">{pillar.badge}</Badge>
                </div>
                <h3 className="text-base font-bold text-primary">{pillar.title}</h3>
                <p className="text-xs text-secondary leading-relaxed">{pillar.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 4. INTERACTIVE LIVE RAG QUERY SIMULATOR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="ai">Interactive Simulator</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
            Try Grounded Knowledge Retrieval
          </h2>
          <p className="text-xs text-secondary">
            Click any question below to experience real-time neural synthesis with exact source verification.
          </p>
        </div>

        {/* Question Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {presetQuestions.map(q => (
            <button
              key={q.id}
              onClick={() => setActiveQuestion(q)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer",
                activeQuestion.id === q.id
                  ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                  : "bg-surface text-secondary hover:text-primary border border-border-default hover:border-border-strong"
              )}
            >
              {q.question}
            </button>
          ))}
        </div>

        {/* Dynamic Response Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-surface border border-purple-500/30 shadow-xl space-y-4 ai-border-glow">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Synthesized Response</span>
            </div>
            <span className="text-[10px] font-mono text-muted">Latency: 98ms • Model: Neural-v4</span>
          </div>

          <p className="text-xs sm:text-sm text-primary leading-relaxed font-medium">
            {activeQuestion.answer}
          </p>

          <div className="pt-3 border-t border-border-subtle flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-secondary">Verified Sources:</span>
            {activeQuestion.sources.map(src => (
              <span
                key={src.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/30 font-mono text-xs font-semibold"
              >
                <span>[{src.id}] {src.title}</span>
                <span className="text-muted">({src.chunk})</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FINAL HIGH-CONVERSION CTA BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-900/60 to-purple-900/60 border border-brand-500/30 shadow-2xl text-center space-y-6 relative overflow-hidden">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Supercharge Your Enterprise Knowledge Base
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl mx-auto leading-relaxed">
            Eliminate hours lost searching across siloed Google Drives and Notion pages. Experience Knowva risk-free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="ai"
              size="lg"
              onClick={() => onOpenAuth?.('register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full sm:w-auto shadow-lg font-bold"
            >
              Start 14-Day Free Trial
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate?.('pricing')}
              className="w-full sm:w-auto"
            >
              Explore Pricing
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
