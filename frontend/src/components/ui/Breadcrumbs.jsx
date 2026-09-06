import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Breadcrumbs Component - Knowva Design System
 * 
 * Accessible trail with support for home icon, truncation, custom separators, and ARIA current page.
 */
export const Breadcrumbs = ({
  items = [],
  separator = <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />,
  showHomeIcon = true,
  maxItems,
  onNavigate,
  className
}) => {
  let displayItems = items;
  let isTruncated = false;

  if (maxItems && items.length > maxItems) {
    isTruncated = true;
    const first = items.slice(0, 1);
    const last = items.slice(items.length - (maxItems - 1));
    displayItems = [...first, { id: 'ellipsis', label: '...', isEllipsis: true }, ...last];
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs sm:text-sm text-secondary", className)}>
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {showHomeIcon && (
          <li className="inline-flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onNavigate?.({ id: 'home', path: '/' })}
              className="p-1 rounded-md text-secondary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5" />
            </button>
            <span className="select-none" aria-hidden="true">{separator}</span>
          </li>
        )}

        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const Icon = item.icon;

          if (item.isEllipsis) {
            return (
              <li key="ellipsis" className="inline-flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 text-xs text-muted font-mono rounded bg-surface-hover">...</span>
                <span className="select-none" aria-hidden="true">{separator}</span>
              </li>
            );
          }

          return (
            <li key={item.id || index} className="inline-flex items-center gap-1.5">
              {isLast ? (
                <span 
                  aria-current="page" 
                  className="font-semibold text-primary flex items-center gap-1.5 select-none"
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-brand-500" />}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {item.badge}
                    </span>
                  )}
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(item)}
                    className="flex items-center gap-1.5 text-secondary hover:text-primary hover:underline transition-colors cursor-pointer"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-secondary" />}
                    <span>{item.label}</span>
                  </button>
                  <span className="select-none" aria-hidden="true">{separator}</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
