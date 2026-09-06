import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, Search, X, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Standard Text Input with Label, Helper Text, Error State, and Icons
 */
export const Input = forwardRef(({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  className,
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold text-primary select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-secondary pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            "w-full h-10 px-3 py-2 bg-surface text-primary placeholder:text-muted rounded-lg border text-sm transition-all duration-150 outline-none",
            "focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
            error 
              ? "border-red-500 focus:ring-red-500/30 focus:border-red-500 text-red-600 dark:text-red-400" 
              : "border-border-default hover:border-border-strong",
            leftIcon ? "pl-9" : "",
            rightIcon ? "pr-9" : "",
            disabled ? "opacity-50 cursor-not-allowed bg-subtle" : "",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 text-secondary flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <div id={`${inputId}-error`} className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="text-xs text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Password Input with Show/Hide Toggle
 */
export const PasswordInput = forwardRef(({
  label = "Password",
  helperText,
  error,
  className,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      ref={ref}
      type={showPassword ? 'text' : 'password'}
      label={label}
      helperText={helperText}
      error={error}
      className={className}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-secondary hover:text-primary transition-colors focus:outline-none cursor-pointer"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = 'PasswordInput';

/**
 * Search Input with Clear Button and Keyboard Shortcut Badge
 */
export const SearchInput = forwardRef(({
  value,
  onChange,
  onClear,
  placeholder = "Search documents, chats, or commands...",
  shortcutKey = "⌘K",
  className,
  ...props
}, ref) => {
  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="w-4 h-4 absolute left-3.5 text-secondary pointer-events-none" />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-16 bg-surface text-primary placeholder:text-muted rounded-xl border border-border-default hover:border-border-strong text-sm transition-all duration-150 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-xs"
        {...props}
      />
      <div className="absolute right-2.5 flex items-center gap-1.5">
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-md text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {shortcutKey && (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted bg-subtle border border-border-default rounded">
            {shortcutKey}
          </kbd>
        )}
      </div>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

/**
 * Textarea with Auto-Resize & Character Counter
 */
export const Textarea = forwardRef(({
  label,
  helperText,
  error,
  maxLength,
  value,
  onChange,
  rows = 4,
  className,
  id,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-primary select-none">
            {label}
          </label>
        )}
        {maxLength && (
          <span className="text-[11px] font-mono text-muted">
            {currentLength}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        className={cn(
          "w-full px-3 py-2.5 bg-surface text-primary placeholder:text-muted rounded-lg border text-sm transition-all duration-150 outline-none resize-y",
          "focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
          error 
            ? "border-red-500 focus:ring-red-500/30 text-red-600 dark:text-red-400" 
            : "border-border-default hover:border-border-strong",
          className
        )}
        {...props}
      />

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
});

Textarea.displayName = 'Textarea';
