import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Select Component - Knowva Design System
 * 
 * Supports searchable options, icons, checkmarks, and full keyboard navigation.
 */
export const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select an option...",
  isSearchable = false,
  disabled = false,
  error,
  helperText,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = isSearchable
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && isSearchable) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearchQuery('');
      setActiveIndex(-1);
    }
  }, [isOpen, isSearchable]);

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0 && filteredOptions[activeIndex]) {
      e.preventDefault();
      onChange?.(filteredOptions[activeIndex].value);
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("w-full space-y-1.5 relative", className)} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-primary select-none">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "w-full h-10 px-3 bg-surface text-primary rounded-lg border text-sm flex items-center justify-between transition-all duration-150 outline-none text-left cursor-pointer",
          "focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
          error 
            ? "border-red-500 text-red-600 dark:text-red-400" 
            : "border-border-default hover:border-border-strong",
          disabled ? "opacity-50 cursor-not-allowed bg-subtle" : "",
          isOpen ? "ring-2 ring-brand-500 border-brand-500" : ""
        )}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="shrink-0 text-secondary">{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-muted truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={cn("w-4 h-4 text-secondary transition-transform duration-150 shrink-0", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          role="listbox"
          className="absolute z-50 left-0 right-0 mt-1 py-1.5 bg-surface border border-border-default rounded-xl shadow-xl backdrop-blur-lg animate-in fade-in zoom-in-95 duration-150"
        >
          {isSearchable && (
            <div className="px-2.5 pb-2 pt-1 border-b border-border-subtle">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-secondary pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className="w-full h-8 pl-8 pr-2 text-xs bg-surface-hover text-primary placeholder:text-muted rounded-md border border-border-subtle outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted text-center">No options found</div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isHighlighted = activeIndex === index;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange?.(opt.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "w-full px-3 py-2 text-xs sm:text-sm flex items-center justify-between text-left transition-colors cursor-pointer",
                      isSelected ? "bg-brand-500/10 text-brand-400 font-medium" : "text-primary hover:bg-surface-hover",
                      isHighlighted && !isSelected ? "bg-surface-hover" : ""
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {opt.icon && <span className="shrink-0 text-secondary">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                      {opt.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-hover text-muted border border-border-subtle">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <div className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p className="text-xs text-muted">{helperText}</p>
      ) : null}
    </div>
  );
};
