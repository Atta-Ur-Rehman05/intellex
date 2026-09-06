import React, { useState, useRef } from 'react';
import { cn } from '../../lib/utils';

/**
 * Tooltip Component - Knowva Design System
 * 
 * Supports placements: top, bottom, left, right
 * Accessible via mouse hover and keyboard focus
 */
export const Tooltip = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const placements = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowPlacements = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent border-4",
    bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent border-4",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent border-4",
    right: "right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent border-4",
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && content && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 px-2.5 py-1 text-xs font-medium text-slate-100 bg-slate-900 dark:bg-slate-800 rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 border border-slate-700/50",
            placements[placement] || placements.top,
            className
          )}
        >
          {content}
          <div className={cn("absolute w-0 h-0", arrowPlacements[placement] || arrowPlacements.top)} />
        </div>
      )}
    </div>
  );
};
