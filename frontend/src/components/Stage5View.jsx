import React, { useState } from 'react';
import { 
  Globe, DollarSign, Sparkles, KeyRound, ShieldCheck, 
  Eye, CheckCircle2, User, ArrowRight, Layers 
} from 'lucide-react';
import { MarketingLayout } from './marketing/MarketingLayout';
import { LandingPage } from './marketing/LandingPage';
import { PricingPage } from './marketing/PricingPage';
import { FeaturesPage } from './marketing/FeaturesPage';
import { AuthLayout } from './auth/AuthLayout';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';
import { VerifyEmailScreen } from './auth/VerifyEmailScreen';
import { ForgotPasswordForm } from './auth/ForgotPasswordForm';
import { marketingAuthSpecs } from '../design-system/marketingAuthSpecs';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { useToast } from './ui/Toast';
import { cn } from '../lib/utils';

export const Stage5View = ({ theme = 'dark', onToggleTheme }) => {
  const [mainTab, setMainTab] = useState('landing'); // 'landing' | 'pricing' | 'features' | 'auth' | 'specs'
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register' | 'verify' | 'forgot'
  const [registeredEmail, setRegisteredEmail] = useState('sarah.chen@acme.ai');
  const { toast } = useToast();

  const subTabs = [
    { id: 'landing', label: '1. Landing & Product Hero', icon: Globe },
    { id: 'pricing', label: '2. Pricing & Seat Calculator', icon: DollarSign },
    { id: 'features', label: '3. Features Deep Dive', icon: Sparkles },
    { id: 'auth', label: '4. Authentication Suite', icon: KeyRound },
    { id: 'specs', label: '5. Security & Pricing Specs', icon: ShieldCheck },
  ];

  const handleOpenAuth = (screen = 'login') => {
    setAuthScreen(screen);
    setMainTab('auth');
  };

  const handleAuthSuccess = (userData) => {
    toast({
      title: "Authentication Verified",
      description: `Welcome to Knowva, ${userData.name || 'User'}! Launching workspace.`,
      type: "success"
    });
  };

  const handleRegisterSuccess = (userData) => {
    setRegisteredEmail(userData.email);
    setAuthScreen('verify');
    toast({
      title: "Verification Code Sent",
      description: `Dispatched 6-digit OTP code to ${userData.email}.`,
      type: "info"
    });
  };

  return (
    <div className="space-y-8">
      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border-default pb-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = mainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setMainTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-2.5 px-4 text-xs sm:text-sm font-medium rounded-lg transition-all cursor-pointer select-none",
                  isActive
                    ? "bg-brand-600 text-white shadow-xs font-semibold"
                    : "text-secondary hover:text-primary hover:bg-surface-hover"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-secondary")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LANDING PAGE                                                       */}
      {/* ========================================================================= */}
      {mainTab === 'landing' && (
        <div className="rounded-2xl border border-border-default overflow-hidden shadow-2xl bg-canvas">
          <MarketingLayout
            activeNav="landing"
            onNavigate={(nav) => setMainTab(nav)}
            onOpenAuth={handleOpenAuth}
            theme={theme}
            onToggleTheme={onToggleTheme}
          >
            <LandingPage
              onOpenAuth={handleOpenAuth}
              onNavigate={(nav) => setMainTab(nav)}
            />
          </MarketingLayout>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRICING PAGE & SEAT CALCULATOR                                      */}
      {/* ========================================================================= */}
      {mainTab === 'pricing' && (
        <div className="rounded-2xl border border-border-default overflow-hidden shadow-2xl bg-canvas">
          <MarketingLayout
            activeNav="pricing"
            onNavigate={(nav) => setMainTab(nav)}
            onOpenAuth={handleOpenAuth}
            theme={theme}
            onToggleTheme={onToggleTheme}
          >
            <PricingPage onOpenAuth={handleOpenAuth} />
          </MarketingLayout>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FEATURES DEEP DIVE                                                  */}
      {/* ========================================================================= */}
      {mainTab === 'features' && (
        <div className="rounded-2xl border border-border-default overflow-hidden shadow-2xl bg-canvas">
          <MarketingLayout
            activeNav="features"
            onNavigate={(nav) => setMainTab(nav)}
            onOpenAuth={handleOpenAuth}
            theme={theme}
            onToggleTheme={onToggleTheme}
          >
            <FeaturesPage onOpenAuth={handleOpenAuth} />
          </MarketingLayout>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUTHENTICATION SUITE                                                */}
      {/* ========================================================================= */}
      {mainTab === 'auth' && (
        <div className="space-y-6">
          {/* Auth Screen Switcher Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border-default shadow-xs">
            <div>
              <h2 className="text-base font-bold text-primary">Authentication Flow Simulator</h2>
              <p className="text-xs text-secondary mt-0.5">
                Toggle between Sign In, Registration (with live password strength meter), OTP Verification, and Password Reset.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-hover p-1 rounded-xl border border-border-subtle text-xs">
              {[
                { id: 'login', label: 'Sign In' },
                { id: 'register', label: 'Sign Up (Strength Meter)' },
                { id: 'verify', label: '6-Digit OTP Code' },
                { id: 'forgot', label: 'Forgot Password' },
              ].map(screen => (
                <button
                  key={screen.id}
                  onClick={() => setAuthScreen(screen.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer",
                    authScreen === screen.id
                      ? "bg-surface text-primary shadow-xs font-semibold"
                      : "text-secondary hover:text-primary"
                  )}
                >
                  {screen.label}
                </button>
              ))}
            </div>
          </div>

          {/* Embedded Auth Shell */}
          <div className="rounded-3xl border border-border-default overflow-hidden shadow-2xl bg-canvas">
            <AuthLayout
              title={
                authScreen === 'login' ? 'Welcome Back to Knowva' :
                authScreen === 'register' ? 'Create Your AI Workspace' :
                authScreen === 'verify' ? 'Security Verification' :
                'Account Recovery'
              }
              subtitle={
                authScreen === 'login' ? 'Enter your credentials to access your enterprise knowledge base.' :
                authScreen === 'register' ? 'Zero customer data retention for foundation model training.' :
                authScreen === 'verify' ? 'Enter the 6-digit code sent to your registered inbox.' :
                'We will send secure self-serve reset instructions.'
              }
              onBackToMarketing={() => setMainTab('landing')}
              theme={theme}
              onToggleTheme={onToggleTheme}
            >
              {authScreen === 'login' && (
                <LoginForm
                  onSuccess={handleAuthSuccess}
                  onSwitchToRegister={() => setAuthScreen('register')}
                  onSwitchToForgotPassword={() => setAuthScreen('forgot')}
                />
              )}

              {authScreen === 'register' && (
                <RegisterForm
                  onSuccess={handleRegisterSuccess}
                  onSwitchToLogin={() => setAuthScreen('login')}
                />
              )}

              {authScreen === 'verify' && (
                <VerifyEmailScreen
                  email={registeredEmail}
                  onVerifySuccess={handleAuthSuccess}
                  onChangeEmail={() => setAuthScreen('register')}
                />
              )}

              {authScreen === 'forgot' && (
                <ForgotPasswordForm
                  onBackToLogin={() => setAuthScreen('login')}
                />
              )}
            </AuthLayout>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: SECURITY & PRICING SPECS                                           */}
      {/* ========================================================================= */}
      {mainTab === 'specs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Marketing, SEO & Security Specifications</h2>
            <p className="text-sm text-secondary mt-1">
              Architectural rules for authentication security, password entropy thresholds, OTP expiration, and pricing tier economics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password Security Rules */}
            <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <h3 className="text-base font-bold text-primary">Password Security Standards</h3>
                <Badge variant="brand">NIST & SOC2 Compliant</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-primary block">Complexity Requirements:</span>
                  <p className="text-secondary mt-0.5">Minimum 8 characters with at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
                </div>

                <div>
                  <span className="font-semibold text-primary block">Entropy Meter Levels:</span>
                  <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-[11px]">
                    <span className="p-2 rounded bg-red-500/10 text-red-500 border border-red-500/25">Level 1: Weak (0-1 conditions)</span>
                    <span className="p-2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/25">Level 2: Moderate (2-3 conditions)</span>
                    <span className="p-2 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">Level 3: Strong (4 conditions)</span>
                    <span className="p-2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/25">Level 4: Excellent (Max entropy)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border-subtle">
                  <span className="font-semibold text-primary block">Email Verification (OTP):</span>
                  <p className="text-secondary mt-0.5">Cryptographic 6-digit numeric token with 15-minute expiration window, 45-second resend cooldown, and lockout after 5 failed attempts.</p>
                </div>
              </div>
            </div>

            {/* Zero-Data Retention SLA */}
            <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <h3 className="text-base font-bold text-primary">Zero-Data Retention Guarantee</h3>
                <Badge variant="success">Legal SLA</Badge>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-semibold text-primary block">Public AI Training Exclusion:</span>
                  <p className="text-secondary mt-0.5">All customer document chunks, embeddings, queries, and generated reasoning chains are legally excluded from public foundation model training sets.</p>
                </div>

                <div>
                  <span className="font-semibold text-primary block">Multi-Tenant Cryptographic Isolation:</span>
                  <p className="text-secondary mt-0.5">Each workspace is assigned a distinct encryption key (AES-256) and isolated vector index partition preventing cross-tenant data leakage.</p>
                </div>

                <div className="pt-2 border-t border-border-subtle">
                  <span className="font-semibold text-primary block">SEO Metadata & OpenGraph:</span>
                  <p className="text-secondary font-mono text-[11px] mt-0.5">Title: %s | Knowva — Your AI Knowledge Workspace</p>
                  <p className="text-secondary font-mono text-[11px]">Meta: Enterprise AI Knowledge Management combining Notion, ChatGPT, and Drive.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
