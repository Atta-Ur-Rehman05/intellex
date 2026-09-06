import React from 'react';
import { 
  BarChart3, Activity, Clock, ShieldCheck, 
  Sparkles, FileText, ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { dashboardSpecs } from '../../design-system/dashboardSpecs';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';

export const AnalyticsDeepDive = () => {
  const { telemetry } = dashboardSpecs;
  const maxQueries = Math.max(...telemetry.queries);

  return (
    <div className="space-y-6">
      {/* 3 Telemetry Health Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-surface border border-border-default shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary block mb-0.5">Vector Cache Hit Ratio</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{telemetry.cacheHitRate}</div>
            <span className="text-[10px] text-muted font-mono">0.4ms cache lookup latency</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border-default shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary block mb-0.5">Mean RAG Inference Latency</span>
            <div className="text-2xl font-bold font-mono text-brand-400">178ms</div>
            <span className="text-[10px] text-emerald-400 font-mono">-14ms vs last week</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface border border-border-default shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-secondary block mb-0.5">Zero Data Retention</span>
            <div className="text-2xl font-bold font-mono text-primary">Verified</div>
            <span className="text-[10px] text-muted font-mono">SOC2 Type II Continuous Audit</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Query Volume vs Latency */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-border-default p-5 sm:p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-base font-bold text-primary tracking-tight">7-Day Query Volume & Latency</h3>
              <p className="text-xs text-secondary">Daily neural queries matched against vector indexes.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-brand-500" />
                <span className="text-secondary">Queries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded bg-emerald-400" />
                <span className="text-secondary">Latency (ms)</span>
              </div>
            </div>
          </div>

          {/* Visual Chart */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-4 px-2">
            {telemetry.days.map((day, idx) => {
              const queryCount = telemetry.queries[idx];
              const latency = telemetry.latencyMs[idx];
              const barHeightPercent = (queryCount / maxQueries) * 100;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono bg-canvas border border-border-default rounded p-1 shadow-sm text-center pointer-events-none mb-1">
                    <div>{queryCount} queries</div>
                    <div className="text-emerald-400">{latency}ms</div>
                  </div>

                  {/* Dual Bar / Indicator */}
                  <div className="w-full flex items-end justify-center gap-1 h-36">
                    <div
                      className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-brand-600 to-indigo-500 group-hover:brightness-110 transition-all duration-200"
                      style={{ height: `${barHeightPercent}%` }}
                    />
                  </div>

                  {/* Day label */}
                  <span className="text-xs font-mono font-medium text-secondary">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Most Cited Documents Leaderboard */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-border-default p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div>
              <h3 className="text-base font-bold text-primary tracking-tight">Top Cited Knowledge</h3>
              <p className="text-xs text-secondary">Documents driving the most AI answers.</p>
            </div>
            <span className="text-xs font-mono text-brand-400 font-semibold">Ranked #1–5</span>
          </div>

          <div className="space-y-3">
            {telemetry.topCitedDocuments.map((doc, idx) => (
              <div
                key={doc.name}
                className="p-3 rounded-xl bg-canvas border border-border-subtle hover:border-border-default transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-6 w-6 rounded-lg bg-surface-hover border border-border-subtle flex items-center justify-center font-mono font-bold text-xs text-brand-400 shrink-0">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-primary block truncate max-w-[180px] sm:max-w-[220px]">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-muted">{doc.domain} Domain</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-xs text-purple-400 block">
                    {doc.citations} citations
                  </span>
                  <span className="text-[10px] text-muted">99.2% relevance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
