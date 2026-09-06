import React, { useState } from 'react';
import { 
  Palette, Type, Ruler, Box, Activity, Code2, 
  CheckCircle2, AlertTriangle, AlertCircle, Info, 
  Sparkles, Check, Copy 
} from 'lucide-react';
import { tokens } from '../design-system/tokens';
import { cn } from '../lib/utils';

export const Stage1View = () => {
  const [stage1Tab, setStage1Tab] = useState('colors');
  const [copiedToken, setCopiedToken] = useState(null);
  const [sampleText, setSampleText] = useState('Knowva unifies your enterprise knowledge with intelligent AI search.');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const copyToClipboard = (text, tokenKey) => {
    navigator.clipboard?.writeText(text);
    setCopiedToken(tokenKey);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const stage1Tabs = [
    { id: 'colors', label: '1. Colors & WCAG', icon: Palette },
    { id: 'typography', label: '2. Typography System', icon: Type },
    { id: 'spacing', label: '3. 8-pt Spacing & Grid', icon: Ruler },
    { id: 'elevation', label: '4. Elevation & Radii', icon: Box },
    { id: 'motion', label: '5. Motion & Transitions', icon: Activity },
    { id: 'tokens', label: '6. Token Cheat Sheet', icon: Code2 },
  ];

  return (
    <div className="space-y-8">
      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-border-default pb-2 overflow-x-auto no-scrollbar">
        {stage1Tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = stage1Tab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStage1Tab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                isActive ? "bg-brand-600 text-white font-semibold" : "text-secondary hover:text-primary hover:bg-surface-hover"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Colors */}
      {stage1Tab === 'colors' && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Color Palette & Semantic Tokens</h2>
            <p className="text-xs text-secondary mt-1">WCAG 2.1 AA/AAA compliant scales for Light and Dark modes.</p>
          </div>

          {/* Brand Indigo Scale */}
          <div className="bg-surface rounded-xl p-5 border border-border-default shadow-xs">
            <h3 className="text-sm font-semibold text-primary mb-3">Primary Brand Scale (Electric Indigo)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-2.5">
              {Object.entries(tokens.colors.brand).map(([weight, val]) => (
                <div
                  key={weight}
                  onClick={() => copyToClipboard(val.hex, `brand-${weight}`)}
                  className="group relative cursor-pointer rounded-lg p-2.5 flex flex-col items-center justify-between border border-border-subtle hover:scale-105 transition-transform"
                  style={{ backgroundColor: val.hex }}
                >
                  <div className="h-8" />
                  <div className={cn("w-full pt-1 flex flex-col items-center text-center", parseInt(weight) >= 500 ? "text-white" : "text-slate-900")}>
                    <span className="text-xs font-bold font-mono">{weight}</span>
                    <span className="text-[9px] opacity-80 uppercase font-mono">{val.hex}</span>
                  </div>
                  {copiedToken === `brand-${weight}` && (
                    <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold">
                      Copied!
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-emerald-500">Success</h4>
                <p className="text-[11px] text-secondary">Embeddings complete, document indexed</p>
              </div>
            </div>
            <div className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-500">Warning</h4>
                <p className="text-[11px] text-secondary">Storage limit at 85%</p>
              </div>
            </div>
            <div className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-500/10 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-rose-500">Error</h4>
                <p className="text-[11px] text-secondary">Parsing failed, invalid token</p>
              </div>
            </div>
            <div className="p-3.5 rounded-lg border border-sky-500/30 bg-sky-500/10 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-sky-500">Info</h4>
                <p className="text-[11px] text-secondary">Syncing workspace</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Typography */}
      {stage1Tab === 'typography' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary">Typography Scale</h2>
          <div className="bg-surface rounded-xl p-5 border border-border-default space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-400">text-3xl font-extrabold</span>
              <h1 className="text-3xl font-extrabold text-primary">{sampleText}</h1>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-400">text-xl font-bold</span>
              <h2 className="text-xl font-bold text-primary">{sampleText}</h2>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-400">text-sm text-secondary</span>
              <p className="text-sm text-secondary leading-relaxed">{sampleText}</p>
            </div>
          </div>
        </div>
      )}

      {/* Spacing */}
      {stage1Tab === 'spacing' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary">8-Point Spacing Grid</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[4, 8, 12, 16, 24, 32, 48, 64].map((px) => (
              <div key={px} className="p-4 rounded-xl bg-surface border border-border-default">
                <span className="text-xs font-mono font-bold text-primary">{px}px</span>
                <div className="mt-2 bg-brand-500/30 rounded" style={{ height: `${Math.min(px, 32)}px`, width: `${px}px` }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Elevation */}
      {stage1Tab === 'elevation' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary">Elevation & Radii</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-surface border border-border-default shadow-xs">
              <span className="text-xs font-bold text-primary">shadow-xs (Cards)</span>
            </div>
            <div className="p-5 rounded-xl bg-surface border border-border-default shadow-md">
              <span className="text-xs font-bold text-primary">shadow-md (Dropdowns)</span>
            </div>
            <div className="p-5 rounded-2xl bg-surface border border-border-default shadow-xl">
              <span className="text-xs font-bold text-primary">shadow-xl (Modals)</span>
            </div>
          </div>
        </div>
      )}

      {/* Motion */}
      {stage1Tab === 'motion' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary">Motion Sandbox</h2>
          <div className="p-6 rounded-xl bg-surface border border-border-default">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 transition-colors"
            >
              Open Motion Modal
            </button>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-surface border border-border-default rounded-xl p-6 max-w-md w-full shadow-2xl">
                <h4 className="text-base font-bold text-primary mb-2">Modal Motion Test</h4>
                <p className="text-xs text-secondary mb-4">Snappy 200ms ease-out cubic bezier curve.</p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Token Cheat Sheet */}
      {stage1Tab === 'tokens' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary">CSS Variables & Tokens</h2>
          <pre className="p-4 rounded-xl bg-surface border border-border-default text-secondary font-mono text-xs overflow-x-auto">
{`--bg-canvas          /* #090D16 Dark / #F8FAFC Light */
--bg-surface         /* #0F172A Dark / #FFFFFF Light */
--bg-surface-hover   /* #1E293B Dark / #F1F5F9 Light */
--border-default     /* #334155 Dark / #E2E8F0 Light */
--color-brand-600    /* #4F46E5 Electric Indigo */`}
          </pre>
        </div>
      )}
    </div>
  );
};
