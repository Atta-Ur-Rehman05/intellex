import React, { useState } from 'react';
import { 
  Sparkles, MessageSquare, Database, ShieldCheck, 
  Cpu, Terminal, BookOpen, Layers 
} from 'lucide-react';
import { ChatPage } from './chat/ChatPage';
import { chatSpecs } from '../design-system/chatSpecs';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export const Stage8View = ({ onNavigateToDocs }) => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'models' | 'specs'

  const subTabs = [
    { id: 'chat', label: '1. Live AI Chat & RAG', icon: MessageSquare },
    { id: 'models', label: '2. Foundation Models & Latency', icon: Cpu },
    { id: 'specs', label: '3. Zero-Retention & RAG Specs', icon: ShieldCheck },
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
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 whitespace-nowrap",
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
          <Badge variant="brand" dot>Stage 8: AI Chat & RAG</Badge>
        </div>
      </div>

      {/* Tab 1: Live Chat */}
      {activeTab === 'chat' && (
        <div className="h-[640px]">
          <ChatPage onNavigateToDocs={onNavigateToDocs} />
        </div>
      )}

      {/* Tab 2: Foundation Models */}
      {activeTab === 'models' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chatSpecs.models.map((m) => (
            <div key={m.id} className="p-5 rounded-2xl bg-surface border border-border-default shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-primary">{m.name}</h4>
                  <span className="text-xs text-muted font-mono">{m.provider}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {m.badge}
                </span>
              </div>
              <p className="text-xs text-secondary leading-relaxed">{m.description}</p>
              <div className="text-[11px] font-mono text-emerald-400 pt-2 border-t border-border-subtle">
                Context Window: {m.contextWindow}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Specs */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
            <h3 className="text-base font-bold text-primary">Zero Customer Data Retention Policy</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Knowva communicates with foundation models through enterprise zero-data-retention APIs. No prompt, generated completion, or vector embedding is stored by the model provider or used for model training.
            </p>
            <div className="p-3 rounded-xl bg-canvas border border-border-subtle text-xs text-emerald-400 font-mono">
              ✓ SOC2 Type II Certified | ISO 27001 | GDPR Title 5 Compliant
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
            <h3 className="text-base font-bold text-primary">Citation & Similarity Verification</h3>
            <p className="text-xs text-secondary leading-relaxed">
              Every factual assertion synthesized by the assistant is grounded in verifiable vector database chunks. Citations are tagged with exact character offsets and page indices to prevent hallucination.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
