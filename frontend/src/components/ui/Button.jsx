import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Button Component - Knowva Design System
 * 
 * Variants: primary, secondary, ghost, destructive, outline, ai
 * Sizes: sm, md, lg, icon
 * Supports: loading state, disabled state, left/right icons, focus rings
 */
export const Button = forwardRef(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98]";

  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-xs hover:shadow-md hover:shadow-brand-500/20 border border-brand-500/30",
    secondary: "bg-surface hover:bg-surface-hover text-primary border border-border-default hover:border-border-strong shadow-xs",
    ghost: "bg-transparent hover:bg-surface-hover text-secondary hover:text-primary",
    destructive: "bg-red-600 hover:bg-red-500 text-white shadow-xs hover:shadow-red-600/20 border border-red-500/30",
    outline: "bg-transparent hover:bg-surface-hover text-primary border border-border-default hover:border-border-strong",
    ai: "bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-md shadow-brand-500/25 border border-purple-400/30 relative overflow-hidden"
  };

  const sizes = {
    sm: "h-8 px-3 text-xs rounded-md gap-1.5",
    md: "h-9 px-4 text-sm rounded-lg gap-2",
    lg: "h-11 px-5 text-base rounded-xl gap-2.5",
    icon: "h-9 w-9 p-0 rounded-lg justify-center",
    iconSm: "h-7 w-7 p-0 rounded-md justify-center text-xs",
    iconLg: "h-11 w-11 p-0 rounded-xl justify-center text-lg",
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(
        baseStyles,
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = 'Button';
