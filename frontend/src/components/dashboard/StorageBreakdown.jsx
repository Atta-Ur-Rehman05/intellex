import React, { useState } from 'react';
import { 
  HardDrive, Database, Sparkles, AlertCircle, 
  Trash2, ArrowUpRight, CheckCircle2, RefreshCw 
} from 'lucide-react';
import { dashboardSpecs } from '../../design-system/dashboardSpecs';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

export const StorageBreakdown = () => {
  const { storage } = dashboardSpecs;
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { toast } = useToast();

  const handleCleanUp = () => {
    toast({
      title: "Optimizing Vector Cache",
      description: "Pruning 42 orphaned chunk embeddings and compressing index cache...",
      type: "info"
    });
    setTimeout(() => {
      toast({
        title: "Storage Cleaned Up",
        description: "Reclaimed 1.4 GB of unreferenced vector cache.",
        type: "success"
      });
    }, 1200);
  };

  const handleUpgrade = () => {
    toast({
      title: "Enterprise Storage Request",
      description: "Redirecting to workspace capacity expansion (Up to 1 TB quota).",
      type: "brand"
    });
  };

  return (
    <div className="bg-surface rounded-2xl border border-border-default p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-primary tracking-tight">Storage & Vector Quota</h3>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
              {storage.percentUsed}% Quota Used
            </span>
          </div>
          <p className="text-xs text-secondary mt-0.5">
            Enterprise tier: <strong>{storage.totalUsedGb} GB</strong> used of <strong>{storage.totalQuotaGb} GB</strong> available.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCleanUp}
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-secondary" />}
            className="text-xs text-secondary hover:text-primary"
          >
            Clean Cache
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleUpgrade}
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5 text-brand-400" />}
            className="text-xs font-medium"
          >
            Upgrade Quota
          </Button>
        </div>
      </div>

      {/* Multi-segment visual progress bar */}
      <div className="space-y-2">
        <div className="h-3.5 w-full bg-canvas rounded-full overflow-hidden flex p-0.5 border border-border-default shadow-inner">
          {storage.categories.map((cat) => {
            const isHovered = hoveredCategory === cat.id;
            return (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{ width: `${cat.percentage}%` }}
                className={cn(
                  cat.color,
                  "h-full first:rounded-l-full last:rounded-r-full transition-all duration-150 cursor-pointer relative group",
                  isHovered ? "brightness-125 scale-y-110 z-10 shadow-xs" : "opacity-90 hover:opacity-100"
                )}
                title={`${cat.name}: ${cat.sizeGb} GB (${cat.percentage}%)`}
              />
            );
          })}
        </div>

        {/* Free space legend label */}
        <div className="flex items-center justify-between text-[11px] text-muted font-mono">
          <span>0 GB</span>
          <span className="text-brand-400 font-semibold">{storage.totalUsedGb} GB Ingested</span>
          <span>{storage.totalQuotaGb} GB Quota</span>
        </div>
      </div>

      {/* Storage Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
        {storage.categories.map((cat) => {
          const isSelected = hoveredCategory === cat.id;
          return (
            <div
              key={cat.id}
              onMouseEnter={() => setHoveredCategory(cat.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={cn(
                "p-3 rounded-xl border transition-all duration-150 cursor-pointer",
                isSelected
                  ? "bg-surface-hover border-brand-500 shadow-xs ring-1 ring-brand-500/20"
                  : "bg-surface-hover/50 border-border-subtle hover:bg-surface-hover hover:border-border-default"
              )}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", cat.color)} />
                <span className="text-xs font-semibold text-primary truncate">{cat.name}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-mono font-bold text-primary">{cat.sizeGb} GB</span>
                <span className="text-[11px] text-muted font-mono">{cat.percentage}%</span>
              </div>
              <div className="text-[10px] text-muted mt-1">
                {cat.fileCount} files indexed
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
