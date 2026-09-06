import React from 'react';
import { 
  Database, Sparkles, FileText, ShieldCheck, 
  Search, HardDrive, ArrowRight, CheckCircle2, 
  Cpu, Lock, Layers, Zap, Clock, Terminal 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

/**
 * FeaturesPage Component - Knowva Deep Capability Tour
 */
export const FeaturesPage = ({ onOpenAuth }) => {
  const featureSections = [
    {
      badge: 'Core Engine',
      title: 'Neural Vector Retrieval & Chunking',
      desc: 'Process unstructured enterprise data into dense semantic representations with sub-120ms retrieval latencies across millions of embeddings.',
      icon: Database,
      points: [
        '512-token chunking with 64-token sliding window overlap',
        'Hybrid lexical (BM25) and neural vector search',
        'Cosine and Euclidean distance relevancy ranking',
        'Automatic deduplication and semantic tag extraction'
      ]
    },
    {
      badge: 'Grounded AI',
      title: 'Hallucination-Free RAG Synthesis',
      desc: 'Every generated answer links directly back to the original source document, page, and chunk ID, ensuring zero ungrounded statements.',
      icon: Sparkles,
      points: [
        'Interactive inline citation pills [1], [2]',
        'One-click source preview drawer',
        'Confidence scores and token traceability',
        'Customizable enterprise system prompts'
      ]
    },
    {
      badge: 'Ingestion Engine',
      title: 'Multi-Cloud & File Ingestion Wizard',
      desc: 'Seamlessly index knowledge from PDF reports, Markdown specs, Word documents, source code repositories, and Slack conversations.',
      icon: HardDrive,
      points: [
        'Automated OCR for scanned PDFs and diagrams',
        'Syntax tree preservation for Python, JS, Go, and Rust',
        'Scheduled recurring web scrapes and Notion sync',
        'Batch upload wizard with real-time embedding progress'
      ]
    },
    {
      badge: 'Governance',
      title: 'Enterprise Security & Compliance',
      desc: 'Engineered for regulated industries with complete tenant vector isolation, SOC2 Type II compliance, and zero-data retention agreements.',
      icon: ShieldCheck,
      points: [
        'Tenant-isolated cryptographic vector namespaces',
        'Zero customer data retention for foundational AI training',
        'Role-Based Access Control (Owner, Admin, Editor, Viewer)',
        'Comprehensive audit logs with SIEM export'
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand">Enterprise Architecture</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
          Engineered for Enterprise Scale
        </h1>
        <p className="text-xs sm:text-sm text-secondary leading-relaxed">
          Explore the underlying technologies powering Knowva&apos;s lightning-fast vector ingestion, grounded AI reasoning, and strict security boundaries.
        </p>
      </div>

      {/* Feature Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {featureSections.map((sec, idx) => {
          const Icon = sec.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-surface border border-border-default shadow-xs space-y-5 hover:border-brand-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/25">
                  <Icon className="w-6 h-6" />
                </div>
                <Badge variant="ai">{sec.badge}</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary">{sec.title}</h3>
                <p className="text-xs text-secondary mt-2 leading-relaxed">{sec.desc}</p>
              </div>

              <div className="pt-4 border-t border-border-subtle space-y-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                  Key Specifications:
                </span>
                <ul className="space-y-2 text-xs text-secondary">
                  {sec.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Final CTA */}
      <div className="text-center pt-8">
        <Button
          variant="ai"
          size="lg"
          onClick={() => onOpenAuth?.('register')}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="font-bold shadow-lg"
        >
          Get Started with Knowva Today
        </Button>
      </div>
    </div>
  );
};
