import React, { useState } from 'react';
import { 
  GitBranch, Map, Layers, Compass, ChevronRight, 
  ChevronLeft, CheckCircle, Search, FileText, 
  Sparkles, Building2, LayoutGrid, Folder, Cpu, Box 
} from 'lucide-react';
import { informationArchitecture } from '../design-system/informationArchitecture';
import { cn } from '../lib/utils';

export const Stage2View = () => {
  const [stage2Tab, setStage2Tab] = useState('flows');
  const [selectedFlowId, setSelectedFlowId] = useState('flow-a');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState('core');

  const stage2Tabs = [
    { id: 'flows', label: '1. Critical User Journeys', icon: GitBranch },
    { id: 'sitemap', label: '2. Complete 3-Tier Sitemap', icon: Map },
    { id: 'hierarchy', label: '3. Multi-Tenant Hierarchy', icon: Layers },
    { id: 'taxonomy', label: '4. Navigation Taxonomy', icon: Compass },
  ];

  const currentFlow = informationArchitecture.flows.find(f => f.id === selectedFlowId) || informationArchitecture.flows[0];
  const activeStep = currentFlow.steps[activeStepIndex] || currentFlow.steps[0];

  return (
    <div className="space-y-8">
      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-border-default pb-2 overflow-x-auto no-scrollbar">
        {stage2Tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = stage2Tab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStage2Tab(tab.id)}
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

      {/* Journeys */}
      {stage2Tab === 'flows' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Critical User Journey Flows & Simulation</h2>
            <p className="text-xs text-secondary mt-1">End-to-end user paths detailing logic and system touchpoints.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                      ? "bg-surface border-brand-500 shadow-md ring-1 ring-brand-500"
                      : "bg-surface/60 border-border-default hover:bg-surface hover:border-border-strong"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-brand-500/20 text-brand-400">
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

          {/* Stepper details */}
          <div className="bg-surface rounded-xl border border-border-default p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <h4 className="text-sm font-bold text-primary">{currentFlow.title}</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  disabled={activeStepIndex === 0}
                  className="px-2.5 py-1 rounded bg-surface-hover text-xs disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  onClick={() => setActiveStepIndex(Math.min(currentFlow.steps.length - 1, activeStepIndex + 1))}
                  disabled={activeStepIndex === currentFlow.steps.length - 1}
                  className="px-2.5 py-1 rounded bg-brand-600 text-white text-xs disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-canvas border border-border-subtle text-xs space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-brand-400 font-semibold">Step 0{activeStepIndex + 1}: {activeStep.name}</span>
                <span className="text-muted">Actor: {activeStep.actor}</span>
              </div>
              <p className="text-secondary">{activeStep.action}</p>
              <div className="p-2.5 rounded bg-surface border border-border-subtle text-muted">
                <strong>Decision Node:</strong> {activeStep.decision}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sitemap */}
      {stage2Tab === 'sitemap' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-primary">Three-Tier Platform Sitemap</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {informationArchitecture.sitemap.tiers.map((tier) => (
              <div key={tier.id} className="p-4 rounded-xl bg-surface border border-border-default space-y-3">
                <h3 className="text-sm font-bold text-primary">{tier.name}</h3>
                <p className="text-xs text-secondary">{tier.description}</p>
                <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                  {tier.routes.map((r) => (
                    <div key={r.path} className="p-2 rounded bg-canvas text-xs flex items-center justify-between">
                      <span className="font-mono text-brand-400">{r.path}</span>
                      <span className="text-[10px] text-muted">{r.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hierarchy */}
      {stage2Tab === 'hierarchy' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary">Multi-Tenant Data Hierarchy</h2>
          {informationArchitecture.hierarchy.map((node) => (
            <div key={node.level} className="p-4 rounded-xl bg-surface border border-border-default flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-brand-400">Level {node.level}</span>
                <h4 className="text-sm font-bold text-primary">{node.name}</h4>
                <p className="text-xs text-secondary mt-0.5">{node.desc}</p>
              </div>
              <span className="text-xs font-mono font-bold text-muted">{node.children}</span>
            </div>
          ))}
        </div>
      )}

      {/* Taxonomy */}
      {stage2Tab === 'taxonomy' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-primary">Navigation Taxonomy</h2>
          <div className="p-5 rounded-xl bg-surface border border-border-default space-y-2">
            <h4 className="text-sm font-bold text-primary">Sidebar Navigation Hierarchy</h4>
            <p className="text-xs text-secondary">{informationArchitecture.taxonomy.sidebar.behavior}</p>
          </div>
        </div>
      )}
    </div>
  );
};
