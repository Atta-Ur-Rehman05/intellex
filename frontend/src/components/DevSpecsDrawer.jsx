import React, { useState } from 'react';
import { 
  Sliders, X, Layers, Code2, GitBranch, 
  Layout, Globe, LayoutDashboard, ChevronRight,
  Sparkles, ExternalLink 
} from 'lucide-react';
import { Stage1View } from './Stage1View';
import { Stage2View } from './Stage2View';
import { Stage3View } from './Stage3View';
import { Stage4View } from './Stage4View';
import { Stage5View } from './Stage5View';
import { Stage6View } from './Stage6View';
import { Stage7View } from './Stage7View';
import { Folder } from 'lucide-react';
import { cn } from '../lib/utils';

export const DevSpecsDrawer = ({ isOpen, onClose, theme, onToggleTheme, onNavigateToChat, onNavigateToDocs }) => {
  const [selectedStage, setSelectedStage] = useState('stage7');

  if (!isOpen) return null;

  const stages = [
    { id: 'stage1', label: 'Prompt 1: Design Tokens & Foundations', icon: Code2 },
    { id: 'stage2', label: 'Prompt 2: Information Architecture', icon: GitBranch },
    { id: 'stage3', label: 'Prompt 3: Core Component Library', icon: Layers },
    { id: 'stage4', label: 'Prompt 4: App Shell & Global Nav', icon: Layout },
    { id: 'stage5', label: 'Prompt 5: Marketing & Auth Suite', icon: Globe },
    { id: 'stage6', label: 'Prompt 6: Main Dashboard & Analytics', icon: LayoutDashboard },
    { id: 'stage7', label: 'Prompt 7: Document Explorer & Upload', icon: Folder },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-5xl h-full bg-surface border-l border-border-default shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-border-default flex items-center justify-between bg-surface/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-primary">Knowva Deliverable Audits & Design Specs</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  Prompts 1–6
                </span>
              </div>
              <p className="text-xs text-secondary">
                Audit each milestone's isolated testbeds, tokens, and schemas on demand.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface-hover border border-border-subtle transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Navigation Pills */}
        <div className="px-4 sm:px-5 py-2.5 border-b border-border-default bg-canvas flex items-center gap-2 overflow-x-auto no-scrollbar">
          {stages.map((st) => {
            const Icon = st.icon;
            const isActive = selectedStage === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStage(st.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                  isActive
                    ? "bg-brand-600 text-white font-semibold shadow-xs"
                    : "bg-surface text-secondary hover:text-primary border border-border-subtle"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{st.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-canvas">
          {selectedStage === 'stage1' && <Stage1View />}
          {selectedStage === 'stage2' && <Stage2View />}
          {selectedStage === 'stage3' && <Stage3View />}
          {selectedStage === 'stage4' && <Stage4View theme={theme} onToggleTheme={onToggleTheme} />}
          {selectedStage === 'stage5' && <Stage5View theme={theme} onToggleTheme={onToggleTheme} />}
          {selectedStage === 'stage6' && (
            <Stage6View 
              theme={theme} 
              onToggleTheme={onToggleTheme} 
              onNavigateToChat={onNavigateToChat}
              onNavigateToDocs={onNavigateToDocs}
            />
          )}
          {selectedStage === 'stage7' && (
            <Stage7View onNavigateToChat={onNavigateToChat} />
          )}
        </div>
      </div>
    </div>
  );
};
