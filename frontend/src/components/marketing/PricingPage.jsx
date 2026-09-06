import React, { useState } from 'react';
import { 
  Check, Sparkles, ArrowRight, ShieldCheck, 
  HelpCircle, Users, Zap, Building2, HardDrive 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

/**
 * PricingPage Component - Knowva Transparent Enterprise Pricing
 */
export const PricingPage = ({
  onOpenAuth
}) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [seatsCount, setSeatsCount] = useState(15);

  const tiers = [
    {
      id: 'free',
      name: 'Starter',
      desc: 'Ideal for individual researchers and small open-source projects.',
      monthlyPrice: 0,
      annualPrice: 0,
      highlight: false,
      badge: 'Free Forever',
      features: [
        '1 Isolated Workspace',
        '5 GB Document Storage',
        '500 AI Neural Queries / month',
        'Standard Semantic Search',
        'Community Discord Support',
      ],
      cta: 'Start with Free',
      ctaVariant: 'secondary'
    },
    {
      id: 'pro',
      name: 'Team Pro',
      desc: 'High-velocity engineering and product teams requiring unlimited AI answers.',
      monthlyPrice: 19,
      annualPrice: 15,
      highlight: true,
      badge: 'Most Popular',
      features: [
        'Up to 5 Workspaces',
        '50 GB Document Storage',
        'Unlimited AI RAG Queries',
        'Sub-120ms Neural Indexing',
        'Slack & Google Drive Integration',
        'Granular RBAC Permissions',
        'Priority Email & Chat Support',
      ],
      cta: 'Start 14-Day Trial',
      ctaVariant: 'ai'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      desc: 'Dedicated enterprise security, custom SLA, and zero data retention guarantees.',
      monthlyPrice: 49,
      annualPrice: 39,
      highlight: false,
      badge: 'Custom Deployment',
      features: [
        'Unlimited Workspaces & Folders',
        '1 TB+ Dedicated Storage',
        'Isolated Vector Namespace',
        'SOC2 Type II & HIPAA Verified',
        'Zero Data Retention Guarantee',
        'Custom SSO (SAML, Okta, Azure)',
        '24/7 Dedicated Support & Slack SLA',
      ],
      cta: 'Contact Enterprise Sales',
      ctaVariant: 'primary'
    }
  ];

  const proSeatPrice = isAnnual ? 15 : 19;
  const calculatedProTotal = seatsCount * proSeatPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand">Predictable Transparent Pricing</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-primary">
          Invest in Your Team&apos;s Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-secondary leading-relaxed">
          Scale effortlessly from a single project to thousands of enterprise employees. Every plan includes client-side encryption and zero public training.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3 select-none">
          <span className={cn("text-xs font-semibold cursor-pointer", !isAnnual ? "text-primary" : "text-muted")} onClick={() => setIsAnnual(false)}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-12 h-6 rounded-full bg-surface-hover border border-border-default p-0.5 transition-colors relative cursor-pointer"
            aria-label="Toggle annual billing"
          >
            <div className={cn("w-5 h-5 rounded-full bg-brand-600 transition-transform duration-200", isAnnual ? "translate-x-6" : "translate-x-0")} />
          </button>
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setIsAnnual(true)}>
            <span className={cn("text-xs font-semibold", isAnnual ? "text-primary" : "text-muted")}>
              Annual Billing
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 animate-pulse">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* 3-Tier Matrix Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier) => {
          const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;

          return (
            <div
              key={tier.id}
              className={cn(
                "p-8 rounded-3xl border flex flex-col justify-between transition-all duration-200 relative",
                tier.highlight
                  ? "bg-surface border-purple-500/50 shadow-2xl shadow-purple-500/10 ring-2 ring-purple-500/30 lg:-translate-y-2 ai-border-glow"
                  : "bg-surface/80 border-border-default hover:border-border-strong shadow-sm"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-brand-600 to-purple-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-md">
                  Most Popular for Teams
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-primary">{tier.name}</h3>
                    <Badge variant={tier.highlight ? 'ai' : 'neutral'} size="sm">
                      {tier.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-secondary mt-2 leading-relaxed">{tier.desc}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-primary">${price}</span>
                  <span className="text-xs text-muted font-medium">/ seat / month</span>
                </div>
                {isAnnual && price > 0 && (
                  <p className="text-[11px] text-emerald-500 font-mono">Billed annually (${price * 12}/seat/yr)</p>
                )}

                {/* Features List */}
                <div className="pt-4 border-t border-border-subtle space-y-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
                    What&apos;s Included:
                  </span>
                  <ul className="space-y-2.5 text-xs text-secondary">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Action Button */}
              <div className="pt-8 mt-6 border-t border-border-subtle">
                <Button
                  variant={tier.ctaVariant}
                  className="w-full justify-center font-bold"
                  onClick={() => onOpenAuth?.('register')}
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Team Seat Calculator Slider */}
      <div className="p-8 sm:p-10 rounded-3xl bg-surface border border-border-default shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <h2 className="text-lg font-bold text-primary">Team Pro Seat Estimator</h2>
            <p className="text-xs text-secondary">Adjust your team size to estimate monthly and annual savings.</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-primary font-mono">${calculatedProTotal}</span>
            <span className="text-xs text-muted"> / month</span>
            <p className="text-[10px] text-emerald-500 font-mono">{seatsCount} seats × ${proSeatPrice}/seat</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-primary">
            <span>Team Members: {seatsCount} Seats</span>
            <span className="font-mono text-muted">1 to 100 Seats</span>
          </div>

          <input
            type="range"
            min="1"
            max="100"
            value={seatsCount}
            onChange={(e) => setSeatsCount(Number(e.target.value))}
            className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="space-y-6 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Detailed Plan Feature Matrix</h2>
          <p className="text-xs text-secondary">Compare capabilities side-by-side to choose the right tier.</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border-default bg-surface">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-default bg-surface-hover/50 text-secondary">
                <th className="p-4 font-semibold text-primary">Platform Capabilities</th>
                <th className="p-4 font-semibold text-center">Starter (Free)</th>
                <th className="p-4 font-semibold text-center text-brand-400">Team Pro</th>
                <th className="p-4 font-semibold text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {[
                { feat: 'Document Ingestion Formats (PDF, MD, Docx, Code)', free: 'Basic', pro: 'Full Suite', ent: 'Custom Connectors' },
                { feat: 'Vector Retrieval Latency SLA', free: 'Standard (~500ms)', pro: 'Sub-120ms', ent: 'Dedicated GPU Index (<80ms)' },
                { feat: 'Tenant Vector Isolation', free: 'Shared Index', pro: 'Isolated Namespace', ent: 'Dedicated VPC / Cluster' },
                { feat: 'Zero Customer Data Retention SLA', free: 'No', pro: 'Yes', ent: 'Custom Legal Addendum' },
                { feat: 'SAML / Okta / Google Workspace SSO', free: 'Google/GitHub', pro: 'Google/GitHub', ent: 'Custom SAML 2.0 / Okta' },
                { feat: 'Audit Logs & Activity Timeline', free: '7 Days', pro: '90 Days', ent: 'Unlimited (SIEM Export)' },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-surface-hover/50">
                  <td className="p-4 font-semibold text-primary">{row.feat}</td>
                  <td className="p-4 text-center text-secondary">{row.free}</td>
                  <td className="p-4 text-center font-semibold text-brand-400">{row.pro}</td>
                  <td className="p-4 text-center font-bold text-primary">{row.ent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
