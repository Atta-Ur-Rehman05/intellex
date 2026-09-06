import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * Tabs Component - Knowva Design System
 * 
 * Supports variants: 'line' (underlined with active indicator) and 'pill' (segmented pill)
 * Includes keyboard navigation support and animated indicators.
 */
export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'line',
  className
}) => {
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % tabs.length;
      onChange?.(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      onChange?.(tabs[prevIndex].id);
    }
  };

  if (variant === 'pill') {
    return (
      <div 
        role="tablist" 
        className={cn("inline-flex items-center p-1 bg-surface-hover rounded-xl border border-border-default", className)}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange?.(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2 select-none",
                isActive ? "text-primary" : "text-secondary hover:text-primary"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="pill-active-indicator"
                  className="absolute inset-0 bg-surface rounded-lg shadow-xs border border-border-default -z-0"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                    isActive ? "bg-brand-500/15 text-brand-400 font-bold" : "bg-surface-hover text-muted"
                  )}>
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Line Variant (Default)
  return (
    <div 
      role="tablist" 
      className={cn("flex border-b border-border-default overflow-x-auto no-scrollbar", className)}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange?.(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "relative px-4 py-3 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap select-none",
              isActive ? "text-brand-500 font-semibold" : "text-secondary hover:text-primary hover:bg-surface-hover/50"
            )}
          >
            {Icon && <Icon className={cn("w-4 h-4", isActive ? "text-brand-500" : "text-secondary")} />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn(
                "text-[11px] px-1.5 py-0.2 rounded-full font-mono",
                isActive ? "bg-brand-500/15 text-brand-400 font-bold" : "bg-surface-hover text-muted"
              )}>
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="line-active-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
