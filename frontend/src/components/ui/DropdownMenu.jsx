import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Dropdown Menu Component - Knowva Design System
 */
export const DropdownMenu = ({
  trigger,
  items = [],
  align = 'left', // 'left' | 'right'
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          role="menu"
          className={cn(
            "absolute z-50 mt-1.5 w-56 rounded-xl bg-surface border border-border-default shadow-xl py-1.5 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-150",
            align === 'right' ? "right-0" : "left-0",
            className
          )}
        >
          {items.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={`div-${idx}`} className="h-px bg-border-subtle my-1" />;
            }

            if (item.type === 'header') {
              return (
                <div key={`header-${idx}`} className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted select-none">
                  {item.label}
                </div>
              );
            }

            const Icon = item.icon;

            return (
              <button
                key={item.id || idx}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={(e) => {
                  item.onClick?.(e);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-xs flex items-center justify-between transition-colors text-left cursor-pointer",
                  item.variant === 'destructive'
                    ? "text-red-600 dark:text-red-400 hover:bg-red-500/10"
                    : "text-primary hover:bg-surface-hover",
                  item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {Icon && <Icon className="w-4 h-4 shrink-0 text-secondary" />}
                  <span className="truncate">{item.label}</span>
                </div>

                {item.shortcut && (
                  <kbd className="ml-auto text-[10px] font-mono text-muted pl-2">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Context Menu Component (triggered by right-click)
 */
export const ContextMenu = ({
  children,
  items = [],
  className
}) => {
  const [position, setPosition] = useState(null);
  const menuRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleClick = () => setPosition(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div onContextMenu={handleContextMenu} className={className}>
      {children}

      {position && (
        <div
          ref={menuRef}
          role="menu"
          style={{ top: position.y, left: position.x }}
          className="fixed z-50 w-52 rounded-xl bg-surface border border-border-default shadow-2xl py-1.5 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-150"
        >
          {items.map((item, idx) => {
            if (item.type === 'divider') {
              return <div key={`div-${idx}`} className="h-px bg-border-subtle my-1" />;
            }

            const Icon = item.icon;

            return (
              <button
                key={item.id || idx}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setPosition(null);
                }}
                className={cn(
                  "w-full px-3 py-2 text-xs flex items-center justify-between text-left transition-colors cursor-pointer",
                  item.variant === 'destructive'
                    ? "text-red-600 dark:text-red-400 hover:bg-red-500/10"
                    : "text-primary hover:bg-surface-hover",
                  item.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {Icon && <Icon className="w-4 h-4 shrink-0 text-secondary" />}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.shortcut && (
                  <kbd className="ml-auto text-[10px] font-mono text-muted">{item.shortcut}</kbd>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
