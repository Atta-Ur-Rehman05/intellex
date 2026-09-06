import { useState } from 'react';
import {
  Inbox, AlertTriangle, Smartphone, Code2,
  WifiOff, UploadCloud, Cpu, Bot, ShieldAlert,
  FileQuestion, ServerCrash, Wrench, Loader2
} from 'lucide-react';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/Card';
import { EmptyState } from './ui/EmptyState';
import { SkeletonBlock, DashboardSkeleton, DocumentTableSkeleton, ChatViewSkeleton } from './ui/Skeleton';
import { ErrorScreen, OfflineBanner } from './ui/ErrorScreen';
import { ResponsiveShowcase } from './ui/ResponsiveShowcase';
import { DeveloperHandoffPanel } from './ui/DeveloperHandoffPanel';
import { edgeCaseSpecs } from '../design-system/edgeCaseSpecs';
import { useToast } from './ui/Toast';
import { cn } from '../lib/utils';

export const Stage12View = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('empty');
  const [httpErrorDemo, setHttpErrorDemo] = useState(404);
  const [contextualDemo, setContextualDemo] = useState('network-disconnected');
  const [skeletonDemo, setSkeletonDemo] = useState('dashboard');

  const subTabs = [
    { id: 'empty', label: '1. Empty States', icon: Inbox },
    { id: 'errors', label: '2. Error States', icon: AlertTriangle },
    { id: 'skeletons', label: '3. Skeletons', icon: Loader2 },
    { id: 'responsive', label: '4. Responsive Spec', icon: Smartphone },
    { id: 'handoff', label: '5. Developer Handoff', icon: Code2 },
  ];

  const httpErrorOptions = [
    { code: 403, icon: ShieldAlert },
    { code: 404, icon: FileQuestion },
    { code: 500, icon: ServerCrash },
    { code: 503, icon: Wrench },
  ];

  const contextualOptions = edgeCaseSpecs.contextualErrors.map((e) => ({
    id: e.id,
    icon: { 'network-disconnected': WifiOff, 'upload-failed': UploadCloud, 'embedding-failed': Cpu, 'chat-generation-failed': Bot }[e.id],
    spec: e,
  }));

  const contextualActionLabels = {
    'network-disconnected': ["Retry Connection", "View Queued Changes"],
    'upload-failed': ["Retry Upload", "Remove"],
    'embedding-failed': ["Retry Embedding", "View Failed Chunks"],
    'chat-generation-failed': ["Regenerate Answer", "Copy Question"],
  };

  const skeletonOptions = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'table', label: 'Document Table' },
    { id: 'chat', label: 'Chat View' },
  ];

  const emptyStateDemos = edgeCaseSpecs.emptyStates.map((e) => ({
    ...e,
    iconMap: {
      'no-documents': { primary: 'UploadCloud', secondary: 'ExternalLink' },
      'no-chats': { primary: 'Sparkles', secondary: 'BookOpen' },
      'no-search-results': { primary: 'RotateCcw', secondary: 'HelpCircle' },
      'no-notifications': { primary: 'Settings' },
      'no-team-members': { primary: 'UserPlus', secondary: 'Copy' },
    }[e.id],
  }));

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
        <Badge variant="brand" dot>Stage 12: Edge Cases & Handoff</Badge>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: EMPTY STATES */}
      {/* ==================================================== */}
      {activeTab === 'empty' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-lg font-bold text-primary">Empty State Gallery</h2>
            <p className="text-xs text-secondary mt-1">
              Illustrated · informative · action-oriented. Every zero-data surface offers a way forward — no dead ends.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {emptyStateDemos.map((e) => (
              <div key={e.id} className="rounded-2xl bg-surface border border-border-default shadow-xs overflow-hidden flex flex-col">
                {/* Live component inside a canvas viewport */}
                <div className="flex-1 flex items-center justify-center bg-canvas py-2 min-h-[280px]">
                  <EmptyState
                    illustration={e.id}
                    title={e.title}
                    description={e.context}
                    primaryAction={{
                      label: e.primaryAction.label,
                      icon: e.primaryAction.icon,
                      variant: e.primaryAction.variant,
                      onClick: () => toast({ title: e.primaryAction.label, description: `Triggered from "${e.title}" empty state.`, type: "success" }),
                    }}
                    secondaryAction={e.secondaryAction ? {
                      label: e.secondaryAction.label,
                      icon: e.secondaryAction.icon,
                      onClick: () => toast({ title: e.secondaryAction.label, type: "info" }),
                    } : undefined}
                  />
                </div>
                {/* Spec footer */}
                <div className="px-4 py-3 border-t border-border-default bg-surface space-y-1.5">
                  <p className="text-[10px] font-mono text-muted">{e.trigger}</p>
                  <p className="text-[11px] text-secondary">{e.statHint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: ERROR STATES */}
      {/* ==================================================== */}
      {activeTab === 'errors' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* HTTP errors */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>HTTP Error Screens — Full-Route Takeover</CardTitle>
                  <CardDescription>Centered, ≤3 actions, incident badge where applicable. Switch codes:</CardDescription>
                </div>
                <div className="flex items-center gap-1.5">
                  {httpErrorOptions.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setHttpErrorDemo(opt.code)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border",
                        httpErrorDemo === opt.code
                          ? "bg-red-500/10 text-red-500 border-red-500/40"
                          : "bg-surface text-secondary border-border-default hover:border-border-strong"
                      )}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      {opt.code}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-canvas border border-border-subtle min-h-[420px] flex items-center justify-center py-4">
                <ErrorScreen
                  code={httpErrorDemo}
                  incidentId={httpErrorDemo === 500 ? "Incident ID: KV-2026-0911 · auto-reported" : httpErrorDemo === 503 ? "Window: 00:30 – 02:00 UTC · no data loss" : undefined}
                  onPrimaryAction={() => toast({ title: `Primary action · ${httpErrorDemo}`, type: "info" })}
                  onSecondaryAction={() => toast({ title: `Secondary action · ${httpErrorDemo}`, type: "info" })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contextual errors */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Contextual Errors — In-Flow Recovery</CardTitle>
                  <CardDescription>Keep the user in context, never lose input, always expose Retry.</CardDescription>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {contextualOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setContextualDemo(opt.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border",
                        contextualDemo === opt.id
                          ? "bg-brand-500/10 text-brand-400 border-brand-500/40"
                          : "bg-surface text-secondary border-border-default hover:border-border-strong"
                      )}
                    >
                      <opt.icon className="w-3.5 h-3.5" />
                      {opt.spec.title}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {contextualOptions.filter((o) => o.id === contextualDemo).map((opt) => {
                const Spec = opt.spec;
                const Icon = opt.icon;
                const [primaryLabel, secondaryLabel] = contextualActionLabels[opt.id];
                return (
                  <div key={opt.id} className="space-y-4">
                    {/* Offline banner pattern for network case */}
                    {opt.id === 'network-disconnected' && (
                      <div className="rounded-xl overflow-hidden border border-border-default">
                        <OfflineBanner
                          queuedChanges={3}
                          onRetry={() => toast({ title: "Reconnecting…", description: "Checking connection stability.", type: "info" })}
                        />
                        <div className="h-24 bg-canvas" />
                      </div>
                    )}

                    {/* Inline error card */}
                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex flex-col sm:flex-row items-start gap-4" role="alert">
                      <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm font-bold text-primary">{Spec.title}</h4>
                        <p className="text-xs text-secondary leading-relaxed">{Spec.context}</p>
                        <p className="text-[10px] font-mono text-muted pt-1">{Spec.dataSafety}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toast({ title: primaryLabel, description: "Recovery action dispatched.", type: "success" })}
                        >
                          {primaryLabel}
                        </Button>
                        {secondaryLabel && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast({ title: secondaryLabel, type: "info" })}
                          >
                            {secondaryLabel}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Spec meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-1.5">
                        <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">Pattern</p>
                        <p className="text-xs text-secondary">{Spec.pattern}</p>
                      </div>
                      {Spec.variants && (
                        <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-1.5">
                          <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">Failure Variants</p>
                          <div className="flex flex-wrap gap-1.5">
                            {Spec.variants.map((v) => (
                              <Badge key={v} variant="neutral" size="sm">{v}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: SKELETONS */}
      {/* ==================================================== */}
      {activeTab === 'skeletons' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>Skeleton Screens — Shape-Faithful Loading</CardTitle>
                  <CardDescription>
                    Each skeleton mirrors the exact geometry of its loaded view. 1.5s shimmer loop · swap to progress bar at 3s.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-hover border border-border-default">
                  {skeletonOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSkeletonDemo(opt.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer",
                        skeletonDemo === opt.id
                          ? "bg-surface text-primary shadow-xs border border-border-default"
                          : "text-secondary hover:text-primary"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl bg-canvas border border-border-subtle p-4 sm:p-6">
                {skeletonDemo === 'dashboard' && <DashboardSkeleton />}
                {skeletonDemo === 'table' && <DocumentTableSkeleton />}
                {skeletonDemo === 'chat' && <ChatViewSkeleton />}
              </div>

              {/* Principles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-2">
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">Principles</p>
                  <ul className="space-y-1.5">
                    {edgeCaseSpecs.skeletons.principles.map((p) => (
                      <li key={p} className="text-xs text-secondary flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-500/70 mt-1.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-canvas border border-border-subtle space-y-2">
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted">Timing & A11y</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-secondary">Shimmer loop</span>
                      <span className="font-mono text-[11px] text-brand-400">{edgeCaseSpecs.skeletons.timing.shimmerLoopMs}ms</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-secondary">Progress-bar swap</span>
                      <span className="font-mono text-[11px] text-brand-400">{edgeCaseSpecs.skeletons.timing.swapToProgressBarMs}ms</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-secondary">Accessibility</span>
                      <span className="font-mono text-[11px] text-brand-400">aria-busy + sr-only</span>
                    </div>
                  </div>
                  {/* Shimmer anatomy */}
                  <div className="pt-2 space-y-1.5">
                    <SkeletonBlock className="h-3 w-full" />
                    <SkeletonBlock className="h-3 w-2/3" />
                    <SkeletonBlock className="h-3 w-1/2" />
                    <p className="text-[10px] text-muted pt-1">↑ live primitives (SkeletonBlock) — same shimmer as above</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: RESPONSIVE SPEC */}
      {/* ==================================================== */}
      {activeTab === 'responsive' && (
        <div className="animate-in fade-in duration-200">
          <ResponsiveShowcase />
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: DEVELOPER HANDOFF */}
      {/* ==================================================== */}
      {activeTab === 'handoff' && (
        <div className="animate-in fade-in duration-200">
          <DeveloperHandoffPanel />
        </div>
      )}
    </div>
  );
};
