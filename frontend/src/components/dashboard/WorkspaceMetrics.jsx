import React, { useState } from 'react';
import { 
  FileText, Cpu, MessageSquare, HardDrive, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock, 
  Info, Sparkles 
} from 'lucide-react';
import { dashboardSpecs } from '../../design-system/dashboardSpecs';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/Badge';

export const WorkspaceMetrics = () => {
  const [activeTimeframe, setActiveTimeframe] = useState('7d');

  const icons = {
    docs: FileText,
    vectors: Cpu,
    queries: MessageSquare,
    storage: HardDrive
  };

  const getMetricData = (item) => {
    // Dynamic multiplier depending on timeframe
    let value = item.value;
    let change = item.change;

    if (activeTimeframe === '24h') {
      if (item.id === 'docs') { value = '42'; change = '+3.8%'; }
      if (item.id === 'vectors') { value = '28.4k'; change = '+4.1k'; }
      if (item.id === 'queries') { value = '842'; change = '+14.2%'; }
    } else if (activeTimeframe === '30d') {
      if (item.id === 'docs') { value = '1,428'; change = '+12.4%'; }
      if (item.id === 'vectors') { value = '842,500'; change = '+18.2k'; }
      if (item.id === 'queries') { value = '14,892'; change = '+24.6%'; }
    } else if (activeTimeframe === 'all') {
      if (item.id === 'docs') { value = '4,890'; change = '+180%'; }
      if (item.id === 'vectors') { value = '2.4M'; change = '+210%'; }
      if (item.id === 'queries') { value = '84,120'; change = '+320%'; }
    }

    return { ...item, value, change };
  };

  return (
    <div className="space-y-4">
      {/* Header and Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-primary tracking-tight">Executive Knowledge KPIs</h3>
          <p className="text-xs text-secondary">Real-time vector ingestion, storage, and neural inference telemetry.</p>
        </div>

        {/* Timeframe pills */}
        <div className="flex items-center p-1 rounded-lg bg-surface border border-border-default self-start sm:self-auto shadow-xs">
          {dashboardSpecs.metrics.timeframes.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setActiveTimeframe(tf.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150",
                activeTimeframe === tf.id
                  ? "bg-brand-600 text-white shadow-xs font-semibold"
                  : "text-secondary hover:text-primary"
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardSpecs.metrics.items.map((rawItem) => {
          const item = getMetricData(rawItem);
          const Icon = icons[item.id] || FileText;

          return (
            <div
              key={item.id}
              className="group bg-surface rounded-xl border border-border-default p-4 sm:p-5 shadow-xs hover:border-brand-500/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Icon & Growth Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="h-9 w-9 rounded-lg bg-surface-hover border border-border-subtle flex items-center justify-center text-brand-400 group-hover:bg-brand-500/10 group-hover:text-brand-400 group-hover:border-brand-500/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" />
                    <span>{item.change}</span>
                  </div>
                </div>

                {/* Title & Value */}
                <span className="text-xs font-medium text-secondary block mb-1">{item.title}</span>
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-2xl font-bold tracking-tight text-primary font-mono">{item.value}</span>
                  <span className="text-xs text-muted font-medium">{item.unit}</span>
                </div>
                <p className="text-[11px] text-secondary line-clamp-1">{item.subtitle}</p>
              </div>

              {/* Bottom Mini Sparkline & Badge */}
              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                {/* Visual mini bar sparkline */}
                <div className="flex items-end gap-1 h-5">
                  {item.sparkline.map((val, idx) => {
                    const heightPercent = Math.min(100, Math.max(20, (val / Math.max(...item.sparkline)) * 100));
                    return (
                      <div
                        key={idx}
                        className="w-1.5 rounded-xs bg-brand-500/30 group-hover:bg-brand-500 transition-colors"
                        style={{ height: `${heightPercent}%` }}
                        title={`Day ${idx + 1}: ${val}`}
                      />
                    );
                  })}
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-hover text-muted border border-border-subtle">
                  {item.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
