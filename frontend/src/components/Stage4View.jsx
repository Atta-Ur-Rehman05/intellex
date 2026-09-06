import React, { useState } from 'react';
import { 
  Layout, Monitor, Tablet, Smartphone, Search, 
  Sparkles, HardDrive, FileText, Settings, Users, 
  ArrowRight, ShieldCheck, Command, Check, 
  HelpCircle, ChevronRight, Activity, Plus, Send,
  UploadCloud, ExternalLink, CornerDownLeft
} from 'lucide-react';
import { AppShell } from './shell/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Avatar } from './ui/Avatar';
import { shellSpecs } from '../design-system/shellSpecs';
import { cn } from '../lib/utils';

export const Stage4View = ({ theme = 'dark', onToggleTheme }) => {
  const [activeTab, setActiveTab] = useState('playground'); // 'playground' | 'responsive' | 'specs'
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [viewportMode, setViewportMode] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'user',
      text: 'What are the SOC2 compliance requirements for our vector database embeddings?'
    },
    {
      sender: 'ai',
      text: 'According to Section 4.2 of your indexed SOC2 Type II audit documentation, all vector embeddings are isolated per enterprise tenant with 256-bit encryption at rest [1]. Furthermore, no customer prompts or generated vectors are retained for third-party foundation model training [2].',
      sources: [
        { id: 1, title: 'SOC2_TypeII_Audit.pdf', page: 'p. 14' },
        { id: 2, title: 'Architecture_2026.pdf', page: 'p. 28' }
      ]
    }
  ]);

  const subTabs = [
    { id: 'playground', label: '1. Live App Shell Playground', icon: Layout },
    { id: 'responsive', label: '2. Responsive Breakpoint Simulator', icon: Monitor },
    { id: 'specs', label: '3. Shell Geometry & Hotkeys', icon: Command },
  ];

  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'ai',
        text: `Synthesizing neural response for: "${userText}" across 48 vector chunks. Verified zero data retention active.`,
        sources: [{ id: 1, title: 'Architecture_2026.pdf', page: 'Chunk #4' }]
      }
    ]);
  };

  // Render mock internal page content based on currentRoute
  const renderInternalPage = () => {
    if (currentRoute === 'dashboard') {
      return (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">Workspace Dashboard</h1>
                <Badge variant="brand" dot>Enterprise Plan</Badge>
              </div>
              <p className="text-xs text-secondary mt-1">
                Unified knowledge management combining Notion docs, ChatGPT intelligence, and Google Drive files.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" leftIcon={<UploadCloud className="w-3.5 h-3.5 text-brand-400" />}>
                Upload Document
              </Button>
              <Button variant="ai" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => setCurrentRoute('chat')}>
                New AI Thread
              </Button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Ingested Docs', val: '48 files', icon: FileText, change: '+12% this week', color: 'text-brand-400' },
              { label: 'Storage Used', val: '8.4 GB', icon: HardDrive, change: '8.4% of 100 GB', color: 'text-indigo-400' },
              { label: 'Active AI Threads', val: '12 sessions', icon: Sparkles, change: 'Sub-120ms latency', color: 'text-purple-400' },
              { label: 'Collaborators', val: '42 members', icon: Users, change: 'SOC2 RBAC active', color: 'text-emerald-400' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-4 rounded-xl bg-surface border border-border-default shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-secondary font-medium">{stat.label}</span>
                    <Icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-primary">{stat.val}</div>
                  <div className="text-[10px] font-mono text-muted">{stat.change}</div>
                </div>
              );
            })}
          </div>

          {/* Recent Knowledge Artifacts */}
          <div className="bg-surface rounded-xl border border-border-default p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-primary">Recent Knowledge Documents</h2>
              <button 
                onClick={() => setCurrentRoute('docs')}
                className="text-xs text-brand-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All 48</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-border-subtle text-xs">
              {[
                { title: 'Architecture_2026.pdf', folder: 'Engineering Specs', size: '4.2 MB', status: 'Indexed (48 chunks)', updated: '10m ago' },
                { title: 'RAG_Pipeline.md', folder: 'Engineering Specs', size: '128 KB', status: 'Indexed (12 chunks)', updated: '2h ago' },
                { title: 'SOC2_TypeII_Audit.pdf', folder: 'Security & Compliance', size: '1.8 MB', status: 'Indexed (24 chunks)', updated: 'Yesterday' },
              ].map((doc, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between hover:bg-surface-hover/50 px-2 rounded-lg transition-colors cursor-pointer" onClick={() => setCurrentRoute('docs')}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-surface-hover text-brand-400 border border-border-subtle">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-primary block">{doc.title}</span>
                      <span className="text-[10px] text-muted font-mono">{doc.folder} • {doc.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" dot size="sm">{doc.status}</Badge>
                    <span className="text-[10px] font-mono text-muted hidden sm:inline">{doc.updated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentRoute === 'chat') {
      return (
        <div className="h-full flex flex-col justify-between space-y-4 max-w-4xl mx-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                <h2 className="text-base font-bold text-primary">Knowva AI Neural Knowledge Assistant</h2>
              </div>
              <p className="text-xs text-secondary mt-0.5">
                Grounded strictly in your workspace vector embeddings with zero third-party data retention.
              </p>
            </div>
            <Badge variant="ai">Model: Neural-RAG-v4</Badge>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[90%] shadow-xs",
                  msg.sender === 'user'
                    ? "ml-auto bg-brand-600 text-white rounded-br-xs"
                    : "bg-surface border border-border-default text-primary rounded-bl-xs space-y-3"
                )}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Knowva Synthesized Answer</span>
                  </div>
                )}
                <p>{msg.text}</p>

                {msg.sources && (
                  <div className="pt-2 border-t border-border-subtle flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted font-bold">
                      Sources Cited:
                    </span>
                    {msg.sources.map(src => (
                      <span
                        key={src.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/25 font-mono text-[11px] font-medium cursor-pointer hover:bg-purple-500/20"
                      >
                        <span>[{src.id}] {src.title}</span>
                        <span className="text-muted">({src.page})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleSendChat} className="relative flex items-center">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask anything about your workspace documents (e.g. SOC2, Architecture)..."
              className="w-full h-12 pl-4 pr-24 bg-surface text-primary placeholder:text-muted rounded-xl border border-border-default hover:border-border-strong focus:border-brand-500 focus:ring-2 focus:ring-brand-500 outline-none text-xs sm:text-sm shadow-sm"
            />
            <button
              type="submit"
              disabled={!chatMessage.trim()}
              className="absolute right-2 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      );
    }

    if (currentRoute === 'docs') {
      return (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-primary">Document Explorer</h2>
              <p className="text-xs text-secondary mt-1">
                Browse hierarchical knowledge collections, inspect vector chunks, and start AI chats.
              </p>
            </div>
            <Button variant="primary" size="sm" leftIcon={<UploadCloud className="w-3.5 h-3.5" />}>
              Upload New Document
            </Button>
          </div>

          {/* Document Preview Card */}
          <div className="p-6 rounded-2xl bg-surface border border-purple-500/30 shadow-lg shadow-purple-500/5 space-y-4 ai-border-glow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Architecture_2026.pdf</h3>
                  <p className="text-xs text-secondary">Collection: Engineering Specs • 4.2 MB • Updated 10m ago</p>
                </div>
              </div>
              <Badge variant="ai">48 Vector Chunks Indexed</Badge>
            </div>

            <p className="text-xs text-secondary leading-relaxed bg-surface-hover p-4 rounded-xl border border-border-subtle">
              &ldquo;The Knowva platform incorporates a multi-tenant vector retrieval engine. Each document is chunked with 64-token overlap to guarantee context continuity during RAG synthesis...&rdquo;
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted font-mono">SOC2 Compliant • Tenant Isolated</span>
              <Button variant="ai" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5" />} onClick={() => setCurrentRoute('chat')}>
                Start AI Chat with this Doc
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentRoute === 'settings') {
      return (
        <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Workspace Administration</h2>
            <p className="text-xs text-secondary mt-1">Configure data residency, RBAC access controls, and organization settings.</p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-primary pb-2 border-b border-border-subtle">General Properties</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-muted block mb-1 font-semibold">Workspace Name</label>
                <div className="p-2.5 rounded-lg bg-surface-hover border border-border-subtle font-semibold text-primary">
                  Acme Enterprise
                </div>
              </div>
              <div>
                <label className="text-muted block mb-1 font-semibold">Subdomain Slug</label>
                <div className="p-2.5 rounded-lg bg-surface-hover border border-border-subtle font-mono text-primary">
                  acme-corp.knowva.ai
                </div>
              </div>
              <div>
                <label className="text-muted block mb-1 font-semibold">Primary Vector Region</label>
                <div className="p-2.5 rounded-lg bg-surface-hover border border-border-subtle text-primary">
                  US East (N. Virginia) - Low Latency
                </div>
              </div>
              <div>
                <label className="text-muted block mb-1 font-semibold">Compliance Status</label>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  SOC2 Type II & HIPAA Verified
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border-default pb-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
      {/* TAB 1: LIVE APP SHELL PLAYGROUND                                          */}
      {/* ========================================================================= */}
      {activeTab === 'playground' && (
        <div className="space-y-6">
          {/* Controls Bar Above Playground */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border-default shadow-xs">
            <div>
              <h2 className="text-base font-bold text-primary">Interactive Application Shell Simulator</h2>
              <p className="text-xs text-secondary mt-0.5">
                Interact with the live sidebar (expand/collapse), top navigation, dynamic breadcrumbs, command palette (`⌘K`), and notifications.
              </p>
            </div>

            {/* Viewport Width Controls */}
            <div className="flex items-center gap-2 bg-surface-hover p-1 rounded-xl border border-border-subtle text-xs">
              <button
                onClick={() => setViewportMode('desktop')}
                className={cn(
                  "px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer",
                  viewportMode === 'desktop' ? "bg-surface text-primary shadow-xs font-semibold" : "text-secondary hover:text-primary"
                )}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewportMode('tablet')}
                className={cn(
                  "px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer",
                  viewportMode === 'tablet' ? "bg-surface text-primary shadow-xs font-semibold" : "text-secondary hover:text-primary"
                )}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tablet (820px)</span>
              </button>
              <button
                onClick={() => setViewportMode('mobile')}
                className={cn(
                  "px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer",
                  viewportMode === 'mobile' ? "bg-surface text-primary shadow-xs font-semibold" : "text-secondary hover:text-primary"
                )}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile (390px)</span>
              </button>
            </div>
          </div>

          {/* Embedded App Shell Container */}
          <div className="w-full flex justify-center bg-canvas/60 p-2 sm:p-4 rounded-2xl border border-dashed border-border-strong overflow-hidden">
            <div
              className={cn(
                "h-[720px] rounded-2xl border border-border-default shadow-2xl overflow-hidden transition-all duration-300 bg-canvas relative",
                viewportMode === 'desktop' && "w-full",
                viewportMode === 'tablet' && "w-[820px] max-w-full",
                viewportMode === 'mobile' && "w-[390px] max-w-full"
              )}
            >
              <AppShell
                currentRoute={currentRoute}
                onRouteChange={setCurrentRoute}
                theme={theme}
                onToggleTheme={onToggleTheme}
              >
                {renderInternalPage()}
              </AppShell>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: RESPONSIVE BREAKPOINT SIMULATOR                                    */}
      {/* ========================================================================= */}
      {activeTab === 'responsive' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Responsive Layout Specifications</h2>
            <p className="text-sm text-secondary mt-1">
              Detailed behavior across Desktop, Tablet, and Mobile viewports adhering to the Knowva responsive grid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shellSpecs.breakpoints.map((bp, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <h3 className="text-base font-bold text-primary">{bp.viewport}</h3>
                  <Badge variant="brand">{idx === 0 ? "Default" : idx === 1 ? "Auto-collapse" : "Off-canvas"}</Badge>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-primary block mb-0.5">Sidebar Mode:</span>
                    <p className="text-secondary leading-relaxed">{bp.sidebarMode}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary block mb-0.5">Top Navigation:</span>
                    <p className="text-secondary leading-relaxed">{bp.topNavMode}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-primary block mb-0.5">Command Palette:</span>
                    <p className="text-secondary leading-relaxed">{bp.commandPalette}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SHELL GEOMETRY & HOTKEYS                                           */}
      {/* ========================================================================= */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-primary">Shell Geometry & Keyboard Shortcuts</h2>
            <p className="text-sm text-secondary mt-1">
              Exact dimensions, z-index layering hierarchy, keyboard hotkeys, and accessible ARIA landmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keyboard Shortcuts */}
            <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <Command className="w-4 h-4 text-brand-400" />
                  <h3 className="text-base font-bold text-primary">Global Keyboard Shortcuts</h3>
                </div>
                <Badge variant="brand">Productivity</Badge>
              </div>

              <div className="divide-y divide-border-subtle text-xs">
                {shellSpecs.keyboardShortcuts.map((hk, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-primary block">{hk.description}</span>
                      <span className="text-[10px] text-muted font-mono">{hk.scope}</span>
                    </div>
                    <kbd className="px-2 py-1 rounded bg-surface-hover border border-border-default font-mono text-[11px] font-semibold text-brand-400">
                      {hk.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            {/* Geometry & ARIA Landmarks */}
            <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-base font-bold text-primary">ARIA Landmarks & Hierarchy</h3>
                </div>
                <Badge variant="success">WCAG AA+</Badge>
              </div>

              <div className="divide-y divide-border-subtle text-xs">
                {shellSpecs.ariaLandmarks.map((lm, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-primary block">{lm.element}</span>
                      <span className="text-[11px] text-secondary">{lm.label}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-surface-hover text-brand-400 border border-border-subtle">
                      role=&quot;{lm.role}&quot;
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
