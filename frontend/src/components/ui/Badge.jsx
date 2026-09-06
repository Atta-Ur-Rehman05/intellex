import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Badge Component - Knowva Design System
 * 
 * Variants: success, warning, error, info, neutral, ai, brand
 * Sizes: sm, md, lg
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
  icon,
  ...props
}) => {
  const variants = {
    neutral: "bg-surface-hover text-secondary border-border-default",
    brand: "bg-brand-500/10 text-brand-400 border-brand-500/25",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    error: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
    info: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/25",
    ai: "bg-gradient-to-r from-brand-500/15 via-purple-500/15 to-pink-500/15 text-brand-400 border-purple-500/30",
  };

  const dotColors = {
    neutral: "bg-slate-400",
    brand: "bg-brand-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
    info: "bg-sky-500",
    ai: "bg-purple-500 animate-pulse",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1 rounded",
    md: "px-2 py-0.5 text-xs gap-1.5 rounded-md",
    lg: "px-2.5 py-1 text-xs font-semibold gap-1.5 rounded-lg",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium border select-none transition-colors",
        variants[variant] || variants.neutral,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant] || dotColors.neutral)} />
      )}
      {variant === 'ai' && !icon && (
        <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

/**
 * Tag Component with Removable Action (X)
 */
export const Tag = ({
  children,
  onRemove,
  icon,
  count,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface text-primary border border-border-default hover:border-border-strong transition-all shadow-2xs group",
        className
      )}
      {...props}
    >
      {icon && <span className="text-secondary group-hover:text-primary transition-colors">{icon}</span>}
      <span>{children}</span>
      {count !== undefined && (
        <span className="text-[10px] px-1 py-0.2 rounded bg-surface-hover text-muted font-mono">
          {count}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded-full text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          aria-label="Remove tag"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};
