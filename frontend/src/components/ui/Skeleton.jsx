import { cn } from '../../lib/utils';

/**
 * Skeleton Primitives - Knowva Design System
 *
 * Shape-faithful shimmer placeholders. The shimmer is a CSS gradient sweep
 * (see index.css @keyframes knowva-shimmer). Containers set aria-busy.
 */

const base = "relative overflow-hidden rounded-md bg-surface-hover";

const Shimmer = () => (
  <span
    aria-hidden="true"
    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent knowva-shimmer"
  />
);

export const SkeletonBlock = ({ className }) => (
  <div className={cn(base, className)}>
    <Shimmer />
  </div>
);

export const SkeletonText = ({ lines = 3, className }) => (
  <div className={cn("space-y-2", className)} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock
        key={i}
        className={cn("h-3", i === lines - 1 ? "w-3/5" : "w-full")}
      />
    ))}
  </div>
);

export const SkeletonCircle = ({ className }) => (
  <div className={cn(base, "rounded-full", className)}>
    <Shimmer />
  </div>
);

/**
 * DashboardSkeleton — mirrors DashboardPage geometry:
 * header row → 4 stat cards → 2-column widgets row
 */
export const DashboardSkeleton = () => (
  <div className="space-y-6" role="status" aria-busy="true" aria-label="Loading dashboard">
    <span className="sr-only">Loading dashboard analytics…</span>
    {/* Page header */}
    <div className="space-y-2">
      <SkeletonBlock className="h-7 w-56" />
      <SkeletonBlock className="h-3.5 w-80" />
    </div>

    {/* Stat cards row */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-5 rounded-xl bg-surface border border-border-default space-y-3">
          <div className="flex items-center justify-between">
            <SkeletonBlock className="h-3 w-20" />
            <SkeletonCircle className="w-8 h-8" />
          </div>
          <SkeletonBlock className="h-7 w-24" />
          <SkeletonBlock className="h-2.5 w-16" />
        </div>
      ))}
    </div>

    {/* Widget row: chart + activity */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 p-5 rounded-xl bg-surface border border-border-default space-y-4">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-4 w-40" />
          <SkeletonBlock className="h-6 w-24 rounded-full" />
        </div>
        {/* Fake chart bars */}
        <div className="flex items-end gap-2 h-40 px-1">
          {[45, 70, 38, 85, 60, 92, 50, 75, 42, 88, 65, 78].map((h, i) => (
            <SkeletonBlock key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="p-5 rounded-xl bg-surface border border-border-default space-y-4">
        <SkeletonBlock className="h-4 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <SkeletonCircle className="w-8 h-8 shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5">
              <SkeletonBlock className="h-2.5 w-3/4" />
              <SkeletonBlock className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * DocumentTableSkeleton — mirrors Table geometry:
 * toolbar → header row → 6 data rows with leading icon chips
 */
export const DocumentTableSkeleton = ({ rows = 6 }) => (
  <div
    className="bg-surface border border-border-default rounded-xl overflow-hidden"
    role="status"
    aria-busy="true"
    aria-label="Loading documents"
  >
    <span className="sr-only">Loading document list…</span>

    {/* Toolbar */}
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-default">
      <SkeletonBlock className="h-9 w-64 rounded-lg" />
      <div className="flex items-center gap-2">
        <SkeletonBlock className="h-9 w-9 rounded-lg" />
        <SkeletonBlock className="h-9 w-24 rounded-lg" />
      </div>
    </div>

    {/* Header row */}
    <div className="flex items-center gap-4 px-4 py-3 border-b border-border-default bg-surface-hover/40">
      <SkeletonBlock className="h-3.5 w-1/4" />
      <SkeletonBlock className="h-3.5 w-1/6" />
      <SkeletonBlock className="h-3.5 w-1/12" />
      <SkeletonBlock className="h-3.5 w-1/6" />
      <SkeletonBlock className="h-3.5 w-1/12 ml-auto" />
    </div>

    {/* Rows */}
    <div className="divide-y divide-border-subtle">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5">
          <div className="flex items-center gap-3 w-1/4">
            <SkeletonBlock className="w-8 h-8 rounded-lg shrink-0" />
            <div className="space-y-1.5 flex-1">
              <SkeletonBlock className="h-2.5 w-3/4" />
              <SkeletonBlock className="h-2 w-1/2" />
            </div>
          </div>
          <SkeletonBlock className="h-2.5 w-1/6" />
          <SkeletonBlock className="h-5 w-16 rounded-full" />
          <SkeletonBlock className="h-2.5 w-1/6" />
          <SkeletonBlock className="h-8 w-8 rounded-lg ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

/**
 * ChatViewSkeleton — mirrors ChatPage geometry:
 * history rail (desktop) + message stream + composer
 */
export const ChatViewSkeleton = () => (
  <div className="flex gap-4 h-[calc(100vh-10rem)]" role="status" aria-busy="true" aria-label="Loading chat workspace">
    <span className="sr-only">Loading AI chat…</span>

    {/* History rail */}
    <div className="hidden md:flex w-64 shrink-0 flex-col gap-3 p-3 rounded-xl bg-surface border border-border-default">
      <SkeletonBlock className="h-9 w-full rounded-lg" />
      <div className="space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-2.5 rounded-lg space-y-2 border border-border-subtle">
            <div className="flex items-center gap-2">
              <SkeletonCircle className="w-4 h-4" />
              <SkeletonBlock className="h-2.5 w-3/4" />
            </div>
            <SkeletonBlock className="h-2 w-1/2" />
          </div>
        ))}
      </div>
    </div>

    {/* Message stream + composer */}
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      {/* User bubble */}
      <div className="flex justify-end">
        <div className="w-2/3 max-w-sm p-4 rounded-2xl rounded-br-md bg-brand-500/10 border border-brand-500/20 space-y-2.5">
          <SkeletonBlock className="h-2.5 w-full bg-brand-500/15" />
          <SkeletonBlock className="h-2.5 w-5/6 bg-brand-500/15" />
          <SkeletonBlock className="h-2.5 w-2/3 bg-brand-500/15" />
        </div>
      </div>

      {/* AI bubble with glow */}
      <div className="flex justify-start">
        <div className="w-3/4 max-w-lg p-4 rounded-2xl rounded-bl-md bg-surface border border-purple-500/25 space-y-2.5 ai-border-glow">
          <div className="flex items-center gap-2">
            <SkeletonCircle className="w-6 h-6 bg-purple-500/15" />
            <SkeletonBlock className="h-2.5 w-24" />
          </div>
          <SkeletonBlock className="h-2.5 w-full" />
          <SkeletonBlock className="h-2.5 w-11/12" />
          <SkeletonBlock className="h-2.5 w-4/5" />
          <div className="flex gap-1.5 pt-1">
            {[1, 2, 3].map((n) => (
              <SkeletonBlock key={n} className="h-5 w-9 rounded-md bg-brand-500/10" />
            ))}
          </div>
        </div>
      </div>

      {/* Streaming dots placeholder */}
      <div className="flex items-center gap-1.5 pl-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {/* Composer */}
      <div className="mt-auto rounded-2xl border border-border-default bg-surface p-3 space-y-2.5">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
    </div>
  </div>
);
