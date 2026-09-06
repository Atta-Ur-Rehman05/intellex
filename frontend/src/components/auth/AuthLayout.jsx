import React from 'react';
import { Sparkles, ShieldCheck, Sun, Moon, ArrowLeft, Lock } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * AuthLayout Component - Security-Conscious Authentication Shell
 */
export const AuthLayout = ({
  children,
  title,
  subtitle,
  onBackToMarketing,
  theme = 'dark',
  onToggleTheme,
  className
}) => {
  return (
    <div className={cn("min-h-screen flex flex-col justify-between bg-canvas text-primary relative overflow-hidden", className)}>
      {/* Subtle Neural Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-brand-600/15 via-purple-600/10 to-transparent blur-[90px] -z-10 pointer-events-none" />

      {/* Top Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        {onBackToMarketing ? (
          <button
            type="button"
            onClick={onBackToMarketing}
            className="flex items-center gap-2 text-xs font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Knowva</span>
          </button>
        ) : <div />}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-2 rounded-xl border border-border-default bg-surface hover:bg-surface-hover text-secondary hover:text-primary transition-colors cursor-pointer shadow-2xs"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>
      </div>

      {/* Centered Auth Card Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Brand Mark */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-11 w-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-purple-600 items-center justify-center text-white shadow-lg shadow-brand-500/25 mb-1">
              <Sparkles className="w-6 h-6" />
            </div>
            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-secondary leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Card Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface/95 border border-border-default shadow-2xl backdrop-blur-xl">
            {children}
          </div>

          {/* Security Trust Badges */}
          <div className="flex items-center justify-center gap-3 text-[11px] text-muted font-mono">
            <div className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-bit TLS Encryption</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>SOC2 Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Footer Links */}
      <div className="p-4 sm:p-6 text-center text-xs text-muted">
        <div className="flex items-center justify-center gap-4">
          <span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Enterprise Security</span>
        </div>
      </div>
    </div>
  );
};
