import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Sun, Moon, Check, Copy, Layers, Type, Maximize2, 
  Sliders, ShieldCheck, Code2, Play, CheckCircle2, AlertTriangle, 
  AlertCircle, Info, ExternalLink, ArrowRight, CornerDownRight,
  Palette, Ruler, Box, Activity, Map, GitBranch, Compass, 
  Folder, FileText, Cpu, Building2, LayoutGrid, Search, 
  Users, ChevronRight, ChevronLeft, Share2, Download, 
  Trash2, Tag, History, FileCode, CheckCircle, ArrowUpRight
} from 'lucide-react';
import { tokens } from './design-system/tokens';
import { informationArchitecture } from './design-system/informationArchitecture';
import { cn } from './lib/utils';
import { ToastProvider } from './components/ui/Toast';
import { Stage3View } from './components/Stage3View';
import { Stage4View } from './components/Stage4View';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [currentStage, setCurrentStage] = useState('stage4'); // 'stage1' | 'stage2' | 'stage3' | 'stage4'
  
  // Stage 1 State
  const [stage1Tab, setStage1Tab] = useState('colors');
  const [copiedToken, setCopiedToken] = useState(null);
  const [sampleText, setSampleText] = useState('Knowva unifies your enterprise knowledge with intelligent AI search.');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animatingSpring, setAnimatingSpring] = useState(false);

  // Stage 2 State
  const [stage2Tab, setStage2Tab] = useState('flows'); // 'sitemap' | 'hierarchy' | 'flows' | 'taxonomy'
  const [selectedFlowId, setSelectedFlowId] = useState('flow-a');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState('core');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

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

  const stage2Tabs = [
    { id: 'flows', label: '1. Critical User Journeys', icon: GitBranch },
    { id: 'sitemap', label: '2. Complete 3-Tier Sitemap', icon: Map },
    { id: 'hierarchy', label: '3. Multi-Tenant Hierarchy', icon: Layers },
    { id: 'taxonomy', label: '4. Navigation Taxonomy', icon: Compass },
  ];

  const currentFlow = informationArchitecture.flows.find(f => f.id === selectedFlowId) || informationArchitecture.flows[0];
  const activeStep = currentFlow.steps[activeStepIndex] || currentFlow.steps[0];

  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas text-primary transition-colors duration-200">
      {/* Global Top Application Header */}
      <header className="sticky top-0 z-40 border-b border-border-default bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-primary">Knowva</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {currentStage === 'stage1' 
                    ? 'Stage 1: Tokens' 
                    : currentStage === 'stage2' 
                    ? 'Stage 2: IA & Flows' 
                    : currentStage === 'stage3' 
                    ? 'Stage 3: Component Library' 
                    : 'Stage 4: App Shell & Global Nav'}
                </span>
              </div>
              <p className="text-xs text-secondary hidden sm:block">Enterprise AI Knowledge Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage Selector Pill */}
            <div className="flex items-center p-1 rounded-lg bg-surface-hover border border-border-default overflow-x-auto no-scrollbar max-w-full">
              <button
                onClick={() => setCurrentStage('stage1')}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 whitespace-nowrap",
                  currentStage === 'stage1'
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-secondary hover:text-primary"
                )}
              >
                Stage 1: Tokens
              </button>
              <button
                onClick={() => setCurrentStage('stage2')}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 whitespace-nowrap",
                  currentStage === 'stage2'
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-secondary hover:text-primary"
                )}
              >
                <span>Stage 2: IA & Flows</span>
              </button>
              <button
                onClick={() => setCurrentStage('stage3')}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 whitespace-nowrap",
                  currentStage === 'stage3'
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-secondary hover:text-primary"
                )}
              >
                <span>Stage 3: Components</span>
              </button>
              <button
                onClick={() => setCurrentStage('stage4')}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 whitespace-nowrap",
                  currentStage === 'stage4'
                    ? "bg-brand-600 text-white shadow-xs"
                    : "text-secondary hover:text-primary"
                )}
              >
                <span>Stage 4: App Shell</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              </button>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-surface hover:bg-surface-hover text-primary transition-all duration-150 text-xs font-medium shadow-xs"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub-navigation Tabs */}
        {currentStage !== 'stage3' && currentStage !== 'stage4' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar border-t border-border-subtle">
            {currentStage === 'stage1' ? (
              stage1Tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = stage1Tab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStage1Tab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150",
                      isActive
                        ? "border-brand-500 text-brand-400"
                        : "border-transparent text-secondary hover:text-primary hover:border-border-default"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-brand-500" : "text-secondary")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })
            ) : (
              stage2Tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = stage2Tab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStage2Tab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-150",
                      isActive
                        ? "border-brand-500 text-brand-400"
                        : "border-transparent text-secondary hover:text-primary hover:border-border-default"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-brand-500" : "text-secondary")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ========================================================================= */}
        {/* STAGE 4 VIEWS (APP SHELL & GLOBAL NAVIGATION)                              */}
        {/* ========================================================================= */}
        {currentStage === 'stage4' && (
          <Stage4View theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
        )}

        {/* ========================================================================= */}
        {/* STAGE 3 VIEWS (CORE REUSABLE COMPONENT LIBRARY)                            */}
        {/* ========================================================================= */}
        {currentStage === 'stage3' && (
          <Stage3View />
        )}

        {/* ========================================================================= */}
        {/* STAGE 2 VIEWS (INFORMATION ARCHITECTURE & FLOWS)                           */}
        {/* ========================================================================= */}
        {currentStage === 'stage2' && (
          <div className="space-y-8">
            
            {/* STAGE 2: TAB 1 - CRITICAL USER JOURNEYS SIMULATOR */}
            {stage2Tab === 'flows' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">Critical User Journey Flows & Simulation</h2>
                  <p className="text-sm text-secondary mt-1">
                    End-to-end user paths detailing logic, system actors, decision branches, and UI component touchpoints.
                  </p>
                </div>

                {/* Flow Selection Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {informationArchitecture.flows.map((flow) => {
                    const isSelected = flow.id === selectedFlowId;
                    return (
                      <button
                        key={flow.id}
                        onClick={() => {
                          setSelectedFlowId(flow.id);
                          setActiveStepIndex(0);
                        }}
                        className={cn(
                          "p-4 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between",
                          isSelected
                            ? "bg-surface border-brand-500 shadow-md shadow-brand-500/10 ring-1 ring-brand-500"
                            : "bg-surface/60 border-border-default hover:bg-surface hover:border-border-strong"
                        )}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn(
                              "text-[10px] font-bold font-mono px-2 py-0.5 rounded",
                              isSelected ? "bg-brand-500 text-white" : "bg-surface-hover text-secondary border border-border-subtle"
                            )}>
                              {flow.code}
                            </span>
                            <span className="text-[11px] text-brand-400 font-medium">{flow.badge}</span>
                          </div>
                          <h3 className="text-sm font-bold text-primary mb-1">{flow.title}</h3>
                          <p className="text-xs text-secondary line-clamp-2">{flow.summary}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] font-medium text-brand-400">
                          <span>{flow.steps.length} Key Steps</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Flow Stepper Canvas */}
                <div className="bg-surface rounded-xl border border-border-default shadow-sm p-6 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-border-default gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 border border-brand-500/30">
                          {currentFlow.code}
                        </span>
                        <h3 className="text-lg font-bold text-primary">{currentFlow.title}</h3>
                      </div>
                      <p className="text-xs text-secondary mt-1">{currentFlow.summary}</p>
                    </div>

                    {/* Step Navigation Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                        disabled={activeStepIndex === 0}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border-default bg-surface hover:bg-surface-hover text-primary text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Previous</span>
                      </button>
                      <button
                        onClick={() => setActiveStepIndex(Math.min(currentFlow.steps.length - 1, activeStepIndex + 1))}
                        disabled={activeStepIndex === currentFlow.steps.length - 1}
                        className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                      >
                        <span>Next Step</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Step Progress Indicator */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {currentFlow.steps.map((step, idx) => {
                      const isActive = idx === activeStepIndex;
                      const isPast = idx < activeStepIndex;
                      return (
                        <button
                          key={step.id}
                          onClick={() => setActiveStepIndex(idx)}
                          className={cn(
                            "p-3 rounded-lg border text-left transition-all relative overflow-hidden",
                            isActive
                              ? "bg-brand-500/10 border-brand-500 text-primary"
                              : isPast
                              ? "bg-surface-hover/80 border-emerald-500/30 text-secondary"
                              : "bg-surface border-border-subtle text-muted hover:border-border-default"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-bold">Step 0{idx + 1}</span>
                            {isPast && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                            {isActive && <div className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />}
                          </div>
                          <p className="text-xs font-semibold truncate">{step.name}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Step Deep Dive & Simulation Panel */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                    {/* Step Specs */}
                    <div className="lg:col-span-7 space-y-4">
                      <div className="p-4 rounded-xl bg-surface-hover border border-border-subtle space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400">
                            Active Step: 0{activeStepIndex + 1} / 0{currentFlow.steps.length}
                          </span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Actor: {activeStep.actor}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-primary">{activeStep.name}</h4>
                        <p className="text-xs text-secondary leading-relaxed">{activeStep.action}</p>
                      </div>

                      {/* Decision Branching Logic */}
                      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-amber-500" />
                          <h5 className="text-xs font-bold uppercase tracking-wider text-amber-500 font-mono">
                            Decision Node & Logic Branch
                          </h5>
                        </div>
                        <p className="text-xs font-semibold text-primary">{activeStep.decision}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <span className="font-bold block mb-0.5">✓ Success Pathway:</span>
                            <span className="text-[11px] text-secondary">{activeStep.decisionPaths.yes}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            <span className="font-bold block mb-0.5">✕ Fallback / Error:</span>
                            <span className="text-[11px] text-secondary">{activeStep.decisionPaths.no}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Step UI Component Preview Card */}
                    <div className="lg:col-span-5 flex flex-col">
                      <div className="flex-1 p-5 rounded-xl border border-border-default bg-canvas flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-mono font-bold text-secondary uppercase tracking-wider">UI Touchpoint</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border-subtle text-muted">
                              Component Spec
                            </span>
                          </div>
                          <div className="p-3 rounded-lg bg-surface border border-border-default mb-3">
                            <code className="text-xs font-mono text-brand-400 font-semibold">{activeStep.ui}</code>
                          </div>
                          <p className="text-xs text-secondary leading-relaxed">
                            Simulated interaction preview for <strong>{activeStep.name}</strong>. Designed according to Stage 1 Design Tokens.
                          </p>
                        </div>

                        {/* Interactive UI Preview Widget */}
                        <div className="p-4 rounded-lg bg-surface border border-border-default shadow-xs space-y-3">
                          <div className="flex items-center justify-between text-xs pb-2 border-b border-border-subtle">
                            <span className="font-semibold text-primary">Live State Preview</span>
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                          </div>

                          {selectedFlowId === 'flow-a' && (
                            <div className="text-xs space-y-2">
                              <div className="h-14 rounded-lg border-2 border-dashed border-brand-500/40 bg-brand-500/5 flex flex-col items-center justify-center text-center p-2">
                                <FileText className="w-5 h-5 text-brand-400 mb-1" />
                                <span className="text-[11px] text-secondary font-medium">Enterprise_Knowledge_Q3.pdf (3.8 MB)</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-muted font-mono">
                                <span>Embedding Status</span>
                                <span className="text-emerald-400 font-semibold">1,536-dim vector generated</span>
                              </div>
                            </div>
                          )}

                          {selectedFlowId === 'flow-b' && (
                            <div className="text-xs space-y-2">
                              <div className="p-2.5 rounded-lg bg-surface-hover border border-border-subtle">
                                <span className="text-[11px] text-secondary font-medium">"Based on Section 4 of Q3 Report <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-1 rounded">[1]</span>, the RAG latency target is 180ms."</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-[11px] text-brand-400 font-mono">
                                <Sparkles className="w-3 h-3 text-purple-400" />
                                <span>Cosine Similarity: 0.94</span>
                              </div>
                            </div>
                          )}

                          {selectedFlowId === 'flow-c' && (
                            <div className="text-xs space-y-2">
                              <div className="flex items-center justify-between p-2 rounded bg-surface-hover text-[11px]">
                                <span className="font-semibold text-primary">engineering-admin@knowva.corp</span>
                                <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-mono">Editor Role</span>
                              </div>
                              <div className="text-[11px] text-muted">Permission Scopes: 14/16 active</div>
                            </div>
                          )}

                          {selectedFlowId === 'flow-d' && (
                            <div className="text-xs space-y-2">
                              <div className="flex items-center gap-2 p-2 rounded bg-surface-hover border border-brand-500/30">
                                <Search className="w-3.5 h-3.5 text-brand-400" />
                                <span className="font-mono text-[11px] text-primary">hybrid_query("RAG latency")</span>
                              </div>
                              <div className="text-[11px] text-emerald-400 font-mono">3 documents matched in 24ms</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 2: TAB 2 - COMPLETE SITEMAP EXPLORER */}
            {stage2Tab === 'sitemap' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">Three-Tier Platform Sitemap</h2>
                  <p className="text-sm text-secondary mt-1">
                    Structured hierarchy covering Public/Marketing, Auth/Onboarding, and Protected Multi-Tenant Core Application.
                  </p>
                </div>

                {/* Tier Selector */}
                <div className="flex flex-wrap gap-3">
                  {informationArchitecture.sitemap.tiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id)}
                      className={cn(
                        "px-4 py-2 rounded-xl border text-left transition-all duration-150 flex items-center gap-3",
                        selectedTierId === tier.id
                          ? "bg-surface border-brand-500 shadow-md ring-1 ring-brand-500 text-primary"
                          : "bg-surface/50 border-border-default text-secondary hover:bg-surface hover:text-primary"
                      )}
                    >
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        tier.id === 'marketing' ? "bg-sky-400" : tier.id === 'auth' ? "bg-amber-400" : "bg-purple-400"
                      )} />
                      <div>
                        <div className="text-xs font-bold">{tier.name}</div>
                        <div className="text-[10px] text-muted font-mono">{tier.access}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active Tier Routes Explorer */}
                {informationArchitecture.sitemap.tiers
                  .filter(tier => tier.id === selectedTierId)
                  .map(tier => (
                    <div key={tier.id} className="bg-surface rounded-xl border border-border-default shadow-sm p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border-subtle gap-2">
                        <div>
                          <h3 className="text-base font-bold text-primary">{tier.name}</h3>
                          <p className="text-xs text-secondary">{tier.description}</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-surface-hover border border-border-default text-brand-400 self-start sm:self-auto">
                          {tier.routes.length} Registered Routes
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {tier.routes.map((route) => (
                          <div 
                            key={route.path}
                            className="p-4 rounded-lg bg-surface-hover/60 border border-border-subtle hover:border-brand-500/40 hover:bg-surface-hover transition-all space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-xs font-bold text-brand-400">{route.path}</span>
                              <span className={cn(
                                "text-[10px] font-bold font-mono px-2 py-0.5 rounded",
                                route.priority === 'P0' ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              )}>
                                {route.priority}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-primary">{route.name}</h4>
                            <p className="text-xs text-secondary leading-relaxed">{route.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* STAGE 2: TAB 3 - MULTI-TENANT HIERARCHY */}
            {stage2Tab === 'hierarchy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">Multi-Tenant Data & Domain Hierarchy</h2>
                  <p className="text-sm text-secondary mt-1">
                    Inheritance taxonomy from Organization down to Token-level Vector Embeddings.
                  </p>
                </div>

                <div className="space-y-4">
                  {informationArchitecture.hierarchy.map((node, index) => {
                    const icons = [Building2, LayoutGrid, Folder, FileText, Cpu];
                    const NodeIcon = icons[index] || Box;
                    return (
                      <div 
                        key={node.level}
                        className="bg-surface rounded-xl border border-border-default p-5 shadow-sm hover:border-brand-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <div className="h-11 w-11 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0 mt-0.5">
                            <NodeIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-hover text-muted border border-border-subtle">
                                Level {node.level}
                              </span>
                              <h3 className="text-base font-bold text-primary">{node.name}</h3>
                              <span className="text-xs text-brand-400 font-medium font-mono">({node.scope})</span>
                            </div>
                            <p className="text-xs text-secondary leading-relaxed max-w-2xl">{node.desc}</p>
                            
                            {/* Key Schema Fields */}
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {node.fields.map(field => (
                                <span key={field} className="text-[11px] font-mono px-2 py-0.5 rounded bg-canvas border border-border-subtle text-secondary">
                                  {field}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="md:text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-border-subtle">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-0.5">Cardinality</span>
                          <span className="text-xs font-mono font-bold text-brand-400">{node.children}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STAGE 2: TAB 4 - NAVIGATION TAXONOMY */}
            {stage2Tab === 'taxonomy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">Navigation Taxonomy & Interaction Matrix</h2>
                  <p className="text-sm text-secondary mt-1">
                    Defines navigation tiers, responsive behaviors, dynamic breadcrumbs, and shortcut context menus.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Sidebar Spec */}
                  <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                      <h3 className="text-sm font-bold text-primary">Primary Sidebar Spec</h3>
                      <span className="text-xs font-mono text-brand-400">Desktop 260px / Collapsed 64px</span>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed">{informationArchitecture.taxonomy.sidebar.behavior}</p>

                    <div className="space-y-3 pt-1">
                      {informationArchitecture.taxonomy.sidebar.sections.map((sec) => (
                        <div key={sec.name} className="p-3 rounded-lg bg-surface-hover border border-border-subtle">
                          <h4 className="text-xs font-bold text-primary mb-1.5 font-mono">{sec.name}</h4>
                          <ul className="text-xs text-secondary space-y-1">
                            {sec.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-brand-400" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Navigation & Context Menus */}
                  <div className="space-y-6">
                    {/* Top Nav Rules */}
                    <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-3">
                      <h3 className="text-sm font-bold text-primary pb-2 border-b border-border-subtle">Top Navigation Rules</h3>
                      <div className="space-y-2">
                        {informationArchitecture.taxonomy.topNav.items.map((item) => (
                          <div key={item.name} className="p-2.5 rounded-lg bg-surface-hover text-xs flex flex-col gap-0.5">
                            <span className="font-semibold text-primary">{item.name}</span>
                            <span className="text-[11px] text-secondary font-mono">{item.rule}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Context Menus Hotkeys */}
                    <div className="bg-surface rounded-xl border border-border-default p-6 shadow-sm space-y-3">
                      <h3 className="text-sm font-bold text-primary pb-2 border-b border-border-subtle">Secondary Context Menu & Shortcuts</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {informationArchitecture.taxonomy.contextMenu.items.map((cm) => (
                          <div key={cm.action} className="p-2.5 rounded-lg bg-surface-hover border border-border-subtle flex items-center justify-between text-xs">
                            <span className={cn("font-medium", cm.destructive ? "text-rose-400" : "text-primary")}>
                              {cm.action}
                            </span>
                            <kbd className="px-1.5 py-0.5 rounded bg-canvas border border-border-default text-[10px] font-mono text-secondary">
                              {cm.shortcut}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 1 VIEWS (DESIGN TOKENS & FOUNDATIONS)                                */}
        {/* ========================================================================= */}
        {currentStage === 'stage1' && (
          <div className="space-y-10">
            {/* TAB 1: COLORS & WCAG */}
            {stage1Tab === 'colors' && (
              <div className="space-y-10">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">Color Palette & Semantic Tokens</h2>
                  <p className="text-sm text-secondary mt-1">
                    Precision-calibrated scales for Light and Dark modes with verified WCAG 2.1 AA/AAA contrast ratios.
                  </p>
                </div>

                {/* Brand Indigo Scale */}
                <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-primary">Primary Brand Scale (Electric Indigo / Sapphire AI)</h3>
                      <p className="text-xs text-secondary">Core interactive elements, primary CTAs, active selections</p>
                    </div>
                    <span className="text-xs font-mono text-muted">--color-brand-50 to 950</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
                    {Object.entries(tokens.colors.brand).map(([weight, val]) => (
                      <div
                        key={weight}
                        onClick={() => copyToClipboard(val.hex, `brand-${weight}`)}
                        className="group relative cursor-pointer rounded-lg p-3 flex flex-col items-center justify-between border border-border-subtle transition-all duration-150 hover:scale-105 hover:shadow-md"
                        style={{ backgroundColor: val.hex }}
                      >
                        <div className="h-10" />
                        <div className={cn(
                          "w-full pt-2 flex flex-col items-center text-center",
                          parseInt(weight) >= 500 ? "text-white" : "text-slate-900"
                        )}>
                          <span className="text-xs font-bold font-mono">{weight}</span>
                          <span className="text-[10px] opacity-80 uppercase font-mono">{val.hex}</span>
                        </div>
                        {copiedToken === `brand-${weight}` && (
                          <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                            Copied!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Neutral Slate Scale */}
                <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-primary">Neutral Surface & Text Scale (Slate)</h3>
                      <p className="text-xs text-secondary">Canvas backgrounds, surfaces, borders, and text hierarchy</p>
                    </div>
                    <span className="text-xs font-mono text-muted">--color-neutral-50 to 950</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
                    {Object.entries(tokens.colors.neutral).map(([weight, val]) => (
                      <div
                        key={weight}
                        onClick={() => copyToClipboard(val.hex, `neutral-${weight}`)}
                        className="group relative cursor-pointer rounded-lg p-3 flex flex-col items-center justify-between border border-border-default transition-all duration-150 hover:scale-105 hover:shadow-md"
                        style={{ backgroundColor: val.hex }}
                      >
                        <div className="h-10" />
                        <div className={cn(
                          "w-full pt-2 flex flex-col items-center text-center",
                          parseInt(weight) >= 600 ? "text-white" : "text-slate-900"
                        )}>
                          <span className="text-xs font-bold font-mono">{weight}</span>
                          <span className="text-[10px] opacity-80 uppercase font-mono">{val.hex}</span>
                        </div>
                        {copiedToken === `neutral-${weight}` && (
                          <div className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                            Copied!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Semantic Feedback States & AI Accents */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Feedback States */}
                  <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm space-y-4">
                    <h3 className="text-base font-semibold text-primary">Semantic Feedback Colors</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-500">Success</h4>
                          <p className="text-xs text-secondary mt-0.5">Embeddings complete, document indexed</p>
                          <span className="text-[11px] font-mono text-muted">#10B981</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-amber-500">Warning</h4>
                          <p className="text-xs text-secondary mt-0.5">Storage limit at 85%, pending invites</p>
                          <span className="text-[11px] font-mono text-muted">#F59E0B</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-rose-500/30 bg-rose-500/10 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-rose-500">Error</h4>
                          <p className="text-xs text-secondary mt-0.5">Parsing failed, invalid API token</p>
                          <span className="text-[11px] font-mono text-muted">#EF4444</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-sky-500/30 bg-sky-500/10 flex items-start gap-3">
                        <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-sky-500">Info</h4>
                          <p className="text-xs text-secondary mt-0.5">Syncing workspace, version update</p>
                          <span className="text-[11px] font-mono text-muted">#0EA5E9</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI & Intelligence Accents */}
                  <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h3 className="text-base font-semibold text-primary">AI & Intelligence Accents</h3>
                    </div>
                    <div className="p-4 rounded-xl ai-border-glow ai-glass flex flex-col justify-between space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">RAG Sparkle Gradient</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">135deg gradient</span>
                      </div>
                      <p className="text-sm font-medium text-primary">
                        Linear & Notion-grade subtle glowing aura used for AI streaming responses, prompt suggestion chips, and citation badges.
                      </p>
                      <div className="h-2 w-full rounded-full bg-gradient-to-r from-brand-500 via-purple-500 to-pink-500" />
                    </div>
                  </div>
                </div>

                {/* WCAG 2.1 Contrast Matrix */}
                <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm">
                  <h3 className="text-base font-semibold text-primary mb-1">WCAG 2.1 AA/AAA Contrast Verification</h3>
                  <p className="text-xs text-secondary mb-4">Strict adherence ensures legibility across all enterprise lighting environments.</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border-default text-xs uppercase tracking-wider text-muted">
                          <th className="py-2.5 px-4">UI Pair Element</th>
                          <th className="py-2.5 px-4">Foreground</th>
                          <th className="py-2.5 px-4">Background</th>
                          <th className="py-2.5 px-4">Contrast Ratio</th>
                          <th className="py-2.5 px-4">Compliance Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {tokens.colors.contrast.map((item, idx) => (
                          <tr key={idx} className="hover:bg-surface-hover/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-primary">{item.element}</td>
                            <td className="py-3 px-4 font-mono text-xs">{item.foreground}</td>
                            <td className="py-3 px-4 font-mono text-xs">{item.background}</td>
                            <td className="py-3 px-4 font-mono font-bold text-brand-400">{item.ratio}</td>
                            <td className="py-3 px-4">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-xs font-bold font-mono",
                                item.rating === 'AAA' ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30" : "bg-blue-500/15 text-blue-500 border border-blue-500/30"
                              )}>
                                WCAG {item.rating}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TYPOGRAPHY SYSTEM */}
            {stage1Tab === 'typography' && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-primary">Typography System</h2>
                    <p className="text-sm text-secondary mt-1">
                      Paired fonts: <span className="font-semibold text-primary">Inter</span> & <span className="font-semibold text-primary font-mono">JetBrains Mono</span>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 max-w-md w-full">
                    <span className="text-xs text-muted whitespace-nowrap">Preview text:</span>
                    <input
                      type="text"
                      value={sampleText}
                      onChange={(e) => setSampleText(e.target.value)}
                      className="w-full text-xs px-3 py-1.5 rounded-lg border border-border-default bg-surface text-primary focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {Object.entries(tokens.typography.scale).map(([name, spec]) => (
                    <div key={name} className="bg-surface rounded-xl p-5 border border-border-default shadow-sm hover:border-brand-500/30 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-border-subtle gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-400 font-mono">{name}</span>
                          <span className="text-xs text-muted">({spec.usage})</span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-secondary">
                          <span className="px-2 py-0.5 rounded bg-surface-hover border border-border-subtle">Size: {spec.fontSize}</span>
                          <span className="px-2 py-0.5 rounded bg-surface-hover border border-border-subtle">Line-height: {spec.lineHeight}</span>
                          <span className="px-2 py-0.5 rounded bg-surface-hover border border-border-subtle">Weight: {spec.fontWeight}</span>
                          <span className="px-2 py-0.5 rounded bg-surface-hover border border-border-subtle">Tracking: {spec.letterSpacing}</span>
                        </div>
                      </div>
                      
                      <div 
                        style={{
                          fontSize: spec.fontSize,
                          lineHeight: spec.lineHeight,
                          fontWeight: spec.fontWeight,
                          letterSpacing: spec.letterSpacing,
                          fontFamily: spec.fontFamily || tokens.typography.fonts.sans,
                        }}
                        className="text-primary truncate"
                      >
                        {sampleText}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: SPACING */}
            {stage1Tab === 'spacing' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">8-Point Spacing Grid & Breakpoints</h2>
                  <p className="text-sm text-secondary mt-1">Rigid 8-point modular grid ensuring consistent visual rhythm.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm space-y-4">
                    <h3 className="text-base font-semibold text-primary">Spacing Scale Hierarchy</h3>
                    <div className="space-y-3">
                      {tokens.spacing.map((s) => (
                        <div key={s.token} className="flex items-center gap-4 text-xs">
                          <div className="w-20 font-mono font-medium text-brand-400">{s.token}</div>
                          <div className="w-14 font-mono text-muted">{s.px}</div>
                          <div className="flex-1 bg-surface-hover rounded h-5 flex items-center px-1">
                            <div className="h-3 rounded bg-brand-500" style={{ width: s.px }} />
                          </div>
                          <div className="w-44 text-secondary text-[11px] truncate hidden sm:block">{s.usage}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm space-y-4">
                    <h3 className="text-base font-semibold text-primary">Responsive Breakpoint Targets</h3>
                    <div className="space-y-3">
                      {tokens.breakpoints.map((bp) => (
                        <div key={bp.name} className="p-3.5 rounded-lg bg-surface-hover border border-border-subtle">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-primary">{bp.name}</span>
                            <span className="text-xs font-mono font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">{bp.range}</span>
                          </div>
                          <p className="text-xs text-secondary mt-1.5">{bp.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ELEVATION */}
            {stage1Tab === 'elevation' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">Elevation, Radii & Soft Shadows</h2>
                  <p className="text-sm text-secondary mt-1">Multi-layered depth tokens for Light and Dark modes.</p>
                </div>

                <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm">
                  <h3 className="text-base font-semibold text-primary mb-4">Border Radius Scale</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {tokens.radii.map((r) => (
                      <div key={r.token} className="flex flex-col items-center text-center p-3 rounded-lg border border-border-subtle bg-surface-hover">
                        <div 
                          className="w-14 h-14 bg-brand-500/20 border-2 border-brand-500 flex items-center justify-center font-mono text-xs font-bold text-brand-400 mb-2"
                          style={{ borderRadius: r.px }}
                        >
                          {r.px}
                        </div>
                        <span className="text-xs font-mono font-semibold text-primary">{r.token}</span>
                        <span className="text-[11px] text-muted mt-0.5">{r.usage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MOTION */}
            {stage1Tab === 'motion' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-primary">Motion Guidelines & Micro-interactions</h2>
                  <p className="text-sm text-secondary mt-1">Snappy, calibrated easing curves and physics.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm space-y-4">
                    <h3 className="text-base font-semibold text-primary">Easing Curves & Durations</h3>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-surface-hover border border-border-subtle">
                        <span className="text-xs font-bold text-primary font-mono">ease-out-quad (250ms)</span>
                        <p className="text-xs text-secondary mt-0.5">Modals, Command-K spotlight display</p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-hover border border-border-subtle">
                        <span className="text-xs font-bold text-primary font-mono">spring-gentle (150ms)</span>
                        <p className="text-xs text-secondary mt-0.5">Button micro-bounces, tag clicks</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface rounded-xl p-6 border border-border-default shadow-sm space-y-4">
                    <h3 className="text-base font-semibold text-primary">Sandbox</h3>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full py-2.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
                    >
                      Open Sample Modal
                    </button>
                  </div>
                </div>

                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-xs">
                    <div className="bg-surface border border-border-default rounded-xl p-6 max-w-md w-full shadow-xl">
                      <h4 className="text-base font-bold text-primary mb-2">Modal Motion Test</h4>
                      <p className="text-xs text-secondary mb-4">Demonstrating ease-out-quad 250ms.</p>
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

            {/* TAB 6: TOKEN CHEAT SHEET */}
            {stage1Tab === 'tokens' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-primary">CSS Variable & Tailwind Cheat Sheet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface rounded-xl p-5 border border-border-default">
                    <pre className="p-4 rounded-lg bg-canvas text-secondary font-mono text-xs overflow-x-auto">
{`--bg-canvas          /* Root background */
--bg-surface         /* Cards & dialogs */
--bg-surface-hover   /* Row/item hover */
--border-default     /* Input/card borders */`}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
    </ToastProvider>
  );
}