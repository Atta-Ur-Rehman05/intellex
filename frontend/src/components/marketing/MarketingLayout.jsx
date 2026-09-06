import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Sun, Moon, 
  CheckCircle2, Globe
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

/**
 * MarketingLayout Component - Knowva Public Marketing Shell
 */
export const MarketingLayout = ({
  children,
  activeNav = 'landing',
  onNavigate,
  onOpenAuth,
  onLaunchApp,
  theme = 'dark',
  onToggleTheme,
  className
}) => {
  const navLinks = [
    { id: 'landing', label: 'Product' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'security', label: 'Security & SOC2' },
  ];

  return (
    <div className={cn("min-h-screen flex flex-col bg-canvas text-primary selection:bg-brand-500/20 selection:text-brand-300", className)}>
      {/* Top Marketing Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border-default/60 bg-surface/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate?.('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-primary">Knowva</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20 font-semibold">
                AI Workspace
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => onNavigate?.(link.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                  activeNav === link.id
                    ? "text-brand-400 bg-brand-500/10 font-semibold"
                    : "text-secondary hover:text-primary hover:bg-surface-hover"
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl border border-border-default bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer shadow-2xs"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Sign In */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenAuth?.('login')}
              className="hidden sm:inline-flex text-xs"
            >
              Sign In
            </Button>

            {/* Launch App or Get Started */}
            {onLaunchApp ? (
              <Button
                variant="primary"
                size="sm"
                onClick={onLaunchApp}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-white" />}
                rightIcon={<ArrowRight className="w-3.5 h-3.5 text-white" />}
                className="text-xs font-semibold bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white shadow-xs"
              >
                Launch Workspace
              </Button>
            ) : (
              <Button
                variant="ai"
                size="sm"
                onClick={() => onOpenAuth?.('register')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                className="text-xs font-semibold"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Enterprise Marketing Footer */}
      <footer className="border-t border-border-default bg-surface/50 mt-16 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand & Security */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-primary">Knowva</span>
              </div>
              <p className="text-xs text-secondary leading-relaxed max-w-sm">
                Enterprise AI Knowledge Management combining Notion collaborative documents, ChatGPT synthesis, and multi-cloud Google Drive ingestion.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[11px] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SOC2 Type II Certified</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 text-[11px] font-semibold">
                  <Globe className="w-3.5 h-3.5" />
                  <span>GDPR Compliant</span>
                </span>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-primary uppercase tracking-wider text-[11px] font-mono">Product</h4>
              <ul className="space-y-2 text-secondary">
                <li><button onClick={() => onNavigate?.('features')} className="hover:text-primary transition-colors cursor-pointer">Vector Search</button></li>
                <li><button onClick={() => onNavigate?.('features')} className="hover:text-primary transition-colors cursor-pointer">RAG Engine</button></li>
                <li><button onClick={() => onNavigate?.('pricing')} className="hover:text-primary transition-colors cursor-pointer">Pricing Matrix</button></li>
                <li><button onClick={() => onNavigate?.('features')} className="hover:text-primary transition-colors cursor-pointer">Integrations</button></li>
              </ul>
            </div>

            {/* Col 3: Security & Governance */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-primary uppercase tracking-wider text-[11px] font-mono">Security</h4>
              <ul className="space-y-2 text-secondary">
                <li><button onClick={() => onNavigate?.('security')} className="hover:text-primary transition-colors cursor-pointer">SOC2 Compliance</button></li>
                <li><button onClick={() => onNavigate?.('security')} className="hover:text-primary transition-colors cursor-pointer">Zero-Data Retention</button></li>
                <li><button onClick={() => onNavigate?.('security')} className="hover:text-primary transition-colors cursor-pointer">Tenant Isolation</button></li>
                <li><button onClick={() => onNavigate?.('security')} className="hover:text-primary transition-colors cursor-pointer">Data Residency</button></li>
              </ul>
            </div>

            {/* Col 4: Company */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-primary uppercase tracking-wider text-[11px] font-mono">Company</h4>
              <ul className="space-y-2 text-secondary">
                <li><a href="#about" className="hover:text-primary transition-colors">About Knowva</a></li>
                <li><a href="#careers" className="hover:text-primary transition-colors">Careers (We're hiring!)</a></li>
                <li><a href="#blog" className="hover:text-primary transition-colors">Research Blog</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Enterprise Sales</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
            <p>© 2026 Knowva Inc. All rights reserved. Zero customer data retained for public model training.</p>
            <div className="flex items-center gap-4 text-muted">
              <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
              <span>•</span>
              <span className="hover:text-primary cursor-pointer transition-colors">System Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
