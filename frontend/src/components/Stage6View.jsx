import React, { useState } from 'react';
import { 
  LayoutDashboard, BarChart3, Database, HardDrive, 
  Sparkles, ShieldCheck, Layers, FileText, 
  MessageSquare, Activity, Sliders, CheckCircle2 
} from 'lucide-react';
import { DashboardPage } from './dashboard/DashboardPage';
import { AnalyticsDeepDive } from './dashboard/AnalyticsDeepDive';
import { dashboardSpecs } from '../design-system/dashboardSpecs';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

export const Stage6View = ({ theme = 'dark', onToggleTheme, onNavigateToChat, onNavigateToDocs }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'telemetry' | 'specs'

  const subTabs = [
    { id: 'dashboard', label: '1. Live Workspace Dashboard', icon: LayoutDashboard },
    { id: 'telemetry', label: '2. Analytics & Telemetry Deep Dive', icon: BarChart3 },
    { id: 'specs', label: '3. Data Schema & Quota Specs', icon: Database },
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
          <Badge variant="brand" dot>Stage 6: Main Dashboard</Badge>
        </div>
      </div>

      {/* Tab 1: Live Dashboard */}
      {activeTab === 'dashboard' && (
        <DashboardPage
          onNavigateToChat={onNavigateToChat}
          onNavigateToDocs={onNavigateToDocs}
        />
      )}

      {/* Tab 2: Analytics & Telemetry */}
      {activeTab === 'telemetry' && (
        <AnalyticsDeepDive />
      )}

      {/* Tab 3: Data Schemas & Specs */}
      {activeTab === 'specs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
            <h3 className="text-base font-bold text-primary">Executive Telemetry Schema</h3>
            <pre className="p-4 rounded-xl bg-canvas border border-border-subtle text-secondary font-mono text-xs overflow-x-auto">
{`interface WorkspaceTelemetry {
  metrics: {
    totalDocuments: number;      // 1,428 files (+12.4%)
    totalVectors: number;        // 842,500 vectors (1536-dim)
    totalRagQueries: number;     // 14,892 queries
    storageUsedGb: number;       // 64.8 GB (Quota: 250 GB)
    meanLatencyMs: number;       // 182 ms
    cacheHitRatio: number;       // 98.6%
  };
  quotas: {
    maxTenants: number;          // 5 isolated partitions
    zeroRetention: boolean;      // true (SOC2 Type II)
  };
}`}
            </pre>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border-default shadow-xs space-y-4">
            <h3 className="text-base font-bold text-primary">Multi-Segment Storage Rules</h3>
            <ul className="text-xs text-secondary space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1 shrink-0" />
                <span><strong>PDFs & Reports</strong>: 50% allocation (32.4 GB). Parsed into semantic 512-token chunks with 64-token overlap.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                <span><strong>Notion & Markdown</strong>: 21.9% allocation (14.2 GB). Hierarchical AST parsing with preserved document headings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                <span><strong>Source Code</strong>: 16.7% allocation (10.8 GB). Function/class level symbol extraction and Tree-sitter AST nodes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500 mt-1 shrink-0" />
                <span><strong>Transcripts & Audio</strong>: 7.4% allocation (4.8 GB). Speaker diarization and timestamped vector embeddings.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
