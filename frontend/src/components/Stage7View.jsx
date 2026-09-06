import React, { useState } from 'react';
import { 
  Folder, UploadCloud, FileText, Sparkles, 
  Database, ShieldCheck, Tag, Layers 
} from 'lucide-react';
import { DocumentExplorerPage } from './documents/DocumentExplorerPage';
import { UploadWizardModal } from './documents/UploadWizardModal';
import { documentSpecs } from '../design-system/documentSpecs';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export const Stage7View = ({ onNavigateToChat }) => {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer' | 'specs'
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const subTabs = [
    { id: 'explorer', label: '1. Live Document Explorer', icon: Folder },
    { id: 'specs', label: '2. Chunking & Taxonomy Specs', icon: Database },
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
          <Badge variant="brand" dot>Stage 7: Document Explorer</Badge>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsWizardOpen(true)}
            leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Launch Wizard
          </Button>
        </div>
      </div>

      {/* Tab 1: Live Explorer */}
      {activeTab === 'explorer' && (
        <DocumentExplorerPage onNavigateToChat={onNavigateToChat} />
      )}

      {/* Tab 2: Specs */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
            <h3 className="text-base font-bold text-primary">Chunking Strategy Profiles</h3>
            <div className="space-y-3">
              {documentSpecs.chunkingProfiles.map((prof) => (
                <div key={prof.id} className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-primary">{prof.name}</span>
                    <span className="text-[10px] font-mono text-brand-400 font-semibold">{prof.chunkSize} tokens</span>
                  </div>
                  <p className="text-xs text-secondary">{prof.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
            <h3 className="text-base font-bold text-primary">Taxonomy & Classification Rules</h3>
            <ul className="text-xs text-secondary space-y-3">
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                <span><strong>Confidential (Tenant Only)</strong>: Vectors isolated to organization partition. Never shared across sub-tenants or public indices.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                <span><strong>Internal Shared</strong>: Visible to all workspace members with Editor or Viewer RBAC permissions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span><strong>Public Knowledge</strong>: Can be exported to public API documentation and external RAG endpoints.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Standalone Wizard Modal */}
      <UploadWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
};
