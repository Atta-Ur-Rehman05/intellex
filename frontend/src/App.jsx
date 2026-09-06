import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Sliders, ArrowRight, ArrowLeft, 
  ExternalLink, Layers, ShieldCheck, HardDrive, 
  MessageSquare, FileText, CheckCircle2, Globe 
} from 'lucide-react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { AppShell } from './components/shell/AppShell';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { MarketingLayout } from './components/marketing/MarketingLayout';
import { LandingPage } from './components/marketing/LandingPage';
import { PricingPage } from './components/marketing/PricingPage';
import { FeaturesPage } from './components/marketing/FeaturesPage';
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { VerifyEmailScreen } from './components/auth/VerifyEmailScreen';
import { ForgotPasswordForm } from './components/auth/ForgotPasswordForm';
import { DevSpecsDrawer } from './components/DevSpecsDrawer';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { cn } from './lib/utils';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [viewMode, setViewMode] = useState('app'); // 'app' | 'public'
  const [appRoute, setAppRoute] = useState('dashboard'); // 'dashboard' | 'docs' | 'chat' | 'settings'
  const [publicPage, setPublicPage] = useState('landing'); // 'landing' | 'pricing' | 'features' | 'login' | 'register' | 'verify' | 'forgot'
  const [isDevDrawerOpen, setIsDevDrawerOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLaunchApp = () => {
    setViewMode('app');
    setAppRoute('dashboard');
  };

  const handleSignOut = () => {
    setViewMode('public');
    setPublicPage('landing');
  };

  const handleOpenAuth = (screen = 'login') => {
    setPublicPage(screen);
    setViewMode('public');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas text-primary transition-colors duration-200 relative selection:bg-brand-500/30">
        
        {/* ========================================================================= */}
        {/* 1. AUTHENTICATED REAL PRODUCT EXPERIENCE (APP SHELL)                      */}
        {/* ========================================================================= */}
        {viewMode === 'app' ? (
          <AppShell
            currentRoute={appRoute}
            onRouteChange={setAppRoute}
            theme={theme}
            onToggleTheme={toggleTheme}
            onSignOut={handleSignOut}
          >
            {/* Master Dashboard (Prompt 6) */}
            {appRoute === 'dashboard' && (
              <DashboardPage
                onNavigateToChat={() => setAppRoute('chat')}
                onNavigateToDocs={() => setAppRoute('docs')}
              />
            )}

            {/* Document Explorer (Roadmap: Prompt 7 Preview) */}
            {appRoute === 'docs' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Document Explorer & Vector Ingestion</h1>
                    <p className="text-xs text-secondary mt-1">
                      Folder navigation, multi-file drag-and-drop wizard, AST chunk viewer, and custom tags.
                    </p>
                  </div>
                  <Badge variant="brand" dot>Prompt 7 (Next Stage)</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Vector Inspection</CardTitle>
                      <CardDescription className="text-xs">1,428 documents currently vectorized</CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs text-secondary">
                      Full folder hierarchy and multi-source connectors (Google Drive, Notion, S3) will be built in Stage 7.
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* AI Chat & RAG Experience (Roadmap: Prompt 8 Preview) */}
            {appRoute === 'chat' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">AI Chat & RAG Experience</h1>
                    <p className="text-xs text-secondary mt-1">
                      Multi-turn conversational knowledge synthesis with verifiable vector citations and streaming tokens.
                    </p>
                  </div>
                  <Badge variant="brand" dot>Prompt 8 (Roadmap)</Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">RAG Engine Live Context</CardTitle>
                    <CardDescription className="text-xs">Zero customer data retention verified by SOC2 audit</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-secondary">
                    Full streaming responses, syntax-highlighted code blocks, and source citations will be built in Stage 8.
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Workspace Settings */}
            {appRoute === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-primary">Workspace & Security Settings</h1>
                  <p className="text-xs text-secondary mt-1">
                    Multi-tenant encryption, API keys, compliance audit logs, and SSO configuration.
                  </p>
                </div>
                <Card>
                  <CardContent className="p-6 text-xs text-secondary">
                    Team member roles, permission scopes, and audit logs will be expanded in Prompts 10–12.
                  </CardContent>
                </Card>
              </div>
            )}
          </AppShell>
        ) : (
          /* ========================================================================= */
          /* 2. PUBLIC MARKETING & AUTHENTICATION EXPERIENCE (PUBLIC SITE)             */
          /* ========================================================================= */
          <div className="min-h-screen flex flex-col justify-between">
            {/* Marketing Shell wrapper for public pages */}
            {(publicPage === 'landing' || publicPage === 'pricing' || publicPage === 'features') && (
              <MarketingLayout
                activeNav={publicPage}
                onNavigate={setPublicPage}
                onOpenAuth={handleOpenAuth}
                onLaunchApp={handleLaunchApp}
                theme={theme}
                onToggleTheme={toggleTheme}
              >
                {publicPage === 'landing' && (
                  <LandingPage
                    onOpenAuth={handleOpenAuth}
                    onNavigate={setPublicPage}
                    onLaunchApp={handleLaunchApp}
                  />
                )}
                {publicPage === 'pricing' && (
                  <PricingPage
                    onOpenAuth={handleOpenAuth}
                    onLaunchApp={handleLaunchApp}
                  />
                )}
                {publicPage === 'features' && (
                  <FeaturesPage
                    onOpenAuth={handleOpenAuth}
                    onLaunchApp={handleLaunchApp}
                  />
                )}
              </MarketingLayout>
            )}

            {/* Authentication screens */}
            {publicPage === 'login' && (
              <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
                <LoginForm
                  onLoginSuccess={handleLaunchApp}
                  onOpenRegister={() => setPublicPage('register')}
                  onOpenForgotPassword={() => setPublicPage('forgot')}
                />
              </AuthLayout>
            )}

            {publicPage === 'register' && (
              <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
                <RegisterForm
                  onRegisterSuccess={() => setPublicPage('verify')}
                  onOpenLogin={() => setPublicPage('login')}
                />
              </AuthLayout>
            )}

            {publicPage === 'verify' && (
              <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
                <VerifyEmailScreen
                  email="sarah.chen@acme.ai"
                  onVerifiedSuccess={handleLaunchApp}
                  onBackToLogin={() => setPublicPage('login')}
                />
              </AuthLayout>
            )}

            {publicPage === 'forgot' && (
              <AuthLayout theme={theme} onToggleTheme={toggleTheme}>
                <ForgotPasswordForm
                  onBackToLogin={() => setPublicPage('login')}
                />
              </AuthLayout>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. DISCREET FLOATING DEV & DESIGN SPECS DRAWER TRIGGER                    */}
        {/* ========================================================================= */}
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
          {/* Quick mode switcher pill */}
          <button
            onClick={() => setViewMode(viewMode === 'app' ? 'public' : 'app')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/90 hover:bg-surface border border-border-default shadow-lg backdrop-blur-md text-xs font-semibold text-primary transition-all hover:border-brand-500 cursor-pointer"
            title="Switch between Public Website and Authenticated Product App"
          >
            {viewMode === 'app' ? (
              <>
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">View Public Website</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span className="hidden sm:inline">Launch App Workspace</span>
              </>
            )}
          </button>

          {/* Dev / Design Specs Drawer Button */}
          <button
            onClick={() => setIsDevDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white shadow-lg backdrop-blur-md text-xs font-semibold transition-all cursor-pointer shadow-brand-500/25"
            title="Open Design System Tokens, IA Flows, and Component Audits"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Dev Specs & Audits</span>
          </button>
        </div>

        {/* Slide-over Specs Drawer */}
        <DevSpecsDrawer
          isOpen={isDevDrawerOpen}
          onClose={() => setIsDevDrawerOpen(false)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onNavigateToChat={() => {
            setIsDevDrawerOpen(false);
            setViewMode('app');
            setAppRoute('chat');
          }}
          onNavigateToDocs={() => {
            setIsDevDrawerOpen(false);
            setViewMode('app');
            setAppRoute('docs');
          }}
        />

      </div>
    </ToastProvider>
  );
}