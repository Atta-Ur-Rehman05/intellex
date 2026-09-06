import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Sliders, ArrowRight, ArrowLeft, 
  ExternalLink, Layers, ShieldCheck, HardDrive, 
  MessageSquare, FileText, CheckCircle2, Globe 
} from 'lucide-react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { AppShell } from './components/shell/AppShell';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { DocumentExplorerPage } from './components/documents/DocumentExplorerPage';
import { ChatPage } from './components/chat/ChatPage';
import { SemanticSearchPage } from './components/search/SemanticSearchPage';
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
import { WorkspaceSettingsPage } from './components/team/WorkspaceSettingsPage';
import { AccountSettingsPage } from './components/settings/AccountSettingsPage';
import { Button } from './components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './components/ui/Card';
import { Badge } from './components/ui/Badge';
import { cn } from './lib/utils';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [viewMode, setViewMode] = useState('app'); // 'app' | 'public'
  const [appRoute, setAppRoute] = useState('dashboard'); // 'dashboard' | 'docs' | 'chat' | 'settings'
  const [publicPage, setPublicPage] = useState('landing'); // 'landing' | 'pricing' | 'features' | 'login' | 'register' | 'verify' | 'forgot'
  const [activeChatDoc, setActiveChatDoc] = useState(null);
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
                onNavigateToChat={(doc) => {
                  setActiveChatDoc(doc || null);
                  setAppRoute('chat');
                }}
                onNavigateToDocs={() => setAppRoute('docs')}
              />
            )}

            {/* Document Explorer & Upload Engine (Prompt 7) */}
            {appRoute === 'docs' && (
              <DocumentExplorerPage
                onNavigateToChat={(doc) => {
                  setActiveChatDoc(doc || null);
                  setAppRoute('chat');
                }}
              />
            )}

            {/* AI Chat & RAG Experience (Prompt 8) */}
            {appRoute === 'chat' && (
              <ChatPage
                initialDocContext={activeChatDoc}
                onNavigateToDocs={(docId) => setAppRoute('docs')}
              />
            )}

            {/* Global & Semantic Search Workbench (Prompt 9) */}
            {appRoute === 'search' && (
              <SemanticSearchPage
                onNavigateToChat={(doc) => {
                  setActiveChatDoc(doc || null);
                  setAppRoute('chat');
                }}
                onNavigateToDocs={(docId) => setAppRoute('docs')}
              />
            )}

            {/* Workspace Settings (Stage 10) */}
            {appRoute === 'settings' && (
              <WorkspaceSettingsPage />
            )}

            {/* Account Settings, Security, Billing & API Keys (Stage 11) */}
            {appRoute === 'account-settings' && (
              <AccountSettingsPage theme={theme} onThemeChange={toggleTheme} />
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