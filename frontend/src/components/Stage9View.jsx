import React, { useState } from 'react';
import { 
  Search, Sliders, Database, ShieldCheck, 
  Cpu, Terminal, Command, Layers, Sparkles,
  ExternalLink, Zap, CheckCircle2, ArrowRight
} from 'lucide-react';
import { SemanticSearchPage } from './search/SemanticSearchPage';
import { GlobalSearchModal } from './search/GlobalSearchModal';
import { searchSpecs } from '../design-system/searchSpecs';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { cn } from '../lib/utils';

export const Stage9View = ({ onNavigateToChat, onNavigateToDocs }) => {
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'palette' | 'specs'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const subTabs = [
    { id: 'search', label: '1. Live Search Workbench', icon: Search },
    { id: 'palette', label: '2. ⌘K Spotlight Overlay', icon: Command },
    { id: 'specs', label: '3. Hybrid RRF & Vector Specs', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border-default">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {subTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap cursor-pointer",
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

        <div className="flex items-center gap-2">
          <Badge variant="brand" dot>Stage 9: Global & Semantic Search</Badge>
        </div>
      </div>

      {/* Tab 1: Live Search Workbench */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <SemanticSearchPage
            onNavigateToChat={onNavigateToChat}
            onNavigateToDocs={onNavigateToDocs}
          />
        </div>
      )}

      {/* Tab 2: ⌘K Spotlight Overlay Demo */}
      {activeTab === 'palette' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Command className="w-5 h-5 text-brand-400" />
                    Global ⌘K Spotlight Palette Testbed
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-surface-elevated border border-border-default font-mono">⌘K</kbd> anywhere or trigger the interactive overlay below.
                  </CardDescription>
                </div>
                <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                  <Search className="w-3.5 h-3.5 mr-1.5" />
                  Open ⌘K Palette
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-canvas border border-border-subtle space-y-2">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    Instant Hotkey Bindings
                  </div>
                  <p className="text-[11px] text-secondary">
                    Supports <kbd className="px-1 font-mono text-[10px] bg-surface rounded">⌘K</kbd> / <kbd className="px-1 font-mono text-[10px] bg-surface rounded">Ctrl+K</kbd>, arrow key navigation, enter selection, and escape dismissal.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-border-subtle space-y-2">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                    <Layers className="w-4 h-4 text-sky-400" />
                    Multi-Entity Query Routing
                  </div>
                  <p className="text-[11px] text-secondary">
                    Retrieves across vector chunk content, conversational AI threads, and quick operational workspace commands simultaneously.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-canvas border border-border-subtle space-y-2">
                  <div className="flex items-center gap-2 text-primary font-semibold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Workbench Seamless Handoff
                  </div>
                  <p className="text-[11px] text-secondary">
                    Forwards in-flight search queries into the full 3-column faceted search workbench with a single keystroke.
                  </p>
                </div>
              </div>

              {/* Quick Actions List */}
              <div className="border-t border-border-subtle pt-4 space-y-2">
                <h4 className="text-xs font-semibold text-primary">Pre-Registered Workspace Quick Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {searchSpecs.quickActions.map(action => (
                    <div key={action.id} className="flex items-center justify-between p-2.5 rounded-lg bg-surface border border-border-default text-xs">
                      <span className="text-secondary">{action.label}</span>
                      <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-primary border border-border-default">
                        {action.shortcut}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <GlobalSearchModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelectResult={(item) => {
              setActiveTab('search');
            }}
            onOpenFullSearch={(query) => {
              setActiveTab('search');
            }}
            onNavigate={(path) => {
              if (path === 'chat') onNavigateToChat?.();
              if (path === 'docs') onNavigateToDocs?.();
            }}
          />
        </div>
      )}

      {/* Tab 3: Hybrid RRF & Vector Architecture */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5 text-brand-400" />
                Dual-Index Retrieval & Reciprocal Rank Fusion Architecture
              </CardTitle>
              <CardDescription className="text-xs">
                Mathematical formulations, embedding models, and multi-tenant isolation guarantees.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Formula & Algorithm Card */}
              <div className="p-4 rounded-xl bg-canvas border border-border-subtle space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-secondary">
                  <span className="font-semibold text-primary">Reciprocal Rank Fusion (RRF) Formulation</span>
                  <Badge variant="outline" className="text-[10px]">Smoothing constant k = 60</Badge>
                </div>
                <div className="p-3 bg-surface rounded-lg border border-border-default text-brand-400 font-bold overflow-x-auto">
                  RRF_Score(d) = Σ [ 1 / (k + Rank_BM25(d)) ] + Σ [ 1 / (k + Rank_Dense(d)) ]
                </div>
                <p className="text-[11px] text-secondary font-sans leading-relaxed">
                  Hybrid search combines sparse lexical BM25 token frequencies with dense 1,536-dimensional OpenAI text-embedding-3-large vectors. By applying Reciprocal Rank Fusion with <span className="font-mono text-primary">k=60</span>, rank discrepancies between keyword exactness and semantic conceptual matching are normalized without requiring manual weight fine-tuning.
                </p>
              </div>

              {/* Multi-Stage Pipeline */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-surface border border-border-default space-y-2">
                  <div className="text-xs font-bold text-primary flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-mono">1</span>
                    Dual-Index Generation
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Documents are parsed into 512-token chunks with 10% overlap. Tokens populate an inverted BM25 index while OpenAI embeds normalized L2 unit vectors into Qdrant.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border-default space-y-2">
                  <div className="text-xs font-bold text-primary flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-mono">2</span>
                    Candidate Retrieval
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Top-50 candidates from BM25 and top-50 candidates from HNSW vector index are retrieved in parallel under 45ms.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface border border-border-default space-y-2">
                  <div className="text-xs font-bold text-primary flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-[10px] font-mono">3</span>
                    Cohere Rerank v3
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    Fused top-20 candidates are passed through Cohere Rerank cross-encoder model to yield the final top-5 context injection window for generative LLM inference.
                  </p>
                </div>
              </div>

              {/* Supported Modes Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-primary">Supported Engine Search Modes</h4>
                <div className="space-y-2">
                  {searchSpecs.modes.map(mode => (
                    <div key={mode.id} className="p-3 rounded-xl bg-surface border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">{mode.name}</span>
                          <Badge variant="outline" className="text-[10px]">{mode.badge}</Badge>
                        </div>
                        <p className="text-[11px] text-secondary">{mode.description}</p>
                      </div>
                      <span className="text-[11px] font-mono text-brand-400 shrink-0">mode="{mode.id}"</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
